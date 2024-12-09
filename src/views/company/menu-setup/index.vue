<template>
  <base-card1 :title="$t('TITLES.menuSetup')" class="!rounded-md">
    <div v-for="(list, indx) in lists" :key="indx" class="mb-7 last:mb-0">
      <h3 class="mb-2 font-medium">{{ list.title }}</h3>

      <div
        class="flex-wrap gap-4 grid sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4"
      >
        <setting-card
          :grid="true"
          classes="w-full"
          v-for="(item, index) in list.items"
          :item="item"
          :key="index"
        />
      </div>
    </div>
  </base-card1>
</template>

<script setup>
import SettingCard from "@/components/cards/SettingCard.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const getImage = (name) =>
  new URL(`../../../assets/images/icons/brand/${name}`, import.meta.url).href;

const lists = [
  {
    title: t("TITLES.items"),
    items: [
      {
        name: t("TITLES.menuItems"),
        path: "/menu-setup/menu-items",
        image: getImage("menu-setup.png"),
      },
      {
        name: t("TITLES.categories"),
        path: "/menu-setup/categories",
        image: getImage("categories.png"),
      },
      {
        name: t("TITLES.subCategories"),
        path: "/menu-setup/sub-categories",
        image: getImage("sub-categories.png"),
      },
      {
        name: t("TITLES.itemDiscounts"),
        path: "/menu-setup/item-discount",
        image: getImage("item-discount.png"),
      },
    ],
  },
  {
    title: t("TITLES.modifiers"),
    items: [
      {
        name: t("TITLES.modifiersGroups"),
        path: "/menu-setup/modifiers-group",
        image: getImage("modifiers-groups.png"),
      },
      {
        name: t("TITLES.modifiersSubGroups"),
        path: "/menu-setup/modifiers-sub-group",
        image: getImage("modifiers-sub-groups.png"),
      },
      {
        name: t("TITLES.itemModifiers"),
        path: "/menu-setup/item-modifiers",
        image: getImage("item-modifiers.png"),
      },
    ],
  },
  {
    title: t("TITLES.financialSection"),
    items: [
      {
        name: t("TITLES.paymentMethods"),
        path: "/menu-setup/payment-methods",
        image: getImage("payment-methods.png"),
      },
      {
        name: t("TITLES.taxRates"),
        path: "/menu-setup/tax-rates",
        image: getImage("tax-rates.png"),
      },
      {
        name: t("TITLES.Surcharges"),
        path: "/menu-setup/surchargers",
        image: getImage("surcharges.png"),
      },
    ],
  },
  {
    title: t("TITLES.others"),
    items: [
      {
        name: t("TITLES.foodIcons"),
        path: "/menu-setup/food-icons",
        image: getImage("food-icons.png"),
      },
      {
        name: t("TITLES.orderDiscounts"),
        path: "/menu-setup/order-discounts",
        image: getImage("other-discounts.png"),
      },
    ],
  },
];
</script>
