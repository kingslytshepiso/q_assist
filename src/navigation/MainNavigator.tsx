import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Text } from "react-native";
import { CategoriesScreen } from "../screens/main/CategoriesScreen";
import { CategoryRequestsScreen } from "../screens/main/CategoryRequestsScreen";
import { CreateRequestScreen } from "../screens/main/CreateRequestScreen";
import { HomeScreen } from "../screens/main/HomeScreen";
import { MyOffersScreen } from "../screens/main/MyOffersScreen";
import { MyRequestsScreen } from "../screens/main/MyRequestsScreen";
import { ProfileScreen } from "../screens/main/ProfileScreen";
import { RequestDetailScreen } from "../screens/main/RequestDetailScreen";

// Define navigation types
type HomeStackParamList = {
  HomeMain: undefined;
  CreateRequest: undefined;
  RequestDetail: { requestId: string };
};

type CategoriesStackParamList = {
  CategoriesMain: undefined;
  CategoryRequests: {
    category: {
      id: string;
      name: string;
      description: string | null;
      icon: string | null;
    };
  };
};

type ProfileStackParamList = {
  ProfileMain: undefined;
  MyRequests: undefined;
  MyOffers: undefined;
};

const Tab = createBottomTabNavigator();
const HomeStackNavigator = createStackNavigator<HomeStackParamList>();
const CategoriesStackNavigator =
  createStackNavigator<CategoriesStackParamList>();
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
          backgroundColor: "#007AFF",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    />
    <HomeStackNavigator.Screen
      name="RequestDetail"
      component={RequestDetailScreen}
      options={{
        title: "Request Details",
        headerStyle: {
          backgroundColor: "#007AFF",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    />
  </HomeStackNavigator.Navigator>
);

const CategoriesStack = () => (
  <CategoriesStackNavigator.Navigator>
    <CategoriesStackNavigator.Screen
      name="CategoriesMain"
      component={CategoriesScreen}
      options={{ headerShown: false }}
    />
    <CategoriesStackNavigator.Screen
      name="CategoryRequests"
      component={CategoryRequestsScreen}
      options={({ route }: { route: any }) => ({
        title: route.params?.category?.name || "Category Requests",
        headerStyle: {
          backgroundColor: "#007AFF",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      })}
    />
  </CategoriesStackNavigator.Navigator>
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
          backgroundColor: "#007AFF",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    />
    <ProfileStackNavigator.Screen
      name="MyOffers"
      component={MyOffersScreen}
      options={{
        title: "My Offers",
        headerStyle: {
          backgroundColor: "#007AFF",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    />
  </ProfileStackNavigator.Navigator>
);

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === "Home") {
            iconName = focused ? "🏠" : "🏠";
          } else if (route.name === "Categories") {
            iconName = focused ? "📂" : "📂";
          } else if (route.name === "Profile") {
            iconName = focused ? "👤" : "👤";
          } else {
            iconName = "?";
          }

          return <Text style={{ fontSize: size, color }}>{iconName}</Text>;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#eee",
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
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
        name="Categories"
        component={CategoriesStack}
        options={{ title: "Categories" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
};
