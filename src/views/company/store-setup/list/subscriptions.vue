<template>
  <div class="h-full">
    <breadcrumbs
      :icon="storeData.image"
      :items="breads"
      :title="storeData[$i18n.locale].name"
      :back="`/store-setup/${$route.params.id}`"
    />

    <base-filter :inputs="inputs" name="subscriptions" :keyword="true">
      <template #button>
        <button type="button" @click="exportItme" class="export-btn">
          <svg-icon name="export" />

          <span>{{ $t("BUTTONS.export") }}</span>
        </button>
      </template>
    </base-filter>

    <!-- Start Base Filter  -->
    <!-- End Base Filter  -->

    <!-- Start data table  -->
    <v-data-table-virtual
      :headers="headers"
      :items="items"
      item-value="name"
      :loading="loading"
      item-key="id"
      :no-data-text="$t('TEXTS.noData', { name: $t('LABELS.country') })"
    >
      <template v-slot:loading>
        <loader />
      </template>
      <template v-slot:no-data>
        <div class="text-center">
          <img
            class="mx-auto"
            src="@/assets/images/stats/subscriptions.png"
            alt=""
          />
          <h3 class="mt-4 font-semibold text-text text-center">
            {{
              $t("TITLES.No have been added yet", {
                name: $t("LABELS.subscriptions"),
              })
            }}
          </h3>
        </div>
      </template>
      <template v-slot:[`item.id`]="{ item }">
        <small-details-card :title="`#${item.id}`" />
      </template>
      <template v-slot:[`item.barnd`]="{ item }">
        <div class="!w-[150px]">
          <small-details-card :title="item.name" />
        </div>
      </template>
      <template v-slot:[`item.price`]="{ item }">
        <small-details-card :title="item.price + '$'" />
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <span class="status" :class="item.status">{{
          $t(`STATUS.${item.status}`)
        }}</span>
      </template>
      <template v-slot:[`item.package`]="{ item }">
        <small-details-card
          class="justify-start"
          :title="`${item.package.name} `"
        />
      </template>
      <template v-slot:[`item.method`]>
        <small-details-card class="justify-start" :title="$t('LABELS.cash')" />
      </template>
      <template v-slot:[`item.start_date`]="{ item }">
        <small-details-card
          class="justify-start"
          :title="
            new Date(item.start_date).toLocaleDateString(
              $i18n.locale == 'en' ? 'en-EG' : 'ar-EG',
              {
                year: 'numeric',
                day: 'numeric',
                month: 'long',
              }
            )
          "
        />
      </template>
      <!-- <template v-slot:[`item.status`]="{ item }">
    
      </template> -->
      <template v-slot:[`item.actions`]="{ item }">
        <action-menu
          :edit="true"
          :archive="true"
          :item="item"
          name="brand_country"
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
import { reactive, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { toast } from "vue3-toastify";
const props = defineProps({
  storeData: {
    required: true,
  },
});

const items = ref([]);
const loading = ref(false);
const route = useRoute();
const { t, locale } = useI18n();
const inputs = [
  {
    name: "status",
    placeholder: "status",
    options: [
      {
        name: t("STATUS.All"),
        id: "",
      },
      {
        name: t("LABELS.paid"),
        id: "paid",
      },
      {
        name: t("STATUS.expired"),
        id: "expired",
      },
      {
        name: t("STATUS.cancelled"),
        id: "cancelled",
      },
      {
        name: t("STATUS.unpaid"),
        id: "unpaid",
      },
      {
        name: t("STATUS.pending"),
        id: "pending",
      },
    ],
    type: "select",
    filter: null,
    multiple: false,
  },
];
const headers = [
  {
    title: t("LABELS.Invoice Number"),
    align: "start",
    sortable: false,
    key: "id",
    width: "100",
  },
  {
    title: t("LABELS.Transaction Date"),
    align: "start",
    width: "150",
    sortable: false,
    key: "start_date",
  },
  {
    title: t("LABELS.package"),
    align: "start",
    sortable: false,
    key: "package",
  },

  {
    title: t("LABELS.amount"),
    align: "start",
    sortable: false,
    key: "price",
  },
  {
    title: t("LABELS.method"),
    align: "start",
    sortable: false,
    key: "method",
  },
  {
    title: t("LABELS.Status"),
    align: "start",
    sortable: false,
    key: "status",
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
    .get("subscriptions", {
      params: {
        status: route.query.status || "",
        page: route.query.page || 1,
        store_id: route.query.store_id || "",
        brand_id: route.query.brand_id || "",
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
const breads = [
  {
    path: "/store-setup",
    imgIcon: "storeSetup.svg",
    name: t("sidebar.storeSetup"),
  },
  {
    path: `/store-setup/${props.storeData.id}/show`,
    imgIcon: "",
    name: props.storeData[locale.value].name,
  },
  {
    path: `/store-setup/${props.storeData.id}/subscriptions${
      route.query.store_id
        ? `?store_id=${route.query.store_id}`
        : route.query.store_id
        ? `?brand_id=${route.query.brand_id}`
        : ""
    }`,
    imgIcon: "",
    name: t("Subscriptions Details"),
  },
];

const openModal = ref(false);
const btnLoading = ref(false);

function remove(id) {
  items.value = items.value.filter((el) => el.id != id);
}

function exportItme() {
  axios({
    url: `store/${route.query.store_id}/subscribes-excel-sheet`,
    method: "GET",
    responseType: "blob", // Important
  })
    .then((res) => {
      const blob = new Blob([res.data], {
        type: res.data.type,
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      // link.download = "subscriptions";
      link.click();
      URL.revokeObjectURL(link.href);
    })
    .catch((err) => {
      toast.error(err.response.status);
    });
}

// function exportItme() {
//   axios({
//     url: `report/${route.params.id}/client-feedbacks-excel-sheet`,
//     method: "GET",
//     responseType: "blob", // Important
//   }).then((res) => {
//     const blob = new Blob([res.data], {
//       type: res.data.type,
//     });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "feedback-clients";
//     link.click();
//     URL.revokeObjectURL(link.href);
//   });
// }

onMounted(() => fetchData());
</script>

<style></style>
