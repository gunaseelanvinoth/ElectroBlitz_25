# Admin Dashboard Troubleshooting Guide

## Current Status
✅ **Database has 143 registrations**  
✅ **Database connection is working**  
✅ **RLS (Row Level Security) is disabled**  
❓ **Admin dashboard may not be showing data**

## Quick Fixes to Try

### 1. **Hard Refresh the Browser**
- Press `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)
- This clears browser cache and forces reload

### 2. **Use the Refresh Button**
- Click the "🔄 Refresh Data" button in the admin dashboard
- This will reload the entire page and fetch fresh data

### 3. **Check Browser Console**
- Press `F12` to open Developer Tools
- Go to "Console" tab
- Look for any error messages
- You should see: "Successfully fetched 143 registrations from database"

### 4. **Clear Browser Cache**
- Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
- Select "Cached images and files"
- Click "Clear data"

### 5. **Try Different Browser**
- Open the admin dashboard in Chrome, Firefox, or Edge
- Sometimes browser-specific issues can occur

## If Still Not Working

### Check Database Connection
Run this command to verify database is working:
```powershell
.\verify-fix.ps1
```

Expected output:
```
✅ Found 143 registrations
✅ Successfully fetched 5 registrations
🎉 Admin dashboard fix is working!
```

### Manual Database Check
1. Go to your Supabase dashboard
2. Go to "Table Editor"
3. Click on "registrations" table
4. You should see 143 rows of data

## Common Issues and Solutions

### Issue: "No registrations found"
**Solution:** The database fix may not have been applied yet
- Run the SQL from `final-database-fix.sql` in Supabase SQL Editor

### Issue: "Loading registrations from database..." (stuck)
**Solution:** Network or connection issue
- Check your internet connection
- Try refreshing the page
- Check browser console for errors

### Issue: "Database error" message
**Solution:** RLS policies are still blocking access
- Run this SQL in Supabase: `ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;`

## Expected Behavior After Fix

1. **Admin dashboard loads** with 143 registrations visible
2. **Stats show correct numbers:**
   - Total Registrations: 143
   - Technical Events: [number]
   - Non-Technical Events: [number]
   - Workshops: [number]
3. **Table shows registration data** with names, emails, colleges, etc.
4. **Export functions work** properly
5. **New registrations can be saved** and appear immediately

## Files to Check

- `final-database-fix.sql` - Main database fix
- `verify-fix.js` - Database verification script
- `AdminDashboard.tsx` - Updated with refresh button and better error handling

## Still Having Issues?

If the admin dashboard still shows "no registrations found" after trying all the above:

1. **Check the browser console** for specific error messages
2. **Verify the database fix was applied** by running the verification script
3. **Try accessing the admin dashboard in an incognito/private window**
4. **Contact support** with the specific error messages from the browser console
