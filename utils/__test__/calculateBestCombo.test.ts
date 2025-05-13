import { calculateBestCoinCombo } from "../calculateBestCombo";
import type { Coin } from "@/types";

const mockCoins: Coin[] = [
  { denomination: 100, quantity: 2, image: "" },
  { denomination: 50, quantity: 3, image: "" },
  { denomination: 10, quantity: 5, image: "" },
];

describe("calculateBestCoinCombo", () => {
  it("should return empty array if no valid combination", () => {
    const result = calculateBestCoinCombo(9999, mockCoins, "max-first");
    expect(result).toEqual([]);
  });

  it("should use largest coins first with 'max-first' strategy", () => {
    const result = calculateBestCoinCombo(160, mockCoins, "max-first");

    // 총액 확인
    const total = result.reduce(
      (sum, c) => sum + c.denomination * c.quantity,
      0
    );
    expect(total).toBe(160);

    // 큰 동전이 먼저 써졌는지 체크
    expect(result[0].denomination).toBeGreaterThanOrEqual(
      result.at(-1)!.denomination
    );
  });

  it("should use smallest coins first with 'min-first' strategy", () => {
    const result = calculateBestCoinCombo(160, mockCoins, "min-first");

    const total = result.reduce(
      (sum, c) => sum + c.denomination * c.quantity,
      0
    );
    expect(total).toBe(160);

    // 작은 동전이 먼저 써졌는지 체크
    expect(result[0].denomination).toBeLessThanOrEqual(
      result.at(-1)!.denomination
    );
  });

  it("should respect coin quantity limits", () => {
    const result = calculateBestCoinCombo(300, mockCoins, "max-first");

    // 총 동전 수량은 보유한 개수를 넘으면 안됨
    for (const coin of result) {
      const available =
        mockCoins.find((c) => c.denomination === coin.denomination)?.quantity ??
        0;
      expect(coin.quantity).toBeLessThanOrEqual(available);
    }
  });
});
