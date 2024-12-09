<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="
        t(`BUTTONS.${route.params.id ? 'Edit' : 'add'}`, {
          name: t('LABELS.brand'),
        })
      "
      back="/brands"
      class="mb-7"
    />

    <div class="">
      <FormSkelton v-if="loading" />
      <CategoryDetails v-else :data="brandDetails" />
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

const brandDetails = ref(null);
const breads = [
  {
    path: "/",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.home"),
  },
  {
    path: "/brands",
    imgIcon: "",
    name: t("LABELS.Brands"),
  },
  // {
  //   name: t(`BUTTONS.${route.params.id ? "Edit" : "add"}`, {
  //     name: t("LABELS.brand"),
  //   }),
  //   path: {
  //     name: "add-brand",
  //     id: route.params.id ? route.params.id : "",
  //   },
  // },
];

function getData() {
  axios.get(`brands/${route.params.id}`).then((res) => {
    const result = res.data.data;

    brandDetails.value = {
      nameAr: result.ar.name,
      nameEn: result.en.name,
      nameUr: result.urd.name,
      brandImage: "",
      brandPrivew: result.image,
      main_category: result.categories[0].parent.id,
      sub_category: result.categories.map((el) => el.id),

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
