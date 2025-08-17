import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { theme } from "../../lib/theme";

interface OTPVerificationScreenProps {
  navigation: any;
  route: {
    params: {
      email: string;
    };
  };
}

export const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({
  navigation,
  route,
}) => {
  const [email, setEmail] = useState(route.params?.email || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { verifyOTP, resendOTP, sendOTP } = useAuth();
  const inputRefs = useRef<TextInput[]>([]);

  // Send OTP when component mounts
  useEffect(() => {
    const sendInitialOTP = async () => {
      setResendLoading(true);
      const { error } = await sendOTP(email);
      setResendLoading(false);

      if (error) {
        Alert.alert("Error", error.message);
      } else {
        setCountdown(60); // Start 60-second countdown
      }
    };

    if (email) {
      sendInitialOTP();
    }
  }, [email]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      Alert.alert(
        "Error",
        "Please enter the complete 6-digit verification code"
      );
      return;
    }

    setLoading(true);
    const { error } = await verifyOTP(email, otpString);
    setLoading(false);

    if (error) {
      Alert.alert("Verification Failed", error.message);
    } else {
      Alert.alert(
        "Success",
        "Email verified successfully! You can now sign in.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("SignIn"),
          },
        ]
      );
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    const { error } = await resendOTP(email);
    setResendLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert(
        "Success",
        "Verification code sent! Please check your email."
      );
      setCountdown(60); // Start 60-second countdown
    }
  };

  const handleBackToSignIn = () => {
    navigation.navigate("SignIn");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit verification code sent to your email
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.emailContainer}>
            <Text style={styles.emailLabel}>Email Address:</Text>
            <Text style={styles.emailText}>{email}</Text>
          </View>

          {resendLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>
                Sending verification code...
              </Text>
            </View>
          ) : (
            <View style={styles.otpContainer}>
              <Text style={styles.otpLabel}>Verification Code:</Text>
              <View style={styles.otpInputs}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      if (ref) inputRefs.current[index] = ref;
                    }}
                    style={styles.otpInput}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    selectTextOnFocus
                    autoFocus={index === 0}
                  />
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              (loading || resendLoading) && styles.buttonDisabled,
            ]}
            onPress={handleVerifyOTP}
            disabled={loading || resendLoading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Verifying..." : "Verify Email"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              (resendLoading || countdown > 0) && styles.buttonDisabled,
            ]}
            onPress={handleResendOTP}
            disabled={resendLoading || countdown > 0}
          >
            <Text style={styles.secondaryButtonText}>
              {resendLoading
                ? "Sending..."
                : countdown > 0
                ? `Resend in ${countdown}s`
                : "Resend Code"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToSignIn}
          >
            <Text style={styles.backButtonText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: theme.spacing[4],
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing[8],
  },
  title: {
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    fontSize: theme.typography.size.md,
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: theme.typography.lineHeight.md,
  },
  content: {
    width: "100%",
  },
  emailContainer: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[6],
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  emailLabel: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[1],
  },
  emailText: {
    fontSize: theme.typography.size.md,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weight.medium,
  },
  otpContainer: {
    marginBottom: theme.spacing[6],
  },
  otpLabel: {
    fontSize: theme.typography.size.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[3],
    textAlign: "center",
  },
  otpInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing[2],
  },
  otpInput: {
    flex: 1,
    height: 56,
    borderWidth: 2,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.borderRadius.md,
    textAlign: "center",
    fontSize: theme.typography.size.xl,
    fontWeight: theme.typography.weight.bold,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.secondary,
  },
  button: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    alignItems: "center",
    marginBottom: theme.spacing[3],
  },
  buttonDisabled: {
    backgroundColor: theme.colors.text.tertiary,
  },
  buttonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.semibold,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
    marginBottom: theme.spacing[3],
  },
  secondaryButtonText: {
    color: theme.colors.primary.main,
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.semibold,
  },
  backButton: {
    alignItems: "center",
    padding: theme.spacing[2],
  },
  backButtonText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.medium,
  },
  loadingContainer: {
    alignItems: "center",
    padding: theme.spacing[6],
    marginBottom: theme.spacing[6],
  },
  loadingText: {
    fontSize: theme.typography.size.md,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
});
