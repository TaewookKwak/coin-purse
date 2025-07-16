import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useWalletStore } from "@/stores/wallet-store";
import { currencies } from "@/constants/currencies";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

export default function SettingsScreen() {
  const wallet = useWalletStore((state) => state.wallet);
  const router = useRouter();

  const menuItems = [
    {
      id: "currency",
      title: "국가/화폐 선택",
      subtitle: `${currencies[wallet.country].flag} ${
        currencies[wallet.country].name
      }`,
      icon: "globe" as const,
      route: "/(modals)/currency-modal" as const,
    },
    {
      id: "reset",
      title: "데이터 초기화",
      subtitle: "지갑 및 내역 데이터 리셋",
      icon: "trash" as const,
      route: "/(modals)/reset-modal" as const,
    },
    {
      id: "info",
      title: "앱 정보",
      subtitle: "버전 및 개발자 정보",
      icon: "info-with-circle" as const,
      route: "/(modals)/info-modal" as const,
    },
  ];

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Text style={styles.title}>설정</Text>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  <Entypo name={item.icon} size={20} color="#1e3a8a" />
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Entypo name="chevron-small-right" size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: "#121212",
  },
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 32,
  },
  menuContainer: {
    gap: 12,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#1f1f1f",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1e3a8a20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
});
