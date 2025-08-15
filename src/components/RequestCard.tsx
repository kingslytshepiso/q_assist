import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Request {
  id: string;
  title: string;
  description: string;
  location: string;
  status: string;
  created_at: string;
  user: {
    full_name: string;
  };
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
        return "#34C759";
      case "in_progress":
        return "#FF9500";
      case "completed":
        return "#007AFF";
      case "cancelled":
        return "#FF3B30";
      default:
        return "#999";
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {request.title}
        </Text>
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

      <Text style={styles.description} numberOfLines={2}>
        {request.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.metaInfo}>
          <Text style={styles.category}>{request.category.name}</Text>
          <Text style={styles.location}>📍 {request.location}</Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>by {request.user.full_name}</Text>
          <Text style={styles.timeAgo}>{formatDate(request.created_at)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
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
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: "#999",
  },
  userInfo: {
    alignItems: "flex-end",
  },
  userName: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    marginBottom: 2,
  },
  timeAgo: {
    fontSize: 11,
    color: "#999",
  },
});
