import RollingNumber from "@/components/rolling-number";
import { currencies } from "@/constants/currencies";
import { useWalletStore } from "@/stores/wallet-store";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router"; // expo-router용
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Config from "react-native-config";

export default function HomeScreen() {
  const { wallet } = useWalletStore();
  const router = useRouter();

  const total = wallet.coins.reduce(
    (sum, c) => sum + c.denomination * c.quantity,
    0
  );
  const symbol = getCurrencySymbol(wallet.country);
  const currency = currencies[wallet.country];
  console.log("🔑 CodePush Key:", Config.CODEPUSH_KEY);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Text style={styles.greeting}>
          동전 지갑{" "}
          {Config.ENV !== "prod"
            ? `(${Config.ENV}, ${Config.CODEPUSH_KEY})`
            : ""}
        </Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.label}>현재 보유한 잔돈</Text>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => router.push("/history-modal")}
            >
              <Text style={styles.editBtnText}>이용내역</Text>
              <Entypo name="chevron-small-right" size={20} color="#aaa" />
            </TouchableOpacity>
          </View>

          <RollingNumber
            value={total}
            duration={1000}
            fontSize={36}
            color="#fff"
            currencySymbol={symbol}
            showComma={true}
          />
          <Text style={styles.sub}>
            {currencies[wallet.country].flag} {wallet.country}-
            {currencies[wallet.country].name}
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/wallet-screen")}
            >
              <Text style={styles.buttonText}>잔돈 입력하기</Text>
            </TouchableOpacity>
          </View>
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
    padding: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 32,
  },
  card: {
    backgroundColor: "#1f1f1f",
    padding: 24,
    borderRadius: 16,
    marginBottom: 36,
  },
  label: {
    color: "#fff",
    fontSize: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  editBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  editBtnText: {
    color: "#aaa",
    fontSize: 14,
  },

  amount: {
    fontSize: 36,
    color: "#fff",
    fontWeight: "bold",
  },
  sub: {
    color: "#888",
    fontSize: 16,
    marginTop: 8,
  },

  buttonContainer: {
    marginTop: 40,
  },
  button: {
    backgroundColor: "#1e3a8a",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
