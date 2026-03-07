// screens/JobsScreen.jsx
import { useEffect, useState } from "react";
import {
  FlatList, Linking, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from "react-native";
import { API } from "../api/client";

export default function JobsScreen() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("remote flexible jobs for mothers");

  const load = async () => {
    setLoading(true);
    try {
      const data = await API.getJobs(keyword);
      setJobs(data.jobs ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          value={keyword}
          onChangeText={setKeyword}
          placeholder="Search jobs..."
          onSubmitEditing={load}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={load}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>Go</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loading}>Finding jobs for you...</Text>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id?.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.jobTitle}>{item.title}</Text>
              <Text style={styles.company}>{item.company} · {item.location}</Text>
              <Text style={styles.salary}>{item.salary}</Text>
              <View style={styles.tagRow}>
                {item.tags?.slice(0, 3).map(tag => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => item.apply_link && item.apply_link !== "#" && Linking.openURL(item.apply_link)}
              >
                <Text style={styles.applyText}>Apply Now →</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: { flexDirection: "row", padding: 12, gap: 8, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  searchInput: { flex: 1, borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 10, padding: 10, fontSize: 13 },
  searchBtn: { backgroundColor: "#b39ddb", borderRadius: 10, paddingHorizontal: 16, justifyContent: "center" },
  loading: { textAlign: "center", color: "#aaa", marginTop: 40 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  jobTitle: { fontSize: 16, fontWeight: "700", color: "#333", marginBottom: 4 },
  company: { fontSize: 13, color: "#888", marginBottom: 4 },
  salary: { fontSize: 13, color: "#b39ddb", fontWeight: "600", marginBottom: 8 },
  tagRow: { flexDirection: "row", gap: 6, marginBottom: 8 },
  tag: { backgroundColor: "#f3e5f5", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { fontSize: 11, color: "#7b1fa2" },
  desc: { fontSize: 13, color: "#666", lineHeight: 20, marginBottom: 12 },
  applyBtn: { backgroundColor: "#f3e5f5", borderRadius: 10, padding: 10, alignItems: "center" },
  applyText: { color: "#7b1fa2", fontWeight: "700", fontSize: 13 },
});