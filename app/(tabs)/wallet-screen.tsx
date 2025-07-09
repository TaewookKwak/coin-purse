import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useWalletStore } from "@/stores/wallet-store";
import { currencies } from "@/constants/currencies";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import { Image } from "expo-image";
import RollingNumber from "@/components/rolling-number";

export default function WalletScreen() {
  const { wallet, addCoin } = useWalletStore();
  const { country, coins } = wallet;

  const coinList = currencies[country].coins;

  const getCoinQuantity = (denom: number) => {
    return coins.find((c) => c.denomination === denom)?.quantity || 0;
  };

  const getTotal = () =>
    coins.reduce((sum, c) => sum + c.denomination * c.quantity, 0);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Text style={styles.title}>나의 지갑 속 잔돈</Text>

        <RollingNumber
          value={getTotal()}
          duration={1000}
          fontSize={36}
          color="#fff"
          currencySymbol={getCurrencySymbol(country)}
          showComma={true}
        />

        <FlatList
          data={coinList}
          keyExtractor={(item) => `${item.denomination}-${item.image}`}
          renderItem={({ item }) => (
            <View style={styles.list}>
              <View style={styles.coinItem}>
                <Image
                  source={item.image}
                  style={styles.coinImage}
                  contentFit="contain"
                  transition={300}
                />
                <Text style={styles.denom}>
                  {item.denomination}
                  {getCurrencySymbol(country)}
                </Text>
              </View>
              <View style={styles.counter}>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => {
                    if (getCoinQuantity(item.denomination) > 0) {
                      addCoin(item.denomination, -1);
                    }
                  }}
                >
                  <Text style={styles.btnText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.qty}>
                  {getCoinQuantity(item.denomination)}개
                </Text>

                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => addCoin(item.denomination, 1)}
                >
                  <Text style={styles.btnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: "#333" }} />
          )}
          contentContainerStyle={{ paddingVertical: 24 }}
        />
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
    marginBottom: 20,
  },
  total: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 12,
  },
  list: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  coinItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 12,
  },
  denom: {
    fontSize: 20,
    color: "#eee",
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  btn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1e3a8a",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 20,
  },
  qty: {
    color: "#fff",
    fontSize: 18,
    minWidth: 40,
    textAlign: "center",
  },
  coinImage: {
    width: 36,
    height: 36,
  },
});
