<template>
  <div class="h-full">
    <breadcrumbs
      :items="breads"
      :title="$t(`LABELS.Zones`)"
      back="/zones"
      class="mb-7"
    />
    <base-card1 class="h-full">
      <base-filter
        v-if="items.length || dataFilterd"
        name="zones"
        :keyword="false"
        :inputs="inputs"
        :btn-name="$t('BUTTONS.new', { name: $t('LABELS.zone') })"
        icon="fas fa-plus"
        @action="$router.push(`/zones/form`)"
        filterClass="!justify-start"
      />

      <Loader v-if="loading" />
      <template v-else>
        <div
          class="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-3 gap-6"
          v-if="items.length"
        >
          <div
            v-for="item in items"
            :key="item.id"
            class="mb-5 last-of-type:mb-0"
          >
            <ZonesCard
              @remove="remove"
              @reload="fetchData"
              @edit="$router.push(`/zones/form/${item.id}`)"
              url="zones"
              :item="item"
            />
          </div>
        </div>

        <div
          v-else-if="!items.length"
          class="items-center flex h-full justify-center"
        >
          <h3
            class="mt-4 font-semibold text-text text-center"
            v-if="dataFilterd"
          >
            {{ $t("TITLES.No Search result") }}
          </h3>
          <div class="space-y-6" v-else>
            <div class="text-center">
              <img
                class="mx-auto"
                src="@/assets/images/stats/deliveryAreas.png"
                alt=""
              />
              <h3 class="mt-4 font-semibold text-text text-center">
                {{
                  $t("TITLES.No have been added yet", {
                    name: $t("LABELS.zones"),
                  })
                }}
              </h3>
            </div>
            <div class="flex flex-wrap items-center gap-2 justify-center">
              <router-link
                to="/zones/form"
                class="base-btn rounded-xl self-end"
              >
                <i class="fas fa-plus"></i>
                {{ $t(`BUTTONS.new`, { name: $t("LABELS.zone") }) }}
              </router-link>
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
import ZonesCard from "@/components/cards/zones/ZonesCard.vue";
import axios from "axios";
const { t, locale } = useI18n();

const route = useRoute();
const props = defineProps({
  storeData: {
    required: false,
  },
});
const breads = ref([]);
const inputs = [
  {
    name: "city_id",
    placeholder: "city",

    url: "cities-without-paginated",
    type: "select",
    filter: null,
    multiple: false,
  },
  {
    name: "district_id",
    placeholder: "district",

    url: "districts-without-paginated",
    type: "select",
    filter: null,
    multiple: false,
  },
];

// fetchCurrency();

const paginator = ref(null);
const items = ref([]);
const loading = ref(true);
const dataFilterd = ref(false);
function fetchData() {
  dataFilterd.value = false;

  loading.value = true;
  axios
    .get("zones", {
      params: {
        city_id: route.query.city_id || "",
        district_id: route.query.district_id || "",
        page: +route.query.page || 1,
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
    if (
      route.query.status == 0 ||
      route.query.status == 1 ||
      route.query.keyword
    ) {
      dataFilterd.value = true;
    }
    fetchData();
  }
);

function remove(id) {
  items.value = items.value.filter((el) => el.id != id);
  paginator.value.total--;
}

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
        path: "zones",
        imgIcon: "",
        name: t("LABELS.Zones"),
      },
    ];
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  fetchData();
});
</script>
