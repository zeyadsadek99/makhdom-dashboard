<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="(t('BUTTONS.allTrashes', { name: t('LABELS.subCategories') }))"
      back="/menu-setup/sub-categories"
      class="mb-7"
    />

    <div
      class="bg-white rounded-[24px] h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] p-7"
    >
      <base-filter
        v-if="items.length || dataFilterd"
        name="subCategories"
        :inputs="[]"
        :keyword="true"
        @action="$router.push('/menu-setup/categories/form')"
      >
        <!-- <template v-slot:button>
          <button
            type="button"
            class="flex items-center justify-center lg:min-w-[130px] min-w-full px-3 gap-3 h-[43px] bg-white rounded-[10px] border border-line text-primary"
          >
             <svg-icon name="import" />

            <span>{{ $t("BUTTONS.import") }}</span>
          </button>

          <button
            type="button"
            class="flex items-center justify-center lg:min-w-[130px] min-w-full px-3 gap-3 h-[43px] bg-white rounded-[10px] border border-line text-primary"
          >
            <svg-icon name="export" />

            <span>{{ $t("BUTTONS.export") }}</span>
          </button>
        </template> -->
      </base-filter>

      <Loader v-if="loading" />
      <div v-else :class="!items.length ? 'h-full' : ''">
        <div class="grid xl:grid-cols-2 gap-4" v-if="items.length">
          <Category
            @remove="remove"
            @reload="fetchData"
            @edit="openEdit(item)"
            :sub="true"
            v-for="item in items"
            :key="item.id"
            :item="item"
            url="sub_category"
            activate="sub_categories"
            :trashed="true"
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
                  name: t("BUTTONS.allTrashes") + t("TITLES.subCategories"),
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
import Category from "@/components/cards/Categories/Category.vue";
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
    path: "/menu-setup/sub-categories",
    imgIcon: "",
    name: t("TITLES.subCategories"),
  },
  {
    path: "/menu-setup/sub-categories/archived",
    imgIcon: "",
    name: t("BUTTONS.allTrashes", { name: t("LABELS.subCategories") }),
  },
];

const loading = ref(true);

const items = ref([]);

const paginator = ref(null);
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
function fetchData() {
  loading.value = true;
  axios
    .get("sub_category/trashed", {
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
