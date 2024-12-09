<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="
        $t('BUTTONS.allTrashes', {
          name: $t('LABELS.kotKitchen'),
        })
      "
      :back="`/store-setup/${route.params.id}/kot-kitchens`"
      class="mb-7"
    />

    <base-card1 class="h-full">
      <!-- <base-filter
        v-if="items.length || dataFilterd"
        name="loyaltyProgram"
        :keyword="true"
        :inputs="[]"
      /> -->

      <Loader v-if="loading" />
      <template v-else>
        <template v-if="items.length">
          <div
            v-for="item in items"
            :key="item.id"
            class="mb-5 last-of-type:mb-0"
          >
            <kotCard
              :trashed="true"
              @remove="remove"
              @reload="fetchData"
              @edit="
                $router.push(
                  `/store-setup/${route.params.id}/kot-kitchen/form/${item.id}`
                )
              "
              url="kot"
              :item="item"
            />
          </div>
        </template>
        <h3
          v-if="$route.query.keyword && !items.length"
          class="mt-4 font-semibold text-text text-center"
        >
          {{ $t("TITLES.No Search result") }}
        </h3>

        <div
          v-if="!$route.query.keyword && !items.length"
          class="items-center flex h-full justify-center"
        >
          <div class="space-y-6">
            <div class="text-center">
              <img class="mx-auto" src="@/assets/images/stats/kot.png" alt="" />
              <h3 class="mt-4 font-semibold text-text text-center">
                {{
                  $t("TITLES.No have been added yet", {
                    name: $t("BUTTONS.allTrashes", {
                      name: $t("LABELS.kotKitchen"),
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
import kotCard from "@/components/cards/kot-kitchen/kotCard.vue";
import axios from "axios";
const { t } = useI18n();

const route = useRoute();

const breads = [
  {
    path: "/store-setup",
    imgIcon: "storeSetup.svg",
    name: t("sidebar.storeSetup"),
  },
  {
    path: `/store-setup/${route.params.id}/kot-kitchens`,
    imgIcon: "",
    name: t("LABELS.kotKitchen"),
  },
  {
    path: "",
    imgIcon: "",
    name: t("BUTTONS.allTrashes", {
      name: t("LABELS.kotKitchen"),
    }),
  },
];

const paginator = ref(null);
const items = ref([]);
const loading = ref(false);
const dataFilterd = ref(false);

function fetchData() {
  if (route.query.keyword) {
    dataFilterd.value = true;
  }

  loading.value = true;
  axios
    .get("kot/trashed", {
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

function remove(id) {
  items.value = items.value.filter((el) => el.id != id);
  paginator.value.total--;
}

onMounted(() => {
  fetchData()
});
</script>
