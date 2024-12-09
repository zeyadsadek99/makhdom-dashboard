<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="t('TITLES.categories')"
      back="/settings"
      class="mb-7"
    />

    <div
      class="bg-white rounded-[24px] shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] p-7"
    >
      <div class="flex items-center justify-between flex-wrap gap-5 mb-5">
        <div
          class="relative rounded-[10px] lg:w-[400px] w-full bg-white border border-line"
        >
          <i
            class="fa-solid fa-magnifying-glass absolute top-1/2 -translate-y-1/2 inset-xe text-primary"
          />

          <input
            :placeholder="$t('INPUTS.searchForCategory')"
            type="text"
            id="search"
            class="!pe-9 h-[43px] outline-none px-3 w-full"
            @change="() => console.log('Good')"
            v-model="search"
          />
        </div>

        <div class="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            class="flex items-center justify-center lg:min-w-[130px] min-w-full px-3 gap-3 h-[43px] bg-white rounded-[10px] border border-line text-primary"
          >
            <img
              src="../../../../assets/images/icons/import.svg"
              alt="import"
            />

            <span>{{ $t("BUTTONS.import") }}</span>
          </button>

          <button
            type="button"
            class="flex items-center justify-center lg:min-w-[130px] min-w-full px-3 gap-3 h-[43px] bg-white rounded-[10px] border border-line text-primary"
          >
            <img
              src="../../../../assets/images/icons/export.svg"
              alt="export"
            />

            <span>{{ $t("BUTTONS.export") }}</span>
          </button>

          <button
            type="button"
            class="flex items-center justify-center lg:min-w-[130px] min-w-full px-5 gap-3 h-[43px] bg-white rounded-[10px] border border-line text-primary"
          >
            <span>{{ $t("BUTTONS.achievedCategories") }}</span>
          </button>

          <RouterLink
            to="/menu/add-category"
            class="flex items-center justify-center lg:min-w-[170px] min-w-full px-3 gap-3 h-[43px] bg-primary rounded-[10px] border border-transparent text-white"
          >
            <i class="fa-solid fa-plus" />

            <span>{{ $t("BUTTONS.addCategory") }}</span>
          </RouterLink>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-4">
        <Category
          v-for="i in 10"
          :key="i"
          :category="categories[0]"
          class="lg:col-span-6 col-span-12"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import Category from "@/components/cards/Categories/Category.vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const { t } = useI18n();

const route = useRoute();

const breads = [
  {
    path: "/menu",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.menuSetup"),
  },
  {
    path: `/menu/${route.params.id}`,
    imgIcon: "",
    name: t("TITLES.menuItems"),
  },
];

const search = ref("");

const categories = ref([
  {
    name: "Dolma & Pasta",
    image: new URL("@/assets/images/categories/category.png", import.meta.url),
    description: "Special ramadan menu for families  and friends gatherings",
    status: false,
  },
]);
</script>
