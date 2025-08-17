import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useRequests } from "../contexts/RequestContext";
import { AuthNavigator } from "./AuthNavigator";
import { MainNavigator } from "./MainNavigator";

const Stack = createStackNavigator();

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.loadingText}>Loading your data...</Text>
    <Text style={styles.loadingSubtext}>
      Please wait while we prepare everything
    </Text>
  </View>
);

// Custom hook to safely get request loading state
const useRequestLoadingState = () => {
  const { user } = useAuth();

  // Always call useRequests to follow Rules of Hooks
  let requestsContext = null;
  try {
    requestsContext = useRequests();
  } catch (error) {
    console.log("RequestContext not available:", error);
  }

  // Only consider requests loading if user is authenticated and context is available
  if (user && requestsContext) {
    console.log("RequestContext available, checking initialization:", {
      isInitialized: requestsContext.isInitialized,
      user: !!user,
    });
    return {
      requestsLoading: !requestsContext.isInitialized,
      requestsInitialized: requestsContext.isInitialized,
    };
  }

  // If no user or no context, requests are not loading
  console.log("RequestContext not needed:", {
    user: !!user,
    hasContext: !!requestsContext,
  });
  return {
    requestsLoading: false,
    requestsInitialized: true,
  };
};

export const RootNavigator = () => {
  const { user, loading: authLoading } = useAuth();
  const { requestsLoading, requestsInitialized } = useRequestLoadingState();
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Add a timeout fallback to prevent infinite loading
  useEffect(() => {
    if (user && requestsLoading) {
      const timeout = setTimeout(() => {
        console.log(
          "RootNavigator: Loading timeout reached, forcing navigation"
        );
        setLoadingTimeout(true);
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeout);
    } else {
      setLoadingTimeout(false);
    }
  }, [user, requestsLoading]);

  // Show loading screen while auth is loading OR while requests are being initialized
  // But allow navigation if timeout is reached
  if (authLoading || (user && requestsLoading && !loadingTimeout)) {
    console.log("RootNavigator: Showing loading screen", {
      authLoading,
      user: !!user,
      requestsLoading,
      requestsInitialized,
      loadingTimeout,
    });
    return <LoadingScreen />;
  }

  console.log("RootNavigator: Rendering navigation", {
    user: !!user,
    requestsInitialized,
    loadingTimeout,
  });

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: "#999",
  },
});
