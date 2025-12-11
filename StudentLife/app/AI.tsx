import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ListRenderItem,   // ⬅ import this
} from "react-native";
import { callAi } from "../services/azureService";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hey! Ask me anything and I'll answer using the Azure model.",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList<Message> | null>(null);

    const handleSend = async () => {
    const trimmed = inputText.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString() + "-user",
      role: "user",
      content: trimmed,
    };

    // optimistic update in UI
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText("");
    setIsLoading(true);

    try {
      // ✅ send full history to backend
      const replyText = await callAi(newMessages);

      const botMessage: Message = {
        id: Date.now().toString() + "-assistant",
        role: "assistant",
        content: replyText,
      };

      setMessages((prev) => [...prev, botMessage]);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 50);
    } catch (err: any) {
      const errorMessage: Message = {
        id: Date.now().toString() + "-error",
        role: "assistant",
        content:
          "Sorry, something went wrong talking to the server. Try again in a bit.",
      };
      console.log("callApi failed", err?.message);
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  const renderItem: ListRenderItem<Message> = ({ item }) => {
    const isUser = item.role === "user";
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.messageUser : styles.messageAssistant,
        ]}
      >
        <Text style={styles.messageText}>{item.content}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={styles.chatContainer}>
        <FlatList<Message>   
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />
      </View>

      {isLoading && (
        <View style={styles.loadingBar}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Thinking...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={isLoading}
        >
          <Text style={styles.sendButtonText}>
            {isLoading ? "..." : "Send"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  messagesList: {
    paddingBottom: 8,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 12,
    marginVertical: 4,
  },
  messageUser: {
    alignSelf: "flex-end",
    backgroundColor: "#2563eb", // blue-ish
  },
  messageAssistant: {
    alignSelf: "flex-start",
    backgroundColor: "#27272a", // dark gray
  },
  messageText: {
    color: "#f9fafb",
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#27272a",
    backgroundColor: "#18181b",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#09090b",
    color: "#f9fafb",
    borderRadius: 8,
  },
  sendButton: {
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#22c55e",
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: "#0b1120",
    fontWeight: "600",
  },
  loadingBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 4,
    gap: 6,
  },
  loadingText: {
    color: "#a1a1aa",
    fontSize: 13,
  },
});
