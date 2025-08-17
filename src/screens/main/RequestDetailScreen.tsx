import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
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
    id: string;
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

  const handleViewLocation = () => {
    if (!request?.latitude || !request?.longitude) {
      Alert.alert(
        "Location Not Available",
        "This request doesn't have location coordinates available."
      );
      return;
    }

    const url = `https://www.google.com/maps/search/?api=1&query=${request.latitude},${request.longitude}`;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert(
          "Error",
          "Unable to open Google Maps. Please make sure you have Google Maps installed."
        );
      }
    });
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
          {request.latitude && request.longitude && (
            <TouchableOpacity
              style={styles.locationButton}
              onPress={handleViewLocation}
            >
              <Text style={styles.locationButtonText}>📍 View on Map</Text>
            </TouchableOpacity>
          )}
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
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    padding: 20,
  },
  header: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: theme.colors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  statusContainer: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  status: {
    color: theme.colors.text.inverse,
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: theme.colors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  detailLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: theme.colors.text.primary,
    fontWeight: "600",
  },
  offerSection: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: theme.colors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  offerInput: {
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    marginBottom: 16,
    minHeight: 100,
  },
  offerButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  offerButtonDisabled: {
    backgroundColor: theme.colors.border.medium,
  },
  offerButtonText: {
    color: theme.colors.text.inverse,
    fontSize: 16,
    fontWeight: "600",
  },
  ownerSection: {
    backgroundColor: theme.colors.secondary.light,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.secondary.main,
  },
  ownerText: {
    fontSize: 14,
    color: theme.colors.secondary.dark,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background.primary,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background.primary,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  locationButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 8,
  },
  locationButtonText: {
    color: theme.colors.text.inverse,
    fontSize: 14,
    fontWeight: "600",
  },
});
