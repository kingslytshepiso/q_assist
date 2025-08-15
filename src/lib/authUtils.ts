import { AuthError } from "@supabase/supabase-js";

export interface AuthErrorInfo {
  title: string;
  message: string;
  isRecoverable: boolean;
  action?: string;
}

export const getAuthErrorInfo = (error: AuthError): AuthErrorInfo => {
  // Handle specific Supabase auth errors
  switch (error.message) {
    case "Invalid login credentials":
      return {
        title: "Invalid Credentials",
        message:
          "The email or password you entered is incorrect. Please try again.",
        isRecoverable: true,
      };

    case "Email not confirmed":
      return {
        title: "Email Not Verified",
        message:
          "Please verify your email address before signing in. Check your inbox for a verification link.",
        isRecoverable: true,
        action: "Resend Verification Email",
      };

    case "User already registered":
      return {
        title: "Account Already Exists",
        message:
          "An account with this email address already exists. Please sign in instead.",
        isRecoverable: true,
        action: "Go to Sign In",
      };

    case "Password should be at least 6 characters":
      return {
        title: "Password Too Short",
        message: "Password must be at least 6 characters long.",
        isRecoverable: true,
      };

    case "Unable to validate email address: invalid format":
      return {
        title: "Invalid Email",
        message: "Please enter a valid email address.",
        isRecoverable: true,
      };

    case "Signup is disabled":
      return {
        title: "Sign Up Disabled",
        message:
          "New account creation is currently disabled. Please contact support.",
        isRecoverable: false,
      };

    case "Too many requests":
      return {
        title: "Too Many Attempts",
        message: "Too many requests. Please wait a moment before trying again.",
        isRecoverable: true,
      };

    default:
      // Handle custom errors
      if (error.name === "EmailNotVerified") {
        return {
          title: "Email Not Verified",
          message: error.message,
          isRecoverable: true,
          action: "Resend Verification Email",
        };
      }

      return {
        title: "Authentication Error",
        message:
          error.message || "An unexpected error occurred. Please try again.",
        isRecoverable: true,
      };
  }
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const formatAuthError = (error: AuthError): string => {
  const errorInfo = getAuthErrorInfo(error);
  return errorInfo.message;
};
