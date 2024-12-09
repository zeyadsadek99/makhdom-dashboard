<template>
  <div class="bg-white p-3">
    <breadcrumbs
      v-if="storeData"
      :items="breads"
      :icon="storeData.image"
      :title="storeData[$i18n.locale].name"
      back="/store-setup"
    />

    <div class="max-w-[800px] w-full mx-auto space-y-5" v-if="storeData">
      <Details :item="storeData" />

      <Subscription :item="storeData" />
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import Details from "./show/Details.vue";

import Subscription from "./show/Subscription.vue";

import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { onMounted, reactive, ref } from "vue";
const { t, locale } = useI18n();
const route = useRoute();

const props = defineProps({
  storeData: {
    required: true,
  },
});

const breads = ref([
  {
    path: "/brand-settings",
    imgIcon: "brand-settings.svg",
    name: t("sidebar.brandSettings"),
  },
]);

onMounted(() => {
  breads.value.push({
    path: `/store-setup/${props.storeData.id}/show`,
    name: props.storeData[locale.value].name,
  });
});
</script>

<style lang="scss">
.item-details {
  @apply space-y-6;
  li {
    @apply flex items-center flex-wrap  gap-3 last:mb-0;
    .name {
      @apply flex items-center  last:mb-0 gap-1 w-[220px];

      img {
        @apply me-2;
      }
    }
    .text {
      @apply font-medium text-text;
    }
  }
}
</style>
