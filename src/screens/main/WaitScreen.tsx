import React, { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AutocompleteInput } from "../../components/AutocompleteInput";
import { RequestCard } from "../../components/RequestCard";
import { useAuth } from "../../contexts/AuthContext";
import { Request, useRequests } from "../../contexts/RequestContext";
import { theme } from "../../lib/theme";

interface AutocompleteOption {
  id: string;
  label: string;
  subtitle?: string;
}

interface WaitScreenProps {
  navigation: any;
}

export const WaitScreen: React.FC<WaitScreenProps> = ({ navigation }) => {
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOptions, setSearchOptions] = useState<AutocompleteOption[]>([]);
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "mine" | "others">(
    "others"
  );
  const { user } = useAuth();
  const {
    requests,
    myRequests,
    loading,
    error,
    isInitialized,
    isRefreshing,
    refreshRequests,
  } = useRequests();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (user?.id) {
      // Requests are automatically fetched by the context
      setFilteredRequests(requests);
    }
  }, [user?.id, requests]);

  useEffect(() => {
    let filtered: Request[] = [];

    // Apply filter type
    switch (filterType) {
      case "mine":
        filtered = myRequests;
        break;
      case "others":
        // Show available requests (requests from other users)
        filtered = requests;
        break;
      case "all":
      default:
        // Show both user's requests and available requests
        filtered = [...requests, ...myRequests];
        break;
    }

    // Apply search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (request) =>
          request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.category.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRequests(filtered);

    // Create search options for autocomplete
    const options: AutocompleteOption[] = [];

    // Combine all requests for search (prioritize available requests)
    const allRequestsForSearch = [...requests, ...myRequests];

    // Add matching titles
    allRequestsForSearch
      .filter((request) =>
        request.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .forEach((request) => {
        options.push({
          id: `title-${request.id}`,
          label: request.title,
          subtitle: `${request.category.name} • ${request.location}`,
        });
      });

    // Add matching locations
    allRequestsForSearch
      .filter((request) =>
        request.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .forEach((request) => {
        options.push({
          id: `location-${request.id}`,
          label: request.location,
          subtitle: `${request.title} • ${request.category.name}`,
        });
      });

    // Add matching categories
    allRequestsForSearch
      .filter((request) =>
        request.category.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .forEach((request) => {
        options.push({
          id: `category-${request.id}`,
          label: request.category.name,
          subtitle: `${request.title} • ${request.location}`,
        });
      });

    // Remove duplicates and limit to 10 options
    const uniqueOptions = options
      .filter(
        (option, index, self) =>
          index === self.findIndex((o) => o.label === option.label)
      )
      .slice(0, 10);

    setSearchOptions(uniqueOptions);
    setShowSearchOptions(uniqueOptions.length > 0);
  }, [searchQuery, requests, myRequests, filterType, user?.id]);

  const onRefresh = () => {
    refreshRequests();
  };

  const handleRequestPress = (request: Request) => {
    navigation.navigate("RequestDetail", { requestId: request.id });
  };

  const renderRequest = ({ item }: { item: Request }) => {
    return (
      <RequestCard request={item} onPress={() => handleRequestPress(item)} />
    );
  };

  // Note: Initial loading is now handled by RootNavigator
  // This screen will only show if RequestContext is initialized

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Available Requests</Text>
        <Text style={styles.subtitle}>Find requests you can help with</Text>
      </View>

      {/* Search and Filter Sections */}
      <View style={styles.searchFilterContainer}>
        {/* Search Section */}
        <View style={styles.searchSection}>
          <AutocompleteInput
            placeholder="Search available requests by title, location, or category..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSelectOption={(option) => {
              setSearchQuery(option.label);
            }}
            options={searchOptions}
            showOptions={showSearchOptions}
            onShowOptionsChange={setShowSearchOptions}
            style={styles.searchInput}
            inputStyle={styles.searchInputField}
            maxHeight={150}
          />
        </View>

        {/* Filter Section */}
        <View style={styles.filterSection}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === "all" && styles.filterButtonActive,
            ]}
            onPress={() => setFilterType("all")}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterType === "all" && styles.filterButtonTextActive,
              ]}
            >
              Available Requests
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === "mine" && styles.filterButtonActive,
            ]}
            onPress={() => setFilterType("mine")}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterType === "mine" && styles.filterButtonTextActive,
              ]}
            >
              My Requests
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === "others" && styles.filterButtonActive,
            ]}
            onPress={() => setFilterType("others")}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterType === "others" && styles.filterButtonTextActive,
              ]}
            >
              Available Requests
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Results Section */}
      <View style={styles.resultsSection}>
        <FlatList
          data={filteredRequests}
          renderItem={renderRequest}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: Math.max(insets.bottom, 20) + 100 },
          ]}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery.trim() !== ""
                  ? "No requests match your search"
                  : filterType === "mine"
                  ? "You haven't created any requests yet"
                  : filterType === "others"
                  ? "No available requests from other users"
                  : "No requests available"}
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
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
    backgroundColor: theme.colors.primary.main,
    padding: theme.spacing[4],
    paddingTop: Platform.OS === "ios" ? theme.spacing[2] : theme.spacing[4],
  },
  title: {
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
  searchFilterContainer: {
    backgroundColor: theme.colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    shadowColor: theme.colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
    maxHeight: 180,
    flex: 1,
  },
  searchSection: {
    padding: theme.spacing[4],
    position: "relative",
    zIndex: 1000,
    flex: 1,
  },
  filterSection: {
    flexDirection: "row",
    gap: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[4],
  },
  searchInput: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    borderWidth: 2,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.borderRadius.base,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    minHeight: theme.layout.inputHeight.base,
  },
  searchInputField: {
    fontSize: theme.typography.size.base,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.primary,
  },
  filterButton: {
    flex: 1,
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
    borderRadius: theme.borderRadius.base,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    backgroundColor: theme.colors.background.primary,
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  filterButtonText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weight.medium,
  },
  filterButtonTextActive: {
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.weight.semibold,
  },
  resultsSection: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    zIndex: 1,
  },
  listContainer: {
    padding: theme.spacing[4],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.spacing[8],
  },
  emptyText: {
    fontSize: theme.typography.size.base,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
});
