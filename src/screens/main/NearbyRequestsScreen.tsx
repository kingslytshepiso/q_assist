import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RequestCard } from "../../components/RequestCard";
import { supabase } from "../../lib/supabase";
import { theme } from "../../lib/theme";

interface Request {
  id: string;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  status: string;
  created_at: string;
  user: {
    full_name: string;
  };
  category: {
    name: string;
  };
  distance_km?: number;
}

interface NearbyRequestsScreenProps {
  navigation: any;
}

export const NearbyRequestsScreen: React.FC<NearbyRequestsScreenProps> = ({
  navigation,
}) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const insets = useSafeAreaInsets();

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to show nearby requests."
        );
        return null;
      }

      const location = await Location.getCurrentPositionAsync({});
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Failed to get your location");
      return null;
    }
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchNearbyRequests = async () => {
    try {
      // First get user location
      const location = await getCurrentLocation();
      if (!location) {
        setLoading(false);
        return;
      }

      setUserLocation(location);

      // Fetch all open requests with coordinates
      const { data, error } = await supabase
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

      if (error) throw error;

      // Calculate distances and filter requests within 50km
      const requestsWithDistance = (data || [])
        .map((request) => ({
          ...request,
          distance_km: calculateDistance(
            location.latitude,
            location.longitude,
            request.latitude!,
            request.longitude!
          ),
        }))
        .filter((request) => request.distance_km <= 50)
        .sort((a, b) => a.distance_km! - b.distance_km!);

      setRequests(requestsWithDistance);
    } catch (error) {
      console.error("Error fetching nearby requests:", error);
      Alert.alert("Error", "Failed to load nearby requests");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNearbyRequests();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNearbyRequests();
  };

  const handleRequestPress = (request: Request) => {
    navigation.navigate("RequestDetail", { requestId: request.id });
  };

  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`;
    } else {
      return `${distance.toFixed(1)}km away`;
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <Text style={styles.loadingText}>Finding nearby requests...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nearby Requests</Text>
        <View style={styles.spacer} />
      </View>

      {userLocation && (
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>
            📍 Showing requests near your location
          </Text>
        </View>
      )}

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.requestContainer}>
            <RequestCard
              request={item}
              onPress={() => handleRequestPress(item)}
            />
            {item.distance_km && (
              <Text style={styles.distanceText}>
                {formatDistance(item.distance_km)}
              </Text>
            )}
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No nearby requests</Text>
            <Text style={styles.emptySubtext}>
              There are no active requests within 50km of your location.
            </Text>
          </View>
        }
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: Math.max(insets.bottom, 20) + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing[4],
    paddingTop: Platform.OS === "ios" ? theme.spacing[2] : theme.spacing[4],
    backgroundColor: theme.colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  backButton: {
    paddingHorizontal: theme.spacing[2],
  },
  backButtonText: {
    fontSize: theme.typography.size.base,
    color: theme.colors.primary.main,
    fontWeight: theme.typography.weight.semibold,
  },
  title: {
    flex: 1,
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  spacer: {
    width: 60,
  },
  locationInfo: {
    backgroundColor: theme.colors.primary.light,
    padding: theme.spacing[3],
    marginHorizontal: theme.spacing[4],
    marginTop: theme.spacing[4],
    borderRadius: theme.borderRadius.base,
  },
  locationText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.primary.dark,
    textAlign: "center",
    fontWeight: theme.typography.weight.medium,
  },
  listContainer: {
    padding: theme.spacing[4],
    flexGrow: 1,
  },
  requestContainer: {
    marginBottom: theme.spacing[3],
  },
  distanceText: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.text.tertiary,
    textAlign: "right",
    marginTop: theme.spacing[1],
    marginRight: theme.spacing[2],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background.primary,
  },
  loadingText: {
    fontSize: theme.typography.size.lg,
    color: theme.colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.spacing[16],
  },
  emptyText: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[2],
  },
  emptySubtext: {
    fontSize: theme.typography.size.base,
    color: theme.colors.text.tertiary,
    textAlign: "center",
  },
});
