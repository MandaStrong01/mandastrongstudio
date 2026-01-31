# Authentication & User Management Guide

## Overview

MandaStrong Studio now has a fully functional authentication system with user management, subscription tiers, and admin privileges.

## Features Implemented

### 1. User Authentication
- **Sign Up**: Create new accounts with email/password
- **Sign In**: Login with existing credentials
- **Sign Out**: Secure logout functionality
- **Profile Management**: User profiles automatically created on signup

### 2. Subscription Tiers
All new users start with a **Free** tier and can be upgraded:
- **Free**: Default tier, basic access
- **Basic**: $20/month - HD Export, 100 AI Tools
- **Pro**: $30/month - 4K Export, 300 AI Tools, Commercial License
- **Studio**: $50/month - 8K Export, All 600 AI Tools, Full Rights

### 3. Admin System
Admins have special privileges:
- View all users in the Admin Dashboard
- Change any user's subscription tier
- Toggle admin status for other users
- See subscription status for all users

## How It Works

### User Interface

**Menu Display (Top Right)**
When logged in, the menu shows:
- Your full name
- Your email address
- Your subscription tier badge (FREE/BASIC/PRO/STUDIO)
- ADMIN badge (if you're an admin)
- Crown icon (if you're an admin)
- Sign Out button

**Admin Dashboard**
Only visible to admin users:
- Accessible via menu → "Admin Dashboard"
- Shows table of all users
- Allows changing subscription tiers
- Toggle admin status for users
- View subscription status

### Login/Registration Flow

1. **New Users**: Click "Create Account" → Fill form → Auto-assigned Free tier
2. **Existing Users**: Click "Sign In" → Enter credentials → Access full app
3. **Guest Mode**: Browse features without account

### Setting Your First Admin

Since you need at least one admin to manage others, use SQL to set yourself as admin:

```sql
-- Replace 'your@email.com' with your actual email
UPDATE profiles
SET is_admin = true
WHERE email = 'your@email.com';
```

Run this in Supabase SQL Editor: https://umrzctjpjveocpzdyjxs.supabase.co

## Database Schema

### Tables Created

**profiles**
- `id`: User ID (linked to auth.users)
- `full_name`: User's full name
- `email`: Email address
- `is_admin`: Admin flag (true/false)
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

**subscriptions**
- `id`: Subscription ID
- `user_id`: Linked to profiles
- `plan_type`: free, basic, pro, or studio
- `status`: active, cancelled, expired, or trialing
- `stripe_customer_id`: For future Stripe integration
- `stripe_subscription_id`: For future Stripe integration
- `current_period_start`: Subscription period start
- `current_period_end`: Subscription period end

### Security (Row Level Security)

- Users can only view/edit their own profile
- Users can only view their own subscription
- Admins can view/edit all profiles and subscriptions
- All tables have RLS enabled
- Automatic profile creation on signup

## Usage Examples

### As a Regular User

1. Create account on page 3
2. Login to access features
3. View your subscription tier in the menu
4. Use all app features based on your tier

### As an Admin

1. Create account
2. Set yourself as admin via SQL (see ADMIN_SETUP.md)
3. Login and open menu
4. Click "Admin Dashboard"
5. Manage user subscriptions and admin status
6. View all users and their details

## Testing Checklist

- [ ] Create a new account
- [ ] Login successfully
- [ ] View profile in menu
- [ ] See subscription tier badge
- [ ] Set yourself as admin via SQL
- [ ] Logout and login again
- [ ] See admin badge in menu
- [ ] Access Admin Dashboard
- [ ] View all users
- [ ] Change a user's subscription tier
- [ ] Toggle admin status
- [ ] Logout successfully

## Security Notes

1. **Passwords**: Minimum 6 characters required
2. **Email Confirmation**: Disabled by default (can be enabled in Supabase)
3. **RLS Policies**: Protect all data access
4. **Admin Actions**: Only admins can modify other users
5. **Authentication**: Handled by Supabase Auth

## Future Enhancements

- Stripe payment integration
- Password reset functionality
- Email verification
- Profile picture uploads
- Two-factor authentication
- Usage analytics per tier
- Automated tier upgrades/downgrades

## Troubleshooting

**Can't login?**
- Check email/password are correct
- Ensure account was created successfully
- Check Supabase dashboard for user

**Not seeing admin features?**
- Verify is_admin = true in profiles table
- Logout and login again to refresh session
- Check RLS policies are correctly applied

**Subscription not showing?**
- Check subscriptions table for user_id
- Verify user has a subscription record
- Default should be 'free' tier

## Support

For issues or questions about authentication:
1. Check the ADMIN_SETUP.md file
2. Review Supabase dashboard for errors
3. Check browser console for error messages
4. Verify database migrations ran successfully
