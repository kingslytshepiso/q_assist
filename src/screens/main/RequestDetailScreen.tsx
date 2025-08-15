import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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

interface RequestDetailScreenProps {
  navigation: any;
  route: {
    params: {
      requestId: string;
    };
  };
}

export const RequestDetailScreen: React.FC<RequestDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [offerMessage, setOfferMessage] = useState("");
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const { user } = useAuth();
  const { requestId } = route.params;

  useEffect(() => {
    fetchRequest();
  }, [requestId]);

  const fetchRequest = async () => {
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
        .eq("id", requestId)
        .single();

      if (error) throw error;
      setRequest(data);
    } catch (error) {
      console.error("Error fetching request:", error);
      Alert.alert("Error", "Failed to load request details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOffer = async () => {
    if (!offerMessage.trim()) {
      Alert.alert("Error", "Please enter a message for your offer");
      return;
    }

    if (!user) {
      Alert.alert("Error", "You must be logged in to make an offer");
      return;
    }

    setSubmittingOffer(true);
    try {
      const { error } = await supabase.from("offers").insert({
        request_id: requestId,
        user_id: user.id,
        message: offerMessage.trim(),
        status: "pending",
      });

      if (error) throw error;

      Alert.alert("Success", "Your offer has been submitted successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error submitting offer:", error);
      Alert.alert("Error", "Failed to submit offer");
    } finally {
      setSubmittingOffer(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading request details...</Text>
      </View>
    );
  }

  if (!request) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Request not found</Text>
      </View>
    );
  }

  const isOwnRequest = user?.id === request.user.id;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{request.title}</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.status}>{request.status.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{request.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category:</Text>
            <Text style={styles.detailValue}>{request.category.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{request.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Posted by:</Text>
            <Text style={styles.detailValue}>{request.user.full_name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Posted on:</Text>
            <Text style={styles.detailValue}>
              {formatDate(request.created_at)}
            </Text>
          </View>
        </View>

        {!isOwnRequest && request.status === "open" && (
          <View style={styles.offerSection}>
            <Text style={styles.sectionTitle}>Make an Offer</Text>
            <TextInput
              style={styles.offerInput}
              placeholder="Describe how you can help..."
              value={offerMessage}
              onChangeText={setOfferMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[
                styles.offerButton,
                submittingOffer && styles.offerButtonDisabled,
              ]}
              onPress={handleSubmitOffer}
              disabled={submittingOffer}
            >
              <Text style={styles.offerButtonText}>
                {submittingOffer ? "Submitting..." : "Submit Offer"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {isOwnRequest && (
          <View style={styles.ownerSection}>
            <Text style={styles.sectionTitle}>Your Request</Text>
            <Text style={styles.ownerText}>
              This is your request. You can manage offers and update the status
              from your profile.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
  header: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  statusContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  status: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  offerSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  offerInput: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
    minHeight: 100,
  },
  offerButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  offerButtonDisabled: {
    backgroundColor: "#ccc",
  },
  offerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  ownerSection: {
    backgroundColor: "#f0f8ff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  ownerText: {
    fontSize: 14,
    color: "#007AFF",
    lineHeight: 20,
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
  },
});
