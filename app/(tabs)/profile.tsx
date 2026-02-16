import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/auth-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface UserData {
  name?: string;
  email?: string;
  image?: string;
}

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const surface = useThemeColor({}, "surface");
  const primary = useThemeColor({}, "primary");
  const border = useThemeColor({}, "border");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await SecureStore.getItemAsync("dataUser");
        if (stored) setUserData(JSON.parse(stored));
      } catch {
        setUserData(null);
      }
    };
    loadUser();
  }, []);

  const handleSignOut = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas salir?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Cerrar sesión", style: "destructive", onPress: () => signOut().then(() => router.replace("/")) },
      ]
    );
  };

  const displayName = userData?.name ?? "Usuario";
  const displayEmail = userData?.email ?? "usuario@email.com";
  const username = displayEmail.split("@")[0] || "user";

  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: avatar, nombre, botones */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.avatarWrapper, { backgroundColor: surface, borderColor: border }]}>
              {userData?.image ? (
                <Image source={{ uri: userData.image }} style={styles.avatarImage} />
              ) : (
                <ThemedText style={[styles.avatarText, { color: primary }]}>
                  {displayName.charAt(0).toUpperCase()}
                </ThemedText>
              )}
            </View>
            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <ThemedText style={[styles.userName, { color: text }]} numberOfLines={1}>
                  {displayName}
                </ThemedText>
                <AntDesign name="check-circle" size={18} color="#2563EB" style={styles.verifiedIcon} />
              </View>
              <ThemedText style={[styles.username, { color: textSecondary }]}>
                @{username}
              </ThemedText>
            </View>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: surface, borderColor: border }]}
              activeOpacity={0.7}
            >
              <MaterialIcons name="document-scanner" size={20} color={text} />
              <ThemedText style={[styles.actionButtonText, { color: text }]}>
                Escanear libro
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonPrimary, { backgroundColor: primary }]}
              activeOpacity={0.7}
            >
              <AntDesign name="safety" size={20} color="#FFF" />
              <ThemedText style={[styles.actionButtonText, styles.actionButtonTextPrimary]}>
                Pixipro
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bloque púrpura */}
        <View style={[styles.purpleBlock, { backgroundColor: primary }]} />

        {/* Tarjeta información personal */}
        <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
          <RowItem
            icon={<MaterialIcons name="badge" size={22} color={primary} />}
            label="Nombre"
            value={displayName}
          />
          <View style={[styles.divider, { backgroundColor: border }]} />
          <RowItem
            icon={<ThemedText style={[styles.atIcon, { color: primary }]}>@</ThemedText>}
            label="Correo"
            value={displayEmail}
          />
          <View style={[styles.divider, { backgroundColor: border }]} />
          <RowItem
            icon={<MaterialIcons name="lock-outline" size={22} color={primary} />}
            label="Contraseña"
            value="*******"
            showChevron
          />
        </View>

        {/* Tarjeta información de la app */}
        <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
          <RowItem
            icon={<MaterialIcons name="phone-iphone" size={22} color={primary} />}
            label="Versión"
            value="1.0"
          />
          <View style={[styles.divider, { backgroundColor: border }]} />
          <RowItem
            icon={<MaterialIcons name="support-agent" size={22} color={primary} />}
            label="Ayuda"
            value="Soportepixi@mail.com"
          />
          <View style={[styles.divider, { backgroundColor: border }]} />
          <RowItem
            icon={<MaterialIcons name="policy" size={22} color={primary} />}
            label="Política de privacidad"
            value="Consulta"
            showChevron
          />
        </View>

        {/* Botón Cerrar sesión */}
        <TouchableOpacity
          style={[styles.signOutButton, { backgroundColor: surface, borderColor: border }]}
          onPress={handleSignOut}
          activeOpacity={0.7}
        >
          <ThemedText style={[styles.signOutText, { color: primary }]}>
            Cerrar sesión
          </ThemedText>
          <MaterialIcons name="logout" size={22} color={primary} />
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ThemedView>
  );
}

function RowItem({
  icon,
  label,
  value,
  showChevron,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  showChevron?: boolean;
}) {
  const text = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");

  return (
    <View style={styles.rowItem}>
      <View style={styles.rowIcon}>{icon}</View>
      <View style={styles.rowContent}>
        <ThemedText style={[styles.rowLabel, { color: text }]}>{label}</ThemedText>
        <ThemedText style={[styles.rowValue, { color: textSecondary }]} numberOfLines={1}>
          {value}
        </ThemedText>
      </View>
      {showChevron && (
        <MaterialIcons name="chevron-right" size={24} color={textSecondary} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 56,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700",
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    maxWidth: "85%",
  },
  verifiedIcon: {
    marginLeft: 2,
  },
  username: {
    fontSize: 14,
    marginTop: 2,
  },
  headerButtons: {
    gap: 10,
    marginLeft: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionButtonPrimary: {
    borderWidth: 0,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  actionButtonTextPrimary: {
    color: "#FFFFFF",
  },
  purpleBlock: {
    height: 100,
    borderRadius: 16,
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 4,
    marginBottom: 16,
    overflow: "hidden",
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowIcon: {
    width: 28,
    alignItems: "center",
    marginRight: 12,
  },
  atIcon: {
    fontSize: 20,
    fontWeight: "700",
  },
  rowContent: {
    flex: 1,
    minWidth: 0,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
  rowValue: {
    fontSize: 14,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginLeft: 56,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "700",
  },
  bottomSpacer: {
    height: 32,
  },
});
