import { Coin } from "@/types";

type Strategy = "max-first" | "min-first";

export function calculateBestCoinCombo(
  amount: number,
  coins: Coin[],
  strategy: Strategy = "max-first"
): Coin[] {
  if (strategy === "max-first") {
    return greedyCombo(amount, coins, true);
  } else {
    const allCombos = findMinFirstCombos(amount, coins, 3); // 👈 추천 3개
    return allCombos[Math.floor(Math.random() * allCombos.length)] ?? []; // 랜덤으로 추천 하나 선택
  }
}

// 기존 방식: 큰 동전 우선
function greedyCombo(
  amount: number,
  coins: Coin[],
  descending: boolean
): Coin[] {
  const sorted = [...coins].sort((a, b) =>
    descending
      ? b.denomination - a.denomination
      : a.denomination - b.denomination
  );

  const result: Coin[] = [];
  let remaining = amount;

  for (const coin of sorted) {
    if (remaining <= 0) break;

    const maxUsable = Math.min(
      Math.floor(remaining / coin.denomination),
      coin.quantity
    );

    if (maxUsable > 0) {
      result.push({
        denomination: coin.denomination,
        quantity: maxUsable,
        image: coin.image,
      });
      remaining -= coin.denomination * maxUsable;
    }
  }

  if (remaining > 0) return [];
  return result;
}

// 새로운 방식: 최소 단위부터 조합 탐색 (백트래킹)
// 백트래킹이란? 모든 경우의 수를 탐색하는 것이 아니라, 가능한 경우의 수만 탐색하는 것
// 예를 들어, 100원을 만들기 위해 100원 동전을 사용하는 경우, 100원 동전을 사용하지 않는 경우를 탐색하는 것
function backtrackCombo(amount: number, coins: Coin[]): Coin[] {
  const sorted = [...coins].sort((a, b) => a.denomination - b.denomination);
  const result: Coin[] = [];
  let found = false;

  function dfs(index: number, current: Coin[], remaining: number) {
    if (remaining === 0) {
      result.push(...current);
      found = true;
      return;
    }

    if (index >= sorted.length || found) return;

    const coin = sorted[index];
    const maxCount = Math.min(
      Math.floor(remaining / coin.denomination),
      coin.quantity
    );

    for (let count = maxCount; count >= 0; count--) {
      dfs(
        index + 1,
        count > 0
          ? [
              ...current,
              {
                denomination: coin.denomination,
                quantity: count,
                image: coin.image,
              },
            ]
          : [...current],
        remaining - coin.denomination * count
      );
    }
  }

  dfs(0, [], amount);

  return found ? result : [];
}

export function findMinFirstCombos(
  amount: number,
  coins: Coin[],
  limit: number = 3
): Coin[][] {
  const sorted = [...coins].sort((a, b) => a.denomination - b.denomination);
  const results: Coin[][] = [];

  function dfs(index: number, current: Coin[], remaining: number) {
    if (remaining === 0) {
      results.push(current);
      return;
    }

    if (index >= sorted.length || results.length >= limit) return;

    const coin = sorted[index];
    const maxCount = Math.min(
      Math.floor(remaining / coin.denomination),
      coin.quantity
    );

    for (let count = maxCount; count >= 0; count--) {
      const next =
        count > 0
          ? [
              ...current,
              {
                denomination: coin.denomination,
                quantity: count,
                image: coin.image,
              },
            ]
          : [...current];

      dfs(index + 1, next, remaining - coin.denomination * count);
    }
  }

  dfs(0, [], amount);

  // 결과 정렬: 총 동전 수가 적은 조합부터
  return results
    .sort(
      (a, b) =>
        a.reduce((sum, c) => sum + c.quantity, 0) -
        b.reduce((sum, c) => sum + c.quantity, 0)
    )
    .slice(0, limit);
}
