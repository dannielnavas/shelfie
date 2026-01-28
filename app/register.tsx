import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { router } from "expo-router";
import React, { useState } from "react";
import {
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

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Colores del tema
  const background = useThemeColor({}, "background");
  const surface = useThemeColor({}, "surface");
  const surfaceSecondary = useThemeColor({}, "surfaceSecondary");
  const text = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const textTertiary = useThemeColor({}, "textTertiary");
  const primary = useThemeColor({}, "primary");
  const onPrimary = useThemeColor({}, "onPrimary");
  const border = useThemeColor({}, "border");
  const disabled = useThemeColor({}, "disabled");
  const disabledText = useThemeColor({}, "disabledText");
  const danger = useThemeColor({}, "danger");

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const isFormValid =
    name.length > 0 &&
    email.length > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const passwordsMatch = password === confirmPassword || confirmPassword === "";

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://milibro-danniel-dev.vercel.app/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email: email.toLowerCase(),
            password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrar");
      }

      ToastAndroid.show("¡Cuenta creada exitosamente!", ToastAndroid.SHORT);
      router.replace("/");
    } catch (err: any) {
      Alert.alert(
        "Error de registro",
        err.message || "Por favor verifica tus datos e intenta nuevamente"
      );
    } finally {
      setIsLoading(false);
    }
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
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={[styles.title, { color: text }]}>
              Crear cuenta
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
              Regístrate para comenzar
            </ThemedText>
          </View>

          {/* Form */}
          <ThemedView style={[styles.form, { backgroundColor: surface }]}>
            {/* Name Input */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={[styles.label, { color: text }]}>
                Nombre completo
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? surfaceSecondary : background,
                    borderColor: border,
                    color: text,
                  },
                ]}
                placeholder="Tu nombre"
                placeholderTextColor={textTertiary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
              />
            </ThemedView>

            {/* Email Input */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={[styles.label, { color: text }]}>
                Email
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? surfaceSecondary : background,
                    borderColor: border,
                    color: text,
                  },
                ]}
                placeholder="tu@email.com"
                placeholderTextColor={textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
              />
            </ThemedView>

            {/* Password Input */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={[styles.label, { color: text }]}>
                Contraseña
              </ThemedText>
              <ThemedView style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    {
                      backgroundColor: isDark ? surfaceSecondary : background,
                      borderColor: border,
                      color: text,
                    },
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor={textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  textContentType="newPassword"
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

            {/* Confirm Password Input */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={[styles.label, { color: text }]}>
                Confirmar contraseña
              </ThemedText>
              <ThemedView style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    {
                      backgroundColor: isDark ? surfaceSecondary : background,
                      borderColor: !passwordsMatch ? danger : border,
                      color: text,
                    },
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor={textTertiary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!isConfirmPasswordVisible}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  textContentType="newPassword"
                />
                <TouchableOpacity
                  onPress={() =>
                    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                  }
                  style={styles.eyeButton}
                >
                  <ThemedText
                    style={[styles.eyeButtonText, { color: textSecondary }]}
                  >
                    {isConfirmPasswordVisible ? "👁️" : "👁️‍🗨️"}
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
              {!passwordsMatch && (
                <ThemedText style={[styles.errorText, { color: danger }]}>
                  Las contraseñas no coinciden
                </ThemedText>
              )}
            </ThemedView>

            {/* Register Button */}
            <TouchableOpacity
              style={[
                styles.registerButton,
                {
                  backgroundColor: isFormValid && !isLoading ? primary : disabled,
                },
              ]}
              onPress={handleRegister}
              disabled={!isFormValid || isLoading}
              activeOpacity={0.8}
            >
              <ThemedText
                style={[
                  styles.registerButtonText,
                  {
                    color: isFormValid && !isLoading ? onPrimary : disabledText,
                  },
                ]}
              >
                {isLoading ? "Creando cuenta..." : "Crear cuenta"}
              </ThemedText>
            </TouchableOpacity>

            {/* Divider */}
            <ThemedView style={styles.dividerContainer}>
              <ThemedView style={[styles.divider, { backgroundColor: border }]} />
              <ThemedText style={[styles.dividerText, { color: textTertiary }]}>
                o
              </ThemedText>
              <ThemedView style={[styles.divider, { backgroundColor: border }]} />
            </ThemedView>

            {/* Login Link */}
            <ThemedView style={styles.loginContainer}>
              <ThemedText style={[styles.loginText, { color: textSecondary }]}>
                ¿Ya tienes una cuenta?{" "}
              </ThemedText>
              <ThemedView>
                <Pressable onPress={() => router.back()}>
                  <ThemedText
                    type="link"
                    style={[styles.loginLink, { color: primary }]}
                  >
                    Inicia sesión
                  </ThemedText>
                </Pressable>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  content: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
  },
  form: {
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 50,
    fontSize: 16,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  eyeButtonText: {
    fontSize: 20,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  registerButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 4,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "600",
  },
});
