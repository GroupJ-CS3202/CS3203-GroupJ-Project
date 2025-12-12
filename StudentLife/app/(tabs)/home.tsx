import { View, Text, ScrollView, Appearance, useColorScheme, StyleSheet} from "react-native";
import {StatusBar} from 'expo-status-bar';
import { getStoredUserName } from "@/services/userService";
import { useEffect, useState } from "react";
import { createPromptForSummary, callAiFromString } from "@/services/azureService";
import { BackendEvent } from "@/services/sqlFetchService";
import { getEventsInRange } from "@/services/sqlFetchService";

export default function HomeScreen() {
  const userName = getStoredUserName(); // placeholder — replace with actual user later

  //You will see this everywhere for now. This determines whether elements will be displayed in light or dark mode.
  const colorScheme = useColorScheme();
  const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

   const [summary, setSummary] = useState<string>("Loading summary...");
   const [events, setEvents] = useState<BackendEvent[]>([]);
   const [loadingEvents, setLoadingEvents] = useState(true);
  

  useEffect(() => {
    async function loadEventsAndSummary() {
      try {
        // 1. Create summarization prompt
        const prompt = await createPromptForSummary();

        // 2. Get AI summary
        const aiSummary = await callAiFromString(prompt);
        setSummary(aiSummary);

        // 3. Load real events
        const start = new Date();
        start.setDate(start.getDate() - 1);
        const end = new Date();
        end.setDate(end.getDate() + 10);

        const result = await getEventsInRange(start, end);
        setEvents(result.events);
      } catch (err) {
        console.error(err);
        setSummary("Unable to load event summary.");
      } finally {
        setLoadingEvents(false);
      }
    }

    loadEventsAndSummary();
  }, []);
  

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
                <Text style={[styles.text, themeTextStyle]}>
                  News and other relevant info goes here.
                </Text>
            </View>
          </View>

          {/* AI OVERVIEW --------------------------------------------------- */}
          <Text style={[styles.eventText, themeTextStyle]}>
            AI Overview
          </Text>
          <View style={[styles.container, themeContainerStyle]}>
            <Text style={[styles.text, themeTextStyle]}>
              {summary}
            </Text>
          </View>
          
          {/* EVENTS LIST --------------------------------------------------- */}
          <Text style={[styles.eventText, themeTextStyle]}>
            Upcoming Events
          </Text>

          <ScrollView style={[styles.scrollView, themeContainerStyle]}>
            {events.length > 0 ? (
              events.map((event, index) => (
                <Text key={index} style={[styles.text, themeTextStyle]}>
                  • {event.title}
                </Text>
              ))
            ) : (
              <Text style={[styles.text, themeTextStyle]}>
                {loadingEvents ? "Loading events..." : "No events available."}
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
      <StatusBar />
    </View>
  );
}

//You will also see this everywhere. This is the stylesheet for all of the main UI elements. this is WIP and needs to be moved to theme.ts file.
//CSS is fun sometimes
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
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 15
  },
  centerTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  scrollView: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    margin: 10
  },
  titleText: {
    fontSize: 35,
    margin: 10,
    padding: 10,
    fontWeight: "bold"
  },
  headerText: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: "bold"
  },
  eventText: {
    fontSize: 25,
    marginBottom: 10,
    fontWeight: "bold",
    marginLeft: 10
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  lightContainer: {
    backgroundColor: '#fff',
    borderColor: '#151718'
  },
  darkContainer: {
    backgroundColor: '#151718',
    borderColor: '#ECEDEE',
  },
  lightThemeText: {
    color: '#11181C',
  },
  darkThemeText: {
    color: '#ECEDEE',
  },
});

//formerly used styles that need to be re-implemented.
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