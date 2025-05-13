# 💰 Coin Purse — Travel Coin Wallet App

A beautifully designed **React Native** app built with **Expo Router**, helping you manage and use leftover coins more efficiently while traveling in countries that still rely on cash.

> “Don’t let your coins go to waste — organize and use them smartly.”

---

## 🧭 Features

- 🔢 **Coin Calculator**  
  Input an amount → get optimized combinations of coins based on two strategies:
  - Largest denomination first
  - Smallest denomination first

- 🧲 **Rolling Number Animation**  
  Elegant number roll-up animation (like slot machines) using Reanimated.

- 🌍 **Multinational Currency Support**  
  Set your country and use the local coin system (`KR`, `JP`, `US`...).

- 🧾 **Usage History**  
  Automatically records and displays coin usage history (stored by country via MMKV).

- 📊 **Visual Coin UI**  
  Shows real coin images per denomination for intuitive recognition.

---

## 📸 Screenshots

<table>
  <tr>
    <td><b>Home</b></td>
    <td><b>Pay</b></td>
    <td><b>Purse</b></td>
    <td><b>Settings</b></td>
    <td><b>History Modal</b></td>
  </tr>
  <tr>
    <td><img src="./assets/screenshots/home.png" width="150"/></td>
    <td><img src="./assets/screenshots/pay.png" width="150"/></td>
    <td><img src="./assets/screenshots/purse.png" width="150"/></td>
    <td><img src="./assets/screenshots/settings.png" width="150"/></td>
    <td><img src="./assets/screenshots/home-history.png" width="150"/></td>
  </tr>
</table>

---

## 🛠️ Stack

| Tech | Purpose |
|------|---------|
| `React Native` | Cross-platform app |
| `Expo Router` | File-based navigation |
| `MMKV` | Blazing fast local storage |
| `Zustand` | State management |
| `Reanimated` | High-performance animations |
| `expo-image` | Fast, efficient image handling |

---

## 🔃 Coin Strategy Example

```ts
// calculateBestCoinCombo(amount, coins, strategy)
calculateBestCoinCombo(270, [{ denomination: 100, quantity: 3 }, { denomination: 50, quantity: 2 }], "max-first")

// → [100x2, 50x1, 20x1]
```

---

## 📦 Folder Structure (key parts)

```
📦app
 ┣ 📂(modals)
 ┃ ┗ 📜history-modal.tsx
 ┣ 📂(tabs)
 ┃ ┣ 📜_layout.tsx
 ┃ ┣ 📜calculator-screen.tsx
 ┃ ┣ 📜index.tsx
 ┃ ┣ 📜settings-screen.tsx
 ┃ ┗ 📜wallet-screen.tsx
 ┣ 📜+not-found.tsx
 ┗ 📜_layout.tsx
📦components
 ┣ 📂ui
 ┃ ┣ 📜IconSymbol.ios.tsx
 ┃ ┣ 📜IconSymbol.tsx
 ┃ ┗ 📜confirm-modal.tsx
 ┣ 📜haptic-tab.tsx
 ┣ 📜layout-with-tab-padding.tsx
 ┣ 📜rolling-number.tsx
 ┗ 📜splash-screen.tsx
📦constants
 ┣ 📜colors.ts
 ┗ 📜currencies.ts
📦stores
 ┣ 📂__test__
 ┃ ┗ 📜wallet-store.test.ts
 ┗ 📜wallet-store.ts
```


---

## 🌐 Multilingual Support

-Saves history per country:
```ts
- MMKV Key: coin-history-JP, coin-history-KR ...
```
- All coin data is localized to currency + flag

---

## 📲 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run the app
npx expo start

# (Optional)
npx expo run:ios
npx expo run:android
```

---

## 🚀 Future Improvements
 - Backup / Export history

 - Cloud sync (optional)

 - Visual charts per usage

 - OCR for scanning physical coins? 🤔

---

## 👨‍💻 Developed by
Taewoo Kwak

## 📄 License
MIT License © 2025





