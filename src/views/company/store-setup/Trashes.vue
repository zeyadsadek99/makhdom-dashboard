<template>
  <div class="h-full flex flex-col">
    <breadcrumbs
      back="/store-setup"
      :items="breads"
      :title="t('sidebar.storeSetup')"
    />

    <!-- <h1 class="page_title">{{ $t("TITLES.Packages") }}</h1> -->
    <!-- Start base filter   -->
    <base-card1 class="h-full">
      <div class="flex flex-wrap items-end justify-between" v-if="items.length">
        <h2 class="text-text text-2xl font-bold gap-2 mb-5">
          {{ (paginator?.total || 0) + " " + $t("LABELS.stores") }}
        </h2>
      </div>
      <Loader v-if="loading" />
      <template v-else>
        <template v-if="items.length">
          <div
            class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4"
          >
            <base-card
              class="border mb-4 last:mb-0"
              v-for="item in items"
              :key="item.id"
            >
              <store-card
                :item="item"
                @remove="remove"
                @reload="fetchData"
                :trashed="true"
                @edit="openEdit(item)"
              />
            </base-card>
          </div>
        </template>

        <div
          v-else
          class="h-full flex flex-col items-center justify-center space-y-6"
        >
          <div class="text-center">
            <img
              class="mx-auto"
              src="@/assets/images/icons/brand/franchise.png"
              alt=""
            />
            <h3 class="mt-4 font-semibold text-text text-center">
              {{
                $t("TITLES.No have been added yet", {
                  name: t('BUTTONS.allTrashes') + t('LABELS.store')
                })
              }}
            </h3>
          </div>
        </div>
      </template>
    </base-card1>
    <base-pagination :item="paginator" v-if="paginator" />

    <!-- End page content -->
  </div>
</template>

<script setup>
import * as yup from "yup";
import StoreCard from "@/components/cards/store/StoreCard.vue";
import { useI18n } from "vue-i18n";
import { onMounted, ref, reactive } from "vue";
import axios from "axios";

const { t } = useI18n();

const breads = [
  {
    path: "/store-setup",
    imgIcon: "storeSetup.svg",
    name: t("sidebar.storeSetup"),
  },
  {
    path: "/store-setup/all-trashes",
    imgIcon: "storeSetup.svg",
    name: t("BUTTONS.allTrashes", { name: t("LABELS.stores") }),
  },
];

const paginator = ref(null);
const items = ref([]);
const loading = ref(true);

function fetchData() {
  loading.value = true;
  axios
    .get("store/trashed")
    .then((res) => {
      items.value = res.data.data;
      paginator.value = res.data.meta;
      loading.value = false;
    })
    .catch(() => (loading.value = false));
}

function remove(id) {
  items.value = items.value.filter((el) => el.id != id);
  paginator.value.total--;
}

onMounted(() => fetchData());
</script>

<style></style>
