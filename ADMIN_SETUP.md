# Admin Setup Guide

## Setting Up Your First Admin User

After creating your account through the app, you need to manually set yourself as an admin using the Supabase SQL editor.

### Steps:

1. Go to your Supabase dashboard: https://umrzctjpjveocpzdyjxs.supabase.co
2. Navigate to the SQL Editor
3. Run this query (replace `your@email.com` with your actual email):

```sql
-- Set user as admin by email
UPDATE profiles
SET is_admin = true
WHERE email = 'your@email.com';
```

4. Alternatively, if you know your user ID:

```sql
-- Set user as admin by ID
UPDATE profiles
SET is_admin = true
WHERE id = 'your-user-id-here';
```

5. To upgrade a user's subscription tier:

```sql
-- Update subscription to Studio tier
UPDATE subscriptions
SET plan_type = 'studio', status = 'active'
WHERE user_id = (SELECT id FROM profiles WHERE email = 'your@email.com');
```

### Admin Features:

Once you're an admin, you can:
- View the Admin Dashboard from the menu
- See all registered users
- Change any user's subscription tier (free, basic, pro, studio)
- Toggle admin status for other users
- View subscription status for all users

### Important Notes:

- Admin privileges are stored in the `profiles` table
- Subscription tiers are stored in the `subscriptions` table
- All data is protected by Row Level Security (RLS)
- Admins bypass RLS policies and can see/edit all data
- Regular users can only see their own profile and subscription

### Available Subscription Tiers:

- **Free**: Default tier for new users
- **Basic**: $20/month - HD Export, 100 AI Tools
- **Pro**: $30/month - 4K Export, 300 AI Tools, Commercial License
- **Studio**: $50/month - 8K Export, All 600 AI Tools, Full Rights

### Testing Login:

1. Create an account through the app
2. Set yourself as admin using the SQL query above
3. Log out and log back in
4. Open the menu - you should see:
   - Your admin badge (crown icon)
   - "ADMIN" label next to your subscription tier
   - "Admin Dashboard" option in the menu
5. Click "Admin Dashboard" to manage users
