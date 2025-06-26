import ConfirmModal from "@/components/ui/confirm-modal";
import { useWalletStore } from "@/stores/wallet-store";
import { calculateBestCoinCombo } from "@/utils/calculateBestCombo";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Strategy = "max-first" | "min-first";

export default function CalculatorScreen() {
  const router = useRouter();

  const { wallet, useCoins } = useWalletStore();
  const [amount, setAmount] = useState("");
  const [strategy, setStrategy] = useState<Strategy>("max-first");
  const [resultText, setResultText] = useState("");

  const [combo, setCombo] = useState<
    { denomination: number; quantity: number; image: string }[] | null
  >(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const symbol = getCurrencySymbol(wallet.country);

  const runCalculation = (num: number, nextStrategy: Strategy) => {
    const combo = calculateBestCoinCombo(num, wallet.coins, nextStrategy);
    if (combo.length === 0) {
      setResultText("동전이 부족합니다 😢");
      setCombo(null);
    } else {
      setCombo(combo);
      setResultText("");
    }
  };

  const handleStrategyChange = (next: Strategy) => {
    setStrategy(next);
    const num = parseInt(amount, 10);
    if (!isNaN(num)) {
      runCalculation(num, next);
    }
  };

  const handleUseCoins = () => {
    if (combo) {
      useCoins(combo);
      setAmount("");
      setCombo(null);
      setResultText("사용되었습니다 ✅");
      setShowConfirmModal(false);

      setTimeout(() => {
        router.replace("/");
      }, 300);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // 화면에 들어올 때마다 초기화
      setAmount("");
      setStrategy("max-first");
      setResultText("");
      setCombo(null);
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <Text style={styles.title}>얼마를 계산할까요?</Text>

        {/* 금액 입력 영역 */}
        <View style={styles.inputWrapper}>
          <TextInput
            value={amount}
            onChangeText={(text) => {
              setAmount(text);
              const num = parseInt(text, 10);
              if (!isNaN(num)) {
                runCalculation(num, strategy);
              } else {
                setCombo(null);
                setResultText("");
              }
            }}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor="#666"
            style={styles.input}
          />
          <Text style={styles.unit}>{symbol}</Text>
        </View>

        {/* 전략 선택 영역 */}
        <View style={styles.strategyContainer}>
          <TouchableOpacity
            style={[
              styles.strategyBtn,
              strategy === "max-first" && styles.strategyBtnSelected,
            ]}
            onPress={() => handleStrategyChange("max-first")}
          >
            <Text
              style={[
                styles.strategyText,
                strategy === "max-first" && styles.strategyTextSelected,
              ]}
            >
              큰 단위 동전부터 사용
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.strategyBtn,
              strategy === "min-first" && styles.strategyBtnSelected,
            ]}
            onPress={() => handleStrategyChange("min-first")}
          >
            <Text
              style={[
                styles.strategyText,
                strategy === "min-first" && styles.strategyTextSelected,
              ]}
            >
              작은 단위 동전부터 사용
            </Text>
          </TouchableOpacity>
        </View>

        {/* 결과 텍스트 */}
        {resultText ? <Text style={styles.resultBox}>{resultText}</Text> : null}

        {/* 추천 동전 목록 */}
        <FlatList
          contentContainerStyle={styles.changeList}
          data={combo}
          showsVerticalScrollIndicator={true}
          renderItem={({ item }) => {
            return (
              <View style={styles.changeItemWrapper}>
                <Image
                  source={item.image}
                  style={styles.changeItemImage}
                  contentFit="contain"
                  transition={300}
                />
                <View style={styles.changeItemTextWrapper}>
                  <Text style={styles.changeItem}>
                    {item.denomination}
                    {symbol}
                  </Text>
                  <Text style={styles.changeItem}>x</Text>
                  <Text style={styles.changeItem}>{item.quantity}개</Text>
                </View>
              </View>
            );
          }}
        />

        {combo && (
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowConfirmModal(true)}
            >
              <Text style={styles.buttonText}>사용하기</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 확인용 모달 */}
        <ConfirmModal
          visible={showConfirmModal}
          title="이렇게 사용하시겠어요?"
          confirmText="사용하기"
          cancelText="취소"
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={handleUseCoins}
        >
          <FlatList
            data={combo}
            keyExtractor={(item) => `${item.denomination}`}
            contentContainerStyle={{ gap: 12, marginTop: 20 }}
            renderItem={({ item }) => (
              <View style={styles.changeItemWrapper}>
                <Image
                  source={item.image}
                  style={styles.changeItemImage}
                  contentFit="contain"
                />
                <View style={styles.changeItemTextWrapper}>
                  <Text style={styles.changeItem}>
                    {item.denomination}
                    {symbol}
                  </Text>
                  <Text style={styles.changeItem}>x</Text>
                  <Text style={styles.changeItem}>{item.quantity}개</Text>
                </View>
              </View>
            )}
          />
        </ConfirmModal>
      </KeyboardAvoidingView>
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
    gap: 20,
  },
  title: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    paddingBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 40,
    color: "#fff",
  },
  unit: {
    fontSize: 20,
    color: "#aaa",
    marginLeft: 8,
  },
  resultBox: {
    color: "#ccc",
    fontSize: 16,
    lineHeight: 26,
  },
  buttonWrapper: {
    marginBottom: 24,
    marginTop: 24,
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
  strategyContainer: {
    flexDirection: "row",
    gap: 12,
  },
  strategyBtn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    alignItems: "center",
  },
  strategyBtnSelected: {
    backgroundColor: "#1e3a8a",
    borderColor: "#1e3a8a",
  },
  strategyText: {
    color: "#ccc",
    fontSize: 14,
  },
  strategyTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  changeList: {
    gap: 12,
  },
  changeItem: {
    color: "#ccc",
    fontSize: 18,
  },
  changeItemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 12,
  },
  changeItemImage: {
    width: 36,
    height: 36,
  },
  changeItemTextWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
