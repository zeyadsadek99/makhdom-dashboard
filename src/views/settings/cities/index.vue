<template>
  <div class="h-full">
    <breadcrumbs
      back="/scope-settings"
      :items="breadItems"
      :title="$t('TITLES.Cities')"
    />
    <div>
      <base-filter
        :inputs="inputs"
        name="city"
        :btn-name="t(`BUTTONS.add`, { name: t('LABELS.city') })"
        icon="fas fa-plus"
        :keyword="true"
        @action="$router.push('/scope-settings/cities/form')"
      >
        <!-- <template v-slot:button>
          <router-link
            to="/scope-settings/cities/all-trashes"
            class="archive-btn"
          >
            {{ $t("BUTTONS.allTrashes", { name: $t("TITLES.Cities") }) }}
          </router-link>
        </template> -->
      </base-filter>
    </div>
    <!-- Start Base Filter  -->
    <!-- End Base Filter  -->

    <!-- Start data table  -->
    <v-data-table-virtual
      :headers="headers"
      :items="items"
      item-value="name"
      :loading="loading"
      item-key="id"
      :no-data-text="$t('TEXTS.noData', { name: $t('LABELS.city') })"
    >
      <template v-slot:loading>
        <loader />
      </template>
      <template v-slot:no-data>
        <div class="text-center">
          <img class="mx-auto" src="@/assets/images/stats/city.png" alt="" />
          <h3 class="mt-4 font-semibold text-text text-center">
            {{
              $t("TITLES.No have been added yet", {
                name: $t("LABELS.city"),
              })
            }}
          </h3>
        </div>
      </template>
      <template v-slot:[`item.city`]="{ item }">
        <small-details-card :title="item.name" />
      </template>

      <template v-slot:[`item.country`]="{ item }">
        <small-details-card :title="`${item.country?.name || ''}`" />
      </template>
      <template v-slot:[`item.is_active`]="{ item }">
        <global-switcher
          :id="item.id"
          model="brand_cities"
          v-model:modalValue="item.is_active"
        />
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <action-menu
          :edit="true"
          :archive="true"
          :item="item"
          name="brand_city"
          @edit="$router.push(`/scope-settings/cities/form/${item.id}`)"
          @reload="fetchData"
          @remove="remove(item.id)"
        />
      </template>
    </v-data-table-virtual>
    <base-pagination :item="paginator" v-if="paginator" />
  </div>
</template>

<script setup>
import { useAppStore } from "@/store/app";
import axios from "axios";
import { useI18n } from "vue-i18n";
import { reactive, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
const appStore = useAppStore();
const items = ref([]);
const loading = ref(false);
const route = useRoute();
const { t, locale } = useI18n();
const inputs = [
  {
    name: "country_id",
    placeholder: "country",
    url: "countries-without-paginated",
    type: "select",
    filter: null,
    multiple: false,
  },
];
const headers = [
  {
    title: t("LABELS.city"),
    align: "start",
    sortable: false,
    key: "city",
  },
  {
    title: t("LABELS.country"),
    align: "start",
    sortable: false,
    key: "country",
  },

  // {
  //   title: t("LABELS.Status"),
  //   align: "start",
  //   sortable: false,
  //   key: "is_active",
  // },

  {
    title: "",
    align: "end",
    sortable: false,
    key: "actions",
  },
];

watch(
  () => route.query,
  () => {
    fetchData();
  }
);
const paginator = ref(null);
function fetchData() {
  loading.value = true;
  axios
    .get("cities", {
      params: {
        page: route.query.page || 1,
        country_id: route.query.country_id ?? "",
        keyword: route.query.keyword ?? "",
      },
    })
    .then((res) => {
      items.value = res.data.data;
      paginator.value = res.data.meta;
      loading.value = false;
    })
    .catch(() => (loading.value = false));
}

const breadItems = [
  {
    name: t("sidebar.settings"),
    path: "/scope-settings",
    imgIcon: "settings.svg",
  },
  {
    name: t("TITLES.Cities"),
    path: "/scope-settings/cities/all",
    imgIcon: "",
  },
];

const openModal = ref(false);
const btnLoading = ref(false);

function remove(id) {
  items.value = items.value.filter((el) => el.id != id);
}

onMounted(() => fetchData());
</script>

<style></style>
