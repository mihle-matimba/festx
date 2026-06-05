# FestX Waitlist Setup Guide

## Overview
This guide walks you through setting up the waitlist feature for FestX.

## Steps

### 1. Create the Waitlist Table in Supabase

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query and copy the entire contents of `migrations/001_create_waitlist_table.sql`
4. Execute the query

This creates:
- `waitlist` table with columns: `id`, `first_name`, `email`, `phone_number`, `created_at`, `updated_at`
- Row Level Security (RLS) policies that allow anonymous insertions but prevent unauthorized reads/updates/deletes
- Indexes for faster queries

### 2. Get Your Supabase API Keys

1. In your Supabase project, go to **Settings > API**
2. Copy your:
   - **Project URL** (your SUPABASE_URL)
   - **Anon Key** (your SUPABASE_ANON_KEY)

### 3. Add Environment Variables to Vercel

1. Go to your Vercel project settings
2. Navigate to **Settings > Environment Variables**
3. Add the following environment variables:

```
SUPABASE_URL = [your Supabase URL]
SUPABASE_ANON_KEY = [your Supabase Anon Key]
```

Make sure to add these to:
- ✓ Production
- ✓ Preview
- ✓ Development

4. Redeploy your application for changes to take effect

### 4. Test the Waitlist

1. Visit your deployed site at your Vercel domain
2. Click "Join Waitlist"
3. Fill in the form (First Name, Email, Phone)
4. Submit
5. Check your Supabase dashboard under the `waitlist` table to confirm the data was saved

## File Structure

```
festx/
├── index.html                          # Main landing page with logo and button
├── api/
│   └── waitlist.js                    # Serverless function to handle form submissions
├── migrations/
│   └── 001_create_waitlist_table.sql  # Database schema and RLS policies
├── package.json                        # Node dependencies
├── vercel.json                         # Vercel configuration
├── .env.example                        # Template for environment variables
└── SETUP.md                            # This file
```

## How It Works

1. **Frontend**: User clicks "Join Waitlist" button on `index.html`
2. **Modal**: Form modal opens with First Name, Email, Phone Number fields
3. **Validation**: Client-side validation checks all fields
4. **API Call**: Form submits to `/api/waitlist` endpoint
5. **Backend**: Vercel serverless function validates data and inserts into Supabase
6. **RLS**: Row Level Security prevents unauthorized access to the data
7. **Success**: User sees confirmation message

## Troubleshooting

### "Missing SUPABASE_URL or SUPABASE_ANON_KEY"
- Make sure you've added the environment variables to Vercel
- Redeploy after adding variables
- Check that you're using the **Anon Key**, not the Service Role Key

### Duplicate Email Error
- The email field has a UNIQUE constraint
- Only one account per email address is allowed

### API returning 500 errors
- Check Vercel function logs: **Vercel Dashboard > Deployments > Function Logs**
- Ensure Supabase credentials are correct
- Check that the `waitlist` table exists in your Supabase database

## Security Notes

- The API only accepts POST requests
- Input validation on both client and server side
- RLS policies restrict data access
- Email must be unique (no duplicates)
- Phone number must be at least 10 characters
