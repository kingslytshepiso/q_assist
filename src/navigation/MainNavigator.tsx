import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../lib/theme";
import { CreateRequestScreen } from "../screens/main/CreateRequestScreen";
import { HomeScreen } from "../screens/main/HomeScreen";
import { MyOffersScreen } from "../screens/main/MyOffersScreen";
import { MyRequestsScreen } from "../screens/main/MyRequestsScreen";
import { NearbyRequestsScreen } from "../screens/main/NearbyRequestsScreen";
import { ProfileScreen } from "../screens/main/ProfileScreen";
import { RequestDetailScreen } from "../screens/main/RequestDetailScreen";
import { WaitScreen } from "../screens/main/WaitScreen";

// Define navigation types
type HomeStackParamList = {
  HomeMain: undefined;
  CreateRequest: undefined;
  RequestDetail: { requestId: string };
  NearbyRequests: undefined;
};

type RequestStackParamList = {
  RequestMain: undefined;
  CreateRequest: undefined;
  RequestDetail: { requestId: string };
};

type WaitStackParamList = {
  WaitMain: undefined;
  RequestDetail: { requestId: string };
};

type ProfileStackParamList = {
  ProfileMain: undefined;
  MyRequests: undefined;
  MyOffers: undefined;
};

const Tab = createBottomTabNavigator();
const HomeStackNavigator = createStackNavigator<HomeStackParamList>();
const RequestStackNavigator = createStackNavigator<RequestStackParamList>();
const WaitStackNavigator = createStackNavigator<WaitStackParamList>();
const ProfileStackNavigator = createStackNavigator<ProfileStackParamList>();

const HomeStack = () => (
  <HomeStackNavigator.Navigator>
    <HomeStackNavigator.Screen
      name="HomeMain"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <HomeStackNavigator.Screen
      name="CreateRequest"
      component={CreateRequestScreen}
      options={{
        title: "Create Request",
        headerStyle: {
          backgroundColor: theme.colors.primary.main,
        },
        headerTintColor: theme.colors.text.inverse,
        headerTitleStyle: {
          fontWeight: theme.typography.weight.bold,
        },
      }}
    />
    <HomeStackNavigator.Screen
      name="RequestDetail"
      component={RequestDetailScreen}
      options={{
        title: "Request Details",
        headerStyle: {
          backgroundColor: theme.colors.primary.main,
        },
        headerTintColor: theme.colors.text.inverse,
        headerTitleStyle: {
          fontWeight: theme.typography.weight.bold,
        },
      }}
    />
    <HomeStackNavigator.Screen
      name="NearbyRequests"
      component={NearbyRequestsScreen}
      options={{
        title: "Nearby Requests",
        headerStyle: {
          backgroundColor: theme.colors.primary.main,
        },
        headerTintColor: theme.colors.text.inverse,
        headerTitleStyle: {
          fontWeight: theme.typography.weight.bold,
        },
      }}
    />
  </HomeStackNavigator.Navigator>
);

const RequestStack = () => (
  <RequestStackNavigator.Navigator>
    <RequestStackNavigator.Screen
      name="RequestMain"
      component={CreateRequestScreen}
      options={{
        title: "Create Request",
        headerStyle: {
          backgroundColor: theme.colors.primary.main,
        },
        headerTintColor: theme.colors.text.inverse,
        headerTitleStyle: {
          fontWeight: theme.typography.weight.bold,
        },
      }}
    />
    <RequestStackNavigator.Screen
      name="CreateRequest"
      component={CreateRequestScreen}
      options={{
        title: "Create Request",
        headerStyle: {
          backgroundColor: theme.colors.primary.main,
        },
        headerTintColor: theme.colors.text.inverse,
        headerTitleStyle: {
          fontWeight: theme.typography.weight.bold,
        },
      }}
    />
    <RequestStackNavigator.Screen
      name="RequestDetail"
      component={RequestDetailScreen}
      options={{
        title: "Request Details",
        headerStyle: {
          backgroundColor: theme.colors.primary.main,
        },
        headerTintColor: theme.colors.text.inverse,
        headerTitleStyle: {
          fontWeight: theme.typography.weight.bold,
        },
      }}
    />
  </RequestStackNavigator.Navigator>
);

const WaitStack = () => (
  <WaitStackNavigator.Navigator>
    <WaitStackNavigator.Screen
      name="WaitMain"
      component={WaitScreen}
      options={{ headerShown: false }}
    />
    <WaitStackNavigator.Screen
      name="RequestDetail"
      component={RequestDetailScreen}
      options={{
        title: "Request Details",
        headerStyle: {
          backgroundColor: theme.colors.primary.main,
        },
        headerTintColor: theme.colors.text.inverse,
        headerTitleStyle: {
          fontWeight: theme.typography.weight.bold,
        },
      }}
    />
  </WaitStackNavigator.Navigator>
);

const ProfileStack = () => (
  <ProfileStackNavigator.Navigator>
    <ProfileStackNavigator.Screen
      name="ProfileMain"
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
    <ProfileStackNavigator.Screen
      name="MyRequests"
      component={MyRequestsScreen}
      options={{
        title: "My Requests",
        headerStyle: {
          backgroundColor: theme.colors.primary.main,
        },
        headerTintColor: theme.colors.text.inverse,
        headerTitleStyle: {
          fontWeight: theme.typography.weight.bold,
        },
      }}
    />
    <ProfileStackNavigator.Screen
      name="MyOffers"
      component={MyOffersScreen}
      options={{
        title: "My Offers",
        headerStyle: {
          backgroundColor: theme.colors.primary.main,
        },
        headerTintColor: theme.colors.text.inverse,
        headerTitleStyle: {
          fontWeight: theme.typography.weight.bold,
        },
      }}
    />
  </ProfileStackNavigator.Navigator>
);

export const MainNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Request") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Wait") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = "help-circle-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary.main,
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.background.secondary,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border.light,
          paddingBottom: Platform.OS === "ios" ? Math.max(insets.bottom, 8) : 8,
          height: Platform.OS === "ios" ? 80 + Math.max(insets.bottom, 8) : 80,
          paddingHorizontal: theme.spacing[2],
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.size.sm,
          fontWeight: theme.typography.weight.medium,
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="Request"
        component={RequestStack}
        options={{ title: "Request" }}
      />
      <Tab.Screen
        name="Wait"
        component={WaitStack}
        options={{ title: "Wait" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
};
