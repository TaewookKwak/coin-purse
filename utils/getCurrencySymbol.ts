import { currencies } from "../constants/currencies";

export function getCurrencySymbol(countryCode: string): string {
  return currencies[countryCode]?.symbol || "";
}
