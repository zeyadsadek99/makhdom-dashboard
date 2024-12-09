<template>
  <div class="flex-1 flex flex-col">
    <div class="flex items-center gap-2 flex-wrap justify-between">
      <breadcrumbs
        :items="breads"
        :title="$t(`LABELS.kotKitchen`)"
        :back="`/store-setup/${$route.params.id}`"
        class="mb-7"
      />

      <base-filter
        name="kotKitchen"
        :keyword="false"
        :inputs="[]"
        :btn-name="$t('BUTTONS.add', { name: $t('LABELS.kot') })"
        icon="fas fa-plus"
        @action="
          $router.push(`/store-setup/${route.params.id}/kot-kitchens/form`)
        "
      >
        <template v-slot:button>
          <router-link
            :to="`/store-setup/${route.params.id}/kot-kitchens/all-trashes`"
            class="archive-btn"
          >
            {{ $t("BUTTONS.allTrashes", { name: $t("LABELS.kot") }) }}
          </router-link>
          <BaseSideFilter v-if="!filterLoader" :inputs="inputs" />
        </template>
      </base-filter>
    </div>

    <base-card1 class="flex-1">
      <Loader v-if="loading" />
      <template v-else>
        <template v-if="items.length">
          <div
            v-for="item in items"
            :key="item.id"
            class="mb-5 last-of-type:mb-0"
          >
            <kotCard
              @remove="remove"
              @reload="fetchData"
              @edit="
                $router.push(
                  `/store-setup/${route.params.id}/kot-kitchens/form/${item.id}`
                )
              "
              url="kot"
              :item="item"
            />
          </div>
        </template>

        <div v-else class="items-center flex h-full justify-center">
          <div class="space-y-6">
            <div class="text-center">
              <img class="mx-auto" src="@/assets/images/stats/kot.png" alt="" />
              <h3 class="mt-4 font-semibold text-text text-center">
                {{
                  $t("TITLES.No have been added yet", {
                    name: $t("LABELS.kotKitchen"),
                  })
                }}
              </h3>
            </div>
            <div class="flex items-center gap-2 justify-center">
              <router-link
                :to="`/store-setup/${$route.params.id}/kot-kitchens/all-trashes`"
                class="archive-btn"
              >
                {{
                  $t("BUTTONS.allTrashes", {
                    name: $t("LABELS.kotKitchen"),
                  })
                }}
              </router-link>
              <router-link
                :to="`/store-setup/${$route.params.id}/kot-kitchens/form`"
                class="base-btn rounded-xl self-end"
              >
                <i class="fas fa-plus"></i>
                {{ $t(`BUTTONS.add`, { name: $t("LABELS.kotKitchen") }) }}
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
import kotCard from "@/components/cards/kot-kitchen/kotCard.vue";
import axios from "axios";
const { t } = useI18n();
defineProps({
  storeData: {
    required: false,
  },
});

const route = useRoute();

const breads = [
  {
    path: `/store-setup/${route.params.id}`,
    imgIcon: "storeSetup.svg",
    name: t("sidebar.storeSetup"),
  },
  {
    path: `/store-setup/${route.params.id}/kot-kitchens`,
    imgIcon: "",
    name: t("LABELS.kotKitchen"),
  },
];

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
        id: 1,
      },
      {
        name: t("STATUS.Unavailable"),
        id: 0,
      },
    ],
    type: "select",
    filter: null,
    multiple: false,
  },
  // {
  //   name: "type",

  //   placeholder: t("currency"),
  //   options: [
  //     {
  //       name: t("STATUS.All"),
  //       id: "",
  //     },
  //   ],
  //   type: "select",
  //   filter: null,
  //   multiple: false,
  // },

  {
    name: "availabilities_tree",
    placeholder: "Availability",
    options: [],
    type: "tree",
    filter: [],
    multiple: true,
  },
];

// fetchCurrency();

const paginator = ref(null);
const items = ref([]);
const loading = ref(false);
const dataFilterd = ref(false);
function fetchData() {
  loading.value = true;
  axios
    .get("kot")
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
const filterLoader = ref(true);

function remove(id) {
  items.value = items.value.filter((el) => el.id != id);
  paginator.value.total--;
}

onMounted(() => {
  fetchData();
});
</script>
