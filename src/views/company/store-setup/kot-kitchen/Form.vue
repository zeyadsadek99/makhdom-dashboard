<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="
        t(`BUTTONS.${route.params.id ? 'Edit' : 'add'}`, {
          name: t('LABELS.kotKitchen'),
        })
      "
      :back="`/store-setup/${route.params.id}/kot-kitchens`"
      class="mb-7"
    />

    <div class="flex gap-5 flex-col md:flex-row flex-wrap">
      <div class="min-w-40">
        <ul class="inline-nav">
          <li>
            <button
              type="button"
              @click="
                closeSteps();
                step1 = true;
              "
              :class="{ active: step1 }"
            >
              <svg-icon name="general_details" />

              {{ t("TITLES.generalDetails") }}
            </button>
          </li>

          <li>
            <button
              type="button"
              @click="
                closeSteps();
                step2 = true;
              "
              :class="{ active: step2 }"
            >
              <svg-icon name="foodItems" />
              {{ t("TITLES.Food Items") }}
            </button>
          </li>
        </ul>
      </div>

      <div class="flex-1 w-full max-w-[800px]">
        <FormSkelton v-if="loading" />

        <template v-else>
          <keep-alive>
            <GeneralDetails
              :data="generalDetails"
              v-if="step1"
              @returned-data="setData($event, 'step1')"
            />
          </keep-alive>

          <keep-alive>
            <FoodItems
              :data="listProduct"
              v-if="step2"
              @returned-data="setData($event, 'step2')"
            />
          </keep-alive>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import FoodItems from "./steps/FoodItems.vue";

import GeneralDetails from "./steps/GeneralDetails.vue";

import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { toast } from "vue3-toastify";
const { t } = useI18n();
const loading = ref(false);
const btnLoading = ref(false);
const route = useRoute();
const listProduct = ref([]);
const router = useRouter();
const step1 = ref(true);
const step2 = ref(false);

const generalDetails = ref(null);
const products = ref(null);

function setData(event, step) {
  if (step == "step1") {
    generalDetails.value = event;
    closeSteps();
    step2.value = true;
    return;
  } else if (step == "step2") {
    closeSteps();
    products.value = event;
    if (!generalDetails.value) {
      step1.value = true;
      return;
    } else {
      step2.value = true;
    }
  }
  handleSubmit();
}

function closeSteps() {
  step1.value = false;
  step2.value = false;
}

function handleSubmit() {
  btnLoading.value = true;

  let url = `kot`;
  const frmData = new FormData();
  if (route.params.kot_id) {
    frmData.append("_method", "PUT");
    url = `kot/${route.params.kot_id}`;
  }

  frmData.append("is_active", +generalDetails.value.is_active);

  frmData.append("ar[name]", generalDetails.value.kotNameAr);
  frmData.append("en[name]", generalDetails.value.kotNameEn);
  frmData.append("ar[desc]", generalDetails.value.descAr);
  frmData.append("en[desc]", generalDetails.value.descEn);
  frmData.append("printer_id", generalDetails.value.printer_related_to);
  frmData.append("store_id", route.params.id);

  products.value.products.map((el, index) => {
    frmData.append(`products[${index}]`, el);
  });

  axios
    .post(url, frmData)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 300);

      btnLoading.value = false;

      router.push(`/store-setup/${route.params.id}/kot-kitchens`);
    })
    .catch((e) => {
      btnLoading.value = false;
      toast.error(e.response.data.message);
    });
}

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
    name: t(`BUTTONS.${route.params.kot_id ? "Edit" : "add"}`, {
      name: t("LABELS.kotKitchen"),
    }),
    path: "",
  },
];

function getData() {
  axios.get(`kot/${route.params.kot_id}`).then((res) => {
    const result = res.data.data;

    generalDetails.value = {
      kotNameAr: result.ar.name,
      kotNameEn: result.en.name,
      printer_related_to: result.printer.id,
      is_active: result.is_active,
      descAr: result.ar.desc,
      descEn: result.en.desc,
    };
    listProduct.value = result.products;
    products.value = result.products.map((el) => el.id);

    loading.value = false;
  });
}

onMounted(() => {
  if (route.params.kot_id) {
    loading.value = true;
    getData();
  }
});
</script>
