<template>
  <div class="h-full">
    <breadcrumbs
      :items="breads"
      :title="
        $t('BUTTONS.allTrashes', {
          name: $t('LABELS.deliveryArea'),
        })
      "
      :back="`/store-setup/${$route.params.id}/delivery-areas`"
      class="mb-7"
    />

    <base-card1 class="h-full">
      <base-filter
        v-if="items.length || dataFilterd"
        name="deliveryArea"
        :keyword="false"
        :inputs="[]"
      />

      <Loader v-if="loading" />
      <template v-else>
        <template v-if="items.length">
          <div
            v-for="item in items"
            :key="item.id"
            class="mb-5 last-of-type:mb-0"
          >
            <delivery-areas-card
              :trashed="true"
              @remove="remove"
              @reload="fetchData"
              @edit="
                $router.push(`/brand-settings/loyalty-program/form/${item.id}`)
              "
              url="delivery_area"
              :item="item"
            />
          </div>
        </template>

        <div
          v-else-if="!items.length && !dataFilterd"
          class="items-center flex h-full justify-center"
        >
          <div class="space-y-6">
            <div class="text-center">
              <img
                class="mx-auto"
                src="@/assets/images/stats/deliveryAreas.png"
                alt=""
              />
              <h3 class="mt-4 font-semibold text-text text-center">
                {{
                  $t("TITLES.No have been added yet", {
                    name: $t("BUTTONS.allTrashes", {
                      name: $t("LABELS.deliveryArea"),
                    }),
                  })
                }}
              </h3>
            </div>
          </div>
        </div>
      </template>
    </base-card1>
    <base-pagination :item="paginator" v-if="paginator" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import DeliveryAreasCard from "@/components/cards/delivery-areas/DeliveryAreasCard.vue";
import axios from "axios";
const { t, locale } = useI18n();
const props = defineProps({
  storeData: {
    required: false,
  },
});
const route = useRoute();

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
        name: t("STATUS.Available"),
        id: "1",
      },
      {
        name: t("STATUS.Unavailable"),
        id: "0",
      },
    ],
    type: "select",
    filter: null,
    multiple: false,
  },
];

const breads = ref([]);

const paginator = ref(null);
const items = ref([]);
const loading = ref(true);
const dataFilterd = ref(false);
function fetchData() {
  if (route.query.keyword) {
    dataFilterd.value = true;
  }

  loading.value = true;
  axios
    .get("delivery_area/trashed", {
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
    if (route.query.keyword) {
      dataFilterd.value = true;
    }
    fetchData();
  }
);

watch(
  () => props.storeData,
  (value) => {
    breads.value = [
      {
        path: "/",
        imgIcon: "dashboard.svg",
        name: t("sidebar.dashboard"),
      },
      {
        path: "/store-setup",
        imgIcon: "",
        name: t("sidebar.storeSetup"),
      },
      {
        path: `/store-setup/${value ? value.id : ""}`,
        imgIcon: "",
        name: value ? value[locale.value].name : "",
      },
      {
        path: `/store-setup/${route.params.id}/delivery-areas`,
        imgIcon: "",
        name: t("TITLES.deliveryArea"),
      },
      {
        path: `/store-setup/${route.params.id}/delivery-areas/all-trashes`,
        imgIcon: "",
        name: t("BUTTONS.allTrashes", { name: t("TITLES.deliveryArea") }),
      },
    ];
  },
  {
    immediate: true,
  }
);

function remove(id) {
  items.value = items.value.filter((el) => el.id != id);
  paginator.value.total--;
}

onMounted(() => fetchData());
</script>
