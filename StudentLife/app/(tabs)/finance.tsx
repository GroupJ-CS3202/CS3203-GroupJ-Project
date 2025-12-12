import { View, Text, StyleSheet, useColorScheme, Button} from "react-native";
import {useState} from 'react';

export default function SettingsScreen() {
    const userName = "User"; // placeholder — replace with actual user later
    const income = 5000; // placeholder
    const [expenses, setExpenses] = useState(); //total expenses value. can be modified with button press.

    const colorScheme = useColorScheme();
  
    const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
    const themeContainerStyle = colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  return (
    <View
      style={[styles.pageContainer, themeContainerStyle]}
    >
      <Text style={[styles.titleText, themeTextStyle]}>{userName}'s Budget</Text>
      <View style={[styles.container, themeContainerStyle]}>
        <Text style={[styles.headerText, themeTextStyle]}>Spending Money: $</Text>
        <Button title="+ Add Spending Money"></Button>
      </View>
      
      <View style={[styles.container, themeContainerStyle]}>
        <Text style={[styles.headerText, themeTextStyle]}>Monthly Income: ${income}</Text>
        <Text style={[styles.headerText, themeTextStyle]}>Income Breakdown:</Text>
        <Button title="+ Add Income"></Button>
      </View>
      <View style={[styles.container, themeContainerStyle]}>
        <Text style={[styles.headerText, themeTextStyle]}>Monthly Expenses:</Text>
        <Text style={[styles.headerText, themeTextStyle]}>Expenses Breakdown:</Text>
        <Button title="+ Add Expenses"></Button>
      </View>
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