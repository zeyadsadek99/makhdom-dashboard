<template>
  <div class="h-full">
    <breadcrumbs
      back="/scope-settings"
      :items="breadItems"
      :title="$t('LABELS.Districts')"
    />
    <div>
      <base-filter
        :inputs="inputs"
        name="Districts"
        :btn-name="t(`BUTTONS.add`, { name: t('LABELS.district') })"
        icon="fas fa-plus"
        :keyword="true"
        @action="$router.push('/scope-settings/districts/form')"
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
                name: $t("LABELS.districts"),
              })
            }}
          </h3>
        </div>
      </template>
      <template v-slot:[`item.name`]="{ item }">
        <small-details-card :title="item.name" />
      </template>

      <template v-slot:[`item.city`]="{ item }">
        <small-details-card :title="`${item.city?.name || ''}`" />
      </template>
      <template v-slot:[`item.country`]="{ item }">
        <small-details-card :title="`${item.city?.country?.name || ''}`" />
      </template>
      <template v-slot:[`item.is_active`]="{ item }">
        <global-switcher
          :id="item.id"
          :url="`districts/${item.id}/toggle-active-item`"
          v-model:modalValue="item.is_active"
        />
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <action-menu
          :edit="true"
          :remove="true"
          :item="item"
          name="districts"
          @edit="$router.push(`/scope-settings/districts/form/${item.id}`)"
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
const inputs = [
  {
    name: "city_id",
    placeholder: "city",
    url: "cities-without-paginated",
    type: "select",
    filter: null,
    multiple: false,
  },
];
const headers = [
  {
    title: t("LABELS.Name"),
    align: "start",
    sortable: false,
    key: "name",
  },
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

  {
    title: t("LABELS.Status"),
    align: "start",
    sortable: false,
    key: "is_active",
  },

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
    .get("districts", {
      params: {
        page: route.query.page || 1,
        city_id: route.query.city_id ?? "",
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
    name: t("LABELS.Districts"),
    path: "/scope-settings/districts/all",
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
