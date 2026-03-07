// screens/ChatScreen.jsx
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API } from "../api/client";

const ROOMS = [
  { id: "general", label: "💬 General" },
  { id: "first-trimester", label: "🌱 First Trimester" },
  { id: "second-trimester", label: "🌸 Second Trimester" },
  { id: "third-trimester", label: "🌺 Third Trimester" },
  { id: "newborn", label: "👶 Newborn" },
  { id: "teenage-moms", label: "💜 Teen Moms" },
];

export default function ChatScreen() {
  const [userName, setUserName] = useState("");
  const [entered, setEntered] = useState(false);
  const [activeRoom, setActiveRoom] = useState(ROOMS[0]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (!entered) return;

    // Load history
    API.getChatHistory(activeRoom.id)
      .then(data => setMessages(data.messages ?? []))
      .catch(() => setMessages([]));

    // Open WebSocket
    const ws = new WebSocket(`${API.WS_BASE}/api/chat/ws/${activeRoom.id}/${userName}`);
    socketRef.current = ws;
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        setMessages(prev => [...prev, msg]);
      } catch {}
    };
    return () => ws.close();
  }, [entered, activeRoom, userName]);

  const sendMessage = () => {
    if (!input.trim() || !connected) return;
    socketRef.current?.send(JSON.stringify({ content: input.trim() }));
    setInput("");
  };

  if (!entered) {
    return (
      <View style={styles.nameContainer}>
        <Text style={styles.nameTitle}>Join the Community 💬</Text>
        <Text style={styles.nameSub}>Connect with mothers who understand</Text>
        <TextInput
          style={styles.nameInput}
          placeholder="Your display name"
          value={userName}
          onChangeText={setUserName}
          autoFocus
        />
        <TouchableOpacity
          style={[styles.nameBtn, !userName.trim() && { opacity: 0.4 }]}
          onPress={() => userName.trim() && setEntered(true)}
          disabled={!userName.trim()}
        >
          <Text style={styles.nameBtnText}>Enter Chat →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.container}>
        {/* Room selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roomBar}>
          {ROOMS.map(room => (
            <TouchableOpacity
              key={room.id}
              style={[styles.roomChip, activeRoom.id === room.id && styles.roomChipActive]}
              onPress={() => setActiveRoom(room)}
            >
              <Text style={[styles.roomChipText, activeRoom.id === room.id && styles.roomChipTextActive]}>
                {room.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Status */}
        <Text style={styles.status}>
          {connected ? "🟢 Connected" : "🔴 Disconnected"} · {activeRoom.label}
        </Text>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, i) => i.toString()}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          contentContainerStyle={{ padding: 12 }}
          renderItem={({ item: msg }) => {
            if (msg.type === "system") {
              return (
                <View style={styles.systemMsg}>
                  <Text style={styles.systemText}>{msg.content}</Text>
                </View>
              );
            }
            const isMe = msg.sender === userName;
            return (
              <View style={[styles.msgRow, isMe && styles.msgRowMe]}>
                {!isMe && <Text style={styles.sender}>{msg.sender}</Text>}
                <View style={[styles.bubble, isMe && styles.bubbleMe]}>
                  <Text style={styles.bubbleText}>{msg.content}</Text>
                </View>
              </View>
            );
          }}
        />

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  nameContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32 },
  nameTitle: { fontSize: 24, fontWeight: "700", color: "#333", marginBottom: 8 },
  nameSub: { fontSize: 14, color: "#888", marginBottom: 24 },
  nameInput: {
    width: "100%", borderWidth: 1, borderColor: "#e0e0e0",
    borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 16,
  },
  nameBtn: {
    width: "100%", backgroundColor: "#b39ddb",
    borderRadius: 12, padding: 14, alignItems: "center",
  },
  nameBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  roomBar: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: "#fff" },
  roomChip: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20, backgroundColor: "#f5f5f5", marginRight: 8,
  },
  roomChipActive: { backgroundColor: "#b39ddb" },
  roomChipText: { fontSize: 12, color: "#666" },
  roomChipTextActive: { color: "#fff", fontWeight: "600" },
  status: { fontSize: 11, color: "#aaa", textAlign: "center", paddingVertical: 4 },
  systemMsg: { alignItems: "center", marginVertical: 4 },
  systemText: { fontSize: 11, color: "#aaa", backgroundColor: "#f0f0f0", paddingHorizontal: 12, paddingVertical: 3, borderRadius: 10 },
  msgRow: { marginBottom: 8, alignItems: "flex-start" },
  msgRowMe: { alignItems: "flex-end" },
  sender: { fontSize: 11, color: "#aaa", marginBottom: 2, marginLeft: 4 },
  bubble: { backgroundColor: "#f0f0f0", borderRadius: 18, padding: 12, maxWidth: "75%" },
  bubbleMe: { backgroundColor: "#b39ddb" },
  bubbleText: { fontSize: 14, color: "#333" },
  inputRow: {
    flexDirection: "row", padding: 12, gap: 8,
    backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#f0f0f0",
  },
  input: {
    flex: 1, borderWidth: 1, borderColor: "#e0e0e0",
    borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14,
  },
  sendBtn: { backgroundColor: "#b39ddb", borderRadius: 24, paddingHorizontal: 20, justifyContent: "center" },
  sendText: { color: "#fff", fontWeight: "700" },
});