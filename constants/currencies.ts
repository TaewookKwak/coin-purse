type Currency = {
  id: string;
  flag: string;
  name: string;
  symbol: string;
  coins: { denomination: number; image: string }[];
};

export const currencies: Record<string, Currency> = {
  KR: {
    id: "KR",
    flag: "🇰🇷",
    name: "KRW",
    symbol: "₩",
    coins: [
      { denomination: 500, image: require("../assets/coins/KR/500.png") },
      { denomination: 100, image: require("../assets/coins/KR/100.png") },
      { denomination: 50, image: require("../assets/coins/KR/50.png") },
      { denomination: 10, image: require("../assets/coins/KR/10.png") },
    ],
  },
  JP: {
    id: "JP",
    flag: "🇯🇵",
    name: "JPY",
    symbol: "¥",
    coins: [
      { denomination: 500, image: require("../assets/coins/JP/500.png") },
      { denomination: 100, image: require("../assets/coins/JP/100.png") },
      { denomination: 50, image: require("../assets/coins/JP/50.png") },
      { denomination: 10, image: require("../assets/coins/JP/10.png") },
      { denomination: 5, image: require("../assets/coins/JP/5.png") },
      { denomination: 1, image: require("../assets/coins/JP/1.png") },
    ],
  },
  US: {
    id: "US",
    flag: "🇺🇸",
    name: "USD",
    symbol: "¢",
    coins: [
      { denomination: 50, image: require("../assets/coins/US/50_f.png") },
      { denomination: 25, image: require("../assets/coins/US/25_f.png") },
      { denomination: 10, image: require("../assets/coins/US/10_f.png") },
      { denomination: 5, image: require("../assets/coins/US/5_f.png") },
      { denomination: 1, image: require("../assets/coins/US/1_f.png") },
    ],
  },
};
