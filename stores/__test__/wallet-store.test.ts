// stores/__test__/wallet-store.test.ts
import { useWalletStore } from "../wallet-store";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();
const langKey = "coin-history-JP";

beforeEach(() => {
  storage.delete(langKey);
  useWalletStore.setState({
    wallet: {
      country: "JP",
      coins: [],
    },
    history: [],
  });
});

describe("wallet-store", () => {
  it("should add coins correctly", () => {
    useWalletStore.getState().addCoin(100, 2);
    const coins = useWalletStore.getState().wallet.coins;

    expect(coins).toEqual([{ denomination: 100, quantity: 2, image: "" }]);
  });

  it("should update coin quantity if denomination exists", () => {
    useWalletStore.getState().addCoin(100, 2);
    useWalletStore.getState().addCoin(100, 3);
    const coins = useWalletStore.getState().wallet.coins;

    expect(coins).toEqual([{ denomination: 100, quantity: 5, image: "" }]);
  });

  it("should use coins and update quantity", () => {
    useWalletStore.getState().addCoin(100, 3);
    useWalletStore
      .getState()
      .useCoins([{ denomination: 100, quantity: 2, image: "" }]);
    const coins = useWalletStore.getState().wallet.coins;

    expect(coins).toEqual([{ denomination: 100, quantity: 1, image: "" }]);
  });

  it("should manually add history", () => {
    const date = "2025-01-01";
    const combo = [
      { denomination: 100, quantity: 2, image: "" },
      { denomination: 50, quantity: 1, image: "" },
    ];
    useWalletStore.getState().addHistory(date, combo, 500, 250, "¥");

    const stored = storage.getString(langKey);
    expect(stored).not.toBeUndefined();
    expect(stored).toContain(date);
  });

  it("should load history from storage", () => {
    const rawHistory = [
      {
        date: "2025-01-01",
        combo: [
          { denomination: 100, quantity: 2, image: "" },
          { denomination: 50, quantity: 1, image: "" },
        ],
        amount: 500,
        spent: 250,
        symbol: "¥",
      },
    ];

    storage.set(langKey, JSON.stringify(rawHistory));
    useWalletStore.getState().loadHistory();

    const history = useWalletStore.getState().history;
    expect(history).toEqual(rawHistory);
  });

  it("should reset wallet", () => {
    useWalletStore.getState().addCoin(100, 2);
    useWalletStore.getState().resetWallet();

    const { coins, country } = useWalletStore.getState().wallet;
    expect(coins).toEqual([]);
    expect(country).toBe("JP");
  });

  it("should reset history", () => {
    const rawHistory = [
      {
        date: "2025-01-01",
        combo: [
          { denomination: 100, quantity: 2, image: "" },
          { denomination: 50, quantity: 1, image: "" },
        ],
        amount: 500,
        spent: 250,
        symbol: "¥",
      },
    ];
    storage.set(langKey, JSON.stringify(rawHistory));
    useWalletStore.getState().loadHistory();
    useWalletStore.getState().resetHistory();

    const history = useWalletStore.getState().history;
    const stored = storage.getString(langKey);
    expect(history).toEqual([]);
    expect(stored).toBeUndefined();
  });
});
