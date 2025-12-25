# Vardast Experts Hub - Deployment Setup Guide

If you are seeing a **500 Internal Server Error** with `MIDDLEWARE_INVOCATION_FAILED` on Vercel, it is likely because the environment variables are missing.

## How to add Environment Variables in Vercel

1.  **Go to your Vercel Dashboard.**
2.  Select your project (**vardast-marketplace** or similar).
3.  Click on the **"Settings"** tab at the top.
4.  On the left sidebar, click on **"Environment Variables"**.
5.  Add the following keys (copy them from your Supabase Dashboard > Project Settings > API):

    *   **Key:** `NEXT_PUBLIC_SUPABASE_URL`
        *   **Value:** `https://your-project-id.supabase.co` (Your Project URL)
    *   **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
        *   **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (Your `anon` public key)

6.  **Important:** After adding these variables, you must **Redeploy** your application for changes to take effect.
    *   Go to the **"Deployments"** tab.
    *   Click the three dots `...` next to the latest deployment.
    *   Select **"Redeploy"**.

## Local Development
For local development, ensure your `.env.local` file contains valid keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
