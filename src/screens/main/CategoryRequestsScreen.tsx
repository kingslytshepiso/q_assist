import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RequestCard } from "../../components/RequestCard";
import { supabase } from "../../lib/supabase";

interface Request {
  id: string;
  title: string;
  description: string;
  location: string;
  status: string;
  created_at: string;
  user: {
    full_name: string;
  };
  category: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
}

interface CategoryRequestsScreenProps {
  navigation: any;
  route: {
    params: {
      category: Category;
    };
  };
}

export const CategoryRequestsScreen: React.FC<CategoryRequestsScreenProps> = ({
  navigation,
  route,
}) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { category } = route.params;

  useEffect(() => {
    fetchRequests();
  }, [category.id]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("requests")
        .select(
          `
          *,
          user:users(full_name),
          category:categories(name)
        `
        )
        .eq("category_id", category.id)
        .eq("status", "open")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      Alert.alert("Error", "Failed to load requests");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRequests();
  };

  const handleRequestPress = (request: Request) => {
    navigation.navigate("RequestDetail", { requestId: request.id });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.categoryIcon}>{category.icon || "📋"}</Text>
        <Text style={styles.title}>{category.name}</Text>
        <Text style={styles.subtitle}>
          {requests.length} active request{requests.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RequestCard
            request={item}
            onPress={() => handleRequestPress(item)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No active requests</Text>
            <Text style={styles.emptySubtext}>
              No one has requested help in this category yet.
            </Text>
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
    alignItems: "center",
  },
  categoryIcon: {
    fontSize: 48,
    marginBottom: 8,
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
  },
});
