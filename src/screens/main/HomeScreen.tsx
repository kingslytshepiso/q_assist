import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RequestCard } from "../../components/RequestCard";
import { useAuth } from "../../contexts/AuthContext";
import { useRequests } from "../../contexts/RequestContext";
import { theme } from "../../lib/theme";
import { MapScreen } from "./MapScreen";

interface DashboardStats {
  totalRequests: number;
  nearbyRequests: number;
  myRequests: number;
  myOffers: number;
}

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    nearbyRequests: 0,
    myRequests: 0,
    myOffers: 0,
  });
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const { user } = useAuth();
  const {
    requests,
    myRequests,
    nearbyRequests,
    loading: requestsLoading,
    error: requestsError,
    isInitialized,
    isRefreshing,
    isLoadingNearby,
    fetchNearbyRequests,
    refreshRequests,
  } = useRequests();
  const insets = useSafeAreaInsets();

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({});
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error("Error getting location:", error);
      return null;
    }
  };

  // Update stats when context data changes
  useEffect(() => {
    if (user?.id && isInitialized) {
      console.log("HomeScreen - Updating stats:", {
        totalRequests: requests.length,
        nearbyRequests: nearbyRequests.length,
        myRequests: myRequests.length,
      });

      setStats({
        totalRequests: requests.length, // All requests from other users
        nearbyRequests: nearbyRequests.length, // Location-based requests
        myRequests: myRequests.length, // User's own requests
        myOffers: 0, // TODO: Add offers context
      });
    }
  }, [
    user?.id,
    isInitialized,
    requests.length,
    nearbyRequests.length,
    myRequests.length,
  ]);

  // Fetch location and nearby requests when user is available
  useEffect(() => {
    const initializeLocation = async () => {
      if (user?.id) {
        const location = await getCurrentLocation();
        setUserLocation(location);

        if (location) {
          await fetchNearbyRequests(location.latitude, location.longitude, 10);
        }
      }
    };

    initializeLocation();
  }, [user?.id]);

  // Set loading state based on context loading
  useEffect(() => {
    console.log("HomeScreen: Loading state update:", {
      requestsLoading,
      isInitialized,
      requestsLength: requests.length,
      myRequestsLength: myRequests.length,
      currentLoading: loading,
    });

    // Only show loading if we have no data and context is still loading
    if (!isInitialized && requests.length === 0 && myRequests.length === 0) {
      console.log("HomeScreen: Setting loading to true (no data yet)");
      setLoading(true);
    } else {
      console.log("HomeScreen: Setting loading to false");
      setLoading(false);
    }
  }, [isInitialized, requests.length, myRequests.length]);

  // Fallback timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.log("Loading timeout reached, forcing loading to false");
        setLoading(false);
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timeout);
  }, [loading]);

  // Debug logging for requests data
  useEffect(() => {
    console.log("HomeScreen - Requests data:", {
      requestsCount: requests.length,
      myRequestsCount: myRequests.length,
      nearbyRequestsCount: nearbyRequests.length,
      loading: requestsLoading,
      error: requestsError,
    });

    if (requests.length > 0) {
      console.log("HomeScreen - First request:", requests[0]);
    }
  }, [requests, myRequests, nearbyRequests, requestsLoading, requestsError]);

  const onRefresh = async () => {
    try {
      await refreshRequests();

      // Refresh nearby requests if location is available
      if (userLocation) {
        await fetchNearbyRequests(
          userLocation.latitude,
          userLocation.longitude,
          10
        );
      }
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
    }
  };

  const handleCreateRequest = () => {
    navigation.navigate("CreateRequest");
  };

  const handleRequestPress = (request: any) => {
    navigation.navigate("RequestDetail", { requestId: request.id });
  };

  const handleViewNearby = () => {
    navigation.navigate("NearbyRequests");
  };

  const handleViewAllRequests = () => {
    // This will show all requests in the main list
    // Requests are already managed by the context
  };

  const handleViewMyRequests = () => {
    navigation.navigate("Profile", { screen: "MyRequests" });
  };

  const handleViewMyOffers = () => {
    navigation.navigate("Profile", { screen: "MyOffers" });
  };

  const toggleMapView = () => {
    setShowMap(!showMap);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  if (showMap) {
    return <MapScreen navigation={navigation} onBackToList={toggleMapView} />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 100 },
        ]}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.greetingSection}>
            <Text style={styles.greeting}>
              {getGreeting()}, {user?.user_metadata?.full_name || "there"}! 👋
            </Text>
            <Text style={styles.subtitle}>
              Here's what's happening in your area
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.profileButtonText}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleCreateRequest}
            >
              <Text style={styles.actionIcon}>➕</Text>
              <Text style={styles.actionTitle}>Create Request</Text>
              <Text style={styles.actionSubtitle}>Ask for help</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleViewNearby}
            >
              <Text style={styles.actionIcon}>📍</Text>
              <Text style={styles.actionTitle}>Nearby</Text>
              <Text style={styles.actionSubtitle}>Find local help</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={toggleMapView}>
              <Text style={styles.actionIcon}>🗺️</Text>
              <Text style={styles.actionTitle}>Map View</Text>
              <Text style={styles.actionSubtitle}>Visual search</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleViewMyRequests}
            >
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionTitle}>My Requests</Text>
              <Text style={styles.actionSubtitle}>Manage yours</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Activity</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalRequests}</Text>
              <Text style={styles.statLabel}>Available Requests</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.nearbyRequests}</Text>
              <Text style={styles.statLabel}>Nearby (10km)</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.myRequests}</Text>
              <Text style={styles.statLabel}>My Requests</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.myOffers}</Text>
              <Text style={styles.statLabel}>My Offers</Text>
            </View>
          </View>
        </View>

        {/* Available Requests Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Requests</Text>
            <TouchableOpacity onPress={handleViewAllRequests}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {requests.slice(0, 3).map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onPress={() => handleRequestPress(request)}
            />
          ))}
        </View>

        {/* My Requests Section */}
        {myRequests.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Requests</Text>
              <TouchableOpacity onPress={handleViewMyRequests}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {myRequests.slice(0, 3).map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onPress={() => handleRequestPress(request)}
              />
            ))}
          </View>
        )}

        {/* Nearby Requests Section */}
        {nearbyRequests.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nearby Requests</Text>
              <TouchableOpacity onPress={handleViewNearby}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.nearbyContainer}>
              {nearbyRequests.slice(0, 3).map((request) => (
                <TouchableOpacity
                  key={request.id}
                  style={styles.nearbyCard}
                  onPress={() => handleRequestPress(request)}
                >
                  <View style={styles.nearbyCardHeader}>
                    <Text style={styles.nearbyTitle} numberOfLines={1}>
                      {request.title}
                    </Text>
                    <Text style={styles.nearbyDistance}>
                      {(request as any).distance_km?.toFixed(1)}km
                    </Text>
                  </View>
                  <Text style={styles.nearbyCategory}>
                    {request.category.name}
                  </Text>
                  <Text style={styles.nearbyLocation}>
                    📍 {request.location}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Promotional Section */}
        <View style={styles.section}>
          <View style={styles.promoCard}>
            <Text style={styles.promoIcon}>🎉</Text>
            <Text style={styles.promoTitle}>Help Your Community!</Text>
            {/* <Text style={styles.promoText}>
              Join thousands of people helping each other in your area. Create a
              request or offer your skills to make a difference.
            </Text> */}
            <TouchableOpacity
              style={styles.promoButton}
              onPress={handleCreateRequest}
            >
              <Text style={styles.promoButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing[4],
    paddingTop: Platform.OS === "ios" ? theme.spacing[2] : theme.spacing[4],
    backgroundColor: theme.colors.primary.main,
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing[1],
  },
  subtitle: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.inverse,
    opacity: 0.9,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  profileButtonText: {
    fontSize: theme.typography.size.lg,
  },
  section: {
    padding: theme.spacing[4],
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing[3],
  },
  sectionTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[3],
  },
  viewAllText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.primary.main,
    fontWeight: theme.typography.weight.semibold,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[3],
  },
  actionCard: {
    width: "47%",
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    alignItems: "center",
    shadowColor: theme.colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  },
  actionIcon: {
    fontSize: theme.typography.size["2xl"],
    marginBottom: theme.spacing[2],
  },
  actionTitle: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.primary,
    textAlign: "center",
    marginBottom: theme.spacing[1],
  },
  actionSubtitle: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing[3],
  },
  statCard: {
    width: "47%",
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    alignItems: "center",
    shadowColor: theme.colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  },
  statNumber: {
    fontSize: theme.typography.size["2xl"],
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.primary.main,
    marginBottom: theme.spacing[1],
  },
  statLabel: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  nearbyContainer: {
    gap: theme.spacing[3],
  },
  nearbyCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[3],
    shadowColor: theme.colors.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  nearbyCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing[2],
  },
  nearbyTitle: {
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: theme.spacing[2],
  },
  nearbyDistance: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.primary.main,
    fontWeight: theme.typography.weight.semibold,
  },
  nearbyCategory: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.secondary.main,
    fontWeight: theme.typography.weight.medium,
    marginBottom: theme.spacing[1],
  },
  nearbyLocation: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
  },
  promoCard: {
    backgroundColor: theme.colors.accent.light,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[6],
    alignItems: "center",
    shadowColor: theme.colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
    minHeight: 200,
  },
  promoIcon: {
    fontSize: theme.typography.size["3xl"],
    marginBottom: theme.spacing[2],
  },
  promoTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.inverse,
    textAlign: "center",
    marginBottom: theme.spacing[2],
  },
  promoText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.inverse,
    textAlign: "center",
    lineHeight: theme.typography.lineHeight.normal,
    marginBottom: theme.spacing[3],
    paddingHorizontal: theme.spacing[2],
    width: "100%",
    flexWrap: "wrap",
    flex: 1,
  },
  promoButton: {
    backgroundColor: theme.colors.accent.main,
    borderRadius: theme.borderRadius.base,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    marginTop: theme.spacing[2],
  },
  promoButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.semibold,
  },
});
