import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { api } from "@/constants/api";
import { useThemeColor } from "@/hooks/use-theme-color";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const CORAL = "#E07C5C";

const CATEGORIES = ["Novel", "Self-love", "Science", "Romance"];

const NEW_ARRIVALS = [
  {
    id: "1",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    cover: "https://covers.openlibrary.org/b/id/8147321-L.jpg",
  },
  {
    id: "2",
    title: "Someone Like You",
    author: "Roald Dahl",
    cover: "https://covers.openlibrary.org/b/id/128787-L.jpg",
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    cover: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
  },
];

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState("Novel");
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const searchInputRef = useRef<TextInput>(null);
  const router = useRouter();
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const textTertiary = useThemeColor({}, "textTertiary");
  const surface = useThemeColor({}, "surface");
  const border = useThemeColor({}, "border");

  const filteredBooks = searchQuery.trim()
    ? books.filter((b) =>
        b.title?.toLowerCase().includes(searchQuery.trim().toLowerCase()),
      )
    : books;

  const handleBarcodeScanned = useCallback(
    async ({ data }: { data: string }) => {
      const isbn = data?.trim();
      if (!isbn) return;

      try {
        // Intentar primero tu API
        const response = await fetch(api.books.searchByISBN + encodeURIComponent(isbn));
        const contentType = response.headers.get("content-type") ?? "";
        const text = await response.text();

        let booksData: any = null;

        if (contentType.includes("application/json") || (text.trim().startsWith("{") || text.trim().startsWith("["))) {
          try {
            booksData = JSON.parse(text);
          } catch {
            // no es JSON válido
          }
        }

        // Si tu API devolvió HTML o error, usar Open Library como fallback
        if (booksData == null) {
          const openLibraryRes = await fetch(
            `https://openlibrary.org/isbn/${encodeURIComponent(isbn)}.json`,
          );
          const olText = await openLibraryRes.text();
          if (olText.trim().startsWith("{")) {
            const olBook = JSON.parse(olText);
            const title = olBook.title ?? "Sin título";
            const coverId = olBook.covers?.[0];
            const cover = coverId
              ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
              : undefined;
            booksData = [
              {
                id: isbn,
                title,
                author: olBook.authors?.map((a: any) => a.name).join(", ") ?? "Autor desconocido",
                cover: cover ?? "https://via.placeholder.com/120x180?text=Sin+portada",
              },
            ];
          }
        }

        if (booksData != null) {
          const list = Array.isArray(booksData) ? booksData : [booksData];
          if (list.length > 0) {
            setBooks((prev) => {
              const newIds = new Set(list.map((b: any) => b.id ?? b.isbn));
              const existing = prev.filter((p: any) => !newIds.has(p.id));
              return [...list, ...existing];
            });
            setShowScanner(false);
            setSearchQuery(list[0]?.title ?? "");
          } else {
            Alert.alert("Sin resultados", "No se encontró ningún libro con ese ISBN.");
          }
        } else {
          Alert.alert(
            "Error de búsqueda",
            "No se pudo obtener información del libro. Comprueba la conexión o que el ISBN sea correcto.",
          );
        }
      } catch (error) {
        console.error("Error al buscar por ISBN:", error);
        Alert.alert(
          "Error",
          "No se pudo buscar el libro. Revisa tu conexión e inténtalo de nuevo.",
        );
      }
    },
    [],
  );

  const openScanner = useCallback(async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
          "Permiso de cámara",
          "Necesitas permitir el acceso a la cámara para escanear el ISBN.",
        );
        return;
      }
    }
    setShowScanner(true);
  }, [permission?.granted, requestPermission]);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch(api.books.getBooks);
      const data = await response.json();
      setBooks(data);
    };
    fetchBooks();
  }, []);
  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={() => {}}>
            <MaterialIcons name="menu" size={28} color={text} />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
              <AntDesign name="bell" size={24} color={text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.avatarButton}
              onPress={() => router.push("/(tabs)/profile")}
            >
              <View style={[styles.avatar, { backgroundColor: CORAL }]}>
                <ThemedText style={styles.avatarText}>T</ThemedText>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting */}
        <View style={styles.greeting}>
          <ThemedText style={[styles.greetingTitle, { color: CORAL }]}>
            Hello, Tricia 👋
          </ThemedText>
          <ThemedText
            style={[styles.greetingSubtitle, { color: textSecondary }]}
          >
            ¿What do you want to read today?
          </ThemedText>
        </View>

        {/* Search bar */}
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: surface, borderColor: border },
          ]}
        >
          <MaterialIcons name="search" size={22} color={textTertiary} />
          <TextInput
            ref={searchInputRef}
            style={[styles.searchInput, { color: text }]}
            placeholder="Buscar por título..."
            placeholderTextColor={textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={styles.searchIcons}>
            <TouchableOpacity style={styles.searchIconBtn}>
              <MaterialIcons name="mic" size={22} color={textTertiary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.searchIconBtn}>
              <MaterialIcons name="tune" size={22} color={textTertiary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Botones: Escanear ISBN y Buscar por título */}
        <View style={styles.searchActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: CORAL }]}
            onPress={openScanner}
            activeOpacity={0.8}
          >
            <MaterialIcons name="document-scanner" size={22} color="#FFFFFF" />
            <ThemedText style={styles.actionButtonText}>
              Escanear ISBN
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.actionButtonSecondary,
              { backgroundColor: surface, borderColor: border },
            ]}
            onPress={() => searchInputRef.current?.focus()}
            activeOpacity={0.8}
          >
            <MaterialIcons name="menu-book" size={22} color={text} />
            <ThemedText
              style={[styles.actionButtonTextSecondary, { color: text }]}
            >
              Buscar por título
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        {/* <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              style={[
                styles.categoryChip,
                selectedCategory === cat && { backgroundColor: CORAL },
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <ThemedText
                style={[
                  styles.categoryChipText,
                  { color: selectedCategory === cat ? "#FFFFFF" : text },
                ]}
              >
                {cat}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView> */}

        {/* New Arrivals */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: text }]}>
            {searchQuery.trim() ? "Resultados" : "New Arrivals"}
          </ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.booksRow}
          >
            {books.length > 0 &&
              filteredBooks.map((book: any) => (
                <TouchableOpacity
                  key={book.id}
                  style={styles.bookCard}
                  onPress={() => router.push(`/book/${book.id}`)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: book.cover }}
                    style={styles.bookCover}
                    resizeMode="cover"
                  />
                  <ThemedText
                    style={[styles.bookTitle, { color: text }]}
                    numberOfLines={2}
                  >
                    {book.title}
                  </ThemedText>
                  <ThemedText
                    style={[styles.bookAuthor, { color: textSecondary }]}
                    numberOfLines={1}
                  >
                    {book.author}
                  </ThemedText>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Modal: escanear ISBN */}
      <Modal
        visible={showScanner}
        animationType="slide"
        onRequestClose={() => setShowScanner(false)}
      >
        <View style={styles.scannerContainer}>
          <View style={styles.scannerHeader}>
            <ThemedText style={styles.scannerTitle}>
              Escanear código ISBN
            </ThemedText>
            <TouchableOpacity
              style={styles.scannerCloseBtn}
              onPress={() => setShowScanner(false)}
            >
              <MaterialIcons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.cameraWrapper}>
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ["ean13", "ean8", "upc_a"],
              }}
              onBarcodeScanned={handleBarcodeScanned}
            />
          </View>
          <ThemedText style={styles.scannerHint}>
            Enfoca el código de barras del libro
          </ThemedText>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
  },
  menuButton: { padding: 8 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 16 },
  iconButton: { padding: 8 },
  avatarButton: {},
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#FFFFFF", fontWeight: "600", fontSize: 16 },
  greeting: { paddingHorizontal: 20, marginBottom: 20 },
  greetingTitle: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
  greetingSubtitle: { fontSize: 15 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: 0 },
  searchIcons: { flexDirection: "row", gap: 8 },
  searchIconBtn: { padding: 4 },
  searchActions: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 20,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionButtonSecondary: {
    borderWidth: 1,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  actionButtonTextSecondary: {
    fontSize: 14,
    fontWeight: "600",
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  scannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
  },
  scannerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  scannerCloseBtn: { padding: 8 },
  cameraWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 20,
  },
  scannerHint: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 20,
  },
  categoriesScroll: { marginBottom: 24 },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryChipText: { fontSize: 14, fontWeight: "600" },
  section: { paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    marginTop: 16,
  },
  booksRow: { gap: 16, paddingRight: 20 },
  bookCard: { width: 120 },
  bookCover: {
    width: 120,
    height: 180,
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  bookAuthor: { fontSize: 12, marginTop: 2 },
});
