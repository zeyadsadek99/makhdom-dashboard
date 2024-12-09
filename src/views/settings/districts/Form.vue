<template>
  <div>
    <breadcrumbs
      back="/scope-settings/districts/all"
      :title="$t('LABELS.Districts')"
      :items="breadItems"
    />
    <div class="flex gap-4 flex-wrap">
      <div class="flex-1 w-full min-w-[250px]">
        <FormSkelton v-if="loading" />
        <template v-else>
          <base-card1
            :title="$t('TITLES.Details', { name: $t('LABELS.District') })"
          >
            <VeeForm
              :validation-schema="schema"
              @submit="handleSubmit"
              :initial-values="initialValues"
              class="grid gap-2 md:grid-cols-2 xl:grid-cols-3"
            >
              <base-input
                id="nameAr"
                name="nameAr"
                :placeholder="
                  $t('LABELS.Name', { name: $t('LABELS.District') }) +
                  $t('inEnglish')
                "
                :label="
                  $t('LABELS.Name', { name: $t('LABELS.District') }) +
                  $t('inArabic')
                "
                type="text"
              />
              <base-input
                id="nameEn"
                name="nameEn"
                :placeholder="
                  $t('LABELS.Name', { name: $t('LABELS.District') }) +
                  $t('inEnglish')
                "
                :label="
                  $t('LABELS.Name', { name: $t('LABELS.District') }) +
                  $t('inEnglish')
                "
                type="text"
              />
              <base-input
                id="nameUr"
                name="nameUr"
                :placeholder="
                  $t('LABELS.Name', { name: $t('LABELS.District') }) +
                  $t('inUrd')
                "
                :label="
                  $t('LABELS.Name', { name: $t('LABELS.District') }) +
                  $t('inUrd')
                "
                type="text"
              />

              <!-- <base-select
                id="country"
                name="country"
                :placeholder="$t('LABELS.choose')"
                :label="$t('LABELS.country')"
                type="text"
                :filter="null"
                url="countries-without-paginated"
                :multiple="false"
                v-model:itemValue="initialValues.country"
              /> -->
              <base-select
                id="city"
                name="city"
                :placeholder="$t('LABELS.choose')"
                :label="$t('LABELS.city')"
                url="cities-without-paginated"
                :filter="[]"
                v-model:itemValue="initialValues.city"
              />

              <div
                class="flex items-center justify-end gap-4 md:col-span-2 xl:col-span-3"
              >
                <router-link
                  to="/scope-settings/districts/all"
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
  // country: null,
  city: null,

  id: "",
});

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

  city: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.city") })),
});
const btnLoading = ref(false);

function handleSubmit(values) {
  btnLoading.value = true;
  const frmData = new FormData();

  let url = "districts";
  if (route.params.id) {
    frmData.append("_method", "PUT");
    url = `districts/${values.id}`;
  }
  frmData.append("ar[name]", values.nameAr);
  frmData.append("en[name]", values.nameEn);
  frmData.append("urd[name]", values.nameUr);
  frmData.append("ar[slug]", values.nameAr);
  frmData.append("en[slug]", values.nameEn);
  frmData.append("urd[slug]", values.nameUr);
  frmData.append("city_id", values.city);
  axios
    .post(url, frmData)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 300);
      btnLoading.value = false;
      router.push("/scope-settings/districts/all");
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
    name: t("LABELS.Districts"),
    path: "/scope-settings/districts/all",
    imgIcon: "",
  },
  {
    name: t(`BUTTONS.${route.params.id ? "Edit" : "add"}`, {
      name: t("LABELS.district"),
    }),
    path: `/scope-settings/districts/form${
      route.params.id ? "/" + route.params.id : ""
    }`,
  },
];

function getData() {
  axios.get(`districts/${route.params.id}`).then((res) => {
    const result = res.data.data;
    initialValues.nameAr = result.ar.name;
    initialValues.nameEn = result.en.name;
    initialValues.nameUr = result.urd.name;

    initialValues.city = result.city.id;
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
