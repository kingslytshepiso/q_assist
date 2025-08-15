import React, { useEffect, useState } from "react";
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
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

interface Category {
  id: string;
  name: string;
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
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      Alert.alert("Error", "Failed to load categories");
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !location || !selectedCategory) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!user) {
      Alert.alert("Error", "You must be logged in to create a request");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("requests").insert({
        user_id: user.id,
        category_id: selectedCategory.id,
        title,
        description,
        location,
        status: "open",
      });

      if (error) throw error;

      Alert.alert("Success", "Your request has been created successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error creating request:", error);
      Alert.alert("Error", "Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
          <TouchableOpacity
            style={styles.categoryPicker}
            onPress={() => setShowCategoryPicker(!showCategoryPicker)}
          >
            <Text
              style={[
                styles.categoryText,
                !selectedCategory && styles.placeholderText,
              ]}
            >
              {selectedCategory ? selectedCategory.name : "Select a category"}
            </Text>
            <Text style={styles.arrow}>▼</Text>
          </TouchableOpacity>

          {showCategoryPicker && (
            <View style={styles.categoryList}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryItem}
                  onPress={() => {
                    setSelectedCategory(category);
                    setShowCategoryPicker(false);
                  }}
                >
                  <Text style={styles.categoryItemText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

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
          <TextInput
            style={styles.input}
            placeholder="Where do you need help? (e.g., Downtown, Home, etc.)"
            value={location}
            onChangeText={setLocation}
          />

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
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  textArea: {
    height: 100,
  },
  categoryPicker: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryText: {
    fontSize: 16,
    color: "#333",
  },
  placeholderText: {
    color: "#999",
  },
  arrow: {
    fontSize: 12,
    color: "#666",
  },
  categoryList: {
    backgroundColor: "white",
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    maxHeight: 200,
  },
  categoryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  categoryItemText: {
    fontSize: 16,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 30,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
