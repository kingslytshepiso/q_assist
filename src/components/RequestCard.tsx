import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { theme } from "../lib/theme";

interface Request {
  id: string;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  status: string;
  created_at: string;
  user?: {
    id: string;
    full_name: string;
  } | null;
  category: {
    name: string;
  };
}

interface RequestCardProps {
  request: Request;
  onPress: () => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onPress,
}) => {
  const { user } = useAuth();
  const isOwnRequest = user?.id === request.user?.id;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return theme.colors.status.success;
      case "in_progress":
        return theme.colors.status.warning;
      case "completed":
        return theme.colors.status.info;
      case "cancelled":
        return theme.colors.status.error;
      default:
        return theme.colors.text.tertiary;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {request.title}
        </Text>
        <View style={styles.headerRight}>
          {isOwnRequest && (
            <View style={styles.ownRequestBadge}>
              <Text style={styles.ownRequestText}>YOURS</Text>
            </View>
          )}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(request.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {request.status.replace("_", " ").toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.metaInfo}>
          <Text style={styles.category}>{request.category.name}</Text>
          <View style={styles.locationContainer}>
            <Text style={styles.location}>📍 {request.location}</Text>
            {request.latitude && request.longitude && (
              <Text style={styles.locationIndicator}>🗺️</Text>
            )}
          </View>
        </View>

        <View style={styles.userInfo}>
          <Text style={[styles.userName, isOwnRequest && styles.ownUserName]}>
            {isOwnRequest
              ? "You"
              : `by ${request.user?.full_name || "Unknown User"}`}
          </Text>
          <Text style={styles.timeAgo}>{formatDate(request.created_at)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[3],
    shadowColor: theme.colors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing[2],
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing[2],
  },
  ownRequestBadge: {
    backgroundColor: theme.colors.accent.main,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.base,
  },
  ownRequestText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.size.xs,
    fontWeight: theme.typography.weight.bold,
  },
  title: {
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.semibold,
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: theme.spacing[2],
  },
  statusBadge: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.base,
  },
  statusText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.size.xs,
    fontWeight: theme.typography.weight.semibold,
  },
  description: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.normal,
    marginBottom: theme.spacing[3],
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  metaInfo: {
    flex: 1,
  },
  category: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.secondary.main,
    fontWeight: theme.typography.weight.medium,
    marginBottom: theme.spacing[1],
  },
  location: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.text.tertiary,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing[1],
  },
  locationIndicator: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.secondary.main,
  },
  userInfo: {
    alignItems: "flex-end",
  },
  userName: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weight.medium,
    marginBottom: theme.spacing[1],
  },
  ownUserName: {
    color: theme.colors.accent.main,
    fontWeight: theme.typography.weight.bold,
  },
  timeAgo: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.text.tertiary,
  },
});
