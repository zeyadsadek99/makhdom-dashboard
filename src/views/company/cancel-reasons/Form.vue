<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="
        t(`BUTTONS.${route.params.id ? 'Edit' : 'add'}`, {
          name: t('LABELS.Cancel Reasons'),
        })
      "
      back="/cancel-reasons"
      class="mb-7"
    />

    <NotFound v-if="errResponse?.status === 404" />
    <GlobalError v-else-if="errResponse?.status === 500" />
    <div class="" v-else>
      <FormSkelton v-if="loading" />
      <FacilityDetails v-else :data="categoriesDetails" />
    </div>
  </div>
</template>

<script setup>
import FacilityDetails from "./steps/FacilityDetails.vue";

import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import axios from "axios";

const loading = ref(false);
const errResponse = ref(null);

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
    path: "/cancel-reasons",
    imgIcon: "",
    name: t("LABELS.Cancel Reasons"),
  },
  {
    name: t(`BUTTONS.${route.params.id ? "Edit" : "add"}`, {
      name: t("LABELS.Cancel Reason"),
    }),
    path: `/cancel-reasons/form${route.params.id ? "/" + route.params.id : ""}`,
  },
];

function getData() {
  errResponse.value = null;
  axios
    .get(`cancel-orders/${route.params.id}`)
    .then((res) => {
      const result = res.data.data;

      categoriesDetails.value = {
        nameAr: result.ar.title,
        nameEn: result.en.title,
        nameUr: result.urd.title,
        type: result.type,
        is_active: result.is_active,
      };

      loading.value = false;
    })
    .catch((err) => (errResponse.value = err.response));
}

onMounted(() => {
  if (route.params.id) {
    loading.value = true;
    getData();
  }
});
</script>
