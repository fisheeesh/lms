## Table of Contents

- [Setup Guide (SaaS Deployment)](#setup-guide-saas-deployment)
- [Prerequisites](#1-prerequisites)
- [Environment Variables](#2-environment-variables)
- [Backend Deployment (Render)](#3-backend-deployment-render)
- [Frontend Deployment (Vercel)](#4-frontend-deployment-vercel)
- [Redis Setup (Redis Cloud)](#6-redis-setup-redis-cloud)
- [Email Setup (Resend)](#7-email-setup-resend)
- [Verify Deployment](#8-verify-deployment)


# Setup Guide (SaaS Deployment)

This document explains how to deploy the **Log Management System (LMS)** in a cloud (SaaS) environment.  
We will use the following managed services:

- **Backend API** → [Render](https://render.com/)  
- **Frontend (React)** → [Vercel](https://vercel.com/)  
- **Database (PostgreSQL)** → [Neon](https://neon.tech/)  
- **Cache & Queue (Redis)** → [Redis Cloud](https://redis.com/redis-enterprise-cloud/overview/)  
- **Email Service** → [Resend](https://resend.com/)  

---

## 1. Prerequisites
- Node.js **22+** and npm installed locally  
- A GitHub repository containing the LMS code  
- Accounts created on Render, Vercel, Neon, Redis Cloud, and Resend  

---

## 2. Environment Variables

Create an `.env` file (or configure environment variables in each hosting platform):

```env
NODE_ENV="production"
# omit port since render automically added after successful deployment
PORT="your-backend-url"
APP_DEBUG="false"
ACCESS_TOKEN_SECRET="your-key"
REFRESH_TOKEN_SECRET="your-key"
REDIS_URL="your-redis-url"
REDIS_HOST="your-redis-host-in-dev-6379"
REDIS_PORT="your-redis-port-in-dev-localhost"
REDIS_PASSWORD="your-redis-password"
LOG_RETENTION_DAYS="7"
DATABASE_URL="your-db-uri-go-grab-from-vercel-storage-create-db-neon-copy-db-uri"
RESEND_API_KEY="your-resend-api-key"
SENDER_EMAIL="no-reply@your-website.com"
RECIEVER_EMAIL="your-email"
```

## 3. Database Setup (Neon via Vercel)

1. Go to [Vercel](https://vercel.com/) and create an account  
2. Navigate to your **Projects** page and open the **Storage** tab  
3. Click **Create Database** and select **Neon**  
4. Complete the setup steps in Vercel’s UI  
5. Copy the generated **DATABASE_URL** from Vercel → Storage → Neon  
6. Paste the `DATABASE_URL` into your `.env` file under the backend project  

## 4. Frontend Deployment (Vercel)

1. Go to **Vercel Dashboard** → *New Project*  
2. Import your **GitHub repository** and select the **frontend** folder  
3. Configure the project:  
   - **Framework Preset**: React + Vite 
   - **Root Directory**: frontend 
   - **Build Command**:  
     ```bash
     npm run build
     ```  
   - **Output Directory**:  
     ```bash
     dist
     ```  
4. Add required **environment variables** in Vercel (for example):  
   ```env
   VITE_API_URL=https://your-backend.onrender.com
5. Click Deploy — Vercel will build and give you a public frontend URL
6. Copy your lived url and put that in backend's cors options in app.ts

## 6. Redis Setup (Redis Cloud)

1. Create a new **Redis instance** on [Redis Cloud](https://redis.com/).  
2. Copy the connection string and set it in your environment variables as:  
   ```env
   REDIS_URL=rediss://<user>:<password>@<redis-host>:6379
3. Ensure the Render backend can connect to it (TLS enabled).

## 7. Email Setup (Resend)

1. Sign up at [Resend](https://resend.com/)  
2. Generate an API key and add it to your environment variables:  
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxxx
3. (Optional) Verify your domain for custom email sending.

## 8. Verify Deployment

- Open the **Frontend (Vercel URL)** in your browser  
- Log in / register as a new user  
- Ingest sample logs via filling log creating form.
- Search and filter logs in the dashboard  
- Configure an alert rule and trigger it → check for **email notification**  

