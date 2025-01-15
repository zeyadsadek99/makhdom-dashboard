<template>
  <div class="h-full flex flex-col">
    <breadcrumbs
      :items="breads"
      :title="t('TITLES.facilities')"
      back="/"
      class="mb-7"
    />

    <div
      class="bg-white rounded-3xl h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] md:p-7 flex-1 flex flex-col"
    >
      <base-filter
        v-if="items.length || dataFilterd"
        name="facilities"
        :inputs="inputs"
        :btn-name="t(`BUTTONS.add`, { name: t('LABELS.facility') })"
        icon="fas fa-plus"
        :keyword="true"
        @action="$router.push('/facility/form')"
        :canStore="checkPermission('facility-types', 'store')"
      />

      <Loader v-if="loading" />
      <div v-else :class="!items.length ? 'h-full' : ''">
        <div class="grid xl:grid-cols-2 gap-4" v-if="items.length">
          <details-card
            @remove="remove"
            @reload="fetchData"
            @edit="$router.push(`/facility/form/${item.id}`)"
            v-for="item in items"
            :key="item.id"
            :item="item"
            permission-key="facility-types"
            url="facility-types"
            :showAcivate="true"
            :activate="`facility-types/${item.id}/toggle-active-item`"
          />
        </div>
        <div
          v-else
          class="h-full flex flex-col items-center justify-center space-y-6"
        >
          <div class="text-center">
            <img
              class="mx-auto"
              src="@/assets/images/icons/brand/franchise.png"
              alt=""
            />
            <h3 class="mt-4 font-semibold text-text text-center">
              {{
                $t("TITLES.No have been added yet", {
                  name: $t("LABELS.facilities"),
                })
              }}
            </h3>
          </div>
          <div
            class="flex items-center gap-2 flex-wrap"
            v-if="checkPermission('facility-types', 'store')"
          >
            <router-link
              to="/facility/form"
              class="text-white mx-auto bg-primary rounded-lg py-3 px-5 text-base self-end"
            >
              <i class="fas fa-plus"></i>
              {{ $t(`BUTTONS.add`, { name: $t("LABELS.facility") }) }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <base-pagination :item="paginator" v-if="paginator" />

    <!-- End page content -->
  </div>
</template>

<script setup>
import { checkPermission } from "@/utils/permissions";
import axios from "axios";
import DetailsCard from "@/components/cards/DetailsCard.vue";
import { ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const { t } = useI18n();

const route = useRoute();

const breads = [
  {
    path: "/",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.home"),
  },
  {
    path: "/facility",
    imgIcon: "",
    name: t("TITLES.facilities"),
  },
];
const loading = ref(true);
const inputs = [
  {
    name: "type",
    placeholder: "type",
    options: [
      {
        name: t("STATUS.All"),
        id: "",
      },
      {
        id: "provider",
        name: t("LABELS.Wholesaler"),
      },
      {
        id: "wholesale",
        name: t("LABELS.Retailer"),
      },
    ],
    type: "select",
    filter: null,
    multiple: false,
  },
];

const items = ref([]);

const paginator = ref(null);
function fetchData() {
  loading.value = true;
  axios
    .get("facility-types", {
      params: {
        keyword: route.query.keyword || "",
        type: route.query.type || "",
        page: +route.query.page || 1,
      },
    })
    .then((res) => {
      items.value = res.data.data.map((item) => ({
        ...item,
        type:
          item.type === "provider"
            ? t("LABELS.Wholesaler")
            : t("LABELS.Retailer"),
      }));
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

const dataFilterd = ref(false);

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
