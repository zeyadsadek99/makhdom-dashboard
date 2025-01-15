<template>
  <div class="h-full flex flex-col">
    <loader v-if="loading" />
    <template v-else>
      <breadcrumbs
        :items="breads"
        :title="t('LABELS.Deals')"
        back="/"
        class="mb-7"
      />

      <div
        class="bg-white rounded-3xl h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] md:p-7 flex-1 flex flex-col"
      >
        <base-filter
          v-if="items.length || dataFilterd"
          name="Products"
          :inputs="inputs"
          hideLabel
          :keyword="true"
        />
        <template v-if="error">
          <not-found v-if="error.status === 404" />
          <back-error v-if="error.status === 500" />
        </template>

        <div
          v-else
          class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
          <deals-card v-for="deal in items" :key="deal.id" :deal="deal" />
        </div>
        <div class="text-center" v-if="!items.length && !dataFilterd">
          <img
            class="mx-auto"
            src="@/assets/images/stats/food-icon.png"
            alt=""
          />
          <h3 class="mt-4 font-semibold text-text text-center">
            {{
              $t("TITLES.No have been added yet", {
                name: $t("LABELS.Deals"),
              })
            }}
          </h3>
        </div>
        <!-- show-select -->
      </div>
      <base-pagination :item="paginator" v-if="paginator" />
    </template>
  </div>
</template>

<script setup>
import axios from "axios";
import DealsCard from "@/components/deals/DealsCard.vue";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const { t } = useI18n();

const error = ref(null);

const inputs = [
  {
    name: "category",
    placeholder: "category",
    url: "categories-without-paginated",
    type: "select",
    filter: null,
    multiple: false,
  },
  {
    name: "status",
    placeholder: t("status"),
    options: [
      {
        name: t("STATUS.All"),
        id: "",
      },
      {
        name: t("STATUS.pending"),
        id: "pending",
      },
      {
        name: t("STATUS.accepted"),
        id: "accepted",
      },
      {
        name: t("STATUS.refused"),
        id: "refused",
      },
    ],
    type: "select",
    filter: null,
    multiple: false,
  },
];

const route = useRoute();
const dataFilterd = ref(false);
const breads = [
  {
    path: "/",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.home"),
  },
  {
    path: "/deals",
    imgIcon: "",
    name: t("LABELS.Deals"),
  },
];

const items = ref([]);
const loading = ref(false);
const paginator = ref(null);
function fetchData() {
  error.value = null;
  if (route.query.keyword || route.query.category) {
    dataFilterd.value = true;
  }

  const params = new URLSearchParams();
  params.append("keyword", route.query.keyword || "");
  params.append("status", route.query.status || "");
  params.append("category_id", route.query.category || "");

  params.append("page", route.query.type || +route.query.page || 1);

  loading.value = true;
  axios
    .get("deals", {
      params: params,
    })
    .then((res) => {
      items.value = res.data.data;
      paginator.value = res.data.meta;
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
      error.value = err.response;
    });
}

watch(
  () => route.query,
  () => {
    if (route.query.keyword) {
      dataFilterd.value = true;
    }
    fetchData();
  }
);

onMounted(() => fetchData());
</script>
