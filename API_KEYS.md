# API Keys Setup Guide

This guide will help you obtain the necessary API keys for the Car Finder application.

## Required API Keys

### 1. OpenAI API Key (REQUIRED)
The application uses OpenAI's GPT-4o model for the chat interface and embeddings.

**How to get it:**
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the key and add it to your `.env` file as `OPENAI_API_KEY`

**Pricing:** Pay-as-you-go, approximately $0.01-0.03 per chat interaction

---

## Optional API Keys (for full functionality)

### 2. Marketcheck API Key
Used to fetch real car listings from dealerships.

**How to get it:**
1. Visit https://www.marketcheck.com/apis
2. Sign up for a developer account
3. Choose a plan (they offer a free tier)
4. Get your API key from the dashboard
5. Add it to your `.env` file as `MARKETCHECK_API_KEY`

**Free Tier:** 10,000 requests/month

### 3. Auto.dev API Key
Alternative source for car listings.

**How to get it:**
1. Go to https://auto.dev/developers
2. Create an account
3. Apply for API access
4. Once approved, find your API key in settings
5. Add it to your `.env` file as `AUTODEV_API_KEY`

### 4. VINAnalytics API Key
For decoding VINs and getting detailed vehicle specifications.

**How to get it:**
1. Visit https://vinanalytics.com
2. Register for an account
3. Subscribe to their API service
4. Get your API key from account settings
5. Add it to your `.env` file as `VINANALYTICS_KEY`

### 5. AWS SES (for Email Notifications)
Simple Email Service for sending alert emails.

**How to get it:**
1. Log in to AWS Console
2. Navigate to SES service
3. Verify your sending domain/email
4. Create IAM user with SES permissions
5. Generate access keys
6. Add to `.env`:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `SES_REGION` (e.g., us-east-1)

### 6. Twilio (for SMS Notifications)
For sending SMS alerts about new matches.

**How to get it:**
1. Sign up at https://www.twilio.com
2. Get a phone number
3. Find your Account SID and Auth Token
4. Add to `.env`:
   - `TWILIO_SID`
   - `TWILIO_TOKEN`

**Free Trial:** $15 credit for testing

### 7. Supabase (Optional - for managed PostgreSQL)
If you want to use Supabase instead of local PostgreSQL.

**How to get it:**
1. Sign up at https://supabase.com
2. Create a new project
3. Go to Settings > API
4. Copy the URL and service_role key
5. Add to `.env`:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

---

## Quick Start (Minimal Setup)

For basic functionality, you only need:
1. **OpenAI API Key** - for chat and embeddings

The application will work with mock data for listings if other APIs are not configured.

## Environment File Setup

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API keys:
   ```bash
   # At minimum, add your OpenAI key:
   OPENAI_API_KEY=sk-...your-key-here...
   ```

3. Start the application:
   ```bash
   docker compose up
   ```

## Cost Estimates

- **OpenAI**: ~$40/month for 100 active users
- **Marketcheck**: Free tier sufficient for testing, $199/month for 50k requests
- **Auto.dev**: ~$50/month for basic tier
- **AWS SES**: ~$0.10 per 1000 emails
- **Twilio**: ~$0.0075 per SMS

## Security Notes

- Never commit your `.env` file to version control
- Rotate API keys regularly
- Use environment-specific keys (dev/staging/prod)
- Consider using a secrets management service in production 