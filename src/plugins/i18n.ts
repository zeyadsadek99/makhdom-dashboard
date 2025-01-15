import { createI18n } from "vue-i18n";
import Cookies from "js-cookie";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";



export default createI18n({
  legacy: false,
  locale: Cookies.get("SAAS_DASHBOARD_LANG") || "en",
  fallbackLocale: Cookies.get("SAAS_DASHBOARD_LANG") || "en",

  messages: {
    ar,
    en,
  },
});
