# Email Setup Instructions

Your customer email system is now implemented but requires domain verification to send emails to any customer address.

## Current Status
- ✅ Customer receipt emails (sent after order completion)
- ✅ Order status update emails (processing, shipped, delivered, cancelled)
- ❌ Domain verification required for live email delivery

## Quick Setup Steps

### 1. Set Up Resend Domain Verification

1. Go to [resend.com/domains](https://resend.com/domains)
2. Add your domain (e.g., `auramedical.com`) 
3. Add the DNS records provided by Resend to your domain
4. Wait for verification (usually takes a few minutes)

### 2. Configure Email Address

In your Supabase project:

1. Go to **Settings** → **Edge Functions** → **Environment Variables**
2. Add a new environment variable:
   - **Name:** `VERIFIED_EMAIL_FROM`
   - **Value:** `AURA Medical Scrubs <orders@yourdomain.com>` (replace with your verified domain)

### 3. Test Email Delivery

Once domain is verified and environment variable is set:
- Place a test order to see customer receipt email
- Update order status in admin panel to test status update emails

## Temporary Testing

For immediate testing, you can temporarily:
- Change customer email to `omarmaher929@gmail.com` in your test orders
- This will work without domain verification

## What Each Email Does

### Customer Receipt Email
- Sent immediately after successful payment
- Includes order details, items, total, and next steps
- Professional branded template with AURA styling

### Order Status Update Emails
- **Processing:** Order is being prepared
- **Shipped:** Includes tracking information if available
- **Delivered:** Confirmation of successful delivery
- **Cancelled:** Refund information and next steps

## Support

If you need help with domain verification:
- [Resend Documentation](https://resend.com/docs/send-with-domains)
- [DNS Setup Guide](https://resend.com/docs/dashboard/domains/introduction)