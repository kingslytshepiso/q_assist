import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: signOut },
    ]);
  };

  const handleMyRequests = () => {
    navigation.navigate("MyRequests");
  };

  const handleMyOffers = () => {
    navigation.navigate("MyOffers");
  };

  const menuItems = [
    {
      title: "My Requests",
      subtitle: "View and manage your help requests",
      icon: "📝",
      onPress: handleMyRequests,
    },
    {
      title: "My Offers",
      subtitle: "View offers you've made to help others",
      icon: "🤝",
      onPress: handleMyOffers,
    },
    {
      title: "Settings",
      subtitle: "App preferences and account settings",
      icon: "⚙️",
      onPress: () =>
        Alert.alert("Coming Soon", "Settings will be available soon"),
    },
    {
      title: "Help & Support",
      subtitle: "Get help and contact support",
      icon: "❓",
      onPress: () =>
        Alert.alert("Coming Soon", "Help & Support will be available soon"),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.user_metadata?.full_name?.charAt(0) ||
              user?.email?.charAt(0) ||
              "U"}
          </Text>
        </View>
        <Text style={styles.userName}>
          {user?.user_metadata?.full_name || "User"}
        </Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.signOutSection}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
  },
  menuSection: {
    backgroundColor: "white",
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  menuArrow: {
    fontSize: 18,
    color: "#999",
    fontWeight: "300",
  },
  signOutSection: {
    marginTop: 20,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  signOutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
