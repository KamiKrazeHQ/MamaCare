// screens/DoctorScreen.jsx
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SPECIALTIES = [
  { icon: "👶", title: "OB/GYN", desc: "Obstetrics & Gynecology specialists for prenatal care" },
  { icon: "🤱", title: "Midwife", desc: "Certified midwives for holistic prenatal care" },
  { icon: "🧠", title: "Perinatal Psychiatrist", desc: "Mental health support during and after pregnancy" },
  { icon: "🥗", title: "Prenatal Nutritionist", desc: "Diet and nutrition guidance for healthy pregnancy" },
  { icon: "💪", title: "Prenatal Fitness", desc: "Safe exercise programs for expecting mothers" },
  { icon: "😴", title: "Sleep Specialist", desc: "Help with pregnancy-related sleep issues" },
];

const TIPS = [
  "Schedule your first prenatal visit as soon as you know you're pregnant",
  "Keep a list of questions ready for each appointment",
  "Don't skip your glucose screening test at 24-28 weeks",
  "Ask about Group B Strep testing at 35-37 weeks",
  "Discuss your birth plan with your provider early",
];

export default function DoctorScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>👩‍⚕️ Doctor & Specialist Finder</Text>
      <Text style={styles.subtitle}>Find the right care for your pregnancy journey</Text>

      {/* Search Button */}
      <TouchableOpacity
        style={styles.searchCard}
        onPress={() => Linking.openURL("https://www.zocdoc.com/search?reason_visit=Obstetrics+%26+Gynecology&insurance_carrier=-1")}
      >
        <Text style={styles.searchIcon}>🔍</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.searchTitle}>Find OB/GYNs Near You</Text>
          <Text style={styles.searchSub}>Powered by ZocDoc — book same-day appointments</Text>
        </View>
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>

      {/* Specialties */}
      <Text style={styles.sectionTitle}>Specialties</Text>
      {SPECIALTIES.map((s) => (
        <View key={s.title} style={styles.specialtyCard}>
          <Text style={styles.specialtyIcon}>{s.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.specialtyTitle}>{s.title}</Text>
            <Text style={styles.specialtyDesc}>{s.desc}</Text>
          </View>
        </View>
      ))}

      {/* Tips */}
      <Text style={styles.sectionTitle}>💡 Prenatal Care Tips</Text>
      <View style={styles.tipsCard}>
        {TIPS.map((tip, i) => (
          <View key={i} style={styles.tip}>
            <Text style={styles.tipNum}>{i + 1}</Text>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>

      {/* Emergency */}
      <TouchableOpacity
        style={styles.emergencyCard}
        onPress={() => Linking.openURL("tel:911")}
      >
        <Text style={styles.emergencyTitle}>🚨 Emergency?</Text>
        <Text style={styles.emergencySub}>Call 911 immediately for urgent pregnancy concerns</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  title: { fontSize: 22, fontWeight: "700", color: "#333", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#888", marginBottom: 20 },
  searchCard: {
    backgroundColor: "#b39ddb", borderRadius: 16, padding: 20,
    flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 24,
  },
  searchIcon: { fontSize: 28 },
  searchTitle: { fontSize: 16, fontWeight: "700", color: "#fff" },
  searchSub: { fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 2 },
  arrow: { fontSize: 20, color: "#fff" },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#333", marginBottom: 12 },
  specialtyCard: {
    backgroundColor: "#fff", borderRadius: 14, padding: 16,
    flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  specialtyIcon: { fontSize: 28 },
  specialtyTitle: { fontSize: 15, fontWeight: "700", color: "#333" },
  specialtyDesc: { fontSize: 12, color: "#888", marginTop: 2 },
  tipsCard: {
    backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 20,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  tip: { flexDirection: "row", gap: 12, marginBottom: 12, alignItems: "flex-start" },
  tipNum: {
    backgroundColor: "#f3e5f5", color: "#7b1fa2", fontWeight: "700",
    width: 24, height: 24, borderRadius: 12, textAlign: "center", lineHeight: 24, fontSize: 12,
  },
  tipText: { flex: 1, fontSize: 13, color: "#555", lineHeight: 20 },
  emergencyCard: {
    backgroundColor: "#ffebee", borderRadius: 16, padding: 20,
    alignItems: "center", marginBottom: 20,
    borderWidth: 1, borderColor: "#ffcdd2",
  },
  emergencyTitle: { fontSize: 18, fontWeight: "700", color: "#c62828" },
  emergencySub: { fontSize: 13, color: "#e57373", marginTop: 4, textAlign: "center" },
});