<template>
  <div class="bg-white p-3">
    <breadcrumbs
      :items="breads"
      :title="t('TITLES.categories')"
      back="/settings"
      class="mb-7"
    />

    <div class="max-w-[800px] mx-auto space-y-5">
      <Details :item="companyData" />

      <!-- <Owner :item="pageData" /> -->

      <!-- <Subscription :item="pageData" /> -->
    </div>
  </div>
</template>

<script setup>
import Details from "./show/Details.vue";
import Owner from "./show/Owner.vue";
import Subscription from "./show/Subscription.vue";
import { useI18n } from "vue-i18n";
import { ref } from "vue";

const { t } = useI18n();
const companyData = ref({
  name: "",
  country: {
    name: "",
    image: "",
  },
  time_zone: "",
  phone: "",
});
  
const breads = [
  {
    path: "/menu",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.menuSetup"),
  },
  {
    path: "/menu/categories",
    imgIcon: "",
    name: t("TITLES.categories"),
  },
  {
    path: `/menu`,
    imgIcon: "",
    name: t("BUTTONS.addCategory"),
  },
];
</script>
