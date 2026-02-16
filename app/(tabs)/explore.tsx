import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const CORAL = "#E07C5C";

export default function ExploreScreen() {
  const router = useRouter();
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");

  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText style={[styles.title, { color: text }]}>
            Mi lista de deseos
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
            Los libros que guardaste aparecerán aquí
          </ThemedText>
        </View>
        <View style={styles.emptyState}>
          <View style={[styles.heartIcon, { backgroundColor: `${CORAL}20` }]}>
            <AntDesign name="heart" size={48} color={CORAL} />
          </View>
          <ThemedText style={[styles.emptyTitle, { color: text }]}>
            Tu lista está vacía
          </ThemedText>
          <ThemedText style={[styles.emptySubtitle, { color: textSecondary }]}>
            Explora libros y añade los que te gusten con el corazón para verlos aquí.
          </ThemedText>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push("/(tabs)")}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.browseButtonText}>Explorar libros</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 56,
  },
  header: { marginBottom: 32 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 15 },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  heartIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  browseButton: {
    height: 52,
    paddingHorizontal: 32,
    backgroundColor: CORAL,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
