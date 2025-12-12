import { View, Text, ScrollView, Appearance, useColorScheme, StyleSheet} from "react-native";
import {StatusBar} from 'expo-status-bar';
import { getStoredUserName } from "@/services/userService";
import { useEffect, useState } from "react";
import { createPromptForSummary, callAiFromString } from "@/services/azureService";
import { BackendEvent } from "@/services/sqlFetchService";


export default function HomeScreen() {
  const userName = getStoredUserName(); // placeholder — replace with actual user later

  //You will see this everywhere for now. This determines whether elements will be displayed in light or dark mode.
  const colorScheme = useColorScheme();
  const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

   const [summary, setSummary] = useState<string>("Loading summary...");
   const [events, setEvents] = useState<BackendEvent[]>([]);

    useEffect(() => {
    let cancelled = false;

    const loadSummary = async () => {
      try {
        const prompt = await createPromptForSummary();
        const aiSummary = await callAiFromString(prompt);
        if (!cancelled) setSummary(aiSummary);
      } catch (err: any) {
        if (!cancelled) setSummary(err?.message ?? "Failed to load summary.");
      }
    };

    loadSummary();

    return () => {
      cancelled = true;
    };
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
          <View style={[styles.container, themeContainerStyle]}>
            <Text style={[styles.headerText, themeTextStyle]}>
              AI Overview
            </Text>
            <Text style={[styles.text, themeTextStyle]}>
              {summary}
            </Text>
          </View>
          
          <Text style={[styles.eventText, themeTextStyle]}>
            Upcomming Events
          </Text>

          <ScrollView style={[styles.scrollView, themeContainerStyle]}>
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