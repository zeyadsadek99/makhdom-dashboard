<template>
  <div class="menu-items">
    <breadcrumbs
      :items="breads"
      :title="$t('TITLES.menuItems')"
      back="/menu-setup/menu-items"
    />

    <multi-archive
      :message="$t('TITLES.areYouSureToRestoreSelected')"
      url="restore_ids"
      @reload="
        selectedRows = [];
        fetchData();
      "
      :items="selectedRows"
      model="products"
      :btn-name="$t('BUTTONS.Restore selected')"
      v-if="selectedRows.length"
    />
    <v-data-table-virtual
      :headers="headers"
      show-select
      :items="items"
      item-value="id"
      v-model="selectedRows"
      class="project-table"
      item-key="id"
      :loading="loading"
      :no-data-text="$t('TEXTS.noData')"
    >
      <template v-slot:loading>
        <loader class="py-7" />
      </template>
      <template v-slot:no-data>
        <div class="text-center">
          <img
            class="mx-auto"
            src="@/assets/images/stats/food-icon.png"
            alt=""
          />
          <h3 class="mt-4 font-semibold text-text text-center">
            {{
              $t("TITLES.No have been added yet", {
                name: t("BUTTONS.allTrashes") + t("TITLES.menuItems"),
              })
            }}
          </h3>
        </div>
      </template>
      <template v-slot:[`item.menuItem`]="{ item }">
        <small-details-card :image="item.image" :title="item.name" />
      </template>

      <template v-slot:[`item.added_by`]="{ item }">
        <small-details-card :title="item.added_by?.full_name" />
      </template>
      <template v-slot:[`item.category`]="{ item }">
        <small-details-card :title="item.category?.name ?? null" />
      </template>
      <template v-slot:[`item.sub_category`]="{ item }">
        <small-details-card :title="item.sub_category?.name ?? null" />
      </template>
      <template v-slot:[`item.type`]="{ item }">
        <small-details-card :title="item.type ? $t(item.type) : null" />
      </template>
      <template v-slot:[`item.deleted_at`]="{ item }">
        <small-details-card :title="item.deleted_at" />
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <action-menu
          :restore="true"
          :item="item"
          name="product"
          @restore="openResotre(item.id)"
          @reload="
            fetchData();
            selectedRows = [];
          "
          @remove="remove(item.id)"
        />

        <Teleport to="body">
          <Restore
            v-if="showArchive && itemToShow == item.id"
            :url="`product/restore/${item.id}`"
            @remove="
              itemToShow = '';
              remove(item.id);
              showArchive = false;
            "
            @close="showArchive = false"
          />
        </Teleport>
      </template>
    </v-data-table-virtual>
  </div>
</template>

<script setup>
import { toast } from "vue3-toastify";
import { onMounted, ref, reactive, watch } from "vue";
import axios from "axios";
import TaxRate from "@/components/cards/TaxRate.vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import * as yup from "yup";
const route = useRoute();
const { t } = useI18n();
const paginator = ref(null);
const loading = ref(false);
const breads = [
  {
    path: "/menu-setup",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.menuSetup"),
  },
  {
    path: "/menu-setup/menu-items",
    imgIcon: "",
    name: t("LABELS.menuItems"),
  },
  {
    path: "/menu-setup/menu-items/archived",
    imgIcon: "",
    name: t("BUTTONS.allTrashes", { name: t("TITLES.menuItems") }),
  },
];
const headers = [
  {
    title: t("LABELS.menuItem"),
    align: "start",
    sortable: false,
    key: "menuItem",
  },
  {
    title: t("LABELS.category"),
    align: "start",
    sortable: false,
    key: "category",
  },
  {
    title: t("LABELS.subCategory"),
    align: "start",
    sortable: false,
    key: "sub_category",
  },
  {
    title: t("LABELS.itemType"),
    align: "start",
    sortable: false,
    key: "type",
  },
  {
    title: t("TITLES.archived date"),
    align: "start",
    sortable: false,
    key: "deleted_at",
  },
  {
    title: t("LABELS.by"),
    align: "start",
    sortable: false,
    key: "added_by",
  },
  {
    title: "",
    align: "center",
    sortable: false,
    key: "actions",
  },
];

const items = ref([]);
const itemToShow = ref("");

function openResotre(id) {
  itemToShow.value = id;
  showArchive.value = true;
}
const isLoading = ref(false);

function fetchData() {
  loading.value = true;
  axios
    .get("product/trashed", {
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
const showArchive = ref(false);
const selectedRows = ref([]);
function remove(id) {
  items.value = items.value.filter((el) => el.id != id);
  selectedRows.value = selectedRows.value.filter((el) => el != id);
  paginator.value.total--;
}

onMounted(() => fetchData());
</script>

<style lang="scss">
.menu-items {
  td {
    background: transparent !important;
  }
}
</style>
