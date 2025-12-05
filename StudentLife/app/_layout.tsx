import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import {useColorScheme} from "react-native";

export default function TabLayout() {

  const colorScheme = useColorScheme();
  const themeTextStyle = colorScheme === 'light' ? '#11181C' : '#ECEDEE';
  const themeContainerStyle = colorScheme === 'light' ? '#fff' : '#151718';

  return (
    //sets the color for the tab bar and nav bar.
    //THIS TOOK FOREVER TO FIGURE OUT. IDK WHY IT TOOK ME SO LONG TO FIGURE OUT HOW TO CHANGE THE FUCKING COLOR OF THE TOP AND BOTTOM BARS
    <Tabs screenOptions={{ 
            tabBarActiveTintColor: 'blue', 
            tabBarStyle: {
              backgroundColor: themeContainerStyle
            },
            headerStyle: {
              backgroundColor: themeContainerStyle,
            },
            headerTitleStyle: {
              color: themeTextStyle
            },
            animation: 'shift'

          }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name = "events"
        options = {{
          title: 'Events',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="star" color={color} />,
        }}
      />
      <Tabs.Screen
        name = "finance"
        options = {{
          title: 'Finance',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="dollar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="AI"
        options={{
          title: 'AI Helper',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="check-square-o" color={color} />,
        }}
      />      
      <Tabs.Screen
        name = "settings"
        options = {{
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
