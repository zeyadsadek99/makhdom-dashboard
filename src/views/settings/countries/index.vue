<template>
  <div class="h-full">
    <breadcrumbs
      back="/scope-settings"
      :items="breadItems"
      :title="$t('TITLES.countries')"
    />
    <div class="flex items-center gap-1 justify-end">
      <base-filter
        :inputs="inputs"
        name="country"
        :btn-name="t(`BUTTONS.add`, { name: t('LABELS.country') })"
        icon="fas fa-plus"
        :keyword="true"
        @action="$router.push('/scope-settings/countries/form')"
      />
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
      :loading-text="$t('loadingData')"
      :no-data-text="$t('TEXTS.noData', { name: $t('LABELS.country') })"
    >
      <template v-slot:loading>
        <loader />
      </template>
      <template v-slot:no-data>
        <div class="text-center">
          <img class="mx-auto" src="@/assets/images/stats/map.png" alt="" />
          <h3 class="mt-4 font-semibold text-text text-center">
            {{
              $t("TITLES.No have been added yet", {
                name: $t("LABELS.country"),
              })
            }}
          </h3>
        </div>
      </template>
      <template v-slot:[`item.barnd`]="{ item }">
        <small-details-card :image="item.image" :title="item.name" />
      </template>
      <!-- <template v-slot:[`item.phone_limit`]="{ item }">
        <small-details-card :title="item.phone_limit" />
      </template> -->
      <template v-slot:[`item.phone_code`]="{ item }">
        <small-details-card
          class="!justify-start"
          :dir="$i18n.locale == 'en' ? 'ltr' : 'rtl'"
          :title="`+${item.phone_code}`"
        />
      </template>
      <template v-slot:[`item.is_active`]="{ item }">
        <global-switcher
          :id="item.id"
          model="brand_countries"
          v-model:modalValue="item.is_active"
        />
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <action-menu
          :edit="true"
          :remove="true"
          :item="item"
          name="countries"
          @edit="$router.push(`/scope-settings/countries/form/${item.id}`)"
          @reload="fetchData"
          @remove="remove(item.id)"
        />
      </template>
    </v-data-table-virtual>
    <base-pagination :item="paginator" v-if="paginator" />
  </div>
</template>

<script setup>
import axios from "axios";
import { useI18n } from "vue-i18n";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const items = ref([]);
const loading = ref(false);
const route = useRoute();
const { t } = useI18n();
const inputs = [];
const headers = [
  {
    title: t("LABELS.country"),
    align: "start",
    sortable: false,
    key: "barnd",
  },
  {
    title: t("LABELS.Country key"),
    align: "start",
    sortable: false,
    key: "phone_code",
  },
  {
    title: t("LABELS.shortName"),
    align: "start",
    sortable: false,
    key: "short_name",
  },
  {
    title: t("LABELS.Nationality"),
    align: "start",
    sortable: false,
    key: "nationality",
  },

  {
    title: t("LABELS.Currency"),
    align: "start",
    sortable: false,
    key: "currency",
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
    .get("countries", {
      params: {
        page: route.query.page || 1,
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
    name: t("TITLES.countries"),
    path: "/scope-settings/countries/all",
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
