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
import { theme } from "../../lib/theme";

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
    ...theme.presets.container.base,
  },
  header: {
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing[5],
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary.main,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing[4],
  },
  avatarText: {
    fontSize: theme.typography.size["3xl"],
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.inverse,
  },
  userName: {
    ...theme.presets.text.h2,
    marginBottom: theme.spacing[1],
  },
  userEmail: {
    ...theme.presets.text.body,
    color: theme.colors.text.secondary,
  },
  menuSection: {
    backgroundColor: theme.colors.background.secondary,
    marginTop: theme.spacing[5],
    marginHorizontal: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  menuIcon: {
    fontSize: theme.typography.size["2xl"],
    marginRight: theme.spacing[4],
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    ...theme.presets.text.body,
    fontWeight: theme.typography.weight.semibold,
    marginBottom: theme.spacing[0.5],
  },
  menuSubtitle: {
    ...theme.presets.text.bodySmall,
  },
  menuArrow: {
    fontSize: theme.typography.size.xl,
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.weight.light,
  },
  signOutSection: {
    marginTop: theme.spacing[5],
    marginHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[5],
  },
  signOutButton: {
    backgroundColor: theme.colors.status.error,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    alignItems: "center",
  },
  signOutText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.size.base,
    fontWeight: theme.typography.weight.semibold,
  },
});
