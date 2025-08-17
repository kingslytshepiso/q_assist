import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { theme } from "../../lib/theme";

interface Request {
  id: string;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  status: string;
  created_at: string;
  user: {
    full_name: string;
  };
  category: {
    name: string;
  };
}

interface MapScreenProps {
  navigation: any;
  onBackToList?: () => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({
  navigation,
  onBackToList,
}) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const mapRef = useRef<MapView>(null);
  const { user } = useAuth();

  useEffect(() => {
    getCurrentLocation();
    fetchNearbyRequests();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permission is required to show nearby requests."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUserLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Could not get your current location.");
    }
  };

  const fetchNearbyRequests = async () => {
    try {
      let query = supabase
        .from("requests")
        .select(
          `
          *,
          user:users(full_name),
          category:categories(name)
        `
        )
        .eq("status", "open")
        .not("latitude", "is", null)
        .not("longitude", "is", null);

      const { data, error } = await query;
      if (error) throw error;

      // Filter requests within 50km radius if we have user location
      if (userLocation) {
        const nearbyRequests = data?.filter((request) => {
          if (!request.latitude || !request.longitude) return false;

          const distance = calculateDistance(
            userLocation.coords.latitude,
            userLocation.coords.longitude,
            request.latitude,
            request.longitude
          );

          return distance <= 50; // 50km radius
        });

        setRequests(nearbyRequests || []);
      } else {
        setRequests(data || []);
      }
    } catch (error) {
      console.error("Error fetching nearby requests:", error);
      Alert.alert("Error", "Failed to load nearby requests");
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getMarkerColor = (categoryName: string) => {
    const colors = {
      "Home & Garden": theme.colors.primary.main,
      Technology: theme.colors.secondary.main,
      Transportation: theme.colors.accent.main,
      Education: theme.colors.status.warning,
      "Health & Wellness": theme.colors.status.error,
      Business: theme.colors.status.info,
      Events: theme.colors.status.success,
      Other: theme.colors.neutral.gray[500],
    };
    return (
      colors[categoryName as keyof typeof colors] ||
      theme.colors.neutral.gray[500]
    );
  };

  const handleMarkerPress = (request: Request) => {
    navigation.navigate("RequestDetail", { requestId: request.id });
  };

  const centerOnUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        mapType="satellite"
      >
        {requests.map((request) => (
          <Marker
            key={request.id}
            coordinate={{
              latitude: request.latitude,
              longitude: request.longitude,
            }}
            title={request.title}
            description={`${request.category.name} • ${request.location}`}
            onPress={() => handleMarkerPress(request)}
            pinColor={getMarkerColor(request.category.name)}
          />
        ))}
      </MapView>

      <TouchableOpacity style={styles.backButton} onPress={onBackToList}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.centerButton}
        onPress={centerOnUserLocation}
      >
        <Text style={styles.centerButtonText}>📍</Text>
      </TouchableOpacity>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Categories</Text>
        <View style={styles.legendItems}>
          {Object.entries({
            "Home & Garden": theme.colors.primary.main,
            Technology: theme.colors.secondary.main,
            Transportation: theme.colors.accent.main,
            Education: theme.colors.status.warning,
            "Health & Wellness": theme.colors.status.error,
            Business: theme.colors.status.info,
            Events: theme.colors.status.success,
            Other: theme.colors.neutral.gray[500],
          }).map(([category, color]) => (
            <View key={category} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text style={styles.legendText}>{category}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background.primary,
  },
  loadingText: {
    marginTop: theme.spacing[3],
    fontSize: theme.typography.size.lg,
    color: theme.colors.text.secondary,
  },
  backButton: {
    position: "absolute",
    top: 50,
    right: theme.spacing[4],
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
    ...theme.shadows.md,
    zIndex: 1000,
  },
  backButtonText: {
    fontSize: theme.typography.size.base,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weight.medium,
  },
  centerButton: {
    position: "absolute",
    bottom: 200,
    right: theme.spacing[4],
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary.main,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.md,
  },
  centerButtonText: {
    fontSize: 24,
  },
  legend: {
    position: "absolute",
    bottom: 100,
    left: theme.spacing[4],
    right: theme.spacing[4],
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[3],
    ...theme.shadows.md,
  },
  legendTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  legendItems: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: theme.spacing[4],
    marginBottom: theme.spacing[2],
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing[1],
  },
  legendText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
  },
});
