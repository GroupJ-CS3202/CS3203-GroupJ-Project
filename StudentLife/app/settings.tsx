import { useState } from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";

export default function SettingsScreen() 
{
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "white" }}>
      {/* HEADER */}
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
        Settings
      </Text>

      {/* SECTION TITLE */}
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: "#444",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        App Preferences
      </Text>

      {/* DARK MODE TOGGLE */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 12,
        }}
      >
        <Text style={{ fontSize: 18 }}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      {/* NOTIFICATION TOGGLE */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 12,
        }}
      >
        <Text style={{ fontSize: 18 }}>Notifications</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>

      {/* LOG OUT BUTTON */}
      <TouchableOpacity
        style={{
          marginTop: 40,
          padding: 15,
          backgroundColor: "#e74c3c",
          borderRadius: 8,
          alignItems: "center",
        }}
        onPress={() => alert("Logged out!")}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
          Log Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}
