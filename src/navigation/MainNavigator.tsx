import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { CategoriesScreen } from "../screens/main/CategoriesScreen";
import { CreateRequestScreen } from "../screens/main/CreateRequestScreen";
import { HomeScreen } from "../screens/main/HomeScreen";
import { ProfileScreen } from "../screens/main/ProfileScreen";
import { RequestDetailScreen } from "../screens/main/RequestDetailScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeMain"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
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
    <Stack.Screen
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
  </Stack.Navigator>
);

const CategoriesStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="CategoriesMain"
      component={CategoriesScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProfileMain"
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
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

          return <span style={{ fontSize: size, color }}>{iconName}</span>;
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
