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
import { theme } from "../../lib/theme";

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
    return theme.utils.getStatusColor(status);
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
    ...theme.presets.container.base,
  },
  header: {
    padding: theme.spacing[5],
    backgroundColor: theme.colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  title: {
    ...theme.presets.text.h2,
    marginBottom: theme.spacing[1],
  },
  subtitle: {
    ...theme.presets.text.body,
    color: theme.colors.text.secondary,
  },
  listContainer: {
    padding: theme.spacing[4],
  },
  offerCard: {
    ...theme.presets.card.base,
    marginBottom: theme.layout.listItemSpacing,
  },
  offerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing[2],
  },
  requestTitle: {
    ...theme.presets.text.h4,
    flex: 1,
    marginRight: theme.spacing[2],
  },
  statusBadge: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.md,
  },
  statusText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.size.xs,
    fontWeight: theme.typography.weight.semibold,
  },
  requestDescription: {
    ...theme.presets.text.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[3],
  },
  offerMessage: {
    backgroundColor: theme.colors.background.tertiary,
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.base,
    marginBottom: theme.spacing[3],
  },
  messageLabel: {
    ...theme.presets.text.bodySmall,
    fontWeight: theme.typography.weight.medium,
    marginBottom: theme.spacing[1],
  },
  messageText: {
    ...theme.presets.text.body,
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
    ...theme.presets.text.bodySmall,
    color: theme.colors.primary.main,
    fontWeight: theme.typography.weight.medium,
    marginBottom: theme.spacing[1],
  },
  locationText: {
    ...theme.presets.text.bodySmall,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing[0.5],
  },
  requestOwnerText: {
    ...theme.presets.text.bodySmall,
    fontWeight: theme.typography.weight.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background.primary,
  },
  loadingText: {
    ...theme.presets.text.body,
    color: theme.colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    ...theme.presets.text.h4,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[2],
  },
  emptySubtext: {
    ...theme.presets.text.bodySmall,
    color: theme.colors.text.tertiary,
    textAlign: "center",
    marginBottom: theme.spacing[5],
  },
  browseButton: {
    ...theme.presets.button.primary,
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[3],
  },
  browseButtonText: {
    ...theme.presets.text.button,
  },
});
