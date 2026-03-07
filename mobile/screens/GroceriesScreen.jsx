// screens/GroceriesScreen.jsx
import { useEffect, useState } from "react";
import {
  FlatList, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from "react-native";
import { API } from "../api/client";

export default function GroceriesScreen() {
  const [groceries, setGroceries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [cart, setCart] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await API.getGroceries(keyword);
      setGroceries(data.groceries ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleCart = (item) => {
    setCart(prev =>
      prev.some(c => c.id === item.id)
        ? prev.filter(c => c.id !== item.id)
        : [...prev, item]
    );
  };

  const inCart = (item) => cart.some(c => c.id === item.id);

  return (
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          value={keyword}
          onChangeText={setKeyword}
          placeholder="Search groceries..."
          onSubmitEditing={load}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={load}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>Go</Text>
        </TouchableOpacity>
        {cart.length > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>🛒 {cart.length}</Text>
          </View>
        )}
      </View>

      {loading ? (
        <Text style={styles.loading}>Finding prenatal groceries...</Text>
      ) : (
        <FlatList
          data={groceries}
          keyExtractor={(item) => item.id?.toString()}
          contentContainerStyle={{ padding: 16 }}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, inCart(item) && styles.cardInCart]}
              onPress={() => toggleCart(item)}
            >
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.benefit}>{item.benefit}</Text>
              <View style={styles.bottom}>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.store} numberOfLines={1}>{item.store}</Text>
              </View>
              {inCart(item) && (
                <View style={styles.inCartBadge}>
                  <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>✓ In Cart</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: { flexDirection: "row", padding: 12, gap: 8, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f0f0f0", alignItems: "center" },
  searchInput: { flex: 1, borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 10, padding: 10, fontSize: 13 },
  searchBtn: { backgroundColor: "#b39ddb", borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10, justifyContent: "center" },
  cartBadge: { backgroundColor: "#f3e5f5", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  cartBadgeText: { fontSize: 13, fontWeight: "700", color: "#7b1fa2" },
  loading: { textAlign: "center", color: "#aaa", marginTop: 40 },
  card: {
    flex: 1, backgroundColor: "#fff", borderRadius: 16, padding: 14,
    marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardInCart: { borderWidth: 2, borderColor: "#b39ddb" },
  emoji: { fontSize: 28, marginBottom: 8 },
  name: { fontSize: 13, fontWeight: "700", color: "#333", marginBottom: 4 },
  benefit: { fontSize: 11, color: "#b39ddb", fontWeight: "600", marginBottom: 8 },
  bottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  price: { fontSize: 13, fontWeight: "700", color: "#333" },
  store: { fontSize: 10, color: "#aaa", flex: 1, textAlign: "right" },
  inCartBadge: {
    position: "absolute", top: 8, right: 8,
    backgroundColor: "#b39ddb", borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2,
  },
});