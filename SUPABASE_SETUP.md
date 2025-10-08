# Supabase Database Setup for ElectroBlitz 2025

This guide will help you set up the Supabase database for the ElectroBlitz 2025 registration system.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Access to your Supabase project dashboard

## Database Setup

### Step 1: Create the Database Table

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor** tab
3. Copy and paste the contents of `database-schema.sql` into the SQL editor
4. Click **Run** to execute the SQL script

This will create:
- A `registrations` table with all necessary fields
- Proper indexes for performance
- Row Level Security (RLS) policies
- Automatic timestamp updates

### Step 2: Verify Table Creation

1. Go to the **Table Editor** tab
2. You should see a new `registrations` table
3. Click on it to verify all columns are created correctly

### Step 3: Test the Connection

1. Start your React application: `npm start`
2. Navigate to the registration page
3. Fill out and submit a test registration
4. Check the Supabase table to verify the data was saved

## Database Schema

The `registrations` table includes the following fields:

- **id**: UUID (Primary Key, Auto-generated)
- **created_at**: Timestamp (Auto-generated)
- **updated_at**: Timestamp (Auto-updated)
- **category**: VARCHAR (tech, non-tech, workshop)
- **first_name**: VARCHAR
- **last_name**: VARCHAR
- **email**: VARCHAR (Unique)
- **phone**: VARCHAR
- **college**: VARCHAR
- **academic_year**: VARCHAR
- **department**: VARCHAR
- **section**: VARCHAR
- **selected_events**: JSONB (Array of event IDs)
- **dietary_requirements**: TEXT
- **accommodation_required**: BOOLEAN
- **emergency_contact**: VARCHAR
- **emergency_phone**: VARCHAR
- **status**: VARCHAR (pending, confirmed, cancelled)

## Security

The database is configured with Row Level Security (RLS) policies that:
- Allow anonymous users to insert new registrations
- Allow service role to read, update, and delete all registrations
- Prevent unauthorized access to registration data

## Admin Dashboard

The admin dashboard allows you to:
- View all registrations in a table format
- Search and filter registrations
- Export data to Excel/CSV formats
- Clear all registration data (with confirmation)

## Troubleshooting

### Common Issues

1. **"Failed to fetch" errors**: Check your internet connection and Supabase project status
2. **"Permission denied" errors**: Verify RLS policies are set up correctly
3. **"Table doesn't exist" errors**: Make sure you've run the database schema SQL script

### Getting Help

- Check the Supabase documentation: https://supabase.com/docs
- Review the browser console for detailed error messages
- Ensure your Supabase project is active and not paused

## Environment Variables

The Supabase configuration is currently hardcoded in `src/utils/supabase.ts`. For production, consider moving these to environment variables:

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Then update the supabase.ts file to use these variables.
