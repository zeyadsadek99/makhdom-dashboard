<template>
  <div class="h-full flex flex-col">
    <breadcrumbs :items="breads" :title="t('sidebar.storeSetup')" />

    <!-- <h1 class="page_title">{{ $t("TITLES.Packages") }}</h1> -->
    <!-- Start base filter   -->
    <base-card1 class="h-full">
      <div class="flex flex-wrap items-end justify-between" v-if="items.length">
        <h2 class="text-text text-2xl font-bold gap-2 mb-5">
          {{ (paginator?.total || 0) + " " + $t("LABELS.stores") }}
        </h2>
        <div class="flex items-center flex-wrap justify-end">
          <router-link to="/store-setup/all-trashes" class="archive-btn mb-4">
            {{ $t("BUTTONS.allTrashes", { name: $t("LABELS.stores") }) }}
          </router-link>
          <base-filter
            :keyword="false"
            :inputs="[]"
            :btn-name="t(`BUTTONS.add`, { name: t('LABELS.store') })"
            icon="fas fa-plus"
            @action="$router.push('/store-setup/form')"
          />
        </div>
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
                  name: $t("LABELS.store"),
                })
              }}
            </h3>
          </div>
          <div class="flex items-center gap-2">
            <router-link to="/store-setup/all-trashes" class="archive-btn">
              {{ $t("BUTTONS.allTrashes", { name: $t("LABELS.store") }) }}
            </router-link>
            <router-link
              to="/store-setup/form"
              class="text-white mx-auto bg-primary rounded-lg py-3 px-5 text-base self-end"
            >
              <i class="fas fa-plus"></i>
              {{ $t(`BUTTONS.add`, { name: $t("LABELS.store") }) }}
            </router-link>
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
];

const paginator = ref(null);
const items = ref([]);
const loading = ref(true);

function fetchData() {
  loading.value = true;
  axios
    .get("store")
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
