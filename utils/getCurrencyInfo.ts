import { currencies } from "../constants/currencies";

export function getCurrencyInfo(code: string) {
  return currencies[code] ?? currencies["KR"];
}
