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
  changeCountry: (country: string) => void; // 국가 변경
  loadWalletData: (country: string) => void; // 특정 국가의 지갑 데이터 로드
};

// MMKV 키 생성 함수들
const getWalletKey = (country: string) => `wallet-${country}`;
const getHistoryKey = (country: string) => `history-${country}`;

export const useWalletStore = create<State>()(
  persist(
    (set, get) => ({
      wallet: {
        country: "JP", // 기본값: 일본
        coins: [],
      },
      history: [],

      // 특정 국가의 지갑 데이터 로드
      loadWalletData: (country: string) => {
        const walletKey = getWalletKey(country);
        const historyKey = getHistoryKey(country);

        // 동전 데이터 로드
        const walletData = storage.getString(walletKey);
        let coins: Coin[] = [];
        if (walletData) {
          try {
            const parsed = JSON.parse(walletData);
            coins = parsed.coins || [];
          } catch (err) {
            console.error("Failed to load wallet data from MMKV", err);
          }
        }

        // 내역 데이터 로드
        const historyData = storage.getString(historyKey);
        let history: HistoryItem[] = [];
        if (historyData) {
          try {
            history = JSON.parse(historyData);
          } catch (err) {
            console.error("Failed to load history from MMKV", err);
          }
        }

        set({
          wallet: { country, coins },
          history,
        });
      },

      // 국가 변경
      changeCountry: (country: string) => {
        const { wallet } = get();

        // 현재 국가의 데이터 저장
        const currentWalletKey = getWalletKey(wallet.country);
        const currentHistoryKey = getHistoryKey(wallet.country);

        storage.set(currentWalletKey, JSON.stringify(wallet));
        storage.set(currentHistoryKey, JSON.stringify(get().history));

        // 새 국가의 데이터 로드
        get().loadWalletData(country);
      },

      addCoin: (denomination, quantity) => {
        const { wallet } = get();
        const coins = [...wallet.coins];
        const index = coins.findIndex((c) => c.denomination === denomination);

        if (index > -1) {
          coins[index].quantity += quantity;
        } else {
          coins.push({ denomination, quantity, image: "" });
        }

        const updatedWallet = { ...wallet, coins };

        // MMKV에 저장
        const walletKey = getWalletKey(wallet.country);
        storage.set(walletKey, JSON.stringify(updatedWallet));

        set({ wallet: updatedWallet });
      },

      useCoins: (used) => {
        const { wallet, history } = get();
        const coins = wallet.coins.map((coin) => {
          const usedCoin = used.find(
            (u) => u.denomination === coin.denomination
          );

          if (usedCoin) {
            return {
              ...coin,
              quantity: Math.max(coin.quantity - usedCoin.quantity, 0),
            };
          }
          return coin;
        });

        const newHistoryItem = {
          date: new Date().toISOString(),
          combo: used,
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

        const updatedWallet = { ...wallet, coins };
        const updatedHistory = [newHistoryItem, ...history];

        // MMKV에 저장
        const walletKey = getWalletKey(wallet.country);
        const historyKey = getHistoryKey(wallet.country);
        storage.set(walletKey, JSON.stringify(updatedWallet));
        storage.set(historyKey, JSON.stringify(updatedHistory));

        set({
          wallet: updatedWallet,
          history: updatedHistory,
        });
      },

      resetWallet: () => {
        const { wallet } = get();
        const resetWallet = {
          country: wallet.country,
          coins: [],
        };

        // MMKV에 저장
        const walletKey = getWalletKey(wallet.country);
        storage.set(walletKey, JSON.stringify(resetWallet));

        set({ wallet: resetWallet });
      },

      addHistory: (date, combo, amount, spent, symbol) => {
        const { history, wallet } = get();
        const updatedHistory = [
          { date, combo, amount, spent, symbol },
          ...history,
        ];

        // MMKV에 저장
        const historyKey = getHistoryKey(wallet.country);
        storage.set(historyKey, JSON.stringify(updatedHistory));

        set({ history: updatedHistory });
      },

      loadHistory: () => {
        const { wallet } = get();
        const historyKey = getHistoryKey(wallet.country);
        const raw = storage.getString(historyKey);

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
        const historyKey = getHistoryKey(wallet.country);
        storage.delete(historyKey);
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
