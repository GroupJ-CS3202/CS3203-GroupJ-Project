import { View, Text, useColorScheme, StyleSheet, ScrollView} from "react-native";

export default function SettingsScreen() {
  const colorScheme = useColorScheme();

  const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  //placeholder campus events
  const events = ["CS/ECE Game Night", "OU Football Vs. Alabama Crimson Tide", "Christmas Carol @ University Theater"];


  return (
    <View
      style={[styles.contentContainer, themeContainerStyle]}
    >
      <Text style={[styles.titleText, themeTextStyle]}>Campus Events</Text>
        <ScrollView style={[styles.scrollView, themeContainerStyle]}>
          {events.map((event, index) => (
            <Text
              key={index}
              style={[styles.headerText, themeTextStyle]}
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
