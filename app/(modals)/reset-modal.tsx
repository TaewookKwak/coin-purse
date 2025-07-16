import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useWalletStore } from "@/stores/wallet-store";
import ConfirmModal from "@/components/ui/confirm-modal";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

export default function ResetModal() {
  const wallet = useWalletStore((state) => state.wallet);
  const resetWallet = useWalletStore((state) => state.resetWallet);
  const resetHistory = useWalletStore((state) => state.resetHistory);
  const [showWalletResetModal, setShowWalletResetModal] = useState(false);
  const [showHistoryResetModal, setShowHistoryResetModal] = useState(false);
  const [showAllResetModal, setShowAllResetModal] = useState(false);
  const router = useRouter();

  const handleWalletReset = () => {
    resetWallet();
    setShowWalletResetModal(false);
    setTimeout(() => {
      router.back();
    }, 300);
  };

  const handleHistoryReset = () => {
    resetHistory();
    setShowHistoryResetModal(false);
    setTimeout(() => {
      router.back();
    }, 300);
  };

  const handleAllReset = () => {
    resetWallet();
    resetHistory();
    setShowAllResetModal(false);
    setTimeout(() => {
      router.back();
    }, 300);
  };

  const resetOptions = [
    {
      id: "wallet",
      title: "지갑 데이터 초기화",
      subtitle: "현재 화폐의 동전 개수만 초기화",
      icon: "wallet" as const,
      color: "#ef4444",
      onPress: () => setShowWalletResetModal(true),
    },
    {
      id: "history",
      title: "내역 데이터 초기화",
      subtitle: "현재 화폐의 사용 내역만 초기화",
      icon: "trash" as const,
      color: "#f59e0b",
      onPress: () => setShowHistoryResetModal(true),
    },
    {
      id: "all",
      title: "모든 데이터 초기화",
      subtitle: "지갑과 내역 모두 초기화",
      icon: "warning" as const,
      color: "#dc2626",
      onPress: () => setShowAllResetModal(true),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Entypo name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>데이터 초기화</Text>
      </View>

      <Text style={styles.subtitle}>
        현재 화폐({wallet.country})의 데이터를 초기화할 수 있습니다.
      </Text>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 12 }}
      >
        {resetOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.optionItem}
            onPress={option.onPress}
          >
            <View style={styles.optionLeft}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${option.color}20` },
                ]}
              >
                <Entypo name={option.icon} size={20} color={option.color} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
              </View>
            </View>
            <Entypo name="chevron-small-right" size={20} color="#666" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 지갑 초기화 모달 */}
      <ConfirmModal
        visible={showWalletResetModal}
        title="지갑 데이터를 초기화하시겠습니까?"
        confirmText="초기화"
        cancelText="취소"
        onCancel={() => setShowWalletResetModal(false)}
        onConfirm={handleWalletReset}
      >
        <Text style={{ color: "#ccc", textAlign: "center", fontSize: 16 }}>
          현재 화폐의 모든 동전 개수가 0으로 초기화됩니다.
        </Text>
      </ConfirmModal>

      {/* 내역 초기화 모달 */}
      <ConfirmModal
        visible={showHistoryResetModal}
        title="내역 데이터를 초기화하시겠습니까?"
        confirmText="초기화"
        cancelText="취소"
        onCancel={() => setShowHistoryResetModal(false)}
        onConfirm={handleHistoryReset}
      >
        <Text style={{ color: "#ccc", textAlign: "center", fontSize: 16 }}>
          현재 화폐의 모든 사용 내역이 삭제됩니다.
        </Text>
      </ConfirmModal>

      {/* 모든 데이터 초기화 모달 */}
      <ConfirmModal
        visible={showAllResetModal}
        title="모든 데이터를 초기화하시겠습니까?"
        confirmText="초기화"
        cancelText="취소"
        onCancel={() => setShowAllResetModal(false)}
        onConfirm={handleAllReset}
      >
        <Text style={{ color: "#ccc", textAlign: "center", fontSize: 16 }}>
          현재 화폐의 동전 개수와 사용 내역이 모두 초기화됩니다.
          {"\n"}이 작업은 되돌릴 수 없습니다.
        </Text>
      </ConfirmModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1f1f1f",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 12,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#1f1f1f",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  optionSubtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
});
