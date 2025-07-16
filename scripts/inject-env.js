// scripts/set-codepush-config.js
const fs = require("fs");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, `../.env.${process.env.ENV || "local"}`),
});

const key = process.env.CODEPUSH_KEY;
const env = process.env.ENV || "local";

const src = path.resolve(__dirname, `../.env.${env}`);
const dest = path.resolve(__dirname, "../.env");

if (!fs.existsSync(src)) {
  console.error("❌ .env.{환경명} 파일이 없습니다.");
  process.exit(1);
}

if (!key) {
  console.error("❌ .env.{환경명}에 CODEPUSH_KEY가 없습니다.");
  process.exit(1);
} else if (!env) {
  console.error("❌ .env.{환경명}에 ENV가 없습니다.");
  process.exit(1);
}

fs.copyFileSync(src, dest);
console.log("✅ .env 파일 복사 완료");
