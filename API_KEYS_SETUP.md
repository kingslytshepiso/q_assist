# 🔑 API Keys Setup Guide

## Overview

This guide will help you set up the required API keys for Google Maps to work properly in your Assist app.

## Step 1: Create Environment File

Create a `.env` file in your project root with the following content:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google Maps API Keys
GOOGLE_MAPS_API_KEY_ANDROID=your_android_api_key_here
GOOGLE_MAPS_API_KEY_IOS=your_ios_api_key_here
```

## Step 2: Get Google Maps API Keys

### 1. Go to Google Cloud Console

- Visit [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select an existing one

### 2. Enable Maps APIs

- Go to "APIs & Services" → "Library"
- Search for and enable:
  - **Maps SDK for Android**
  - **Maps SDK for iOS**

### 3. Create API Keys

- Go to "APIs & Services" → "Credentials"
- Click "Create Credentials" → "API Key"
- Create two separate API keys:
  - One for Android
  - One for iOS

### 4. Restrict API Keys

For each API key, click "Restrict Key" and set:

**Application restrictions:**

- For Android: Select "Android apps" and add your package name `com.assist.app`
- For iOS: Select "iOS apps" and add your bundle identifier `com.assist.app`

**API restrictions:**

- Select "Restrict key"
- Choose the APIs you enabled (Maps SDK for Android/iOS)

## Step 3: Get SHA-1 Fingerprint (Android)

### Option 1: Generate Debug Keystore

```bash
# Create the .android directory
mkdir -p ~/.android

# Generate debug keystore
keytool -genkey -v -keystore ~/.android/debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
```

### Option 2: Use Existing Keystore (if you have one)

```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

### Option 3: Use Expo's Debug Keystore

If you're using Expo, the debug keystore might be in a different location. Try:

```bash
# For Windows
keytool -list -v -keystore "%USERPROFILE%\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android

# For macOS/Linux
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

## Step 4: Update app.json

Replace the placeholder values in your `app.json`:

```json
{
  "expo": {
    "ios": {
      "config": {
        "googleMapsApiKey": "YOUR_ACTUAL_IOS_API_KEY"
      }
    },
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_ACTUAL_ANDROID_API_KEY"
        }
      }
    }
  }
}
```

## Step 5: Add SHA-1 to Google Cloud Console

1. Copy the SHA-1 fingerprint from the keytool command
2. Go to Google Cloud Console → APIs & Services → Credentials
3. Edit your Android API key
4. Add the SHA-1 fingerprint to the "SHA-1 certificate fingerprints" section

## Step 6: Rebuild the App

After updating the API keys:

```bash
# Clean and rebuild
npx expo prebuild --clean

# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios
```

## Troubleshooting

### Common Issues

1. **"API key not found" error**:

   - Verify API keys are correctly set in `app.json`
   - Check that the Maps SDK APIs are enabled
   - Ensure you're using a development build, not Expo Go

2. **"SHA-1 fingerprint not found"**:

   - Make sure you've added the correct SHA-1 to your Android API key
   - Verify you're using the debug keystore, not a release keystore

3. **"Permission denied for location"**:
   - Check that location permissions are added to `app.json`
   - Request permissions at runtime using expo-location

### Debug Steps

1. **Check API Key Restrictions**:

   - Go to Google Cloud Console → APIs & Services → Credentials
   - Verify your API keys have the correct restrictions

2. **Check API Usage**:

   - Go to Google Cloud Console → APIs & Services → Dashboard
   - Verify the Maps SDK APIs are enabled and being used

3. **Check Console Logs**:
   - Look for any error messages in the development console
   - Check for network request failures

## Security Notes

- **Never commit API keys to version control**
- Use environment variables for sensitive data
- Set up proper API key restrictions
- Monitor API usage and costs

## Next Steps

1. Follow this guide to set up your API keys
2. Update your `app.json` with the actual API keys
3. Rebuild your app with `npx expo prebuild --clean`
4. Test the map functionality
5. Monitor API usage in Google Cloud Console
