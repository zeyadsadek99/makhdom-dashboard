<template>
  <div>
    <breadcrumbs back="/themes" :title="$t('LABELS.Sliders')" :items="breads" />
    <div class="flex gap-4 flex-wrap">
      <div class="flex-1 w-full min-w-[250px]">
        <FormSkelton v-if="loading" />
        <template v-else>
          <base-card1
            :title="$t('TITLES.Details', { name: $t('LABELS.slider') })"
          >
            <VeeForm
              :validation-schema="schema"
              @submit="handleSubmit"
              :initial-values="initialValues"
            >
              <div class="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                <base-input
                  id="nameAr"
                  name="nameAr"
                  :placeholder="
                    $t('LABELS.Name', { name: $t('LABELS.Slider') }) +
                    $t('inArabic')
                  "
                  :label="
                    $t('LABELS.Name', { name: $t('LABELS.Slider') }) +
                    $t('inArabic')
                  "
                  type="text"
                />
                <base-input
                  id="nameEn"
                  name="nameEn"
                  :placeholder="
                    $t('LABELS.Name', { name: $t('LABELS.Slider') }) +
                    $t('inEnglish')
                  "
                  :label="
                    $t('LABELS.Name', { name: $t('LABELS.Slider') }) +
                    $t('inEnglish')
                  "
                  type="text"
                />
                <base-input
                  id="nameUr"
                  name="nameUr"
                  :placeholder="
                    $t('LABELS.Name', { name: $t('LABELS.Slider') }) +
                    $t('inUrd')
                  "
                  :label="
                    $t('LABELS.Name', { name: $t('LABELS.Slider') }) +
                    $t('inUrd')
                  "
                  type="text"
                />
                <base-select
                  id="type"
                  name="type"
                  :placeholder="$t('LABELS.choose')"
                  :label="$t('LABELS.type')"
                  :options="types"
                  :filter="null"
                  :multiple="false"
                  v-model:itemValue="initialValues.type"
                />
              </div>
              <div class="mb-5">
                <base-file
                  modalName="sliders"
                  modalType="image"
                  id="companyLogo"
                  name="sliderImage"
                  :placeholder="
                    $t('LABELS.image', { name: $t('LABELS.Slider') })
                  "
                  :label="$t('LABELS.image', { name: $t('LABELS.Slider') })"
                  accept="image/png, image/webp, image/jpeg"
                  v-model:itemValue="initialValues.sliderPrivew"
                  v-model:image="initialValues.sliderImage"
                />
              </div>

              <div
                class="flex items-center justify-end mt-7 gap-4 md:col-span-2 xl:col-span-3"
              >
                <router-link
                  to="/sliders"
                  class="capitalize font-semibold text-sub"
                >
                  {{ $t("BUTTONS.cancel") }}
                </router-link>
                <button class="base-btn" :disabled="btnLoading" type="submit">
                  {{ $t("BUTTONS.save") }}
                </button>
              </div>
            </VeeForm>
          </base-card1>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as yup from "yup";
import { toast } from "vue3-toastify";
import axios from "axios";
import { reactive, ref, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";

import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const { t } = useI18n();

const initialValues = reactive({
  desAr: "",
  titleAr: "",
  desEn: "",
  titleEn: "",
  // nameUr: "",
  sliderImage: "",
  sliderPrivew: "",
  // type: null,
  id: "",
});

const types = [
  {
    name: t("LABELS.main"),
    id: "main",
  },
  {
    name: t("LABELS.banner"),
    id: "banner",
  },
  {
    name: t("LABELS.middle"),
    id: "middle",
  },
  {
    name: t("LABELS.divided"),
    id: "divided",
  },
];

// divided,main,banner,middle'

const schema = yup.object().shape({
  // nameEn: yup
  //   .string()
  //   .required(
  //     t("ERRORS.isRequired", { name: t("LABELS.Slider") }) + t("inEnglish")
  //   ),
  // nameAr: yup
  //   .string()
  //   .required(
  //     t("ERRORS.isRequired", { name: t("LABELS.Slider") }) + t("inArabic")
  //   ),
  // nameUr: yup
  //   .string()
  //   .required(
  //     t("ERRORS.isRequired", { name: t("LABELS.Slider") }) + t("inUrd")
  //   ),
  // type: yup
  //   .string()
  //   .required(t("ERRORS.isRequired", { name: t("LABELS.type") })),
  // sliderImage: yup.mixed().test(
  //   "sliderImage",
  //   t("ERRORS.isRequired", {
  //     name: t("LABELS.image", { name: t("LABELS.Slider") }),
  //   }),
  //   (value) => {
  //     if (value || initialValues.sliderPrivew) {
  //       return true;
  //     }
  //   }
  // ),
});

const btnLoading = ref(false);

function handleSubmit(values, actions) {
  btnLoading.value = true;
  const frmData = new FormData();

  let url = "sliders";

  if (route.params.id) {
    frmData.append("_method", "PUT");
    url = `sliders/${values.id}`;
  }

  frmData.append("ar[title]", values.nameAr);
  frmData.append("en[title]", values.nameEn);
  frmData.append("ar[description]", values.nameAr);
  frmData.append("en[description]", values.nameEn);
  // frmData.append("urd[title]", values.nameUr);
  // frmData.append("type", values.type);
  if (values.sliderImage) {
    frmData.append("image[media]", values.sliderImage);
  }

  axios
    .post(url, frmData)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 300);
      router.push("/sliders");
      btnLoading.value = false;
      actions.resetForm();
    })
    .catch((e) => {
      toast.error(e.response.data.message);
    })
    .finally(() => (btnLoading.value = false));
}

const loading = ref(false);

const breads = [
  {
    path: "/",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.home"),
  },
  {
    name: t("LABELS.Sliders"),
    path: "/sliders",
    imgIcon: "",
  },
  {
    name: t(`BUTTONS.${route.params.id ? "Edit" : "add"}`, {
      name: t("LABELS.slider"),
    }),
    path: `/sliders/form${route.params.id ? "/" + route.params.id : ""}`,
  },
];

function getData() {
  axios.get(`sliders/${route.params.id}`).then((res) => {
    const result = res.data.data;

    initialValues.titleAr = result.ar.title;
    initialValues.desAr = result.ar.description;
    initialValues.titleEn = result.en.title;
    initialValues.desEn = result.en.description;
    // initialValues.nameUr = result.urd.name;
    // initialValues.type = result.type;
    initialValues.sliderPrivew = result.image;

    initialValues.id = result.id;

    loading.value = false;
  });
}

onBeforeMount(() => {
  if (route.params.id) {
    loading.value = true;
    getData();
  }
});
</script>

<style></style>
