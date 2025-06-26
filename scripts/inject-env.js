// scripts/set-codepush-config.js
const fs = require("fs");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, `../.env.${process.env.ENV || "local"}`),
});

const key = process.env.CODEPUSH_KEY;

if (!key) {
  console.error("❌ .env.{환경명}에 CODEPUSH_KEY가 없습니다.");
  process.exit(1);
}

// ✅ Android: local.properties
const androidPropsPath = path.join(__dirname, "../android/local.properties");
let content = fs.existsSync(androidPropsPath)
  ? fs.readFileSync(androidPropsPath, "utf-8")
  : "";

content = content
  .split("\n")
  .filter((line) => !line.startsWith("CODEPUSH_KEY="))
  .concat([`CODEPUSH_KEY=${key}`])
  .join("\n");
fs.writeFileSync(androidPropsPath, content + "\n");
console.log("✅ Android local.properties 업데이트 완료");

// ✅ iOS: tmp.xcconfig만 새로 생성
const iosConfigDir = path.join(__dirname, "../ios/Config");
const tmpConfigPath = path.join(iosConfigDir, "tmp.xcconfig");
fs.mkdirSync(iosConfigDir, { recursive: true });
fs.writeFileSync(tmpConfigPath, `CODEPUSH_KEY=${key}\n`);
console.log("✅ iOS tmp.xcconfig 생성 완료");

// ✅ iOS: Config.xcconfig은 고정 파일로 유지되어야 함
const mainConfigPath = path.join(iosConfigDir, "Config.xcconfig");
if (!fs.existsSync(mainConfigPath)) {
  fs.writeFileSync(mainConfigPath, `#include? "tmp.xcconfig"\n`);
  console.log("✅ iOS Config.xcconfig 초기 생성 완료");
}
