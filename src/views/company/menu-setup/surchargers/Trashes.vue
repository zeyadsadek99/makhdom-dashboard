<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="(t('BUTTONS.allTrashes', { name: t('LABELS.Surcharge') }))"
      back="/menu-setup/surchargers"
      class="mb-7"
    />

    <base-card1
      class="flex-1 bg-white"
      :class="items.length ? '' : 'flex flex-col'"
    >
    <!-- <base-card1 class="flex-1 bg-white p-0 md:p-4"> -->
    <div :class="items.length ? 'space-y-5' : 'my-auto'">

      <Loader v-if="loading" />
      <template v-else>
        <template v-if="items.length">
          <surchargers
            v-for="item in items"
            :key="item.id"
            :item="item"
            @remove="remove"
            @reload="fetchData"
            :trashed="true"
          />
        </template>

        <div
          v-else
          class="h-full my-auto items-center justify-center space-y-6"
        >
          <div class="text-center">
            <img class="mx-auto" src="@/assets/images/surchargers.png" alt="" />
            <h3 class="mt-4 font-semibold text-text text-center">
              {{
                $t("TITLES.No have been added yet", {
                  name: t('BUTTONS.allTrashes') + t('TITLES.Surcharges')
                })
              }}
            </h3>
          </div>
        </div>
      </template>
    </div>

    </base-card1>
  </div>
</template>

<script setup>
import axios from "axios";
import Surchargers from "@/components/cards/Surchargers.vue";
import { ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const { t } = useI18n();

const route = useRoute();

const breads = [
  {
    path: "/menu-setup",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.menuSetup"),
  },
  {
    path: "/menu-setup/surchargers",
    imgIcon: "",
    name: t("TITLES.Surcharges"),
  },
  {
    path: "/menu-setup/surchargers/archived",
    imgIcon: "",
    name: t("BUTTONS.allTrashes", { name: t("TITLES.Surcharges") }),
  },
];

const loading = ref(true);

const items = ref([]);
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
const paginator = ref(null);
function fetchData() {
  loading.value = true;
  axios
    .get("surcharge/trashed", {
      params: {
        keyword: route.query.keyword || "",
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
onMounted(() => {
  if (route.query.keyword) {
    dataFilterd.value = true;
  }
  fetchData();
});
function remove(id) {
  items.value = items.value.filter((el) => el.id != id);
  paginator.value.total--;
}
</script>
