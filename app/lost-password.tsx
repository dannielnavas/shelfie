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

export default function LostPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

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

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const isFormValid = email.length > 0 && email.includes("@");

  const handleResetPassword = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://milibro-danniel-dev.vercel.app/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email.toLowerCase() }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al enviar el correo");
      }

      setEmailSent(true);
      ToastAndroid.show("Correo enviado exitosamente", ToastAndroid.SHORT);
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.message ||
          "No se pudo enviar el correo. Por favor verifica tu email e intenta nuevamente",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
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
              <ThemedText style={[styles.successIcon]}>✉️</ThemedText>
              <ThemedText style={[styles.title, { color: text }]}>
                Correo enviado
              </ThemedText>
              <ThemedText
                style={[
                  styles.subtitle,
                  { color: textSecondary, textAlign: "center" },
                ]}
              >
                Hemos enviado un enlace de recuperación a{" "}
                <ThemedText style={{ fontWeight: "600", color: text }}>
                  {email}
                </ThemedText>
              </ThemedText>
            </View>

            {/* Success Card */}
            <ThemedView style={[styles.form, { backgroundColor: surface }]}>
              <ThemedText style={[styles.instructionText, { color: textSecondary }]}>
                Revisa tu bandeja de entrada y sigue las instrucciones para
                restablecer tu contraseña. Si no ves el correo, revisa la carpeta de
                spam.
              </ThemedText>

              {/* Back to Login Button */}
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: primary }]}
                onPress={() => router.replace("/")}
                activeOpacity={0.8}
              >
                <ThemedText style={[styles.primaryButtonText, { color: onPrimary }]}>
                  Volver al inicio de sesión
                </ThemedText>
              </TouchableOpacity>

              {/* Resend Link */}
              <ThemedView style={styles.resendContainer}>
                <ThemedText style={[styles.resendText, { color: textSecondary }]}>
                  ¿No recibiste el correo?{" "}
                </ThemedText>
                <Pressable
                  onPress={() => {
                    setEmailSent(false);
                  }}
                >
                  <ThemedText style={[styles.resendLink, { color: primary }]}>
                    Reenviar
                  </ThemedText>
                </Pressable>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

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
            <ThemedText style={[styles.lockIcon]}>🔒</ThemedText>
            <ThemedText style={[styles.title, { color: text }]}>
              Recuperar contraseña
            </ThemedText>
            <ThemedText
              style={[
                styles.subtitle,
                { color: textSecondary, textAlign: "center" },
              ]}
            >
              Ingresa tu correo electrónico y te enviaremos un enlace para
              restablecer tu contraseña
            </ThemedText>
          </View>

          {/* Form */}
          <ThemedView style={[styles.form, { backgroundColor: surface }]}>
            {/* Email Input */}
            <ThemedView style={styles.inputContainer}>
              <ThemedText style={[styles.label, { color: text }]}>Email</ThemedText>
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
                autoFocus
              />
            </ThemedView>

            {/* Reset Password Button */}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                {
                  backgroundColor: isFormValid && !isLoading ? primary : disabled,
                },
              ]}
              onPress={handleResetPassword}
              disabled={!isFormValid || isLoading}
              activeOpacity={0.8}
            >
              <ThemedText
                style={[
                  styles.primaryButtonText,
                  {
                    color: isFormValid && !isLoading ? onPrimary : disabledText,
                  },
                ]}
              >
                {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
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

            {/* Back to Login */}
            <ThemedView style={styles.loginContainer}>
              <ThemedText style={[styles.loginText, { color: textSecondary }]}>
                ¿Recordaste tu contraseña?{" "}
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
  lockIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 22,
    paddingHorizontal: 16,
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
    marginBottom: 24,
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
  instructionText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 24,
  },
  primaryButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  primaryButtonText: {
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
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  resendText: {
    fontSize: 14,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: "600",
  },
});
