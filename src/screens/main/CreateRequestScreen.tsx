import * as Location from "expo-location";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AutocompleteInput } from "../../components/AutocompleteInput";
import { DropdownPicker } from "../../components/DropdownPicker";
import { useAuth } from "../../contexts/AuthContext";
import { useRequests } from "../../contexts/RequestContext";
import { supabase } from "../../lib/supabase";
import { theme } from "../../lib/theme";

interface Category {
  id: string;
  name: string;
}

interface LocationSuggestion {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface AutocompleteOption {
  id: string;
  label: string;
  subtitle?: string;
}

interface CreateRequestScreenProps {
  navigation: any;
}

export const CreateRequestScreen: React.FC<CreateRequestScreenProps> = ({
  navigation,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useAuth();
  const { createRequest } = useRequests();

  useEffect(() => {
    fetchCategories();
    getCurrentLocation();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");

      if (error) throw error;
      console.log("Categories loaded:", data);
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      Alert.alert("Error", "Failed to load categories");
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  const searchLocations = async (query: string) => {
    if (query.trim().length < 2) {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
      return;
    }

    try {
      // For now, we'll create some sample suggestions based on the query
      // In a real app, you would integrate with Google Places API or similar
      const sampleSuggestions: LocationSuggestion[] = [
        {
          id: "1",
          name: `${query} Downtown`,
          address: `${query} City Center, Main Street`,
          latitude: 37.7749,
          longitude: -122.4194,
        },
        {
          id: "2",
          name: `${query} Shopping Center`,
          address: `${query} Mall, Shopping District`,
          latitude: 37.7849,
          longitude: -122.4094,
        },
        {
          id: "3",
          name: `${query} Park`,
          address: `${query} Public Park, Green Area`,
          latitude: 37.7649,
          longitude: -122.4294,
        },
        {
          id: "4",
          name: `${query} Station`,
          address: `${query} Transit Station, Transport Hub`,
          latitude: 37.7549,
          longitude: -122.4394,
        },
      ];

      setLocationSuggestions(sampleSuggestions);
      setShowLocationSuggestions(true);
    } catch (error) {
      console.error("Error searching locations:", error);
    }
  };

  const selectLocation = (suggestion: LocationSuggestion) => {
    console.log("Location selected:", suggestion);
    setLocation(suggestion.name);
    setLatitude(suggestion.latitude);
    setLongitude(suggestion.longitude);
    setLocationSearchQuery(suggestion.name);
    setShowLocationSuggestions(false);
  };

  const useCurrentLocation = () => {
    getCurrentLocation();
    setLocation("Current Location");
    setLocationSearchQuery("Current Location");
    setShowLocationSuggestions(false);
  };

  const handleSubmit = async () => {
    console.log("Form validation:", {
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      selectedCategory: selectedCategory,
    });

    if (
      !title.trim() ||
      !description.trim() ||
      !location.trim() ||
      !selectedCategory
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!user) {
      Alert.alert("Error", "You must be logged in to create a request");
      return;
    }

    setLoading(true);
    try {
      const newRequest = await createRequest({
        title,
        description,
        location,
        latitude: latitude || undefined,
        longitude: longitude || undefined,
        category_id: selectedCategory.id,
      });

      if (newRequest) {
        Alert.alert("Success", "Your request has been created successfully!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Error", "Failed to create request");
      }
    } catch (error) {
      console.error("Error creating request:", error);
      Alert.alert("Error", "Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  // Check if any dropdown is open
  const isAnyDropdownOpen = showLocationSuggestions || isDropdownOpen;

  console.log("Dropdown states:", {
    showLocationSuggestions,
    isDropdownOpen,
    categoriesCount: categories.length,
    selectedCategory,
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Request</Text>
          <Text style={styles.subtitle}>Ask for help from your community</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Brief description of what you need help with"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />

          <Text style={styles.label}>Category *</Text>
          <DropdownPicker
            placeholder="Select a category"
            selectedOption={
              selectedCategory
                ? { id: selectedCategory.id, label: selectedCategory.name }
                : null
            }
            options={categories.map((category) => ({
              id: category.id,
              label: category.name,
            }))}
            onSelectOption={(option) => {
              console.log("Category selected:", option);
              const category = categories.find((c) => c.id === option.id);
              setSelectedCategory(category || null);
            }}
            onOpenChange={setIsDropdownOpen}
            style={styles.categoryPicker}
          />

          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Provide more details about what you need help with"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Location *</Text>
          <View style={styles.locationContainer}>
            <AutocompleteInput
              placeholder="Search for a location or enter manually..."
              value={locationSearchQuery}
              onChangeText={useCallback((text) => {
                console.log("Location input changed:", text);
                setLocationSearchQuery(text);
                setLocation(text);
                searchLocations(text);
              }, [])}
              onSelectOption={useCallback(
                (option) => {
                  const suggestion = locationSuggestions.find(
                    (s) => s.name === option.label
                  );
                  if (suggestion) {
                    selectLocation(suggestion);
                  }
                },
                [locationSuggestions]
              )}
              options={locationSuggestions.map((s) => ({
                id: s.id,
                label: s.name,
                subtitle: s.address,
              }))}
              showOptions={showLocationSuggestions}
              onShowOptionsChange={useCallback((show) => {
                setShowLocationSuggestions(show);
              }, [])}
              style={styles.locationInput}
              maxHeight={150}
            />
            <TouchableOpacity
              style={styles.currentLocationButton}
              onPress={useCurrentLocation}
            >
              <Text style={styles.currentLocationText}>📍</Text>
            </TouchableOpacity>
          </View>

          {latitude && longitude && (
            <View style={styles.locationInfo}>
              <Text style={styles.locationInfoText}>
                📍 Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Creating Request..." : "Create Request"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollContainer: {
    padding: theme.spacing[4],
    paddingBottom: theme.spacing[8],
  },
  header: {
    marginBottom: theme.spacing[6],
  },
  title: {
    ...theme.presets.text.h1,
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    ...theme.presets.text.body,
    color: theme.colors.text.secondary,
  },
  form: {
    width: "100%",
  },
  label: {
    ...theme.presets.text.body,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
    marginTop: theme.spacing[4],
  },
  input: {
    ...theme.presets.input.base,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  categoryPicker: {
    // Styles are handled by DropdownPicker component
  },
  submitButton: {
    ...theme.presets.button.primary,
    marginTop: theme.spacing[6],
  },
  submitButtonDisabled: {
    backgroundColor: theme.colors.border.medium,
  },
  submitButtonText: {
    ...theme.presets.text.button,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "transparent",
    borderRadius: theme.borderRadius.base,
    minHeight: theme.layout.inputHeight.base,
    position: "relative",
  },
  locationInput: {
    flex: 1,
    marginRight: theme.spacing[2],
  },
  currentLocationButton: {
    padding: theme.spacing[3],
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.base,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    alignItems: "center",
    justifyContent: "center",
    minHeight: theme.layout.inputHeight.base,
  },
  currentLocationText: {
    fontSize: theme.typography.size["2xl"],
    color: theme.colors.primary.main,
  },
  locationInfo: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.base,
    marginTop: theme.spacing[3],
    padding: theme.spacing[3],
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
  },
  locationInfoText: {
    ...theme.presets.text.bodySmall,
    color: theme.colors.text.secondary,
  },
});
