import { HapticTab } from "@/components/haptic-tab";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          height: 80,
          paddingBottom: 2,
          paddingTop: 2,
          backgroundColor: "#121212",
          elevation: 10,
          borderTopWidth: 1,
          borderColor: "#2f2f2f",
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
        animation: "shift",
        tabBarButton: (props) => <HapticTab {...props} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="home" size={focused ? 26 : 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calculator-screen"
        options={{
          title: "페이",

          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name="barcode-outline"
              size={focused ? 26 : 22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet-screen"
        options={{
          title: "지갑",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="wallet" size={focused ? 26 : 22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings-screen"
        options={{
          title: "설정",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="settings" size={focused ? 26 : 22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
