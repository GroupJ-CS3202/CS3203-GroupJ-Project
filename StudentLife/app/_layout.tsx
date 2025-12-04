import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
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
