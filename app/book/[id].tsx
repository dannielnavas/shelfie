import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const CORAL = "#E07C5C";

const BOOK_DATA: Record<
  string,
  {
    title: string;
    author: string;
    cover: string;
    aboutAuthor: string;
    overview: string;
  }
> = {
  "1": {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    cover: "https://covers.openlibrary.org/b/id/8147321-L.jpg",
    aboutAuthor:
      "Jerome David Salinger was an American author best known for his 1951 novel The Catcher in the Rye. Salinger got his start in literature by publishing several short stories in Story magazine in the early 1940s.",
    overview:
      "The Catcher in the Rye is a novel by J.D. Salinger, partially published in serial form in 1945–1946 and as a novel in 1951. It was originally intended for adults but is often read by adolescents for its themes of angst, alienation, and as a critique on superficiality in society.",
  },
  "2": {
    title: "Someone Like You",
    author: "Roald Dahl",
    cover: "https://covers.openlibrary.org/b/id/128787-L.jpg",
    aboutAuthor:
      "Roald Dahl was a British novelist, short-story writer, poet, screenwriter, and wartime fighter pilot. He is best known for his children's books and his darkly humorous adult short stories.",
    overview:
      "Someone Like You is a collection of short stories by Roald Dahl, first published in 1953. The stories explore themes of revenge, deception, and the unexpected twists of human nature.",
  },
  "3": {
    title: "1984",
    author: "George Orwell",
    cover: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
    aboutAuthor:
      "George Orwell was an English novelist, essayist, journalist and critic. His work is characterized by lucid prose, biting social criticism, opposition to totalitarianism, and outspoken support of democratic socialism.",
    overview:
      "Nineteen Eighty-Four is a dystopian social science fiction novel and cautionary tale. The novel is set in the year 1984 when most of the world population have become victims of perpetual war, omnipresent government surveillance, and propaganda.",
  },
};

const DEFAULT_BOOK = {
  title: "The Catcher in the Rye",
  author: "J.D. Salinger",
  cover: "https://covers.openlibrary.org/b/id/8147321-L.jpg",
  aboutAuthor:
    "Jerome David Salinger was an American author best known for his 1951 novel The Catcher in the Rye.",
  overview:
    "The Catcher in the Rye is a novel by J.D. Salinger. It was originally intended for adults but is often read by adolescents for its themes of angst and alienation.",
};

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const book = (id && BOOK_DATA[id]) || DEFAULT_BOOK;
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const surface = useThemeColor({}, "surface");

  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={28} color={text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.heartButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <AntDesign
              name="heart"
              size={24}
              color={isFavorite ? CORAL : text}
              solid={isFavorite}
            />
          </TouchableOpacity>
        </View>

        {/* Cover + title + author + rating */}
        <View style={styles.coverSection}>
          <Image
            source={{ uri: book.cover }}
            style={styles.cover}
            resizeMode="cover"
          />
          <ThemedText style={[styles.title, { color: text }]}>
            {book.title}
          </ThemedText>
          <ThemedText style={[styles.author, { color: textSecondary }]}>
            {book.author}
          </ThemedText>
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4].map((i) => (
              <AntDesign key={i} name="star" size={18} color="#FBBF24" />
            ))}
            <AntDesign name="star" size={18} color="#FBBF24" />
            <ThemedText style={[styles.ratingText, { color: textSecondary }]}>
              4.0
            </ThemedText>
          </View>
        </View>

        {/* About the author */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: text }]}>
            About the author
          </ThemedText>
          <ThemedText style={[styles.sectionBody, { color: textSecondary }]}>
            {book.aboutAuthor}
          </ThemedText>
        </View>

        {/* Overview */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: text }]}>
            Overview
          </ThemedText>
          <ThemedText style={[styles.sectionBody, { color: textSecondary }]}>
            {book.overview}
          </ThemedText>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add to Cart fixed */}
      <View style={[styles.footer, { backgroundColor: surface }]}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => {}}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.addToCartText}>Add to Cart</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 56 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backButton: { padding: 8 },
  heartButton: { padding: 8 },
  coverSection: { alignItems: "center", marginBottom: 32 },
  cover: {
    width: 200,
    height: 300,
    borderRadius: 12,
    backgroundColor: "#E2E8F0",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  author: { fontSize: 16, marginBottom: 8 },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: { fontSize: 14, marginLeft: 4 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  sectionBody: {
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 34,
  },
  addToCartButton: {
    height: 52,
    backgroundColor: CORAL,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
