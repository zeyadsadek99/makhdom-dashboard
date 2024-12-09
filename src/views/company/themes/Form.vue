<template>
  <div>
    <breadcrumbs back="/themes" :title="$t('LABELS.Themes')" :items="breads" />
    <div class="flex gap-4 flex-wrap">
      <div class="flex-1 w-full min-w-[250px]">
        <FormSkelton v-if="loading" />
        <template v-else>
          <base-card1
            :title="$t('TITLES.Details', { name: $t('LABELS.Theme') })"
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
                    $t('LABELS.Name', { name: $t('LABELS.Theme') }) +
                    $t('inArabic')
                  "
                  :label="
                    $t('LABELS.Name', { name: $t('LABELS.Theme') }) +
                    $t('inArabic')
                  "
                  type="text"
                />
                <base-input
                  id="nameEn"
                  name="nameEn"
                  :placeholder="
                    $t('LABELS.Name', { name: $t('LABELS.Theme') }) +
                    $t('inEnglish')
                  "
                  :label="
                    $t('LABELS.Name', { name: $t('LABELS.Theme') }) +
                    $t('inEnglish')
                  "
                  type="text"
                />
                <base-input
                  id="nameUr"
                  name="nameUr"
                  :placeholder="
                    $t('LABELS.Name', { name: $t('LABELS.Theme') }) +
                    $t('inUrd')
                  "
                  :label="
                    $t('LABELS.Name', { name: $t('LABELS.Theme') }) +
                    $t('inUrd')
                  "
                  type="text"
                />
              </div>
              <div class="mb-5">
                <base-file
                  modalName="story_themes"
                  modalType="image"
                  id="companyLogo"
                  name="themeImage"
                  :placeholder="
                    $t('LABELS.image', { name: $t('LABELS.Theme') })
                  "
                  :label="$t('LABELS.image', { name: $t('LABELS.Theme') })"
                  accept="image/png, image/webp, image/jpeg"
                  v-model:itemValue="initialValues.themePrivew"
                  v-model:image="initialValues.themeImage"
                />
              </div>

              <div
                class="flex items-center justify-end mt-7 gap-4 md:col-span-2 xl:col-span-3"
              >
                <router-link
                  to="/themes"
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
  nameAr: "",
  nameEn: "",
  nameUr: "",
  themeImage: "",
  themePrivew: "",
  id: "",
});

const schema = yup.object().shape({
  nameEn: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.Theme") }) + t("inEnglish")
    ),
  nameAr: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.Theme") }) + t("inArabic")
    ),
  nameUr: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.Theme") }) + t("inUrd")),

  themeImage: yup.mixed().test(
    "themeImage",
    t("ERRORS.isRequired", {
      name: t("LABELS.image", { name: t("LABELS.Theme") }),
    }),
    (value) => {
      if (value || initialValues.themePrivew) {
        return true;
      }
    }
  ),
});

const btnLoading = ref(false);

function handleSubmit(values, actions) {
  btnLoading.value = true;
  const frmData = new FormData();

  let url = "story_themes";

  if (route.params.id) {
    frmData.append("_method", "PUT");
    url = `story_themes/${values.id}`;
  }

  frmData.append("ar[name]", values.nameAr);
  frmData.append("en[name]", values.nameEn);
  frmData.append("urd[name]", values.nameUr);
  if (values.themeImage) {
    frmData.append("image", values.themeImage);
  }

  axios
    .post(url, frmData)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 300);
      router.push("/themes");
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
    name: t("LABELS.Themes"),
    path: "/themes",
    imgIcon: "",
  },
  {
    name: t(`BUTTONS.${route.params.id ? "Edit" : "add"}`, {
      name: t("LABELS.theme"),
    }),
    path: `/themes/form${route.params.id ? "/" + route.params.id : ""}`,
  },
];

function getData() {
  axios.get(`story_themes/${route.params.id}`).then((res) => {
    const result = res.data.data;

    initialValues.nameAr = result.ar.name;
    initialValues.nameEn = result.en.name;
    initialValues.nameUr = result.urd.name;
    initialValues.themePrivew = result.image;

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
