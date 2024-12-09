<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="
        t(`BUTTONS.${route.params.id ? 'Edit' : 'add'}`, {
          name: t('LABELS.main-category'),
        })
      "
      back="/main-categories"
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

import { ref, onMounted } from "vue";
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
    name: t(`BUTTONS.${route.params.id ? "Edit" : "add"}`, {
      name: t("LABELS.main-category"),
    }),
    path: `/main-categories/form${
      route.params.id ? "/" + route.params.id : ""
    }`,
  },
];

function getData() {
  axios.get(`categories/${route.params.id}`).then((res) => {
    const result = res.data.data;

    categoriesDetails.value = {
      nameAr: result.ar.name,
      nameEn: result.en.name,
      nameUr: result.urd.name,
      facility_type_id: result.facility_type?.id,
      categoryImage: "",
      categoryPrivew: result.image,
      ordering: result.ordering,
      is_active: result.is_active,
    };

    loading.value = false;
  });
}

onMounted(() => {
  if (route.params.id) {
    loading.value = true;
    getData();
  }
});
</script>
