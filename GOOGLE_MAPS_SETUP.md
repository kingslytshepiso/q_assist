# 🗺️ Google Maps Setup Guide for React Native Maps

## Overview

This guide will help you set up Google Maps with `react-native-maps` for your Assist app. Google Maps provides excellent performance, satellite imagery, and a comprehensive mapping experience.

## Prerequisites

- Google Cloud Platform account
- Expo project with development build (not Expo Go)
- Android/iOS development environment

## Step 1: Install Dependencies

```bash
# Install react-native-maps
npm install react-native-maps@1.10.0

# For Expo projects, you'll need to create a development build
npx expo install --fix
```

## Step 2: Google Cloud Platform Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter a project name (e.g., "Assist App Maps")
4. Click "Create"

### 2. Enable Maps APIs

1. In your project, go to "APIs & Services" → "Library"
2. Search for and enable these APIs:
   - **Maps SDK for Android**
   - **Maps SDK for iOS**
   - **Places API** (optional, for location search)
   - **Geocoding API** (optional, for address conversion)

### 3. Create API Keys

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key
4. Click "Restrict Key" to secure it:
   - **Application restrictions**: Select "Android apps" and "iOS apps"
   - **API restrictions**: Select "Restrict key" and choose the APIs you enabled

## Step 3: Configure Android

### 1. Update app.json

```json
{
  "expo": {
    "name": "Assist",
    "slug": "assist",
    "version": "1.0.0",
    "platforms": ["ios", "android"],
    "android": {
      "package": "com.yourcompany.assist",
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_ANDROID_API_KEY_HERE"
        }
      }
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.assist",
      "config": {
        "googleMapsApiKey": "YOUR_IOS_API_KEY_HERE"
      }
    }
  }
}
```

### 2. Create Development Build

```bash
# Create a development build with Google Maps support
npx expo prebuild

# For Android
npx expo run:android

# For iOS
npx expo run:ios
```

## Step 4: iOS Specific Setup

### 1. Update Info.plist (if needed)

If you encounter issues, you may need to manually update the iOS Info.plist:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs access to location to show nearby requests.</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>This app needs access to location to show nearby requests.</string>
```

### 2. Pod Install (if using bare React Native)

```bash
cd ios
pod install
cd ..
```

## Step 5: Environment Variables (Recommended)

### 1. Create .env file

```bash
# .env
GOOGLE_MAPS_API_KEY_ANDROID=your_android_api_key_here
GOOGLE_MAPS_API_KEY_IOS=your_ios_api_key_here
```

### 2. Install expo-constants

```bash
npx expo install expo-constants
```

### 3. Update app.json to use environment variables

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "GOOGLE_MAPS_API_KEY_ANDROID"
        }
      }
    },
    "ios": {
      "config": {
        "googleMapsApiKey": "GOOGLE_MAPS_API_KEY_IOS"
      }
    }
  }
}
```

## Step 6: Testing the Setup

### 1. Test Basic Map

```typescript
import MapView from "react-native-maps";

<MapView
  style={{ flex: 1 }}
  provider={PROVIDER_GOOGLE}
  initialRegion={{
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
/>;
```

### 2. Test with Markers

```typescript
<MapView
  style={{ flex: 1 }}
  provider={PROVIDER_GOOGLE}
  initialRegion={{
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
>
  <Marker
    coordinate={{
      latitude: 37.78825,
      longitude: -122.4324,
    }}
    title="Test Marker"
    description="This is a test marker"
  />
</MapView>
```

## Step 7: Troubleshooting

### Common Issues

#### 1. "Google Play services is not available"

**Solution**: Make sure you're using a development build, not Expo Go.

#### 2. "API key not found"

**Solution**:

- Verify API key is correctly set in app.json
- Check that the API key has the correct restrictions
- Ensure the Maps SDK is enabled in Google Cloud Console

#### 3. "Maps not loading on iOS"

**Solution**:

- Verify the iOS API key is set correctly
- Check that the bundle identifier matches your app
- Ensure you're using a development build

#### 4. "Permission denied for location"

**Solution**:

- Add location permissions to app.json
- Request permissions at runtime using expo-location

### Debug Steps

1. **Check API Key Restrictions**:

   - Go to Google Cloud Console → APIs & Services → Credentials
   - Verify your API key has the correct restrictions

2. **Check API Usage**:

   - Go to Google Cloud Console → APIs & Services → Dashboard
   - Verify the Maps SDK APIs are enabled and being used

3. **Check Console Logs**:
   - Look for any error messages in the development console
   - Check for network request failures

## Step 8: Production Considerations

### 1. API Key Security

- **Never commit API keys to version control**
- Use environment variables or secure key management
- Set up proper API key restrictions
- Monitor API usage and costs

### 2. Billing Setup

1. Go to Google Cloud Console → Billing
2. Link a billing account to your project
3. Set up billing alerts
4. Monitor usage to avoid unexpected charges

### 3. Rate Limiting

- Google Maps has generous free tiers
- Monitor usage in Google Cloud Console
- Implement caching for frequently accessed data

## Step 9: Advanced Features

### Custom Markers

```typescript
<Marker
  coordinate={coordinate}
  image={require("./assets/custom-marker.png")}
  // or use custom view
  tracksViewChanges={false}
>
  <View style={styles.customMarker}>
    <Text>Custom</Text>
  </View>
</Marker>
```

### Map Types

```typescript
<MapView
  mapType="satellite" // or "standard", "hybrid", "terrain"
  // ... other props
/>
```

### Clustering (for many markers)

```bash
npm install react-native-maps-clustering
```

```typescript
import MapView, { Marker } from "react-native-maps";
import { Clustering } from "react-native-maps-clustering";

<MapView>
  <Clustering>
    {markers.map((marker) => (
      <Marker key={marker.id} coordinate={marker.coordinate} />
    ))}
  </Clustering>
</MapView>;
```

## Cost Information

### Google Maps Pricing (as of 2024)

- **$200 free credit monthly** (covers most small to medium apps)
- **Maps SDK for Android/iOS**: $7 per 1,000 map loads
- **Places API**: $17 per 1,000 requests
- **Geocoding API**: $5 per 1,000 requests

### Free Tier Examples

With $200 free credit, you can typically get:

- ~28,500 map loads per month
- ~11,700 Places API requests
- ~40,000 Geocoding requests

## Alternative Solutions

If Google Maps doesn't work for your needs:

1. **Mapbox**: 50,000 free map loads/month
2. **HERE Maps**: 250,000 free transactions/month
3. **OpenStreetMap**: Completely free (what we implemented earlier)

## Support Resources

- [React Native Maps Documentation](https://github.com/react-native-maps/react-native-maps)
- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Expo Maps Documentation](https://docs.expo.dev/versions/latest/sdk/map-view/)

## Next Steps

1. Follow this guide to set up Google Maps
2. Test the implementation with your existing MapScreen
3. Monitor API usage and costs
4. Consider implementing advanced features like clustering
5. Set up proper error handling and fallbacks
