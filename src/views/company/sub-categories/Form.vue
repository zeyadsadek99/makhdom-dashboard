<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="
        t(`BUTTONS.${route.params.id ? 'Edit' : 'add'}`, {
          name: t('LABELS.subCategory'),
        })
      "
      :back="{
        name: 'sub-categories',
        id: route.params.id,
      }"
      class="mb-7"
    />

    <div class="">
      <FormSkelton v-if="loading" />
      <CategoryDetails v-else :data="categoriesDetails" />
    </div>
  </div>
</template>

<script setup>
import CategoryDetails from "./steps/CategoryDetails.vue";

import { reactive, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import axios from "axios";

const loading = ref(false);

const route = useRoute();
const { t } = useI18n();

const categoriesDetails = ref(null);

const breads = [
  {
    path: "/",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.home"),
  },
  {
    path: "/main-categories",
    imgIcon: "",
    name: t("TITLES.main-categories"),
  },
  {
    path: {
      name: "sub-categories",
      id: route.params.id,
    },
    imgIcon: "",
    name: t("TITLES.subCategories"),
  },
  {
    name: t(`BUTTONS.${route.params.sub_id ? "Edit" : "add"}`, {
      name: t("LABELS.subCategory"),
    }),
    path: {
      name: route.params.sub_id ? "edit-sub-category" : "add-sub-category",
      id: route.params.id,
      sub_id: route.params.sub_id,
    },
  },
];

function getData() {
  axios.get(`categories/${route.params.sub_id}`).then((res) => {
    const result = res.data.data;

    categoriesDetails.value = {
      nameAr: result.ar.name,
      nameEn: result.en.name,
      nameUr: result.urd.name,
      main_category: result.parent.id,
      categoryImage: "",
      categoryPrivew: result.image,
      ordering: result.ordering,
      is_active: result.is_active,
    };

    loading.value = false;
  });
}

onMounted(() => {
  if (route.params.sub_id) {
    loading.value = true;
    getData();
  }
});
</script>
