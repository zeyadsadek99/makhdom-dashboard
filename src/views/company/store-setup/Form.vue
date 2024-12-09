<template>
  <div>
    <breadcrumbs
      back="/store-setup"
      :items="breads"
      :title="t(`TITLES.${route.params.id ? 'editStore' : 'newStore'}`)"
    />

    <base-card1
      :title="$t('TITLES.Store Data')"
      class="w-full max-w-[1200px] mx-auto"
    >
      <FormSkelton v-if="loading" />
      <VeeForm
        v-else
        as="div"
        :validation-schema="schema"
        @submit="handleSubmit"
        :initial-values="initialValues"
      >
        <form>
          <div class=" ">
            <v-switch
              color="success"
              :model-value:any="true"
              class="capitalize"
              :label="$t(is_active ? 'LABELS.activated' : 'LABELS.inactivated')"
              v-model="is_active"
            ></v-switch>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <base-input
                id="storeNameAr"
                name="storeNameAr"
                :placeholder="$t('LABELS.storeName')"
                :label="$t('LABELS.storeName') + t('inArabic')"
                type="text"
                icon="store1"
              />
              <base-input
                id="storeNameEn"
                name="storeNameEn"
                :placeholder="$t('LABELS.storeName')"
                :label="$t('LABELS.storeName') + t('inEnglish')"
                type="text"
                icon="store1"
              />
              <base-select
                id="FranchiseGroup"
                name="franchiseGroup"
                :placeholder="$t('LABELS.Franchise Group')"
                :label="$t('LABELS.Franchise Group')"
                type="text"
                icon="store"
                url="all_franchise_group"
                :filter="null"
                :multiple="false"
                v-model:itemValue="initialValues.franchiseGroup"
              />
              <base-phone
                icon="key"
                id="phoneNumber"
                name="phoneNumber"
                url="all_brandCountry"
                v-model:itemValue="phone_country"
                :phone-code="initialValues.phoneCode"
              />
              <base-select
                id="country"
                name="country"
                :placeholder="$t('LABELS.country')"
                :label="$t('LABELS.country')"
                type="text"
                icon="flag"
                url="all_brandCountry"
                :filter="null"
                :multiple="false"
                @change="getCities"
                v-model:itemValue="initialValues.country"
              />

              <base-select
                id="storeCity"
                name="storeCity"
                :placeholder="$t('LABELS.Store City')"
                :label="$t('LABELS.Store City')"
                type="text"
                icon="flag"
                :options="cities"
                :filter="null"
                :multiple="false"
                :loading="cityLoading"
                v-model:itemValue="initialValues.storeCity"
              />

              <base-select
                id="timeZone"
                name="timeZone"
                :placeholder="$t('LABELS.timeZone')"
                :label="$t('LABELS.timeZone')"
                type="text"
                icon="hour"
                :filter="null"
                :options="timeZones"
                :multiple="false"
                v-model:itemValue="initialValues.timeZone"
              />
            </div>
            <div class="mb-5">
              <base-file
                modalName="stores"
                modalType="image"
                id="logo"
                name="logo"
                :placeholder="$t('LABELS.Store logo')"
                :label="$t('LABELS.Store logo')"
                multiple
                v-model:itemValue="initialValues.preview"
                v-model:image="initialValues.logo"
              />
            </div>

            <div
              class="sm:col-span-2 mb-3"
              :class="
                locationValidation ? 'border p-2 rounded-lg border-warning' : ''
              "
            >
              <Map
                @set-location="setLocation"
                :location="initialValues.location"
              />
              <p
                class="text-error font-bold text-sm my-4"
                v-if="locationValidation"
              >
                {{ locationValidation }}
              </p>
            </div>
            <base-input
              id="locationInformation"
              name="locationInformation"
              :placeholder="$t('LABELS.Location Information')"
              :label="$t('LABELS.Location Information')"
              type="text"
              icon="location"
            />
          </div>

          <div class="flex items-center justify-end mt-3">
            <button
              type="submit"
              class="h-[57px] bg-primary !text-white w-full lg:w-[165px] rounded-[10px] disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="isLoading"
            >
              {{ $t("BUTTONS.save") }}
            </button>
          </div>
        </form>
      </VeeForm>
    </base-card1>
  </div>
</template>

<script setup>
import Map from "@/components/Map.vue";
import axios from "axios";
import { configure, useField } from "vee-validate";
import { useRoute, useRouter } from "vue-router";
import * as yup from "yup";
import { toast } from "vue3-toastify";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const phone_country = ref("");
const breads = [
  {
    path: "/store-setup",
    imgIcon: "storeSetup.svg",
    name: t("sidebar.storeSetup"),
  },
  {
    path: `/store-setup/form${route.params.id ? `/` + route.params.id : ""}`,

    name: t(`BUTTONS.${route.params.id ? "edit" : "add"}`, {
      name: t("LABELS.store"),
    }),
  },
];

const location = ref(null);
const locationValidation = ref(null);
function setLocation(loc) {
  initialValues.location.lat = loc.lat;
  initialValues.location.lng = loc.lng;

  locationValidation.value = null;
}

const initialValues = {
  phoneCode: "",
  logo: "",
  preview: "",
  country: null,
  storeCity: null,
  franchiseGroup: null,
  is_active: true,
  locationInformation: "",

  timeZone: null,
  storeNameEn: "",
  storeNameAr: "",
  location: {
    lat: 0,
    lng: 0,
  },
};

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: false,
  validateOnModelUpdate: true,
});

const schema = yup.object().shape({
  franchiseGroup: yup.mixed().nullable(),
  // .required(t("ERRORS.isRequired", { name: t("LABELS.Franchise Group") })),
  country: yup.mixed().required(t("ERRORS.country")),
  storeCity: yup
    .mixed()
    .required(t("ERRORS.isRequired", { name: t("LABELS.Store City") })),
  locationInformation: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.Location Information") })
    )
    .nullable(),
  timeZone: yup.mixed().required(t("ERRORS.timeZone")),
  phoneNumber: yup
    .string()
    .test("phoneNumber", t("ERRORS.phoneNumber"), (value) => {
      if (value) {
        return true;
      }
    })
    .test("phoneCode", t("ERRORS.phoneCode"), () => {
      if (phone_country.value) {
        return true;
      }
    }),
  storeNameAr: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.storeName") }) + t("inArabic")
    ),
  storeNameEn: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.storeName") }) + t("inEnglish")
    ),

  logo: yup
    .mixed()
    .test(
      "logo",
      t("ERRORS.isRequired", { name: t("LABELS.Store logo") }),
      (value) => {
        if (value || initialValues.preview) {
          return true;
        }
      }
    ),
});

const is_active = ref(true);

const isLoading = ref(false);
const loading = ref(false);
function handleSubmit(values) {
  locationValidation.value = "";
  if (!initialValues.location.lat || !initialValues.location.lng) {
    locationValidation.value = t("locationIsRequired");

    return;
  }

  if (initialValues.logo) {
    values.logo = initialValues.logo;
  }
  if (initialValues.preview) {
    values.preview = initialValues.preview;
  }
  values.location = initialValues.location;
  values.is_active = initialValues.is_active;

  isLoading.value = true;
  let url = "store";
  const frmData = new FormData();
  if (route.params.id) {
    frmData.append("_method", "PUT");

    url = `store/${route.params.id}`;
  }
  frmData.append("is_active", +is_active.value);
  frmData.append("ar[name]", values.storeNameAr);
  frmData.append("en[name]", values.storeNameEn);

  frmData.append("phone", values.phoneNumber);
  if (values.logo) {
    frmData.append("logo", values.logo);
  }
  frmData.append("brand_country_id", values.country);
  frmData.append("lng", values.location.lng);
  frmData.append("lat", values.location.lat);
  if (values.locationInformation) {
    frmData.append("location_description", values.locationInformation);
  }
  frmData.append("time_zone", values.timeZone);
  frmData.append("phone_code_id", values.phoneCode?.id);
  if (values.franchiseGroup) {
    frmData.append("franchise_group_id", values.franchiseGroup);
  }
  frmData.append("brand_city_id", values.storeCity);

  axios
    .post(url, frmData)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 300);

      router.push("/store-setup");
    })
    .catch((e) => {
      toast.error(e.response.data.message);
    })
    .finally(() => (isLoading.value = false));
}

const features = ref([]);

function getData() {
  loading.value = true;

  axios
    .get(`store/${route.params.id}`)
    .then((res) => {
      const result = res.data.data;
      is_active.value = result.is_active;
      initialValues.locationInformation = result.location_description;
      initialValues.storeNameEn = result.en.name;
      initialValues.storeNameAr = result.ar.name;
      getCities(result.brand_country?.id);
      initialValues.country = result.brand_country.id;
      initialValues.storeCity = result.brand_city.id;
      initialValues.franchiseGroup = result.franchise_group?.id;
      initialValues.phoneNumber = result.phone;
      initialValues.timeZone = result.time_zone;
      initialValues.preview = result.image;
      initialValues.location = {
        lat: +result.lat,
        lng: +result.lng,
      };

      is_active.value = result.is_active;
      loading.value = false;
    })
    .catch(() => (loading.value = false));
}

const timeZones = ref([]);

function getTimeZonesWithGMTUTC() {
  // List of available time zones
  const availableTimeZones = Intl.supportedValuesOf("timeZone");

  availableTimeZones.forEach((timeZone) => {
    const timeZoneLabel = new Intl.DateTimeFormat("en", {
      timeZone,
    }).resolvedOptions().timeZone;
    const timeZoneOffset = new Date().toLocaleString("en", {
      timeZoneName: "short",
      timeZone,
    });

    // Extract the UTC/GMT offset from the full offset string
    const utcOffset = timeZoneOffset.replace(timeZoneLabel, "").trim();

    timeZones.value.push({
      name: timeZoneLabel,
      id: timeZoneLabel,
      offset: utcOffset,
    });
  });

  return timeZones;
}

const cities = ref([]);
const cityLoading = ref(false);

function getCities(id) {
  if (id) {
    cityLoading.value = true;

    axios.get(`all_brandCity/${id}`).then((res) => {
      cityLoading.value = false;
      cities.value = res.data.data;
    });
  }
}

onMounted(() => {
  getTimeZonesWithGMTUTC();
  if (route.params.id) {
    getData();
  }
});
</script>
