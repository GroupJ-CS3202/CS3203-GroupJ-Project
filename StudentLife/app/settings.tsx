import { useState } from "react";
import { View, Text, Switch, TouchableOpacity, ScrollView } from "react-native";

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const placeholderPress = (label: string) => {
    alert(`${label} placeholder – feature not implemented yet`);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "white" }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* HEADER */}
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
        Settings
      </Text>

      {/* Everything else stays the same… */}


      {/* PROFILE SECTION ---------------------------------------------------- */}
      <Text style={{ fontSize: 16, fontWeight: "600", color: "#444", marginBottom: 10 }}>
        Profile
      </Text>

      <TouchableOpacity
        style={{
          paddingVertical: 12,
          borderBottomColor: "#ddd",
          borderBottomWidth: 1,
        }}
        onPress={() => placeholderPress("Edit Profile")}
      >
        <Text style={{ fontSize: 18 }}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          paddingVertical: 12,
          borderBottomColor: "#ddd",
          borderBottomWidth: 1,
        }}
        onPress={() => placeholderPress("Change Password")}
      >
        <Text style={{ fontSize: 18 }}>Change Password</Text>
      </TouchableOpacity>

      {/* APP PREFERENCES ---------------------------------------------------- */}
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: "#444",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        App Preferences
      </Text>

      {/* DARK MODE */}
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

      {/* NOTIFICATIONS */}
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

      {/* PRIVACY & SECURITY ------------------------------------------------ */}
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: "#444",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        Privacy & Security
      </Text>

      <TouchableOpacity
        style={{
          paddingVertical: 12,
          borderBottomColor: "#ddd",
          borderBottomWidth: 1,
        }}
        onPress={() => placeholderPress("Permissions")}
      >
        <Text style={{ fontSize: 18 }}>Permissions</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          paddingVertical: 12,
          borderBottomColor: "#ddd",
          borderBottomWidth: 1,
        }}
        onPress={() => placeholderPress("Data Usage")}
      >
        <Text style={{ fontSize: 18 }}>Data Usage</Text>
      </TouchableOpacity>

      {/* ABOUT ------------------------------------------------------------- */}
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: "#444",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        About
      </Text>

      <TouchableOpacity
        style={{
          paddingVertical: 12,
          borderBottomColor: "#ddd",
          borderBottomWidth: 1,
        }}
        onPress={() => placeholderPress("About App")}
      >
        <Text style={{ fontSize: 18 }}>About This App</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          paddingVertical: 12,
          borderBottomColor: "#ddd",
          borderBottomWidth: 1,
        }}
        onPress={() => placeholderPress("Contact Support")}
      >
        <Text style={{ fontSize: 18 }}>Contact Support</Text>
      </TouchableOpacity>

      {/* LOG OUT BUTTON ---------------------------------------------------- */}
      <TouchableOpacity
        style={{
          marginTop: 30,
          padding: 15,
          backgroundColor: "#e74c3c",
          borderRadius: 8,
          alignItems: "center",
        }}
        onPress={() => placeholderPress("Log Out")}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
          Log Out
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
