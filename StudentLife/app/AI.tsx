import { View, Text } from "react-native";
import React, {useState, useRef} from "react";

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    {
      id:"welcome", 
      role: "assistant", 
      content: "Hey! Ask me anything about your schedule or other school related activities!"
    },
  ]);
  
  
  
  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <Text style={{ fontSize: 24 }}>AI Helper Screen</Text>

    </View>
  );
}
