package com.wleft.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.wleft.entity.Product;
import com.wleft.repository.ProductRepository;
import com.wleft.service.InventoryService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*") // Allow frontend access
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Value("${razorpay.webhook.secret}")
    private String webhookSecret;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InventoryService inventoryService;

    @PostMapping("/create-order/{productId}")
    public ResponseEntity<?> createOrder(@PathVariable Long productId, @RequestParam(defaultValue = "1") int quantity) {
        try {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getQuantity() < quantity) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Not enough stock available");
            }

            RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);

            JSONObject orderRequest = new JSONObject();
            // Amount in paise (multiply by 100) * quantity
            orderRequest.put("amount", (int) (product.getPrice() * 100) * quantity);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

            // Critical: Store productId AND quantity in notes to retrieve it in webhook
            JSONObject notes = new JSONObject();
            notes.put("product_id", String.valueOf(productId));
            notes.put("quantity", String.valueOf(quantity));
            orderRequest.put("notes", notes);

            Order order = razorpay.orders.create(orderRequest);

            return ResponseEntity.ok(order.toString()); // Returns JSON string of order
        } catch (RazorpayException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(@RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String signature) {
        try {
            // Verify signature using the dedicated webhook secret
            Utils.verifyWebhookSignature(payload, signature, webhookSecret);

            JSONObject json = new JSONObject(payload);
            String event = json.getString("event");

            if ("order.paid".equals(event)) {
                JSONObject payloadObj = json.getJSONObject("payload");
                JSONObject order = payloadObj.getJSONObject("order").getJSONObject("entity");
                JSONObject notes = order.getJSONObject("notes");

                if (notes.has("product_id")) {
                    Long productId = Long.parseLong(notes.getString("product_id"));
                    int quantity = 1;
                    if (notes.has("quantity")) {
                        quantity = Integer.parseInt(notes.getString("quantity"));
                    }

                    System.out.println("Payment success for Product ID: " + productId + ", Qty: " + quantity);

                    // Trigger Inventory Update
                    inventoryService.processSale(productId, quantity);
                }
            }

            return ResponseEntity.ok("Webhook received and processed");
        } catch (RazorpayException e) {
            System.err.println("Webhook signature verification failed");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing webhook");
        }
    }
}
