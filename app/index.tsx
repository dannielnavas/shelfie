import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import * as LocalAuthentication from "expo-local-authentication";
import { Redirect, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
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

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [hasBiometric, setHasBiometric] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  
  const { isAuthenticated, isLoading: authLoading, signIn } = useAuth();

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

  const isFormValid = email.length > 0 && password.length > 0;

  const fetchLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://milibro-danniel-dev.vercel.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      if (!response.ok) {
        throw new Error("Credenciales inválidas");
      }

      const data = await response.json();
      
      // Usar el contexto de autenticación para guardar el token
      await signIn(data.access_token);

      await SecureStore.setItemAsync(
        "dataUser",
        JSON.stringify({
          email,
          password,
          name: data.user.name,
          image: data.user.image,
        }),
      );
      ToastAndroid.show("¡Bienvenido!", ToastAndroid.SHORT);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Error de inicio de sesión",
        "Por favor verifica tus credenciales e intenta nuevamente",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    await fetchLogin({ email: email.toLowerCase(), password });
  };

  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(compatible && enrolled);
    } catch (error) {
      console.error("Error checking biometric availability:", error);
    }
  };

  const handleAuthentication = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Verifica tu identidad",
        fallbackLabel: "Usar correo y contraseña",
        disableDeviceFallback: false,
      });

      if (result.success) {
        setIsLoading(true);
        const data = JSON.parse(
          (await SecureStore.getItemAsync("dataUser")) ?? "{}",
        );
        if (data.email && data.password) {
          await fetchLogin(data);
        }
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      Alert.alert("Error", "No se pudo verificar tu identidad");
    }
  };

  useEffect(() => {
    checkBiometricAvailability();
    const checkSavedCredentials = async () => {
      const savedData = await SecureStore.getItemAsync("dataUser");
      if (savedData && biometricAvailable) {
        const dataUser = JSON.parse(savedData);
        setUserData(dataUser);
        setHasBiometric(true);
      }
    };
    checkSavedCredentials();
  }, [biometricAvailable]);

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <View style={[styles.container, { backgroundColor: background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }

  // Redirigir si ya está autenticado
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
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
            <ThemedText style={[styles.title, { color: text }]}>
              Bienvenido
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
              Inicia sesión para continuar
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
                  autoComplete="password"
                  textContentType="password"
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

            {/* Forgot Password */}
            <Pressable
              onPress={() => router.push("/lost-password")}
              style={styles.forgotPassword}
            >
              <ThemedText style={[styles.forgotPasswordText, { color: primary }]}>
                ¿Olvidaste tu contraseña?
              </ThemedText>
            </Pressable>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                {
                  backgroundColor: isFormValid ? primary : disabled,
                },
              ]}
              onPress={handleLogin}
              disabled={!isFormValid}
              activeOpacity={0.8}
            >
              <ThemedText
                style={[
                  styles.loginButtonText,
                  {
                    color: isFormValid ? onPrimary : disabledText,
                  },
                ]}
              >
                Iniciar sesión
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

            {/* Sign Up */}
            <ThemedView style={styles.signUpContainer}>
              <ThemedText style={[styles.signUpText, { color: textSecondary }]}>
                ¿No tienes una cuenta?{" "}
              </ThemedText>
              <ThemedView>
                <Pressable onPress={() => router.push("/register")}>
                  <ThemedText
                    type="link"
                    style={[styles.signUpLink, { color: primary }]}
                  >
                    Regístrate
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  loginButtonText: {
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
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    fontSize: 14,
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: "600",
  },
});
