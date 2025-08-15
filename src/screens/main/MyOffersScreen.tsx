import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

interface Offer {
  id: string;
  message: string;
  status: string;
  created_at: string;
  request: {
    id: string;
    title: string;
    description: string;
    location: string;
    status: string;
    category: {
      name: string;
    };
    user: {
      full_name: string;
    };
  };
}

interface MyOffersScreenProps {
  navigation: any;
}

export const MyOffersScreen: React.FC<MyOffersScreenProps> = ({
  navigation,
}) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("offers")
        .select(
          `
          *,
          request:requests(
            id,
            title,
            description,
            location,
            status,
            category:categories(name),
            user:users(full_name)
          )
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOffers(data || []);
    } catch (error) {
      console.error("Error fetching offers:", error);
      Alert.alert("Error", "Failed to load your offers");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOffers();
  };

  const handleRequestPress = (requestId: string) => {
    navigation.navigate("RequestDetail", { requestId });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#FF9500";
      case "accepted":
        return "#34C759";
      case "rejected":
        return "#FF3B30";
      default:
        return "#999";
    }
  };

  const renderOfferItem = ({ item }: { item: Offer }) => (
    <TouchableOpacity
      style={styles.offerCard}
      onPress={() => handleRequestPress(item.request.id)}
    >
      <View style={styles.offerHeader}>
        <Text style={styles.requestTitle} numberOfLines={1}>
          {item.request.title}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.requestDescription} numberOfLines={2}>
        {item.request.description}
      </Text>

      <View style={styles.offerMessage}>
        <Text style={styles.messageLabel}>Your offer:</Text>
        <Text style={styles.messageText} numberOfLines={2}>
          {item.message}
        </Text>
      </View>

      <View style={styles.offerFooter}>
        <View style={styles.offerMeta}>
          <Text style={styles.categoryText}>{item.request.category.name}</Text>
          <Text style={styles.locationText}>📍 {item.request.location}</Text>
          <Text style={styles.requestOwnerText}>
            by {item.request.user.full_name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your offers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Offers</Text>
        <Text style={styles.subtitle}>
          Track the status of your help offers
        </Text>
      </View>

      <FlatList
        data={offers}
        keyExtractor={(item) => item.id}
        renderItem={renderOfferItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No offers yet</Text>
            <Text style={styles.emptySubtext}>
              Start helping others by making offers on their requests!
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.browseButtonText}>Browse Requests</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  listContainer: {
    padding: 16,
  },
  offerCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  offerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  requestTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  requestDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  offerMessage: {
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  messageLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  offerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  offerMeta: {
    flex: 1,
  },
  categoryText: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
    marginBottom: 4,
  },
  locationText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  requestOwnerText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
