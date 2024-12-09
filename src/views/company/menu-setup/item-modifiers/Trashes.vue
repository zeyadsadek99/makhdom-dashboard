<template>
  <div class="item-modifiers">
    <breadcrumbs
      :items="breads"
      :title="$t('BUTTONS.allTrashes', { name: t('TITLES.ItemModifier') })"
      back="/menu-setup/item-modifiers"
    />

    <div
      class="bg-white rounded-3xl h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] md:p-7 flex-1 flex flex-col"
    >
      <base-filter
        v-if="items.length || route.query.keyword"
        name="item"
        :inputs="[]"
        icon="fas fa-plus"
        :keyword="true"
      />

      <multi-archive
        :message="$t('TITLES.areYouSureToRestoreSelected')"
        url="restore_ids"
        @reload="
          selectedRows = [];
          fetchData();
        "
        :items="selectedRows"
        model="item_modifiers"
        :btn-name="$t('BUTTONS.Restore selected')"
        v-if="selectedRows.length"
      />
      <v-data-table-virtual
        :headers="headers"
        show-select
        :items="items"
        item-value="id"
        class="project-table"
        v-model="selectedRows"
        item-key="id"
        :loading="loading"
        :loading-text="$t('TEXTS.loadingData')"
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
            <h3
              class="mt-4 font-semibold text-text text-center"
              v-if="!$route.query.keyword"
            >
              {{
                $t("TITLES.No have been added yet", {
                  name: t("BUTTONS.allTrashes") + t("TITLES.ItemModifier"),
                })
              }}
            </h3>
            <h3 class="mt-4 font-semibold text-text text-center" v-else>
              {{ $t("TITLES.No Search result") }}
            </h3>
          </div>
        </template>
        <template v-slot:[`item.name`]="{ item }">
          <!-- <small-details-card :image="item.icon" /> -->
          <small-details-card :title="item.name" />
        </template>
        <template v-slot:[`item.deleted_at`]="{ item }">
          <small-details-card :title="item.deleted_at" />
        </template>
        <template v-slot:[`item.added_by`]="{ item }">
          <small-details-card :title="item.added_by?.full_name" />
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <!-- <action-menu
            :item="item"
            name="item_modifier"
            :restore="true"
            @restore="showArchive = true"
            @reload="fetchData"
            @remove="remove(item.id)"
          /> -->

          <action-menu
            :restore="true"
            :item="item"
            name="item_modifier"
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
              :url="`item_modifier/restore/${item.id}`"
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
  </div>
</template>

<script setup>
import { toast } from "vue3-toastify";
import { onMounted, ref, reactive, watch } from "vue";
import axios from "axios";
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
    path: "/menu-setup/item-modifiers",
    imgIcon: "",
    name: t("LABELS.ItemModifier"),
  },
  {
    path: "/menu-setup/item-modifiers/archived",
    imgIcon: "",
    name: t("BUTTONS.allTrashes", { name: t("TITLES.ItemModifier") }),
  },
];

const headers = [
  {
    title: t("LABELS.item"),
    align: "start",
    sortable: false,
    key: "name",
  },
  {
    title: t("LABELS.modifierGroup"),
    align: "start",
    sortable: false,
    key: "modifier.name",
  },
  {
    title: t("LABELS.modifiersSubGroup"),
    align: "start",
    sortable: false,
    key: "sub_modifier.name",
  },
  {
    title: t("LABELS.Date"),
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

function fetchData() {
  loading.value = true;
  axios
    .get("item_modifier/trashed", {
      params: {
        page: route.query.page || 1,
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
.item-modifiers {
  td {
    background: transparent !important;
  }
}
</style>
