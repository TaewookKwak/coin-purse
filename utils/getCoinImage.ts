import { currencies } from "@/constants/currencies";

export const getCoinImage = (country: string, denomination: number): string => {
  const currencyCoins = currencies[country]?.coins || [];
  const coinInfo = currencyCoins.find((c) => c.denomination === denomination);
  return coinInfo ? coinInfo.image : "";
};
