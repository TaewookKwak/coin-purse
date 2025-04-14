import React, { useState } from "react";
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
import ConfirmModal from "@/components/ui/confirm-modal";
import { router } from "expo-router";
export default function SettingsScreen() {
  const { wallet } = useWalletStore();
  const [selectedCountry, setSelectedCountry] = useState(wallet.country);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleConfirm = () => {
    const defaultCoins = currencies[selectedCountry].coins.map((denom) => ({
      denomination: denom.denomination,
      quantity: 0,
      image: denom.image,
    }));

    useWalletStore.setState(() => ({
      wallet: {
        country: selectedCountry,
        coins: defaultCoins,
      },
    }));

    setShowConfirmModal(false);

    setTimeout(() => {
      router.replace("/");
    }, 300);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>국가/화폐 선택</Text>

        <FlatList
          data={Object.keys(currencies)}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isSelected = selectedCountry === item;
            return (
              <TouchableOpacity
                style={[styles.item, isSelected && styles.itemSelected]}
                onPress={() => setSelectedCountry(item)}
              >
                <Text
                  style={[
                    styles.itemText,
                    isSelected && styles.itemTextSelected,
                  ]}
                >
                  {currencies[item].flag} - {currencies[item].name}
                </Text>

                {/* 현재 세팅 국가 */}
                {wallet.country === item && (
                  <Text style={styles.currentCountry}>사용중</Text>
                )}
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 120 }}
        />

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={[
              styles.button,
              selectedCountry === wallet.country && styles.buttonDisabled,
            ]}
            disabled={selectedCountry === wallet.country}
            onPress={() => setShowConfirmModal(true)}
          >
            <Text style={styles.buttonText}>변경하기</Text>
          </TouchableOpacity>
        </View>

        <ConfirmModal
          visible={showConfirmModal}
          title="이 국가 설정으로 변경할까요?"
          confirmText="변경"
          cancelText="취소"
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={handleConfirm}
        >
          <Text style={{ color: "#ccc", textAlign: "center", fontSize: 16 }}>
            선택한 국가는 {currencies[selectedCountry].flag}
            {currencies[selectedCountry].name} 입니다.
          </Text>
        </ConfirmModal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  item: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#1f1f1f",
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemSelected: {
    backgroundColor: "#1e3a8a",
  },
  itemText: {
    fontSize: 16,
    color: "#ccc",
  },
  itemTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  currentCountry: {
    fontSize: 12,
    color: "#ccc",
    marginTop: 4,
  },
  buttonWrapper: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
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
  buttonDisabled: {
    backgroundColor: "#333",
    opacity: 0.5,
  },
});
