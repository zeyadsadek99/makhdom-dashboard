<template>
  <div class="h-full flex flex-col">
    <breadcrumbs
      :items="breads"
      :title="t('BUTTONS.allTrashes', { name: t('TITLES.taxRates') })"
      back="/menu-setup/tax-rates"
      class="mb-7"
    />

    <base-card1
      class="flex-1 bg-white"
      :class="items.length ? '' : 'flex flex-col'"
    >
      <div :class="items.length ? 'space-y-5' : 'my-auto'">
        <Loader v-if="loading" />
        <template v-else>
          <template v-if="items.length">
            <TaxRate
              v-for="item in items"
              :key="item.id"
              :item="item"
              @remove="remove"
              @reload="fetchData"
              :trashed="true"
            />
          </template>

          <div
            v-else
            class="h-full my-auto items-center justify-center space-y-6"
          >
            <div class="text-center">
              <img class="mx-auto" src="@/assets/images/tax-rate.png" alt="" />
              <h3 class="mt-4 font-semibold text-text text-center">
                {{
                  $t("TITLES.No have been added yet", {
                    name: t("BUTTONS.allTrashes") + t("TITLES.taxRates"),
                  })
                }}
              </h3>
            </div>
          </div>
        </template>
      </div>
    </base-card1>

    <base-pagination :item="paginator" v-if="paginator" />
  </div>
</template>

<script setup>
import { toast } from "vue3-toastify";
import * as yup from "yup";
import { onMounted, ref, reactive, watch } from "vue";
import axios from "axios";
import TaxRate from "@/components/cards/TaxRate.vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const route = useRoute();
const { t } = useI18n();

const breads = [
  {
    path: "/menu-setup",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.menuSetup"),
  },
  {
    path: "/menu-setup/tax-rates",
    imgIcon: "",
    name: t("TITLES.taxRates"),
  },
  {
    path: "/menu-setup/tax-rates/archived",
    imgIcon: "",
    name: t("BUTTONS.allTrashes", { name: t("TITLES.taxRates") }),
  },
];

const paginator = ref(null);
const items = ref([]);
const loading = ref(true);
function fetchData() {
  loading.value = true;
  axios
    .get("tax_rate/trashed", {
      params: {
        page: route.query.page || 1,
      },
    })
    .then((res) => {
      items.value = res.data.data;
      paginator.value = res.data.meta;
      loading.value = false;
    })
    .catch(() => (loading.value = false));
}
watch(
  () => route.query,
  () => {
    fetchData();
  }
);

function remove(id) {
  items.value = items.value.filter((el) => el.id != id);
  paginator.value.total--;
}

onMounted(() => fetchData());
</script>

<style lang="scss">
.hav-precentage {
  @apply relative;
  .with_icon {
    &::after {
      content: "%";
      @apply absolute text-primary font-bold top-1/2 -translate-y-1/2;
      inset-inline-end: 8px;
    }
  }
}
</style>
