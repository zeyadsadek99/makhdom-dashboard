<template>
  <div>
    <breadcrumbs
      back="/scope-settings/countries/all"
      :title="$t('TITLES.countries')"
      :items="breadItems"
    />
    <div class="flex gap-4 flex-wrap">
      <div class="flex-1 w-full min-w-[250px]">
        <FormSkelton v-if="loading" />
        <template v-else>
          <base-card1>
            <VeeForm
              as="div"
              :validation-schema="schema"
              @submit="handleSubmit"
              :initial-values="initialValues"
            >
              <form class="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                <!-- <v-switch
                  color="success"
                  :model-value="true"
                  class="capitalize md:col-span-2"
                  :label="
                    $t(is_active ? 'LABELS.activated' : 'LABELS.inactivated')
                  "
                  v-model="is_active"
                ></v-switch> -->

                <base-input
                  id="nameAr"
                  name="nameAr"
                  :placeholder="$t('LABELS.Name')"
                  :label="$t('LABELS.Name') + $t('inArabic')"
                  type="text"
                />
                <base-input
                  id="nameEn"
                  name="nameEn"
                  :placeholder="$t('LABELS.name')"
                  :label="$t('LABELS.name') + $t('inEnglish')"
                  type="text"
                />
                <base-input
                  id="nameUr"
                  name="nameUr"
                  :placeholder="$t('LABELS.name')"
                  :label="$t('LABELS.name') + $t('inUrd')"
                  type="text"
                />

                <!-- <base-input
                  id="nationalityAr"
                  name="nationalityAr"
                  :placeholder="$t('LABELS.nationality')"
                  :label="$t('LABELS.nationality') + $t('inArabic')"
                  type="text"
                />
                <base-input
                  id="nationalityEn"
                  name="nationalityEn"
                  :placeholder="$t('LABELS.nationality')"
                  :label="$t('LABELS.nationality') + $t('inEnglish')"
                  type="text"
                />
                <base-input
                  id="nationalityUr"
                  name="nationalityUr"
                  :placeholder="$t('LABELS.nationality')"
                  :label="$t('LABELS.nationality') + $t('inUrd')"
                  type="text"
                /> -->
                <base-input
                  id="currencyAr"
                  name="currencyAr"
                  :placeholder="$t('LABELS.currency')"
                  :label="$t('LABELS.currency') + $t('inArabic')"
                  type="text"
                />
                <base-input
                  id="currencyEn"
                  name="currencyEn"
                  :placeholder="$t('LABELS.currency')"
                  :label="$t('LABELS.currency') + $t('inEnglish')"
                  type="text"
                />
                <base-input
                  id="currencyUr"
                  name="currencyUr"
                  :placeholder="$t('LABELS.currency')"
                  :label="$t('LABELS.currency') + $t('inUrd')"
                  type="text"
                />

                <!-- <base-input
                  id="shortName"
                  name="shortName"
                  :placeholder="$t('LABELS.shortName')"
                  :label="$t('LABELS.shortName')"
                  type="text"
                /> -->
                <base-input
                  id="phoneCode"
                  name="phoneCode"
                  :placeholder="$t('LABELS.phoneCode')"
                  :label="$t('LABELS.phoneCode')"
                  type="number"
                />
                <base-input
                  id="phoneLimit"
                  name="phoneLimit"
                  :placeholder="$t('LABELS.phoneLimit')"
                  :label="$t('LABELS.phoneLimit')"
                  type="number"
                />
                <!-- <base-input
                  id="national_id_limit"
                  name="national_id_limit"
                  :placeholder="$t('LABELS.national_id_limit')"
                  :label="$t('LABELS.national_id_limit')"
                  type="number"
                /> -->

                <div class="md:col-span-2 xl:col-span-3">
                  <!-- :return-file="true" -->
                  <base-file
                    modalName="countries"
                    modalType="image"
                    id="image"
                    name="image"
                    :placeholder="$t('LABELS.flag')"
                    :label="$t('LABELS.flag')"
                    v-model:itemValue="initialValues.preview"
                    v-model:image="initialValues.image"
                    accept="image/png, image/webp, image/jpeg"
                  />
                </div>

                <div
                  class="flex items-center justify-end mt-7 gap-4 md:col-span-2 xl:col-span-3"
                >
                  <router-link
                    to="/scope-settings/countries"
                    class="capitalize font-semibold text-sub"
                  >
                    {{ $t("BUTTONS.cancel") }}
                  </router-link>
                  <button class="base-btn" :disabled="btnLoading" type="submit">
                    {{ $t("BUTTONS.save") }}
                  </button>
                </div>
              </form>
            </VeeForm>
          </base-card1>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import fetchData from "@/utils/fetchData";
import * as yup from "yup";
import { toast } from "vue3-toastify";
import axios from "axios";
import { reactive, ref, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";

import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const { t, locale } = useI18n();

const initialValues = reactive({
  nameAr: "",
  nameEn: "",
  nameUr: "",
  nationalityEn: "",
  nationalityAr: "",
  nationalityUr: "",
  currencyEn: "",
  currencyAr: "",
  currencyUr: "",
  shortNameAr: "",
  shortNameEn: "",
  shortNameUr: "",

  phoneCode: "",

  image: "",
  preview: "",
  phoneLimit: "",
  national_id_limit: "",
  // is_active: true,

  ordering: "",
  id: "",
});
// const is_active = ref(true);
const schema = yup.object().shape({
  nameEn: yup.string().required(t("ERRORS.name") + t("inEnglish")),
  nameAr: yup.string().required(t("ERRORS.name") + t("inArabic")),
  nameUr: yup.string().required(t("ERRORS.name") + t("inUrd")),
  // nationalityEn: yup
  //   .string()
  //   .required(
  //     t("ERRORS.isRequired", { name: t("LABELS.nationality") }) + t("inEnglish")
  //   ),
  // nationalityAr: yup
  //   .string()
  //   .required(
  //     t("ERRORS.isRequired", { name: t("LABELS.nationality") }) + t("inArabic")
  //   ),

  currencyEn: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.currency") }) + t("inEnglish")
    ),
  currencyAr: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.currency") }) + t("inArabic")
    ),
  currencyUr: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.currency") }) + t("inUrl")
    ),
  // shortName: yup
  //   .string()
  //   .required(t("ERRORS.isRequired", { name: t("LABELS.shortName") })),

  phoneCode: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.phoneCode") })),

  phoneLimit: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.phoneLimit") })),
  // national_id_limit: yup
  //   .string()
  //   .required(t("ERRORS.isRequired", { name: t("LABELS.national_id_limit") })),
  image: yup
    .mixed()
    .test(
      "image",
      t("ERRORS.isRequired", { name: t("LABELS.flag") }),
      (value) => {
        if (value || initialValues.preview) {
          return true;
        }
      }
    ),
});

const btnLoading = ref(false);

function handleSubmit(values) {
  btnLoading.value = true;
  const frmData = new FormData();

  let url = "countries";

  if (route.params.id) {
    frmData.append("_method", "PUT");
    url = `countries/${values.id}`;
  }

  frmData.append("ar[name]", values.nameAr);
  frmData.append("en[name]", values.nameEn);
  frmData.append("urd[name]", values.nameUr);
  // frmData.append("ar[nationality]", values.nationalityAr);
  // frmData.append("en[nationality]", values.nationalityEn);
  frmData.append("ar[currency]", values.currencyAr);
  frmData.append("en[currency]", values.currencyEn);
  frmData.append("urd[currency]", values.currencyUr);
  frmData.append("ar[short_name]", values.nameAr);
  frmData.append("en[short_name]", values.nameAr);
  frmData.append("urd[short_name]", values.nameAr);
  frmData.append("ar[nationality]", values.nameAr);
  frmData.append("en[nationality]", values.nameAr);
  frmData.append("urd[nationality]", values.nameAr);
  frmData.append("ar[slug]", values.nameAr);
  frmData.append("en[slug]", values.nameAr);
  frmData.append("urd[slug]", values.nameAr);

  frmData.append("phone_code", values.phoneCode);
  frmData.append("phone_number_limit", values.phoneLimit);
  frmData.append("national_id_limit", values.phoneLimit);
  // frmData.append("short_name", values.shortName);
  // frmData.append("is_active", +is_active.value);

  if (initialValues.image) {
    frmData.append("image", initialValues.image);
  }

  axios
    .post(url, frmData)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 300);
      btnLoading.value = false;
      router.push("/scope-settings/countries/all");
    })
    .catch((e) => {
      toast.error(e.response.data.message);
    })
    .finally(() => (btnLoading.value = false));
}

const loading = ref(false);

const breadItems = [
  {
    name: t("sidebar.settings"),
    path: "/scope-settings",
    imgIcon: "settings",
  },
  {
    name: t("TITLES.countries"),
    path: "/scope-settings/countries/all",
    imgIcon: "",
  },
  {
    name: t(`BUTTONS.${route.params.id ? "Edit" : "add"}`, {
      name: t("LABELS.country"),
    }),
    path: `/scope-settings/countries/form${
      route.params.id ? "/" + route.params.id : ""
    }`,
  },
];

function getData() {
  fetchData(`countries/${route.params.id}`).then((res) => {
    const result = res.data.data;

    initialValues.nameAr = result.ar.name;
    initialValues.nameEn = result.en.name;
    initialValues.nameUr = result.urd.name;
    initialValues.currencyEn = result.en.currency;
    initialValues.currencyAr = result.ar.currency;
    initialValues.currencyUr = result.urd.currency;
    // initialValues.nationalityEn = result.en.nationality;
    // initialValues.nationalityAr = result.ar.nationality;
    // initialValues.nationalityUr = result.urd.nationality;
    // initialValues.shortNameAr = result.ar.short_name;
    // initialValues.shortNameEn = result.en.short_name;
    // initialValues.shortNameUr = result.urd.short_name;

    initialValues.phoneCode = result.phone_code;

    initialValues.preview = result.image;
    initialValues.phoneLimit = result.phone_number_limit;
    // is_active.value = result.is_active;
    initialValues.timeZone = result.time_zone;

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
