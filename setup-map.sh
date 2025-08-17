#!/bin/bash

# Setup script for Google Maps with React Native Maps
echo "🗺️ Setting up Google Maps for Assist App..."

# Install react-native-maps
echo "📦 Installing react-native-maps..."
npm install react-native-maps@1.10.0

# Check if expo-location is already installed
if ! npm list expo-location > /dev/null 2>&1; then
    echo "📍 Installing expo-location..."
    npm install expo-location@^18.1.6
else
    echo "✅ expo-location already installed"
fi

# Update app.json with location permissions
echo "🔧 Updating app.json with location permissions..."
if [ -f "app.json" ]; then
    # Create backup
    cp app.json app.json.backup
    
    # Add location plugin if not exists
    if ! grep -q "expo-location" app.json; then
        echo "Adding location plugin to app.json..."
        # This is a simplified version - you may need to manually edit app.json
        echo "Please manually add the location plugin to your app.json:"
        echo '{
  "expo": {
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow Assist to use your location to show nearby requests."
        }
      ]
    ]
  }
}'
    fi
else
    echo "⚠️  app.json not found. Please create it with location permissions."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up Google Cloud Platform:"
echo "   - Create a Google Cloud project"
echo "   - Enable Maps SDK for Android and iOS"
echo "   - Create API keys"
echo "   - Follow the detailed guide in GOOGLE_MAPS_SETUP.md"
echo ""
echo "2. Update your app.json with API keys:"
echo "   - Add Google Maps API keys for Android and iOS"
echo "   - Configure proper restrictions for security"
echo ""
echo "3. Create a development build:"
echo "   - Run: npx expo prebuild"
echo "   - Run: npx expo run:android (or run:ios)"
echo ""
echo "4. Run the database migration in Supabase:"
echo "   - Copy the SQL from database-migration.sql"
echo "   - Run it in your Supabase SQL editor"
echo ""
echo "5. Test the implementation:"
echo "   - Test on device with location enabled"
echo "   - Verify Google Maps loads correctly"
echo ""
echo "✅ Benefits of Google Maps:"
echo "   - Excellent performance and reliability"
echo "   - High-quality satellite imagery"
echo "   - Comprehensive mapping features"
echo "   - $200 free credit monthly"
echo "   - Professional-grade solution"
