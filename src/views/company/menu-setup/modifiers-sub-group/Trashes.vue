<template>
  <div class="modifiers-sub-group">
    <breadcrumbs
      :items="breads"
      :title="$t('TITLES.modifiersSubGroup')"
      back="/menu-setup/modifiers-sub-group"
    />

    <div
      class="bg-white rounded-[24px] h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] p-7"
    >
      <base-filter
        v-if="items.length || $route.query.keyword"
        name="subGroup"
        :inputs="[]"
        :keyword="true"
        @action="$router.push('/menu-setup/modifiers-group/form')"
      />

      <multi-archive
        :message="$t('TITLES.areYouSureToRestoreSelected')"
        url="restore_ids"
        @reload="
          selectedRows = [];
          fetchData();
        "
        :items="selectedRows"
        model="sub_modifiers"
        :btn-name="$t('BUTTONS.Restore selected')"
        v-if="selectedRows.length"
      />
      <v-data-table-virtual
        :headers="headers"
        show-select
        :items="items"
        class="project-table"
        v-model="selectedRows"
        item-value="id"
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
              src="@/assets/images/stats/modifier_group.png"
              alt=""
            />
            <h3
              class="mt-4 font-semibold text-text text-center"
              v-if="$route.query.keyword"
            >
              {{ $t("TITLES.No Search result") }}
            </h3>
            <h3 class="mt-4 font-semibold text-text text-center" v-else>
              {{
                $t("TITLES.No have been added yet", {
                  name: t("BUTTONS.allTrashes") + t("LABELS.modifiersSubGroup"),
                })
              }}
            </h3>
          </div>
        </template>
        <template v-slot:[`item.name`]="{ item }">
          <small-details-card :title="item.name" />
        </template>
        <template v-slot:[`item.modifiers_count`]="{ item }">
          <small-details-card :title="item.modifiers_count" />
        </template>
        <template v-slot:[`item.min_num_of_selection`]="{ item }">
          <small-details-card :title="item.min_num_of_selection" />
        </template>
        <template v-slot:[`item.max_num_of_selection`]="{ item }">
          <small-details-card :title="item.max_num_of_selection" />
        </template>
        <template v-slot:[`item.added_by`]="{ item }">
          <small-details-card :title="item.added_by?.full_name" />
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <div class="flex justify-end items-center gap-5">
            <div class="flex items-center justify-between gap-2">
              <action-menu
                :restore="true"
                :item="item"
                name="sub_modifier"
                @restore="openResotre(item.id)"
                @reload="
                  fetchData();
                  selectedRows = [];
                "
                @remove="remove(item.id)"
              />
            </div>

            <Teleport to="body">
              <Restore
                v-if="showArchive && itemToShow == item.id"
                :url="`sub_modifier/restore/${item.id}`"
                @remove="
                  itemToShow = '';
                  remove(item.id);
                  showArchive = false;
                "
                @close="showArchive = false"
              />
            </Teleport>
          </div>
        </template>
      </v-data-table-virtual>
    </div>
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
    path: "/menu-setup/modifiers-sub-group",
    imgIcon: "",
    name: t("LABELS.modifiersSubGroup"),
  },
  {
    path: "/menu-setup/modifiers-sub-group/archived",
    imgIcon: "",
    name: t("BUTTONS.allTrashes", { name: t("TITLES.modifiersSubGroup") }),
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
    title: t("LABELS.noOfModifierGroups"),
    align: "start",
    sortable: false,
    key: "modifiers_count",
  },
  {
    title: t("LABELS.minNoOfSelection"),
    align: "start",
    sortable: false,
    key: "min_num_of_selection",
  },
  {
    title: t("LABELS.maxNoOfSelection"),
    align: "start",
    sortable: false,
    key: "max_num_of_selection",
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

// const items = [
//   {
//     created_at: "2023-12-18",
//     deleted_at: "2023-12-24",
//     id: 3,
//     is_active: false,
//     name: "Mushrom Swiss Burger",
//     by: "Adam Taylor",
//     noOfModifierGroups: "3 Modifiers",
//     minNoOfSelection: 0,
//     maxNoOfSelection: 4,
//   },
// ];

const isLoading = ref(false);

function fetchData() {
  loading.value = true;
  axios
    .get("sub_modifier/trashed", {
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

const itemToShow = ref("");

function openResotre(id) {
  itemToShow.value = id;
  showArchive.value = true;
}
const selectedRows = ref([]);
function remove(id) {
  items.value = items.value.filter((el) => el.id != id);
  selectedRows.value = selectedRows.value.filter((el) => el != id);
  paginator.value.total--;
}
onMounted(() => fetchData());
</script>

<style lang="scss">
.modifiers-sub-group {
  td {
    background: transparent !important;
  }
}
</style>
