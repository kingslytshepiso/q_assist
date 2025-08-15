import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { ForgotPasswordScreen } from "../screens/auth/ForgotPasswordScreen";
import { SignInScreen } from "../screens/auth/SignInScreen";
import { SignUpScreen } from "../screens/auth/SignUpScreen";

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};
