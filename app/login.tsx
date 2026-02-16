import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { api } from "@/constants/api";
import { useAuth } from "@/context/auth-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View,
} from "react-native";

const CORAL = "#E07C5C";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuth();
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const textTertiary = useThemeColor({}, "textTertiary");
  const border = useThemeColor({}, "border");

  const isFormValid = email.length > 0 && password.length > 0;

  const fetchLogin = async ({
    email: e,
    password: p,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await fetch(api.auth.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: e, password: p }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Credenciales inválidas");
      await signIn(data.accessToken);
      if (response.ok) {
        const userResponse = await fetch(api.user.me, {
          headers: { Authorization: `Bearer ${data.accessToken}` },
        });
        const userData = await userResponse.json();
        await SecureStore.setItemAsync("dataUser", JSON.stringify(userData));
        console.log("userData", userData);
      }
      ToastAndroid.show("¡Bienvenido!", ToastAndroid.SHORT);
      router.replace("/(tabs)");
    } catch (error) {
      console.log("error", error instanceof TypeError);
      const isNetworkError =
        error instanceof TypeError &&
        (error as Error).message === "Network request failed";
      Alert.alert(
        "Error de inicio de sesión",
        isNetworkError
          ? "No se pudo conectar al servidor. Revisa que el backend esté corriendo y que la IP en constants/api.ts sea la de tu computadora en la misma red WiFi."
          : (error as Error).message ||
              "Por favor verifica tus credenciales e intenta nuevamente",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    await fetchLogin({ email: email.toLowerCase(), password });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={[styles.logoWrapper, { borderColor: border }]}>
              <ThemedText style={[styles.logoLetter, { color: CORAL }]}>
                A
              </ThemedText>
              <View
                style={[styles.logoRibbon, { backgroundColor: "#64748B" }]}
              />
            </View>
          </View>

          {/* Campos */}
          <ThemedView style={styles.form}>
            <ThemedView style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: background,
                    borderColor: border,
                    color: text,
                  },
                ]}
                placeholder="Email"
                placeholderTextColor={textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </ThemedView>
            <ThemedView style={styles.inputContainer}>
              <ThemedView style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    {
                      backgroundColor: background,
                      borderColor: border,
                      color: text,
                    },
                  ]}
                  placeholder="Password"
                  placeholderTextColor={textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                  autoComplete="password"
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  style={styles.eyeButton}
                >
                  <ThemedText
                    style={[styles.eyeButtonText, { color: textSecondary }]}
                  >
                    {isPasswordVisible ? "👁️" : "👁️‍🗨️"}
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>

            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: isFormValid ? CORAL : "#CBD5E1" },
              ]}
              onPress={handleLogin}
              disabled={!isFormValid || isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <ThemedText style={styles.loginButtonText}>Log In</ThemedText>
              )}
            </TouchableOpacity>

            <View style={styles.signUpRow}>
              <ThemedText style={[styles.signUpText, { color: textSecondary }]}>
                Don&apos;t have an account yet?{" "}
              </ThemedText>
              <Pressable onPress={() => router.push("/register")}>
                <ThemedText style={[styles.signUpLink, { color: CORAL }]}>
                  Sign up here
                </ThemedText>
              </Pressable>
            </View>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  content: { width: "100%", maxWidth: 400, alignSelf: "center" },
  logoContainer: { alignItems: "center", marginBottom: 32 },
  logoWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  logoLetter: { fontSize: 40, fontWeight: "700" },
  logoRibbon: {
    position: "absolute",
    bottom: -4,
    left: "50%",
    marginLeft: -24,
    width: 48,
    height: 8,
    borderRadius: 4,
  },
  form: { gap: 16 },
  inputContainer: {},
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  passwordContainer: { position: "relative" },
  passwordInput: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 48,
    fontSize: 16,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  eyeButtonText: { fontSize: 20 },
  loginButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  signUpRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 24,
  },
  signUpText: { fontSize: 14 },
  signUpLink: { fontSize: 14, fontWeight: "600" },
});
