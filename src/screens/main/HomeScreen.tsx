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
import { RequestCard } from "../../components/RequestCard";
import { useAuth } from "../../contexts/AuthContext";
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

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

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

  useEffect(() => {
    fetchRequests();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRequests();
  };

  const handleCreateRequest = () => {
    navigation.navigate("CreateRequest");
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
        <Text style={styles.title}>Active Requests</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateRequest}
        >
          <Text style={styles.createButtonText}>+ New Request</Text>
        </TouchableOpacity>
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
              Be the first to create a request for help!
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  createButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  createButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
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
