import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

export interface Request {
  id: string;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  status: string;
  created_at: string;
  user_id: string;
  category_id: string;
  user?: {
    id: string;
    full_name: string;
  } | null;
  category: {
    id: string;
    name: string;
  };
}

export interface CreateRequestData {
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  category_id: string;
}

export interface UpdateRequestData {
  title?: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  status?: string;
  category_id?: string;
}

export interface RequestFilters {
  status?: string;
  category_id?: string;
  user_id?: string;
  search?: string;
  location?: string;
  radius?: number;
  userLatitude?: number;
  userLongitude?: number;
}

interface RequestContextType {
  // State
  requests: Request[];
  myRequests: Request[];
  nearbyRequests: Request[];
  loading: boolean;
  error: string | null;

  // Granular loading states
  isInitialized: boolean;
  isRefreshing: boolean;
  isLoadingNearby: boolean;

  // Actions
  fetchRequests: (filters?: RequestFilters) => Promise<void>;
  fetchMyRequests: () => Promise<void>;
  fetchNearbyRequests: (
    latitude: number,
    longitude: number,
    radius?: number
  ) => Promise<void>;
  createRequest: (data: CreateRequestData) => Promise<Request | null>;
  updateRequest: (
    id: string,
    data: UpdateRequestData
  ) => Promise<Request | null>;
  deleteRequest: (id: string) => Promise<boolean>;
  searchRequests: (
    query: string,
    filters?: RequestFilters
  ) => Promise<Request[]>;

  // Real-time
  subscribeToRequests: () => void;
  unsubscribeFromRequests: () => void;

  // Utilities
  getRequestById: (id: string) => Request | undefined;
  refreshRequests: () => Promise<void>;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const useRequests = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error("useRequests must be used within a RequestProvider");
  }
  return context;
};

interface RequestProviderProps {
  children: React.ReactNode;
}

export const RequestProvider: React.FC<RequestProviderProps> = ({
  children,
}) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [myRequests, setMyRequests] = useState<Request[]>([]);
  const [nearbyRequests, setNearbyRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null);

  // Granular loading states
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingNearby, setIsLoadingNearby] = useState(false);

  // Debug state changes
  useEffect(() => {
    console.log(
      "RequestContext: State changed - requests:",
      requests.length,
      "myRequests:",
      myRequests.length,
      "isInitialized:",
      isInitialized
    );
  }, [requests, myRequests, isInitialized]);

  const isMountedRef = useRef(true);
  const initializedRef = useRef(false);

  const { user } = useAuth();

  // Calculate distance between two points
  const calculateDistance = useCallback(
    (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      const R = 6371; // Earth's radius in kilometers
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
    []
  );

  // Fetch all requests with filters
  const fetchRequests = useCallback(
    async (filters?: RequestFilters) => {
      if (!user?.id) {
        console.log("No user found, skipping requests fetch");
        return;
      }

      console.log("RequestContext: Starting fetchRequests");

      // Only set loading if this is the initial fetch
      if (!isInitialized) {
        setLoading(true);
      }
      // Don't set loading during refresh operations
      setError(null);

      try {
        let query = supabase
          .from("requests")
          .select(
            `
          *,
          user:users(id, full_name),
          category:categories(id, name)
        `
          )
          .order("created_at", { ascending: false });

        // Apply filters
        if (filters?.status) {
          query = query.eq("status", filters.status);
        }
        if (filters?.category_id) {
          query = query.eq("category_id", filters.category_id);
        }
        if (filters?.user_id) {
          query = query.eq("user_id", filters.user_id);
        }

        const { data, error } = await query;

        if (error) throw error;

        console.log("Fetched requests:", data?.length || 0);

        // Use all requests, including those with null user objects
        const allRequests = data || [];

        console.log("All requests fetched:", allRequests.length);
        console.log(
          "Requests with null user:",
          allRequests.filter((r) => !r.user).length
        );

        if (data && data.length > 0) {
          console.log("Sample request data:", {
            id: data[0].id,
            title: data[0].title,
            user: data[0].user,
            hasUser: !!data[0].user,
          });
        }

        // Apply search filter if provided
        let filteredRequests = allRequests;
        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          filteredRequests = allRequests.filter(
            (request) =>
              request.title.toLowerCase().includes(searchLower) ||
              request.location.toLowerCase().includes(searchLower) ||
              request.category.name.toLowerCase().includes(searchLower)
          );
        }

        // Filter out current user's requests from main requests list
        // (unless specifically requested)
        if (!filters?.user_id && user?.id) {
          filteredRequests = filteredRequests.filter(
            (request) => request.user_id !== user.id
          );
          console.log(
            "Filtered out user's own requests. Remaining:",
            filteredRequests.length
          );
        }

        // Apply location-based filtering if coordinates provided
        if (
          filters?.userLatitude &&
          filters?.userLongitude &&
          filters?.radius
        ) {
          filteredRequests = filteredRequests
            .filter((request) => request.latitude && request.longitude)
            .map((request) => ({
              ...request,
              distance_km: calculateDistance(
                filters.userLatitude!,
                filters.userLongitude!,
                request.latitude!,
                request.longitude!
              ),
            }))
            .filter(
              (request) => (request as any).distance_km <= filters.radius!
            )
            .sort((a, b) => (a as any).distance_km - (b as any).distance_km);
        }

        if (isMountedRef.current) {
          console.log(
            "RequestContext: Setting requests:",
            filteredRequests.length
          );
          setRequests(filteredRequests);
          console.log("RequestContext: fetchRequests completed successfully");
          console.log(
            "RequestContext: Current requests state after set:",
            filteredRequests
          );
        } else {
          console.log(
            "RequestContext: Component unmounted, not setting requests"
          );
        }
      } catch (err) {
        console.error("Error fetching requests:", err);
        if (isMountedRef.current) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch requests"
          );
        }
      } finally {
        if (isMountedRef.current) {
          console.log(
            "RequestContext: fetchRequests finally block - setting loading to false"
          );
          setLoading(false);
        }
      }

      console.log("RequestContext: fetchRequests function completed");
    },
    [user?.id, calculateDistance]
  );

  // Fetch user's own requests
  const fetchMyRequests = useCallback(async () => {
    if (!user?.id) return;

    console.log("RequestContext: Starting fetchMyRequests");

    try {
      const { data, error } = await supabase
        .from("requests")
        .select(
          `
          *,
          user:users(id, full_name),
          category:categories(id, name)
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const allRequests = data || [];
      if (isMountedRef.current) {
        console.log("RequestContext: Setting myRequests:", allRequests.length);
        setMyRequests(allRequests);
        console.log("RequestContext: fetchMyRequests completed successfully");
        console.log(
          "RequestContext: Current myRequests state after set:",
          allRequests
        );
      } else {
        console.log(
          "RequestContext: Component unmounted, not setting myRequests"
        );
      }
    } catch (err) {
      console.error("Error fetching my requests:", err);
      if (isMountedRef.current) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch my requests"
        );
      }
    } finally {
      console.log("RequestContext: fetchMyRequests finally block");
    }

    console.log("RequestContext: fetchMyRequests function completed");
  }, [user?.id]);

  // Fetch nearby requests
  const fetchNearbyRequests = useCallback(
    async (latitude: number, longitude: number, radius: number = 10) => {
      if (!user?.id) return;

      setIsLoadingNearby(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("requests")
          .select(
            `
          *,
          user:users(id, full_name),
          category:categories(id, name)
        `
          )
          .eq("status", "open")
          .not("user_id", "eq", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const allRequests = data || [];

        const requestsWithDistance = allRequests
          .filter((request) => request.latitude && request.longitude)
          .map((request) => ({
            ...request,
            distance_km: calculateDistance(
              latitude,
              longitude,
              request.latitude!,
              request.longitude!
            ),
          }))
          .filter((request) => (request as any).distance_km <= radius)
          .sort((a, b) => (a as any).distance_km - (b as any).distance_km);

        if (isMountedRef.current) {
          setNearbyRequests(requestsWithDistance);
        }
      } catch (err) {
        console.error("Error fetching nearby requests:", err);
        if (isMountedRef.current) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to fetch nearby requests"
          );
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoadingNearby(false);
        }
      }
    },
    [user?.id, calculateDistance]
  );

  // Create a new request
  const createRequest = useCallback(
    async (data: CreateRequestData): Promise<Request | null> => {
      if (!user?.id) {
        setError("User not authenticated");
        return null;
      }

      try {
        const { data: newRequest, error } = await supabase
          .from("requests")
          .insert({
            ...data,
            user_id: user.id,
            status: "open",
          })
          .select(
            `
          *,
          user:users(id, full_name),
          category:categories(id, name)
        `
          )
          .single();

        if (error) throw error;

        console.log("Created request:", newRequest);
        return newRequest;
      } catch (err) {
        console.error("Error creating request:", err);
        setError(
          err instanceof Error ? err.message : "Failed to create request"
        );
        return null;
      }
    },
    [user?.id]
  );

  // Update an existing request
  const updateRequest = useCallback(
    async (id: string, data: UpdateRequestData): Promise<Request | null> => {
      try {
        const { data: updatedRequest, error } = await supabase
          .from("requests")
          .update(data)
          .eq("id", id)
          .select(
            `
          *,
          user:users(id, full_name),
          category:categories(id, name)
        `
          )
          .single();

        if (error) throw error;

        console.log("Updated request:", updatedRequest);
        return updatedRequest;
      } catch (err) {
        console.error("Error updating request:", err);
        setError(
          err instanceof Error ? err.message : "Failed to update request"
        );
        return null;
      }
    },
    []
  );

  // Delete a request
  const deleteRequest = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("requests").delete().eq("id", id);

      if (error) throw error;

      console.log("Deleted request:", id);
      return true;
    } catch (err) {
      console.error("Error deleting request:", err);
      setError(err instanceof Error ? err.message : "Failed to delete request");
      return false;
    }
  }, []);

  // Search requests
  const searchRequests = useCallback(
    async (query: string, filters?: RequestFilters): Promise<Request[]> => {
      if (!user?.id) return [];

      try {
        let searchQuery = supabase
          .from("requests")
          .select(
            `
          *,
          user:users(id, full_name),
          category:categories(id, name)
        `
          )
          .or(`title.ilike.%${query}%,location.ilike.%${query}%`)
          .order("created_at", { ascending: false });

        // Apply additional filters
        if (filters?.status) {
          searchQuery = searchQuery.eq("status", filters.status);
        }
        if (filters?.category_id) {
          searchQuery = searchQuery.eq("category_id", filters.category_id);
        }

        const { data, error } = await searchQuery;

        if (error) throw error;

        const allRequests = data || [];
        return allRequests;
      } catch (err) {
        console.error("Error searching requests:", err);
        setError(
          err instanceof Error ? err.message : "Failed to search requests"
        );
        return [];
      }
    },
    [user?.id]
  );

  // Subscribe to real-time updates
  const subscribeToRequests = useCallback(() => {
    if (!user?.id) return;

    const subscription = supabase
      .channel("requests_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "requests",
        },
        (payload) => {
          console.log("Request change detected:", payload);

          // Refresh data based on the type of change
          if (payload.eventType === "INSERT") {
            // New request created
            console.log("RequestContext: Refreshing due to INSERT");
            // Use setTimeout to avoid calling functions that might cause re-renders
            setTimeout(() => {
              if (isMountedRef.current) {
                fetchRequests();
                fetchMyRequests();
              }
            }, 0);
          } else if (payload.eventType === "UPDATE") {
            // Request updated
            console.log("RequestContext: Refreshing due to UPDATE");
            setTimeout(() => {
              if (isMountedRef.current) {
                fetchRequests();
                fetchMyRequests();
              }
            }, 0);
          } else if (payload.eventType === "DELETE") {
            // Request deleted
            console.log("RequestContext: Refreshing due to DELETE");
            setTimeout(() => {
              if (isMountedRef.current) {
                fetchRequests();
                fetchMyRequests();
              }
            }, 0);
          }
        }
      )
      .subscribe();

    setSubscription(subscription);
  }, [user?.id]); // Keep only user?.id dependency

  // Unsubscribe from real-time updates
  const unsubscribeFromRequests = useCallback(() => {
    if (subscription) {
      supabase.removeChannel(subscription);
      setSubscription(null);
    }
  }, [subscription]);

  // Get request by ID
  const getRequestById = useCallback(
    (id: string): Request | undefined => {
      return requests.find((request) => request.id === id);
    },
    [requests]
  );

  // Refresh all request data
  const refreshRequests = useCallback(async () => {
    if (!user?.id) return;

    console.log("RequestContext: Starting refresh");
    setIsRefreshing(true);
    setError(null);

    try {
      // Add timeout to prevent hanging
      const refreshPromise = Promise.all([fetchRequests(), fetchMyRequests()]);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Refresh timeout")), 10000)
      );

      await Promise.race([refreshPromise, timeoutPromise]);
      console.log("RequestContext: Refresh completed successfully");
    } catch (error) {
      console.error("Error refreshing requests:", error);
    } finally {
      if (isMountedRef.current) {
        console.log("RequestContext: Setting isRefreshing to false");
        setIsRefreshing(false);
      }
    }
  }, [user?.id, fetchRequests, fetchMyRequests]); // Include dependencies

  // Initialize data and subscriptions
  useEffect(() => {
    console.log(
      "RequestContext: useEffect triggered, user?.id =",
      user?.id,
      "initializedRef.current =",
      initializedRef.current
    );

    if (user?.id && !initializedRef.current) {
      console.log("RequestContext: Initializing with user:", user.id);
      initializedRef.current = true;

      // Fetch all requests (excluding user's own)
      console.log("RequestContext: Starting Promise.all for initialization");

      // Use a timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Initialization timeout")), 15000)
      );

      const initPromise = Promise.race([
        Promise.allSettled([
          fetchRequests({
            // Don't filter by status or user_id here - we want all requests except user's own
          }),
          fetchMyRequests(),
        ]).then((results) => {
          // Log results for debugging
          results.forEach((result, index) => {
            if (result.status === "rejected") {
              console.error(
                `RequestContext: Initialization promise ${index} failed:`,
                result.reason
              );
            } else {
              console.log(
                `RequestContext: Initialization promise ${index} succeeded`
              );
            }
          });
          // Always resolve, even if some promises failed
          return results;
        }),
        timeoutPromise,
      ])
        .then(() => {
          console.log("RequestContext: Promise.all completed successfully");
          console.log(
            "RequestContext: isMountedRef.current =",
            isMountedRef.current
          );
          if (isMountedRef.current) {
            console.log(
              "RequestContext: Setting isInitialized to true after data fetch"
            );
            setIsInitialized(true);
          }
          console.log("RequestContext: Initialization completed successfully");
        })
        .catch((error) => {
          console.error("RequestContext: Error during initialization:", error);
          if (isMountedRef.current) {
            console.log(
              "RequestContext: Setting isInitialized to true despite error"
            );
            setIsInitialized(true);
          }
        })
        .finally(() => {
          // Ensure isInitialized is set even if there was an error
          if (isMountedRef.current) {
            console.log(
              "RequestContext: Finally block - ensuring isInitialized is true"
            );
            setIsInitialized(true);
          }
        });

      // Subscribe to real-time updates after a short delay to avoid conflicts
      setTimeout(() => {
        if (isMountedRef.current) {
          console.log("RequestContext: Setting up real-time subscription");
          subscribeToRequests();
        }
      }, 100);
    } else if (!user?.id) {
      // Reset state when no user
      console.log("RequestContext: Resetting state - no user");
      initializedRef.current = false;
      setRequests([]);
      setMyRequests([]);
      setNearbyRequests([]);
      setLoading(false);
      setError(null);
      setIsInitialized(false);
      setIsRefreshing(false);
      setIsLoadingNearby(false);
    }

    return () => {
      console.log(
        "RequestContext: useEffect cleanup - setting isMountedRef to false"
      );
      // Don't set isMountedRef to false immediately - give time for async operations
      setTimeout(() => {
        isMountedRef.current = false;
        console.log(
          "RequestContext: Cleanup timeout - setting isMountedRef to false"
        );
      }, 1000); // Give 1 second for async operations to complete

      unsubscribeFromRequests();
    };
  }, [user?.id]); // Only depend on user?.id to prevent re-initialization

  const value: RequestContextType = {
    // State
    requests,
    myRequests,
    nearbyRequests,
    loading,
    error,

    // Granular loading states
    isInitialized,
    isRefreshing,
    isLoadingNearby,

    // Actions
    fetchRequests,
    fetchMyRequests,
    fetchNearbyRequests,
    createRequest,
    updateRequest,
    deleteRequest,
    searchRequests,

    // Real-time
    subscribeToRequests,
    unsubscribeFromRequests,

    // Utilities
    getRequestById,
    refreshRequests,
  };

  return (
    <RequestContext.Provider value={value}>{children}</RequestContext.Provider>
  );
};
