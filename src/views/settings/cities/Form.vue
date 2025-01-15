<template>
  <div>
    <breadcrumbs
      back="/scope-settings/cities/all"
      :title="$t('TITLES.Cities')"
      :items="breadItems"
    />
    <div class="flex gap-4 flex-wrap">
      <div class="flex-1 w-full min-w-[250px]">
        <FormSkelton v-if="loading" />
        <template v-else>
          <base-card1
            :title="$t('TITLES.Details', { name: $t('LABELS.city') })"
          >
            <VeeForm
              as="div"
              :validation-schema="schema"
              @submit="handleSubmit"
              :initial-values="initialValues"
            >
              <form class="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                <base-input
                  id="nameAr"
                  name="nameAr"
                  :placeholder="$t('LABELS.cityName')"
                  :label="$t('LABELS.cityName') + $t('inArabic')"
                  type="text"
                />
                <base-input
                  id="nameEn"
                  name="nameEn"
                  :placeholder="$t('LABELS.cityName')"
                  :label="$t('LABELS.cityName') + $t('inEnglish')"
                  type="text"
                />
                <base-input
                  id="nameUr"
                  name="nameUr"
                  :placeholder="$t('LABELS.cityName')"
                  :label="$t('LABELS.cityName') + $t('inUrd')"
                  type="text"
                />
                <base-input
                  id="postalCode"
                  name="postalCode"
                  :placeholder="$t('LABELS.postalCode')"
                  :label="$t('LABELS.postalCode')"
                  type="number"
                />

                <base-select
                  id="country"
                  name="country"
                  :placeholder="$t('LABELS.country')"
                  :label="$t('LABELS.country')"
                  type="text"
                  :filter="null"
                  url="countries-without-paginated"
                  :multiple="false"
                  v-model:itemValue="initialValues.country"
                />
                <!-- <div class="md:col-span-2">
                  <base-input
                    id="location"
                    name="location"
                    :placeholder="$t('LABELS.location')"
                    :label="$t('LABELS.location')"
                    type="text"
                    icon="location"
                  />
                </div> -->

                <div
                  class="flex items-center justify-end mt-7 gap-4 md:col-span-2 xl:col-span-3"
                >
                  <router-link
                    to="/scope-settings/cities/all"
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
  country: "",
  postalCode: "",
  location: "",

  id: "",
});
const is_active = ref(true);
const schema = yup.object().shape({
  nameEn: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.cityName") }) + t("inEnglish")
    ),
  nameAr: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.cityName") }) + t("inArabic")
    ),
  nameUr: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.cityName") }) + t("inUrd")
    ),

  postalCode: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.postalCode") })),
  // location: yup
  //   .string()
  //   .required(t("ERRORS.isRequired", { name: t("LABELS.location") })),
  country: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.country") })),
});
const timeZones = ref([]);
const btnLoading = ref(false);

function handleSubmit(values) {
  btnLoading.value = true;
  const frmData = new FormData();

  let url = "cities";

  if (route.params.id) {
    frmData.append("_method", "PUT");
    url = `cities/${values.id}`;
  }

  frmData.append("ar[name]", values.nameAr);
  frmData.append("en[name]", values.nameEn);
  frmData.append("urd[name]", values.nameUr);
  frmData.append("country_id", values.country);
  frmData.append("postal_code", values.postalCode);
  // frmData.append("location", values.location);
  // frmData.append("is_active", +is_active.value);
  axios
    .post(url, frmData)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 300);
      btnLoading.value = false;
      router.push("/scope-settings/cities/all");
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
    imgIcon: "flag.png",
  },
  {
    name: t("TITLES.Cities"),
    path: "/scope-settings/cities/all",
    imgIcon: "",
  },
  {
    name: t(`BUTTONS.${route.params.id ? "Edit" : "add"}`, {
      name: t("LABELS.city"),
    }),
    path: `/scope-settings/cities/form${
      route.params.id ? "/" + route.params.id : ""
    }`,
  },
];

function getData() {
  axios.get(`cities/${route.params.id}`).then((res) => {
    const result = res.data.data;

    initialValues.nameAr = result.ar.name;
    initialValues.nameEn = result.en.name;
    initialValues.nameUr = result.urd.name;
    // initialValues.location = result.location;
    initialValues.postalCode = result.postal_code;
    initialValues.country = result.country.id;

    // is_active.value = result.is_active;

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
