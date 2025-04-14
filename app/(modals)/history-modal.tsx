// app/history-screen.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useWalletStore } from "@/stores/wallet-store";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import { Image } from "expo-image";
import ConfirmModal from "@/components/ui/confirm-modal";

const SORT_OPTIONS = {
  RECENT: "최신순",
  OLDEST: "오래된순",
} as const;

const FILTER_OPTIONS = ["전체", "7일", "30일"];

export default function HistoryModal() {
  const { wallet, history, loadHistory, resetHistory } = useWalletStore();

  console.log("history", history);
  const symbol = getCurrencySymbol(wallet.country);
  const [sortOrder, setSortOrder] =
    useState<keyof typeof SORT_OPTIONS>("RECENT");
  const [filter, setFilter] = useState("전체");
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const filtered = useMemo(() => {
    const now = new Date();
    let result = [...history];

    if (filter === "7일") {
      result = result.filter((item) => {
        const date = new Date(item.date);
        return now.getTime() - date.getTime() <= 7 * 24 * 60 * 60 * 1000; // 1000ms * 60s * 60m * 24h * 7d = 604800000ms
      });
    } else if (filter === "30일") {
      result = result.filter((item) => {
        const date = new Date(item.date);
        return now.getTime() - date.getTime() <= 30 * 24 * 60 * 60 * 1000; // 1000ms * 60s * 60m * 24h * 30d = 2592000000ms
      });
    }

    if (sortOrder === "RECENT") {
      result.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else {
      result.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }

    return result;
  }, [history, filter, sortOrder]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>이용 내역</Text>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => setShowResetModal(true)}
        >
          <Text style={styles.resetButtonText}>초기화</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        {Object.entries(SORT_OPTIONS).map(([key, label]) => (
          <TouchableOpacity
            key={key}
            onPress={() => setSortOrder(key as keyof typeof SORT_OPTIONS)}
            style={[
              styles.filterButton,
              sortOrder === key && styles.filterButtonActive,
            ]}
          >
            <Text style={styles.filterButtonText}>{label}</Text>
          </TouchableOpacity>
        ))}

        {FILTER_OPTIONS.map((label) => (
          <TouchableOpacity
            key={label}
            onPress={() => setFilter(label)}
            style={[
              styles.filterButton,
              filter === label && styles.filterButtonActive,
            ]}
          >
            <Text style={styles.filterButtonText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {filtered.length === 0 ? (
        <Text style={styles.emptyText}>이용 내역이 없습니다.</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(_, index) => `history-${index}`}
          contentContainerStyle={{ paddingBottom: 80, gap: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.date}>
                {new Date(item.date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </Text>
              {item.combo.map((coin: any) => (
                <View key={coin.denomination} style={styles.coinRow}>
                  <Image
                    source={coin.image}
                    style={styles.coinImage}
                    contentFit="contain"
                  />
                  <Text style={styles.coinText}>
                    {coin.denomination}
                    {symbol} × {coin.quantity}개
                  </Text>
                </View>
              ))}

              {/* before -> after 금액 보여주는 UI */}
              <View style={styles.beforeAfterContainer}>
                <Text style={styles.beforeText}>
                  {item.amount}
                  {symbol}
                </Text>

                <Text style={styles.arrow}>→</Text>

                <Text style={styles.afterText}>
                  {item.spent}
                  {symbol}
                </Text>
              </View>
            </View>
          )}
        />
      )}
      {showResetModal && (
        <ConfirmModal
          visible={showResetModal}
          title="이용 내역을 초기화 하시겠습니까?"
          onCancel={() => setShowResetModal(false)}
          onConfirm={() => {
            resetHistory();
            setShowResetModal(false);
          }}
        />
      )}
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 34,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  resetButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: "#1e1e1e",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  filterButtonActive: {
    backgroundColor: "#1e3a8a",
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
    marginTop: 100,
  },
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
  },
  date: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
  },
  coinRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 6,
  },
  coinImage: {
    width: 24,
    height: 24,
  },
  coinText: {
    fontSize: 16,
    color: "#ddd",
  },
  beforeAfterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: 12,
  },
  beforeText: {
    fontSize: 14,
    color: "#ddd",
  },
  afterText: {
    fontSize: 14,
    color: "#ddd",
  },
  arrow: {
    fontSize: 14,
    color: "#ddd",
  },
});
