import { View, Text, ScrollView, Appearance, useColorScheme, StyleSheet} from "react-native";
import {StatusBar} from 'expo-status-bar';

export default function HomeScreen() {
  const userName = "User"; // placeholder — replace with actual user later

  const colorScheme = useColorScheme();

  const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  // Placeholder events
  const events = ["Meeting at 3 PM", "Project deadline", "Team standup"];

  return (
    <View style={[styles.pageContainer, themeContainerStyle]}>
      {/* MAIN LAYOUT: Left content + right sidebar */}
      <View style={[styles.contentContainer, themeContainerStyle]}>
        {/* LEFT SIDE ------------------------------------------------------ */}
        <View style={[styles.contentContainer, themeContainerStyle]}>
          {/* WELCOME TEXT */}
          <Text style={[styles.titleText, themeTextStyle]}>
            Welcome, {userName}
          </Text>

          {/* MAIN WINDOW (potential bulletin board box) */}
          <View
            style={[styles.container, themeContainerStyle]}
          >
            {/* Bulletin title text */}
            <View style={[styles.centerTextContainer, themeContainerStyle]}> 
                <Text style={[styles.headerText, themeTextStyle]}>
                  Bulletin
                </Text>
            </View>
          </View>

          {/* AI OVERVIEW --------------------------------------------------- */}
          <View style={[styles.container, themeContainerStyle]}>
            <Text style={[styles.headerText, themeTextStyle]}>
              AI Overview
            </Text>
            <Text style={[styles.text, themeTextStyle]}>
              AI summary for the week will appear here.
              {"\n"}(Placeholder content for now.)
            </Text>
          </View>
          
          <Text style={[styles.eventText, themeTextStyle]}>
            Upcomming Events
          </Text>

          <ScrollView style={[styles.scrollView, themeContainerStyle]}>
            {events.map((event, index) => (
              <Text
                key={index}
                style={[styles.text, themeTextStyle]}
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
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
  },
  contentContainer:{ 
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    margin: 15
  },
  centerTextContainer: {
    alignContent: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 15,
    margin: 10
  },
  titleText: {
    fontSize: 35,
    margin: 10,
    padding: 10,
    fontWeight: "600"
  },
  headerText: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: "600"
  },
  eventText: {
    fontSize: 25,
    marginBottom: 10,
    fontWeight: "600",
    marginLeft: 10
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  lightContainer: {
    backgroundColor: '#f9f9f9',
  },
  darkContainer: {
    backgroundColor: '#222021',
    borderColor: '#f9f9f9',
  },
  lightThemeText: {
    color: '#222021',
  },
  darkThemeText: {
    color: '#f9f9f9',
  },
});


/*
            style={{
              flex: 1,
              borderWidth: 2,
              borderColor: "#999",
              borderRadius: 10,
              marginBottom: 20,
              backgroundColor: "#f9f9f9",
            }}

            style={{
              padding: 15,
              borderWidth: 2,
              borderColor: "#999",
              borderRadius: 10,
              marginBottom: 20,
              backgroundColor: "#f1f7ff",
            }}


            style={{ fontSize: 20, fontWeight: "600", marginBottom: 10 }}
            { fontSize: 16, color: "#555" }
            style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}
            {fontSize: 16, marginBottom: 8,}
*/