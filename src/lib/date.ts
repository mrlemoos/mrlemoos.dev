import { DEFAULT_LOCALE } from "./constants";

export function formatDate(date: string, locale = DEFAULT_LOCALE) {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
