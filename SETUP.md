# Quick Setup Guide

## 1. Environment Setup

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Configuration**: The app uses standard Expo configuration with `app.json` and environment variables.

## 2. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `database-schema.sql`
4. Run the SQL script

## 3. Run the App

```bash
npm start
```

Then scan the QR code with Expo Go app on your phone, or press:

- `i` for iOS simulator
- `a` for Android emulator
- `w` for web browser

## 4. Test the App

1. **Sign Up**: Create a new account
2. **Browse Categories**: View available help categories
3. **Create Request**: Make a help request
4. **View Requests**: See all active requests
5. **Make Offers**: Respond to others' requests

## Features Implemented

✅ **Authentication**

- Sign up with email/password
- Sign in
- Password reset
- Session management

✅ **Request Management**

- Create new requests
- View all active requests
- Request details with offer functionality
- Category filtering

✅ **User Interface**

- Clean, modern design
- Tab navigation
- Responsive layouts
- Loading states and error handling

✅ **Database**

- Complete schema with RLS policies
- User profiles
- Categories
- Requests and offers
- Proper relationships and constraints

## Next Steps

1. Set up Supabase project and get credentials
2. Run database schema
3. Update environment variables
4. Start the app and test functionality

The app is ready to use once you complete the Supabase setup!
