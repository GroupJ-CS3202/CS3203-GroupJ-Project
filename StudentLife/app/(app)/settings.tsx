import { useState } from "react";
import { View, Text, Switch, TouchableOpacity, ScrollView, Appearance, useColorScheme} from "react-native";
import { useSession } from '../../ctx';

export default function SettingsScreen() {

    const colorScheme = useColorScheme();
    const themeTextStyle = colorScheme === 'light' ? '#11181C' : '#ECEDEE';
    const themeContainerStyle = colorScheme === 'light' ? '#fff' : '#151718';

  const [notifications, setNotifications] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const placeholderPress = (label: string) => {
    alert(`${label} placeholder – feature not implemented yet`);
  };

  //changes color scheme to dark or light mode, depending on state of dark mode switch. I am very happy with this thing, but, it needs some fixing.
  const setDarkMode = () => {
    setIsDarkMode(previousState => !previousState);
    if(isDarkMode === false) {
      Appearance.setColorScheme('dark');
    }
    else {
      Appearance.setColorScheme('light')
    }
  }

  const { signOut } = useSession();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: themeContainerStyle }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* HEADER */}
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20, color:themeTextStyle }}>
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
        <Text style={{ fontSize: 18, color:themeTextStyle}}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          paddingVertical: 12,
          borderBottomColor: "#ddd",
          borderBottomWidth: 1,
        }}
        onPress={() => placeholderPress("Change Password")}
      >
        <Text style={{ fontSize: 18, color:themeTextStyle}}>Change Password</Text>
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
        <Text style={{ fontSize: 18, color:themeTextStyle}}>Dark Mode</Text>
        <Switch onValueChange={setDarkMode} value={isDarkMode}/>
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
        <Text style={{ fontSize: 18, color:themeTextStyle }}>Notifications</Text>
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
        <Text style={{ fontSize: 18, color:themeTextStyle}}>Permissions</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          paddingVertical: 12,
          borderBottomColor: "#ddd",
          borderBottomWidth: 1,
        }}
        onPress={() => placeholderPress("Data Usage")}
      >
        <Text style={{ fontSize: 18, color:themeTextStyle }}>Data Usage</Text>
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
        <Text style={{ fontSize: 18, color:themeTextStyle}}>About This App</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          paddingVertical: 12,
          borderBottomColor: "#ddd",
          borderBottomWidth: 1,
        }}
        onPress={() => placeholderPress("Contact Support")}
      >
        <Text style={{ fontSize: 18, color:themeTextStyle}}>Contact Support</Text>
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
        onPress={() => {signOut();}}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
          Log Out
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
