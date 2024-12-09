<template>
  <base-card1 class="!rounded-md relative store-index">
    <breadcrumbs
      :icon="pageData.image"
      :items="breads"
      :title="pageData[$i18n.locale].name"
      back="/store-setup"
    />
    <div v-for="(list, indx) in lists" :key="indx" class="mb-7 last:mb-0">
      <h3 class="mb-2 font-medium">{{ list.title }}</h3>
      <div class="flex flex-wrap gap-4">
        <SettingCard
          v-for="(item, index) in list.items"
          :item="item"
          :key="index"
        />
      </div>
    </div>

    <Popup v-if="startSubscription" @close="$router.push('/store-setup')">
      <img class="mx-auto mb-4" src="@/assets/images/icons/visa.png" alt="" />
      <h3 class="text-text font-semibold text-3xl max-w-[500px] text-center">
        {{
          $t(
            "TITLES.To continue using MEA Telcome please activate your account"
          )
        }}
      </h3>

      <router-link
        class="base-btn rounded-xl w-fit mx-auto mt-7"
        :to="`/store-setup/${$route.params.id}/subscription`"
        >{{ $t("BUTTONS.Active Subscription") }}</router-link
      >
    </Popup>
  </base-card1>
</template>

<script setup>
import Popup from "@/components/store-setup/Popup.vue";
import icon from "@/assets/images/brand.png";
import SettingCard from "@/components/cards/SettingCard.vue";
import { useI18n } from "vue-i18n";
import { onMounted, reactive, ref, toRef } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();

const props = defineProps({
  storeData: {
    required: true,
  },
});

const pageData = toRef(props.storeData);

const getImage = (name) =>
  new URL(
    `../../../../assets/images/icons/store-setup/${name}`,
    import.meta.url
  ).href;
// const icon = () =>
//   new URL(`../../../../assets/images/brand.png`, import.meta.url).href;

const item = {
  name: "brand details",
  path: "/",
  image: getImage("details.png"),
};

const { t, locale } = useI18n();
const breads = reactive([
  {
    path: "/store-setup",
    imgIcon: "storeSetup.svg",
    name: t("sidebar.storeSetup"),
  },
]);

const startSubscription = ref(true);

const lists = [
  {
    title: t("TITLES.Delivery Section"),
    items: [
      {
        name: t("TITLES.Delivery Areas"),
        path: `/store-setup/${route.params.id}/delivery-areas`,
        image: getImage("Delivery_Areas.png"),
      },
    ],
  },
  {
    title: t("TITLES.Kitchen Section"),
    items: [
      {
        name: t("TITLES.KOT Kitchens"),
        path: `/store-setup/${route.params.id}/kot-kitchens`,
        image: getImage("KOT_Kitchens.png"),
      },
      {
        name: t("TITLES.Printers"),
        path: `/store-setup/${route.params.id}/printers`,
        image: getImage("Printers.png"),
      },
      {
        name: t("TITLES.Token Screen"),
        path: `/store-setup/${route.params.id}/token-screen`,
        image: getImage("Token_Screen.png"),
      },
      {
        name: t("TITLES.Central Kitchen"),
        path: `/store-setup/${route.params.id}/central-kitchen`,
        image: getImage("Central_Kitchen.png"),
      },
    ],
  },
  {
    title: t("TITLES.Dine In Section"),
    items: [
      {
        name: t("TITLES.Dine-in Areas"),
        path: `/store-setup/${route.params.id}/dine-in-areas`,
        image: getImage("Dine-in_Areas.png"),
      },
      {
        name: t("TITLES.Dine-in Tables"),
        path: `/store-setup/${route.params.id}/dine-in-tables`,
        image: getImage("Dine-in_tables.png"),
      },

      {
        name: t("TITLES.Table available"),
        path: `/store-setup/${route.params.id}/table-available`,
        image: getImage("Table_available.png"),
      },
    ],
  },
  {
    title: t("TITLES.POS Section"),
    items: [
      {
        name: t("TITLES.POS Waiting time"),
        path: `/store-setup/${route.params.id}/POS-waiting-time`,
        image: getImage("POS_Waiting_time.png"),
      },
    ],
  },
  {
    title: t("TITLES.General Settings"),
    items: [
      {
        name: t("TITLES.Work Times"),
        path: `/store-setup/${route.params.id}/work-times`,
        image: getImage("Work_Times.png"),
      },
      {
        name: t("TITLES.Available orders type"),
        path: `/store-setup/${route.params.id}/available-order-types`,
        image: getImage("Available_orders_type.png"),
      },
      {
        name: t("TITLES.Integration Settings"),
        path: `/store-setup/${route.params.id}/integration-settings`,
        image: getImage("Integration_Settings.png"),
      },
    ],
  },

  {
    title: t("TITLES.Inventory Section"),
    items: [
      {
        name: t("TITLES.Items"),
        path: "/store-setup/1",
        image: getImage("Items.png"),
      },
      {
        name: t("TITLES.Import Items"),
        path: "/store-setup/1",
        image: getImage("Import_Items.png"),
      },
      {
        name: t("TITLES.Export Items"),
        path: "/store-setup/1",
        image: getImage("Export_Items.png"),
      },
      {
        name: t("TITLES.Stock take"),
        path: "/store-setup/1",
        image: getImage("Stock_take.png"),
      },
      {
        name: t("TITLES.Item Status Used"),
        path: "/store-setup/1",
        image: getImage("Item_Status.png"),
      },
      {
        name: t("TITLES.Issues"),
        path: "/store-setup/1",
        image: getImage("Issues.png"),
      },
    ],
  },
];

onMounted(() => {
  if (pageData.value) {
    if (pageData.value.subscription_type == "active") {
      startSubscription.value = false;
    }
    breads.push({
      path: `/store-setup/${pageData.value.id}`,
      imgIcon: "",
      name: pageData.value[locale.value].name,
    });
  }
});
</script>

<style lang="scss"></style>
