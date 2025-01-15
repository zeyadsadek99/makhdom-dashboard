<template>
  <div class="h-full flex flex-col">
    <breadcrumbs :items="breadItems" :title="$t('LABELS.settings')" />
    <div class="bg-white rounded-3xl h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] md:p-7 flex-1 flex flex-col">
      <base-filter
        name="settings"
        :inputs="[]"
        :btn-name="t(`BUTTONS.add`, { name: t('LABELS.settings') })"
        icon="fas fa-plus"
        @action="$router.push('/settings/form')"
      />
      <v-data-table-virtual
        :headers="headers"
        :items="items"
        :loading="loading"
        item-value="id"
        class="project-table"
        item-key="id"
        :no-data-text="$t('TEXTS.noData')"
      >
        <template v-slot:loading>
          <loader class="py-7" />
        </template>

        <template v-slot:no-data>
          <div class="text-center" v-if="!$route.query.keyword && !$route.query.status">
            <h3 class="mt-4 font-semibold text-text text-center">
              {{ $t("TITLES.No have been added yet", { name: $t("LABELS.settings") }) }}
            </h3>
            <div class="flex items-center justify-center mt-7 gap-2 flex-wrap">
              <router-link to="/settings/form" class="base-btn rounded-xl self-end">
                <i class="fas fa-plus"></i>
                {{ $t(`BUTTONS.add`, { name: $t("LABELS.settings") }) }}
              </router-link>
            </div>
          </div>
          <h3 v-else class="mt-4 font-semibold text-text text-center">
            {{ $t("TITLES.No Search result") }}
          </h3>
        </template>

        <!-- Custom Slot for displaying Key -->
        <template v-slot:[`item.key`]="{ item }">
          <div class="flex gap-2 items-center flex-wrap">
            <small-details-card :title="`${item.key}`" />
          </div>

        </template>

        <!-- Custom Slot for displaying Value -->
        <template v-slot:[`item.value`]="{ item }">
          <div class="flex gap-2 items-center flex-wrap">
            <!-- Check if the key is 'phones' and display accordingly -->
            <div v-if="item.key === 'phones'">
              <ul>
                <li v-for="(phone, index) in item.value" :key="index" class="flex items-center">
                  <span class="font-semibold">Phone: </span> 
                  <span>{{ phone.phone }}</span>
                  <span class="ml-2">({{ phone.phone_code }})</span>
                </li>
              </ul>
            </div>
            <!-- For other keys, show them as regular text -->
            <div v-else>
              <small-details-card :title="`${item.value}`" />
            </div>
          </div>
        </template>

      </v-data-table-virtual>
    </div>
    <base-pagination :item="paginator" v-if="paginator" />
  </div>
</template>


<script setup>
import axios from "axios";
import { ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const route = useRoute();
const { t } = useI18n();

const breadItems = [
  {
    name: t("TITLES.home"),
    path: "/",
    imgIcon: "settings.svg",
  },
  {
    name: t("LABELS.settings"),
    path: "/settings",
    imgIcon: "",
  },
];

const items = ref([]);
const loading = ref(false);
const paginator = ref(null);

const headers = [
  {
    title: t("LABELS.key"),
    align: "start",
    sortable: false,
    key: "key",
  },

  {
    title: t("LABELS.value"),
    align: "start",
    sortable: false,
    key: "value",
  },
];

function fetchData() {
  loading.value = true;
  axios
    .get("settings", {
      params: {
        keyword: route.query.keyword || "",
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
  () => fetchData()
);

onMounted(() => {
  fetchData();
});
</script>
