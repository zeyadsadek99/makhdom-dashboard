<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="t('BUTTONS.allTrashes', { name: t('LABELS.modifierGroup') })"
      back="/menu-setup/modifiers-group"
      class="mb-7"
    />

    <div
      class="bg-white rounded-[24px] h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] p-7"
    >
      <base-filter
        v-if="items.length || $route.query.keyword"
        name="group"
        :inputs="[]"
        :keyword="true"
        @action="$router.push('/menu-setup/modifiers-group/form')"
      />

      <Loader v-if="loading" />
      <div v-else :class="!items.length ? 'h-full' : ''">
        <div class="grid xl:grid-cols-2 gap-4" v-if="items.length">
          <ModifiersGroup
            v-for="item in items"
            :key="item.id"
            :item="item"
            :name="true"
            :trashed="true"
            url="modifier"
            @remove="remove"
            @reload="fetchData"
            @edit="openEdit(item)"
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
            <h3
              class="mt-4 font-semibold text-text text-center"
              v-if="$route.query.keyword"
            >
              {{ $t("TITLES.No Search result") }}
            </h3>
            <h3 class="mt-4 font-semibold text-text text-center" v-else>
              {{
                $t("TITLES.No have been added yet", {
                  name: t("BUTTONS.allTrashes") + t("TITLES.modifierGroup"),
                })
              }}
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import ModifiersGroup from "@/components/cards/ModifiersGroup.vue";
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
    path: "/menu-setup/modifiers-group",
    imgIcon: "",
    name: t("TITLES.modifiers"),
  },
  {
    path: "/menu-setup/modifiers-group/archived",
    imgIcon: "",
    name: t("BUTTONS.allTrashes", { name: t("LABELS.modifierGroup") }),
  },
];

const loading = ref(false);

const items = ref([]);

// const items = [
//   {
//     ar: {
//       name: "Cain Giles",
//     },
//     name: "Cain Giles",
//     created_at: "2023-12-21",
//     deleted_at: null,
//     en: {
//       name: "Ciara Moody",
//     },
//     name: "Ciara Moody",
//     id: 3,
//     desc: "Lorem ipsum dolor sit amet consectetur. Eget fringilla aliquam pretium aenean quisque.",
//     // desc: "Lorem ipsum dolor sit amet consectetur.",
//     image:
//       "https://saas.khlod.aait-d.com/storage/tenants/ezzat/images/tax_rates",
//     is_active: true,
//     is_applied_in_new_item: true,
//     is_applied_in_open_item: true,
//     name: "Ciara Moody",
//     ordering: 27,
//     percentage: 40,
//     deleted_at: 55,
//   },
//   {
//     ar: {
//       name: "Cain Giles",
//     },
//     name: "Cain Giles",
//     created_at: "2023-12-21",
//     deleted_at: null,
//     en: {
//       name: "Ciara Moody",
//     },
//     name: "Ciara Moody",
//     id: 3,
//     desc: "Lorem ipsum dolor sit amet consectetur. Eget fringilla aliquam pretium aenean quisque.",
//     // desc: "Lorem ipsum dolor sit amet consectetur.",
//     image:
//       "https://saas.khlod.aait-d.com/storage/tenants/ezzat/images/tax_rates",
//     is_active: true,
//     is_applied_in_new_item: true,
//     is_applied_in_open_item: true,
//     name: "Ciara Moody",
//     ordering: 27,
//     percentage: 40,
//     deleted_at: 55,
//   },
// ];
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
    .get("modifier/trashed", {
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
