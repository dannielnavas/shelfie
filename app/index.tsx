import { useAuth } from "@/context/auth-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const primary = useThemeColor({}, "primary");
  const background = useThemeColor({}, "background");

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: background,
        }}
      >
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }

  //   if (isAuthenticated) {
  //     return <Redirect href="/(tabs)" />;
  //   }

  return <Redirect href="/welcome" />;
}
