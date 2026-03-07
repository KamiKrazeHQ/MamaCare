// App.js
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";

import HomeScreen from "./screens/HomeScreen";
import ChatScreen from "./screens/ChatScreen";
import CalendarScreen from "./screens/CalendarScreen";
import JobsScreen from "./screens/JobsScreen";
import GroceriesScreen from "./screens/GroceriesScreen";
import DoctorScreen from "./screens/DoctorScreen";

const Tab = createBottomTabNavigator();

const TABS = [
  { name: "Home",      component: HomeScreen,      icon: "🏠" },
  { name: "Chat",      component: ChatScreen,       icon: "💬" },
  { name: "Calendar",  component: CalendarScreen,   icon: "📅" },
  { name: "Jobs",      component: JobsScreen,       icon: "💼" },
  { name: "Groceries", component: GroceriesScreen,  icon: "🛒" },
  { name: "Doctor",    component: DoctorScreen,     icon: "👩‍⚕️" },
];

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            const tab = TABS.find(t => t.name === route.name);
            return <Text style={{ fontSize: focused ? 22 : 18 }}>{tab?.icon}</Text>;
          },
          tabBarActiveTintColor: "#b39ddb",
          tabBarInactiveTintColor: "#aaa",
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopColor: "#f0f0f0",
            paddingBottom: 6,
            paddingTop: 4,
            height: 60,
          },
          tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { color: "#333", fontWeight: "700" },
          headerShadowVisible: false,
        })}
      >
        {TABS.map(tab => (
          <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}