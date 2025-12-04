import { View, Text, ScrollView } from "react-native";

export default function HomeScreen() {
  const userName = "User"; // placeholder — replace with actual user later

  // Placeholder events
  const events = ["Meeting at 3 PM", "Project deadline", "Team standup"];

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {/* MAIN LAYOUT: Left content + right sidebar */}
      <View style={{ flexDirection: "row", flex: 1 }}>
        {/* LEFT SIDE ------------------------------------------------------ */}
        <View style={{ flex: 1, padding: 20 }}>
          {/* WELCOME TEXT */}
          <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
            Welcome {userName}
          </Text>

          {/* MAIN EMPTY WINDOW (placeholder box) */}
          <View
            style={{
              flex: 1,
              borderWidth: 2,
              borderColor: "#999",
              borderRadius: 10,
              marginBottom: 20,
              backgroundColor: "#f9f9f9",
            }}
          >
            {/* Empty for now */}
          </View>

          {/* AI OVERVIEW --------------------------------------------------- */}
          <View
            style={{
              padding: 15,
              borderWidth: 2,
              borderColor: "#999",
              borderRadius: 10,
              marginBottom: 20,
              backgroundColor: "#f1f7ff",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 10 }}>
              AI Overview
            </Text>
            <Text style={{ fontSize: 16, color: "#555" }}>
              AI summary for the week will appear here.
              {"\n"}(Placeholder content for now.)
            </Text>
          </View>
        </View>

        {/* RIGHT SIDEBAR: EVENTS ------------------------------------------ */}
        <View
          style={{
            width: '50%', // replaced width with a percentage value to allow for better scaling on different devices
            borderLeftWidth: 2,
            borderColor: "#aaa",
            padding: 10,
            backgroundColor: "#fafafa",
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
            Events
          </Text>

          <ScrollView>
            {events.map((event, index) => (
              <Text
                key={index}
                style={{
                  fontSize: 16,
                  marginBottom: 8,
                }}
              >
                • {event}
              </Text>
            ))}

            {/* If no events */}
            {events.length === 0 && (
              <Text style={{ color: "#777" }}>No events yet.</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
