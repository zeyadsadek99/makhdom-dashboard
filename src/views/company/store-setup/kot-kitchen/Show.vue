<template>
  <div class="h-full flex flex-col">
    <loader v-if="loading" />
    <template v-else>
      <breadcrumbs
        :items="breads"
        :title="item[$i18n.locale].name"
        back="/brand-settings/loyalty-program"
        class="mb-7"
        v-if="item"
      />

      <ProgramCardShow :item="item" v-if="item" class="mb-4" />

      <div
        class="bg-white rounded-3xl h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] md:p-7 flex-1 flex flex-col"
      >
        <div class="flex items-center gap-2 justify-between">
          <p class="text-sub">0 {{ $t("LABELS.entities") }}</p>
          <base-filter
            keywordClass="ms-auto"
            name="Clinet Name"
            :inputs="[]"
            :keyword="true"
          />
        </div>

        <v-data-table-virtual
          :headers="headers"
          show-select
          :items="items"
          :loading="loading"
          item-value="name"
          class="project-table"
          item-key="id"
          :no-data-text="$t('TEXTS.noData')"
        >
          <template v-slot:loading>
            <loader class="py-7" />
          </template>
          <template v-slot:no-data>
            <div class="text-center">
              <img
                class="mx-auto"
                src="@/assets/images/stats/loyalty.png"
                alt=""
              />
              <h3 class="mt-4 font-semibold text-text text-center">
                {{
                  $t("TITLES.No have been added yet", {
                    name: $t("LABELS.orders"),
                  })
                }}
              </h3>
            </div>
          </template>

          <template v-slot:[`item.code`]="{ item }">
            <small-details-card :title="item.code" />
          </template>
          <template v-slot:[`item.brand_country.name`]="{ item }">
            <small-details-card :title="item.brand_country.name" />
          </template>
          <template v-slot:[`item.customer`]="{ item }">
            <small-details-card :title="item.customer?.full_name" />
          </template>

          <template v-slot:[`item.points`]="{ item }">
            {{ item.points }}
            <span v-if="item.points > 1">
              {{ $t("LABELS.points") }}
            </span>
            <span v-else>
              {{ $t("LABELS.point") }}
            </span>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <action-menu
              :show="true"
              :show-title="$t(`BUTTONS.details`)"
              :item="item"
              name="product"
              @show="
                $router.push(`/brand-settings/loyalty-cards/show/${item.id}`)
              "
            />
          </template>
        </v-data-table-virtual>
      </div>
      <base-pagination :item="paginator" v-if="paginator" />
    </template>
  </div>
</template>

<script setup>
import ProgramCardShow from "@/components/cards/loyalty/ProgramCardShow.vue";
import axios from "axios";

import { ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const { t, locale } = useI18n();

const route = useRoute();
const dataFilterd = ref(false);

const breads = ref([
  {
    path: "/brand-settings",
    imgIcon: "brand-settings.svg",
    name: t("sidebar.brandSettings"),
  },
  {
    path: "/brand-settings/loyalty-program",
    imgIcon: "",
    name: t("TITLES.loyaltyProgram"),
  },
]);
const headers = [
  {
    title: t("LABELS.orderNumber"),
    align: "start",
    sortable: false,
    key: "code",
  },
  {
    title: t("LABELS.store"),
    align: "start",
    sortable: false,
    key: "customer",
  },
  {
    title: t("LABELS.createdAt"),
    align: "start",
    sortable: false,
    key: "created_at",
  },
  {
    title: t("LABELS.total"),
    align: "start",
    sortable: false,
    key: "ordering",
  },
  {
    title: t("LABELS.points"),
    align: "start",
    sortable: false,
    key: "points",
  },
  {
    title: "",
    align: "start",
    sortable: false,
    key: "actions",
  },
];

const item = ref(null);
const items = ref([]);
const loading = ref(false);
const paginator = ref(null);
function fetchData() {
  if (route.query.keyword) {
    dataFilterd.value = true;
  }
  loading.value = true;
  axios
    .get(`loyal_program/${route.params.id}`, {
      params: {
        keyword: route.query.keyword || "",
        page: +route.query.page || 1,
      },
    })
    .then((res) => {
      breads.value = [
        {
          path: "/brand-settings",
          imgIcon: "brand-settings.svg",
          name: t("sidebar.brandSettings"),
        },
        {
          path: "/brand-settings/loyalty-program",
          imgIcon: "",
          name: t("TITLES.loyaltyProgram"),
        },
        {
          path: `/brand-settings/loyalty-program/show/${res.data.data.id}`,
          imgIcon: "",
          name: res.data.data[locale.value].name,
        },
      ];

      item.value = res.data.data;
      // items.value = res.data.data;
      paginator.value = res.data.meta;
      loading.value = false;
    })
    .catch(() => (loading.value = false));
}

onMounted(() => {
  if (route.query.keyword) {
    dataFilterd.value = true;
  }
  fetchData();
});

watch(
  () => route.query,
  () => {
    if (route.query.keyword) {
      dataFilterd.value = true;
    }
    fetchData();
  }
);
function remove(id) {
  items.value = items.value.filter((el) => el.id != id);
  paginator.value.total--;
}
</script>
