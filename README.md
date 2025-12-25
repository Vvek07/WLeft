# WLeft - Inventory Payment Hub
Deployed URL: https://wleft-demo.vercel.app (Example)

## Project Overview
WLeft is a full-stack Inventory Management System featuring:
- **Dual-Dashboard:** Buyer & Admin Views.
- **Automated Payments:** Integrated Razorpay with Webhooks.
- **Real-time Inventory:** Stock updates instantly upon payment success.
- **Alerts:** Automated email notifications for low stock via Mailtrap.

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS (Hosted on Vercel)
- **Backend:** Spring Boot 3 + Java 21 (Hosted on Render)
- **Database:** PostgreSQL (Supabase)
- **Payments:** Razorpay

## 🚀 Deployment Instructions

### 1. Backend (Render)
1.  Create a **Web Service** on Render.
2.  Connect your GitHub repo and select the `backend` folder as Root Directory.
3.  **Build Command:** `mvn clean package -DskipTests`
4.  **Start Command:** `java -jar target/backend-0.0.1-SNAPSHOT.jar`
5.  **Environment Variables:** Add these in Render Dashboard:
    - `DB_URL`: Your Supabase Connection String
    - `DB_USERNAME`: Database Username
    - `DB_PASSWORD`: Database Password
    - `RAZORPAY_KEY_ID`: Your Key ID
    - `RAZORPAY_KEY_SECRET`: Your Key Secret
    - `RAZORPAY_WEBHOOK_SECRET`: Your Webhook Secret
    - `MAILTRAP_USERNAME`: Mailtrap User
    - `MAILTRAP_PASSWORD`: Mailtrap Pass

### 2. Frontend (Vercel)
1.  Import the project into Vercel.
2.  Select `frontend` as the Root Directory.
3.  **Environment Variables**:
    - `VITE_API_BASE_URL`: The URL of your Render Backend (e.g., `https://wleft-backend.onrender.com`).
4.  **Important:** Update `vercel.json` destination with your actual Render URL!

## 📜 Legal / Corporate Details
- **Registered Name:** Razorpay Payments Private Limited
- **CIN:** U62099KA2024PTC188982
- **GST:** 29AANCR6717K1ZN
- **Payment Handle:** [https://razorpay.me/@wleft](https://razorpay.me/@wleft)

## Local Development
1.  Backend: `cd backend && mvn spring-boot:run`
2.  Frontend: `cd frontend && npm run dev`
