import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { MMKV } from "react-native-mmkv";
import { Coin } from "@/types";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";

// MMKV 인스턴스 생성
const storage = new MMKV();

type Wallet = {
  country: string; // 국가 코드
  coins: Coin[]; // 동전 목록
};

interface HistoryItem {
  date: string;
  combo: Coin[];
  amount: number;
  spent: number;
  symbol: string;
}

type State = {
  wallet: Wallet; // 지갑 상태
  history: HistoryItem[]; // 지출 내역
  addCoin: (denomination: number, quantity: number) => void; // 동전 추가
  useCoins: (used: Coin[]) => void; // 동전 사용
  addHistory: (
    date: string,
    combo: Coin[],
    amount: number,
    spent: number,
    symbol: string
  ) => void; // 지출 내역 추가
  resetWallet: () => void; // 지갑 초기화
  loadHistory: () => void; // 지출 내역 로드
  resetHistory: () => void; // 지출 내역 초기화
};

export const useWalletStore = create<State>()(
  persist(
    (set, get) => ({
      wallet: {
        country: "JP", // 기본값: 일본
        coins: [],
      },
      history: [],
      addCoin: (denomination, quantity) => {
        const { wallet } = get(); // 현재 지갑 상태
        const coins = [...wallet.coins]; // 동전 목록 복사
        const index = coins.findIndex((c) => c.denomination === denomination); // 동전 인덱스 찾기

        if (index > -1) {
          coins[index].quantity += quantity; // 동전 개수 증가
        } else {
          coins.push({ denomination, quantity, image: "" }); // 새로운 동전 추가
        }

        set({ wallet: { ...wallet, coins } }); // 지갑 상태 업데이트
      },
      useCoins: (used) => {
        const { wallet, history } = get(); // 현재 지갑 상태
        const coins = wallet.coins.map((coin) => {
          const usedCoin = used.find(
            (u) => u.denomination === coin.denomination
          );

          if (usedCoin) {
            return {
              ...coin,
              quantity: Math.max(coin.quantity - usedCoin.quantity, 0), // 사용된 동전 개수 감소, Math.max 사용하여 0 이하로 떨어지지 않도록 함
            };
          }
          return coin;
        });

        const newHistoryItem = {
          date: new Date().toISOString(), // 예) 2025-04-10T00:00:00.000Z
          combo: used, // 예) [{denomination: 100, quantity: 1}, {denomination: 50, quantity: 2}]
          amount: coins.reduce(
            (acc, coin) => acc + coin.denomination * coin.quantity,
            0
          ),
          spent: used.reduce(
            (acc, coin) => acc + coin.denomination * coin.quantity,
            0
          ),
          symbol: getCurrencySymbol(wallet.country),
        };
        const langKey = `coin-history-${wallet.country}`;
        const updatedHistory = [newHistoryItem, ...history];
        storage.set(langKey, JSON.stringify(updatedHistory));

        set({
          wallet: { ...wallet, coins },
          history: updatedHistory,
        });
      },
      resetWallet: () => {
        set({
          wallet: {
            country: "JP",
            coins: [],
          },
        });
      },

      addHistory: (date, combo, amount, spent, symbol) => {
        const { history, wallet } = get();
        const updatedHistory = [
          { date, combo, amount, spent, symbol },
          ...history,
        ];
        const langKey = `coin-history-${wallet.country}`;
        storage.set(langKey, JSON.stringify(updatedHistory));
        set({ history: updatedHistory });
      },

      loadHistory: () => {
        const { wallet } = get();
        const langKey = `coin-history-${wallet.country}`;
        const raw = storage.getString(langKey);

        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            set({ history: parsed });
          } catch (err) {
            console.error("Failed to load history from MMKV", err);
          }
        }
      },
      resetHistory: () => {
        const { wallet } = get();
        const langKey = `coin-history-${wallet.country}`;
        storage.delete(langKey);
        set({ history: [] });
      },
    }),
    {
      name: "wallet-storage",
      storage: createJSONStorage(() => ({
        getItem: (key) => storage.getString(key) ?? null,
        setItem: (key, value) => storage.set(key, value),
        removeItem: (key) => storage.delete(key),
      })),
    }
  )
);
