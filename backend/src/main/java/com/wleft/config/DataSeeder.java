package com.wleft.config;

import com.wleft.entity.Product;
import com.wleft.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.ArrayList;

@Component
public class DataSeeder implements CommandLineRunner {

        private final ProductRepository productRepository;
        private final RestTemplate restTemplate;

        public DataSeeder(ProductRepository productRepository) {
                this.productRepository = productRepository;
                this.restTemplate = new RestTemplate();
        }

        @Override
        public void run(String... args) throws Exception {
                long count = productRepository.count();
                System.out.println("Current product count: " + count);

                // 1. Seed from FakeStoreAPI if completely empty
                if (count == 0) {
                        System.out.println("Database is empty. Seeding data from FakeStoreAPI...");
                        seedFromApi();
                }

                // 2. Check count again and add manual products if needed (e.g., to reach 50)
                count = productRepository.count();
                if (count < 50) {
                        System.out.println("Adding additional premium products to reach 50...");
                        seedAdditionalProducts();
                } else {
                        System.out.println("Product catalog sufficient (Total: " + count + ").");
                }
        }

        private void seedFromApi() {
                String url = "https://fakestoreapi.com/products";
                try {
                        ResponseEntity<FakeStoreProduct[]> response = restTemplate.getForEntity(url,
                                        FakeStoreProduct[].class);
                        FakeStoreProduct[] fakeProducts = response.getBody();

                        if (fakeProducts != null) {
                                List<Product> productsToSave = new ArrayList<>();
                                for (FakeStoreProduct fp : fakeProducts) {
                                        Product product = new Product();
                                        product.setTitle(fp.getTitle());
                                        product.setPrice(fp.getPrice() * 85); // Convert roughly to INR
                                        product.setDescription(fp.getDescription());
                                        product.setImage(fp.getImage());
                                        product.setQuantity(10);
                                        productsToSave.add(product);
                                }
                                productRepository.saveAll(productsToSave);
                                System.out.println("API Seeded " + productsToSave.size() + " products.");
                        }
                } catch (Exception e) {
                        System.err.println("Failed to seed from API: " + e.getMessage());
                }
        }

        private void seedAdditionalProducts() {
                try {
                        List<Product> manualProducts = new ArrayList<>();

                        // 30 Premium Tech & Lifestyle Products
                        manualProducts.add(createProduct("Sony WH-1000XM5", 29990.00,
                                        "Industry-leading noise canceling headphones with Auto NC Optimizer.",
                                        "https://m.media-amazon.com/images/I/51SKmu2G9FL._AC_UF1000,1000_QL80_.jpg",
                                        15));
                        manualProducts.add(createProduct("Logitech MX Master 3S", 9995.00,
                                        "Performance wireless mouse, ultra-fast scrolling, 8K DPI.",
                                        "https://resource.logitech.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-3s/gallery/mx-master-3s-mouse-top-view-graphite.png?v=1",
                                        20));
                        manualProducts.add(createProduct("Keychron K2 Mechanical Keyboard", 8999.00,
                                        "Wireless mechanical keyboard with Gateron Brown switches.",
                                        "https://www.meckeys.com/wp-content/uploads/2021/08/K2-V2-Aluminum-RGB-1.jpg",
                                        12));
                        manualProducts.add(createProduct("Apple MacBook Air M2", 114900.00,
                                        "Supercharged by M2 chip. 13.6-inch Liquid Retina display.",
                                        "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303665",
                                        5));
                        manualProducts.add(createProduct("Dell XPS 13 Plus", 135000.00,
                                        "Twice as powerful as before in the same size.",
                                        "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-plus-9320/media-gallery/tactile/xs9320Nt_cnb_00055lf110_gy.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=553&qlt=100,1&resMode=sharp2&size=553,402&chrss=full",
                                        4));
                        manualProducts.add(createProduct("Samsung Odyssey G9 Monitor", 125000.00,
                                        "49-inch 1000R curved gaming monitor, 240Hz.",
                                        "https://images.samsung.com/is/image/samsung/p6pim/in/lc49g95tsswxxl/gallery/in-odyssey-g9-c49g95tssw-356916524?$684_547_PNG$",
                                        3));
                        manualProducts.add(createProduct("Herman Miller Aeron Chair", 190000.00,
                                        "The benchmark for ergonomic seating.",
                                        "https://images.hermanmiller.group/m/1739815043aa41b7/W-Aeron_Ref_Chr_Carbon_C_PolishedAlum_Carbon_Front_Low.png?trim=auto&trim-sd=1&blend-mode=darken&blend=fafafa",
                                        2));
                        manualProducts.add(createProduct("Bose SoundLink Flex", 11900.00,
                                        "Waterproof Bluetooth speaker with deep, immersive sound.",
                                        "https://assets.bose.com/content/dam/Bose_DAM/Web/consumer_electronics/global/products/speakers/soundlink_flex/product_silo_images/soundlink_flex_black_front.png/_jcr_content/renditions/cq5dam.web.320.320.png",
                                        25));
                        manualProducts.add(createProduct("GoPro HERO11 Black", 39990.00,
                                        "Capture your adventures with 5.3K video and 27MP photos.",
                                        "https://static.gopro.com/assets/blta2b8522e5372af40/blt5c26b91a78850684/6303e33fdd5d262b7c7be923/pdp-hero11-black-camera.png",
                                        8));
                        manualProducts.add(createProduct("iPad Air 5th Gen", 59900.00,
                                        "Light. Bright. Full of might. M1 chip.",
                                        "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-air-select-wifi-blue-202203?wid=940&hei=1112&fmt=png-alpha&.v=1645065732688",
                                        15));

                        manualProducts.add(createProduct("Nothing Phone (2)", 44999.00,
                                        "New Glyph Interface. Snapdragon 8+ Gen 1.",
                                        "https://in.nothing.tech/cdn/shop/files/Phone_2_White_PF_1200x.png?v=1688987179",
                                        10));
                        manualProducts.add(createProduct("Kindle Paperwhite", 13999.00,
                                        "Now with a 6.8” display and thinner borders.",
                                        "https://m.media-amazon.com/images/I/51hcj0gS8IL._AC_SX679_.jpg", 30));
                        manualProducts.add(createProduct("Fujifilm Instax Mini 12", 6999.00,
                                        "Compact instant camera with automatic exposure.",
                                        "https://asset.fujifilm.com/www/in/files/styles/768x768/public/2023-03/instax-mini-12-purple_2.png?itok=3DqjR74T",
                                        18));
                        manualProducts.add(createProduct("Nintendo Switch OLED", 32990.00,
                                        "7-inch OLED screen. Wide adjustable stand.",
                                        "https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_1.5/c_scale,w_400/ncom/en_US/switch/site-design-update/hardware/switch/oled-model/gallery/white/01",
                                        12));
                        manualProducts.add(createProduct("Dyson V12 Detect Slim", 55900.00,
                                        "Laser reveals microscopic dust. Powerful suction.",
                                        "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/369363-01.png?fmt=png-alpha&scl=1",
                                        4));
                        manualProducts.add(createProduct("Philips Hue Starter Kit", 9999.00,
                                        "White and Color Ambiance smart bulbs.",
                                        "https://www.assets.signify.com/is/image/Signify/7822230p7_Hue_WCA_E27_Starter_Kit_Pdp_Image?wid=500&hei=500&fmt=png-alpha",
                                        15));
                        manualProducts.add(createProduct("Anker 737 Power Bank", 14999.00,
                                        "Ultra-Powerful Two-Way Charging (Gen 3).",
                                        "https://m.media-amazon.com/images/I/61+-X3e0b2L._AC_SX679_.jpg", 20));
                        manualProducts.add(createProduct("Razer DeathAdder V3 Pro", 13999.00,
                                        "Ultra-lightweight wireless ergonomic esports mouse.",
                                        "https://assets3.razerzone.com/A6j4S3X7Fz6i6W4u6C5t4k/razer-deathadder-v3-pro-white-500x500.png",
                                        14));
                        manualProducts.add(createProduct("Elgato Stream Deck", 14500.00,
                                        "15 LCD keys to control apps and tools.",
                                        "https://m.media-amazon.com/images/I/710R9YpIy7L._AC_SX679_.jpg", 10));
                        manualProducts.add(createProduct("Secretlab TITAN Evo", 48000.00,
                                        "Award-winning gaming chair. Integrated lumbar support.",
                                        "https://cdn.shopify.com/s/files/1/2246/5495/t/172/assets/TITAN-Evo-2022-Small-Classic-Black.png?v=1658474254",
                                        6));

                        manualProducts.add(createProduct("Marshall Stanmore III", 31999.00,
                                        "Legendary sound. Re-engineered for wider soundstage.",
                                        "https://www.marshallheadphones.com/on/demandware.static/-/Sites-zs-master-catalog/default/dw106195fb/images/marshall/speakers/stanmore-iii/black/high-res/pos-marshall-stanmore-iii-black-01.png",
                                        7));
                        manualProducts.add(createProduct("Garmin Fenix 7", 67990.00,
                                        "Multisport GPS Watch. Solar charging available.",
                                        "https://static.garmincdn.com/en/products/010-02540-00/v/cf-lg-76b32b84-4861-41d3-85f8-b38466606367.png",
                                        9));
                        manualProducts.add(createProduct("DJI Mini 3 Pro", 85990.00,
                                        "Weighs less than 249 g. Tri-Directional Obstacle Sensing.",
                                        "https://dji-official-apsoutheast1.oss-ap-southeast-1.aliyuncs.com/cms/uploads/0498028711e737979603f0d4dd2247dc.png",
                                        5));
                        manualProducts.add(createProduct("BenQ ScreenBar Halo", 15990.00,
                                        "LED Monitor Light with Wireless Controller.",
                                        "https://image.benq.com/is/image/benqco/screenbar-halo-kv?$Responsive$", 12));
                        manualProducts.add(createProduct("Lego Star Wars Falcon", 74999.00,
                                        "Ultimate Collector Series Millennium Falcon.",
                                        "https://www.lego.com/cdn/cs/set/assets/blt9af51000632a6136/75192.jpg", 2));
                        manualProducts.add(createProduct("Yeti X USB Microphone", 15995.00,
                                        "Professional USB Mic for Streaming and Podcasting.",
                                        "https://m.media-amazon.com/images/I/61b7b7p3KTL._AC_SX679_.jpg", 10));
                        manualProducts.add(createProduct("Oura Ring Gen3", 29900.00,
                                        "Sleep and Activity Tracker. Titanium.",
                                        "https://m.media-amazon.com/images/I/51r5KkY2d1L._AC_SX679_.jpg", 20));
                        manualProducts.add(createProduct("Peak Design Everyday Backpack", 24900.00,
                                        "20L or 30L. MagLatch hardware.",
                                        "https://cdn.shopify.com/s/files/1/0004/7962/5273/products/bdb-20-bk-2-v2_1024x1024.jpg?v=1576629988",
                                        8));
                        manualProducts.add(createProduct("Nanoleaf Shapes", 18999.00,
                                        "Hexagons Smarter Kit. Modular LED Light Panels.",
                                        "https://us-shop.nanoleaf.me/cdn/shop/products/NL42_Hexagons_9PK_Kit_ISO_1200x.png?v=1626887576",
                                        11));
                        manualProducts.add(createProduct("Fellow Stagg EKG", 16500.00,
                                        "Electric Pour-over Kettle. Precision temperature control.",
                                        "https://fellowproducts.com/cdn/shop/products/EKG_Black_1200x.jpg?v=1604085429",
                                        15));

                        productRepository.saveAll(manualProducts);
                        System.out.println("Manually seeded " + manualProducts.size() + " premium products.");
                } catch (Exception e) {
                        System.err.println("Critical Error seeding manual products: " + e.getMessage());
                        e.printStackTrace();
                }
        }

        private Product createProduct(String title, Double price, String desc, String img, Integer qty) {
                Product p = new Product();
                // Truncate fields to match Entity constraints to avoid crash
                p.setTitle(truncate(title, 255));
                p.setDescription(desc); // Text is now TEXT, safe
                p.setPrice(price);
                p.setImage(truncate(img, 2000));
                p.setQuantity(qty);
                return p;
        }

        private String truncate(String input, int maxLength) {
                if (input == null)
                        return null;
                if (input.length() <= maxLength)
                        return input;
                return input.substring(0, maxLength);
        }

        // Inner DTO helper from FakeStore
        static class FakeStoreProduct {
                private Long id;
                private String title;
                private Double price;
                private String description;
                private String category;
                private String image;

                public Long getId() {
                        return id;
                }

                public void setId(Long id) {
                        this.id = id;
                }

                public String getTitle() {
                        return title;
                }

                public void setTitle(String title) {
                        this.title = title;
                }

                public Double getPrice() {
                        return price;
                }

                public void setPrice(Double price) {
                        this.price = price;
                }

                public String getDescription() {
                        return description;
                }

                public void setDescription(String description) {
                        this.description = description;
                }

                public String getImage() {
                        return image;
                }

                public void setImage(String image) {
                        this.image = image;
                }
        }
}
