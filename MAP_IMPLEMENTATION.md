# 🗺️ Google Maps Implementation Guide

## Overview

This implementation adds a professional-grade map feature to your Assist app using **Google Maps with react-native-maps**. The map shows nearby requests based on user location with satellite imagery, custom markers, and excellent performance.

## Features

- **Google Maps Integration**: Professional-grade mapping with satellite imagery
- **Location-Based Requests**: Shows requests within 50km of user location
- **Category Color Coding**: Each request category has a unique colored marker
- **Interactive Markers**: Tap markers to view request details
- **User Location**: Shows user's current location on the map
- **Custom Theme Integration**: Uses your Q logo-inspired color scheme
- **Satellite View**: High-quality satellite imagery for better context
- **Center Button**: "📍" button to center on user location

## Installation Steps

### 1. Install Dependencies

```bash
# Install react-native-maps
npm install react-native-maps@1.10.0

# For Expo projects, you'll need to create a development build
npx expo install --fix
```

### 2. Google Cloud Platform Setup

1. **Create a Google Cloud Project**:

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project (e.g., "Assist App Maps")

2. **Enable Maps APIs**:

   - Go to "APIs & Services" → "Library"
   - Enable: Maps SDK for Android, Maps SDK for iOS

3. **Create API Keys**:
   - Go to "APIs & Services" → "Credentials"
   - Create API key and restrict it to your app

### 3. Configure app.json

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_ANDROID_API_KEY_HERE"
        }
      }
    },
    "ios": {
      "config": {
        "googleMapsApiKey": "YOUR_IOS_API_KEY_HERE"
      }
    }
  }
}
```

### 4. Create Development Build

```bash
# Create a development build with Google Maps support
npx expo prebuild

# For Android
npx expo run:android

# For iOS
npx expo run:ios
```

### 5. Database Migration

Run the following SQL in your Supabase dashboard:

```sql
-- Add coordinates to requests table
ALTER TABLE public.requests
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Create a simple distance calculation function using Haversine formula
CREATE OR REPLACE FUNCTION calculate_distance_km(
  lat1 DECIMAL, lon1 DECIMAL,
  lat2 DECIMAL, lon2 DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
  R DECIMAL := 6371; -- Earth's radius in kilometers
  dlat DECIMAL;
  dlon DECIMAL;
  a DECIMAL;
  c DECIMAL;
BEGIN
  -- Convert degrees to radians
  dlat := RADIANS(lat2 - lat1);
  dlon := RADIANS(lon2 - lon1);

  -- Haversine formula
  a := SIN(dlat/2) * SIN(dlat/2) +
       COS(RADIANS(lat1)) * COS(RADIANS(lat2)) *
       SIN(dlon/2) * SIN(dlon/2);
  c := 2 * ATAN2(SQRT(a), SQRT(1-a));

  RETURN R * c;
END;
$$ LANGUAGE plpgsql;

-- Create an index on coordinates for better performance
CREATE INDEX IF NOT EXISTS idx_requests_coordinates
ON public.requests (latitude, longitude)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
```

## Usage

### Dashboard Integration

The map is integrated into the HomeScreen with a toggle button:

- **List View**: Shows requests in a scrollable list (default)
- **Map View**: Shows requests on Google Maps with satellite imagery
- **Toggle Button**: "🗺️ Map" button in the header

### Creating Requests with Location

When creating a request:

1. The app automatically gets the user's current location
2. Coordinates are stored with the request
3. Location text is still required for display purposes

### Map Features

- **Google Maps**: High-quality map tiles with satellite imagery
- **Category Legend**: Color-coded categories in the top-left
- **Center Button**: "📍" button to center on user location
- **Interactive Markers**: Tap to view request details
- **Distance Filtering**: Only shows requests within 50km
- **Custom Markers**: Color-coded by category

## Color Scheme

The map uses your custom theme colors:

- **Home & Garden**: Green (`#00D400`)
- **Technology**: Cyan (`#00E5FF`)
- **Transportation**: Magenta (`#FF00FF`)
- **Education**: Orange (`#FF9500`)
- **Health & Wellness**: Red (`#FF3B30`)
- **Business**: Blue (`#007AFF`)
- **Events**: Success Green (`#34C759`)
- **Other**: Gray (`#9E9E9E`)

## Technical Implementation

### Google Maps + React Native Maps

The map uses:

- **Google Maps SDK**: Professional-grade mapping service
- **React Native Maps**: Native bridge to Google Maps
- **Expo Location**: For getting user location
- **Custom Markers**: Color-coded pins for each request
- **Satellite Imagery**: High-quality satellite view

### Advantages of This Approach

1. **Professional Quality**: Google Maps provides the best mapping experience
2. **Satellite Imagery**: High-quality satellite view for better context
3. **Excellent Performance**: Native implementation with smooth animations
4. **Comprehensive Features**: Full Google Maps feature set
5. **Reliable**: Google's infrastructure ensures high availability
6. **Free Tier**: $200 free credit monthly covers most apps

## Cost Information

### Google Maps Pricing (as of 2024)

- **$200 free credit monthly** (covers most small to medium apps)
- **Maps SDK for Android/iOS**: $7 per 1,000 map loads
- **Places API**: $17 per 1,000 requests (optional)
- **Geocoding API**: $5 per 1,000 requests (optional)

### Free Tier Examples

With $200 free credit, you can typically get:

- ~28,500 map loads per month
- ~11,700 Places API requests
- ~40,000 Geocoding requests

## Advanced Features to Consider

### Real-time Updates

```typescript
// Subscribe to real-time request updates
const subscription = supabase
  .channel("requests")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "requests" },
    (payload) => {
      // Update map markers
      fetchNearbyRequests();
    }
  )
  .subscribe();
```

### Custom Markers

```typescript
<Marker
  coordinate={coordinate}
  image={require("./assets/custom-marker.png")}
  tracksViewChanges={false}
>
  <View style={styles.customMarker}>
    <Text>Custom</Text>
  </View>
</Marker>
```

### Map Clustering

```bash
npm install react-native-maps-clustering
```

```typescript
import { Clustering } from "react-native-maps-clustering";

<MapView>
  <Clustering>
    {markers.map((marker) => (
      <Marker key={marker.id} coordinate={marker.coordinate} />
    ))}
  </Clustering>
</MapView>;
```

### Different Map Types

```typescript
<MapView
  mapType="satellite" // or "standard", "hybrid", "terrain"
  // ... other props
/>
```

## Troubleshooting

### Common Issues

1. **"Google Play services is not available"**: Use development build, not Expo Go
2. **"API key not found"**: Verify API key in app.json and Google Cloud Console
3. **"Maps not loading on iOS"**: Check iOS API key and bundle identifier
4. **"Permission denied for location"**: Add location permissions to app.json

### Debug Steps

- Check API key restrictions in Google Cloud Console
- Verify Maps SDK APIs are enabled
- Monitor console logs for error messages
- Test with development build, not Expo Go

## Performance Optimization

### Database Indexing

```sql
-- Create spatial index for better performance
CREATE INDEX idx_requests_coordinates
ON public.requests (latitude, longitude)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
```

### Map Optimization

- Implement marker clustering for dense areas
- Use `tracksViewChanges={false}` for custom markers
- Lazy load markers as user pans
- Cache location data to reduce API calls

## Security Considerations

### API Key Security

- **Never commit API keys to version control**
- Use environment variables or secure key management
- Set up proper API key restrictions
- Monitor API usage and costs

### Location Privacy

- Only request location when needed
- Store coordinates securely
- Implement user consent for location sharing
- Allow users to disable location features

## Future Enhancements

### Planned Features

- [ ] Route planning to requests
- [ ] Custom marker icons
- [ ] Request clustering
- [ ] Offline map support
- [ ] Heat map visualization
- [ ] Real-time location sharing
- [ ] Geofencing notifications
- [ ] Multi-language support

### Integration Ideas

- Weather data overlay
- Traffic information
- Public transport routes
- Emergency services integration
- Community safety features

## Comparison with Other Solutions

| Feature       | Google Maps | Mapbox   | OpenStreetMap | HERE Maps |
| ------------- | ----------- | -------- | ------------- | --------- |
| Performance   | Excellent   | Good     | Good          | Good      |
| Satellite     | Excellent   | Good     | Limited       | Good      |
| Cost          | $200 free   | 50k free | Free          | 250k free |
| API Key       | Required    | Required | No            | Required  |
| Customization | High        | High     | High          | Medium    |
| Reliability   | Excellent   | Good     | Good          | Good      |
| Support       | Excellent   | Good     | Community     | Good      |

## Support Resources

- [React Native Maps Documentation](https://github.com/react-native-maps/react-native-maps)
- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Expo Maps Documentation](https://docs.expo.dev/versions/latest/sdk/map-view/)
- [Google Cloud Console](https://console.cloud.google.com/)

## Next Steps

1. Follow the detailed setup guide in `GOOGLE_MAPS_SETUP.md`
2. Set up Google Cloud Platform and API keys
3. Create a development build with `npx expo prebuild`
4. Test the implementation on device
5. Monitor API usage and costs
6. Consider implementing advanced features
