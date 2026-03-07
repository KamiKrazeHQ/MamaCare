// screens/HomeScreen.jsx
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const FEATURES = [
  { icon: "💬", label: "Chat", tab: "Chat", color: "#e8f5e9" },
  { icon: "📅", label: "Calendar", tab: "Calendar", color: "#f3e5f5" },
  { icon: "💼", label: "Jobs", tab: "Jobs", color: "#fff3e0" },
  { icon: "🛒", label: "Groceries", tab: "Groceries", color: "#e3f2fd" },
  { icon: "👩‍⚕️", label: "Doctor", tab: "Doctor", color: "#fce4ec" },
];

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, Mama 👋</Text>
        <Text style={styles.subtitle}>What do you need today?</Text>
      </View>

      {/* Week Card */}
      <View style={styles.weekCard}>
        <Text style={styles.weekLabel}>You're at</Text>
        <Text style={styles.weekNumber}>Week 24</Text>
        <Text style={styles.weekSub}>Your baby is the size of an ear of corn 🌽</Text>
      </View>

      {/* Feature Grid */}
      <Text style={styles.sectionTitle}>Quick Access</Text>
      <View style={styles.grid}>
        {FEATURES.map((f) => (
          <TouchableOpacity
            key={f.tab}
            style={[styles.card, { backgroundColor: f.color }]}
            onPress={() => navigation.navigate(f.tab)}
          >
            <Text style={styles.cardIcon}>{f.icon}</Text>
            <Text style={styles.cardLabel}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tip */}
      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>💡 Today's Tip</Text>
        <Text style={styles.tipText}>
          Stay hydrated! Aim for 8-10 glasses of water today. Proper hydration supports your baby's development and helps with common pregnancy discomforts.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  header: { marginBottom: 20 },
  greeting: { fontSize: 28, fontWeight: "700", color: "#333" },
  subtitle: { fontSize: 16, color: "#888", marginTop: 4 },
  weekCard: {
    backgroundColor: "#b39ddb",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: "center",
  },
  weekLabel: { fontSize: 14, color: "rgba(255,255,255,0.8)" },
  weekNumber: { fontSize: 40, fontWeight: "800", color: "#fff", marginVertical: 4 },
  weekSub: { fontSize: 14, color: "rgba(255,255,255,0.9)", textAlign: "center" },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#333", marginBottom: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 },
  card: {
    width: "47%",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cardIcon: { fontSize: 32, marginBottom: 8 },
  cardLabel: { fontSize: 14, fontWeight: "600", color: "#333" },
  tipCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  tipTitle: { fontSize: 16, fontWeight: "700", color: "#333", marginBottom: 8 },
  tipText: { fontSize: 14, color: "#666", lineHeight: 22 },
});