// screens/CalendarScreen.jsx
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API } from "../api/client";

const USER_ID = "user_demo_1";

export default function CalendarScreen() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    title: "", with_whom: "", datetime: "", appointment_type: "in-person", notes: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const data = await API.getAppointments(USER_ID);
      setAppointments(data.appointments ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleBook = async () => {
    if (!form.title || !form.with_whom || !form.datetime) {
      Alert.alert("Missing fields", "Please fill in title, doctor name and date.");
      return;
    }
    try {
      await API.createAppointment({ user_id: USER_ID, ...form });
      setModalVisible(false);
      setForm({ title: "", with_whom: "", datetime: "", appointment_type: "in-person", notes: "" });
      await load();
    } catch (e) {
      Alert.alert("Error", "Failed to book appointment");
    }
  };

  const handleCancel = (appt) => {
    Alert.alert("Cancel Appointment", `Cancel "${appt.title}"?`, [
      { text: "No" },
      {
        text: "Yes", style: "destructive", onPress: async () => {
          await API.cancelAppointment(USER_ID, appt.appointment_id);
          await load();
        }
      }
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>📅 My Appointments</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
            <Text style={styles.addBtnText}>+ Book</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <Text style={styles.empty}>Loading...</Text>
        ) : appointments.length === 0 ? (
          <Text style={styles.empty}>No appointments yet. Tap + Book to add one.</Text>
        ) : (
          appointments
            .sort((a, b) => a.datetime?.localeCompare(b.datetime))
            .map((appt) => (
              <TouchableOpacity
                key={appt.appointment_id}
                style={styles.card}
                onLongPress={() => handleCancel(appt)}
              >
                <View style={styles.cardLeft}>
                  <Text style={styles.cardTitle}>{appt.title}</Text>
                  <Text style={styles.cardSub}>👩‍⚕️ {appt.with_whom}</Text>
                  <Text style={styles.cardSub}>
                    📅 {appt.datetime?.replace("T", " ").slice(0, 16)}
                  </Text>
                  <Text style={styles.cardSub}>📍 {appt.appointment_type}</Text>
                </View>
                <View style={[
                  styles.badge,
                  { backgroundColor: appt.status === "confirmed" ? "#e8f5e9" : "#fff3e0" }
                ]}>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: appt.status === "confirmed" ? "green" : "#e65100" }}>
                    {appt.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
        )}
        <Text style={styles.hint}>💡 Long press an appointment to cancel it</Text>
      </ScrollView>

      {/* Booking Modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <ScrollView contentContainerStyle={{ padding: 24 }}>
          <Text style={styles.modalTitle}>Book Appointment</Text>
          {[
            { key: "title", placeholder: "Title (e.g. Midwife Checkup)" },
            { key: "with_whom", placeholder: "With whom (e.g. Dr. Sarah Jones)" },
            { key: "datetime", placeholder: "Date & Time (e.g. 2026-03-15T10:00:00)" },
            { key: "notes", placeholder: "Notes (optional)" },
          ].map(field => (
            <TextInput
              key={field.key}
              style={styles.input}
              placeholder={field.placeholder}
              value={form[field.key]}
              onChangeText={v => setForm({ ...form, [field.key]: v })}
            />
          ))}

          <View style={styles.typeRow}>
            {["in-person", "online"].map(type => (
              <TouchableOpacity
                key={type}
                style={[styles.typeBtn, form.appointment_type === type && styles.typeBtnActive]}
                onPress={() => setForm({ ...form, appointment_type: type })}
              >
                <Text style={{ color: form.appointment_type === type ? "#fff" : "#666" }}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.bookBtn} onPress={handleBook}>
            <Text style={styles.bookBtnText}>Book Appointment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
            <Text style={{ color: "#888", textAlign: "center" }}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#333" },
  addBtn: { backgroundColor: "#b39ddb", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  addBtnText: { color: "#fff", fontWeight: "700" },
  empty: { color: "#aaa", textAlign: "center", marginTop: 40 },
  card: {
    backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardLeft: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#333", marginBottom: 4 },
  cardSub: { fontSize: 13, color: "#888", marginBottom: 2 },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  hint: { textAlign: "center", color: "#ccc", fontSize: 12, marginTop: 8 },
  modalTitle: { fontSize: 22, fontWeight: "700", color: "#333", marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 12,
    padding: 14, fontSize: 14, marginBottom: 12,
  },
  typeRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  typeBtn: {
    flex: 1, padding: 12, borderRadius: 12,
    borderWidth: 1, borderColor: "#e0e0e0", alignItems: "center",
  },
  typeBtnActive: { backgroundColor: "#b39ddb", borderColor: "#b39ddb" },
  bookBtn: { backgroundColor: "#b39ddb", borderRadius: 12, padding: 16, alignItems: "center", marginBottom: 12 },
  bookBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  cancelBtn: { padding: 12 },
});