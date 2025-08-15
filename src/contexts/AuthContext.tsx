import { AuthError, Session, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: AuthError | null; data: any }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  resendVerificationEmail: (
    email: string
  ) => Promise<{ error: AuthError | null }>;
  isEmailVerified: () => boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting initial session:", error);
        }
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Unexpected error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        return { error };
      }

      // Check if email is verified
      if (data.user && !data.user.email_confirmed_at) {
        return {
          error: {
            message:
              "Please verify your email address before signing in. Check your inbox for a verification link.",
            name: "EmailNotVerified",
            status: 400,
          } as AuthError,
        };
      }

      return { error: null };
    } catch (error) {
      console.error("Unexpected sign in error:", error);
      return {
        error: {
          message: "An unexpected error occurred. Please try again.",
          name: "UnexpectedError",
          status: 500,
        } as AuthError,
      };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: "assist://auth/callback",
        },
      });

      if (error) {
        console.error("Sign up error:", error);
        return { error, data: null };
      }

      return { error: null, data };
    } catch (error) {
      console.error("Unexpected sign up error:", error);
      return {
        error: {
          message: "An unexpected error occurred. Please try again.",
          name: "UnexpectedError",
          status: 500,
        } as AuthError,
        data: null,
      };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        return { error };
      }
      return { error: null };
    } catch (error) {
      console.error("Unexpected sign out error:", error);
      return {
        error: {
          message: "An unexpected error occurred during sign out.",
          name: "UnexpectedError",
          status: 500,
        } as AuthError,
      };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "assist://auth/reset-password",
      });

      if (error) {
        console.error("Password reset error:", error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error("Unexpected password reset error:", error);
      return {
        error: {
          message: "An unexpected error occurred. Please try again.",
          name: "UnexpectedError",
          status: 500,
        } as AuthError,
      };
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: "assist://auth/callback",
        },
      });

      if (error) {
        console.error("Resend verification error:", error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error("Unexpected resend verification error:", error);
      return {
        error: {
          message: "An unexpected error occurred. Please try again.",
          name: "UnexpectedError",
          status: 500,
        } as AuthError,
      };
    }
  };

  const isEmailVerified = () => {
    return (
      user?.email_confirmed_at !== null &&
      user?.email_confirmed_at !== undefined
    );
  };

  const refreshSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.refreshSession();
      if (error) {
        console.error("Session refresh error:", error);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
    } catch (error) {
      console.error("Unexpected session refresh error:", error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    resendVerificationEmail,
    isEmailVerified,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
