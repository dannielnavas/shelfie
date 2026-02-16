import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";

const CORAL = "#E07C5C";

export default function WelcomeScreen() {
  const coral = useThemeColor({}, "coral");

  return (
    <View style={styles.container}>
      {/* Lado izquierdo coral */}
      <View style={[styles.leftPanel, { backgroundColor: coral }]}>
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <ThemedText style={styles.logoLetter}>A</ThemedText>
            <View style={styles.logoRibbon} />
          </View>
        </View>
        <ThemedText style={styles.welcomeTitle}>Welcome</ThemedText>
        <ThemedText style={styles.welcomeSubtitle}>Read without limits</ThemedText>
      </View>

      {/* Botones inferiores */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push("/register")}
          activeOpacity={0.8}
        >
          <ThemedText style={[styles.primaryButtonText, { color: coral }]}>
            Create Account
          </ThemedText>
        </TouchableOpacity>

        <Pressable
          style={[styles.secondaryButton, { backgroundColor: coral }]}
          onPress={() => router.push("/login")}
        >
          <ThemedText style={styles.secondaryButtonText}>
            Log In as Guest
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  leftPanel: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 80,
    justifyContent: "flex-start",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  logoLetter: {
    fontSize: 56,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  logoRibbon: {
    position: "absolute",
    bottom: -4,
    left: "50%",
    marginLeft: -40,
    width: 80,
    height: 12,
    backgroundColor: "#475569",
    borderRadius: 6,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "400",
  },
  buttonsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 16,
  },
  primaryButton: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E07C5C",
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
