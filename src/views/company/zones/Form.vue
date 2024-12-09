<template>
  <div>
    <div>
      <breadcrumbs
        :items="breads"
        :title="
          $t(`BUTTONS.${route.params.id ? 'Edit' : 'new'}`, {
            name: $t('LABELS.zone'),
          })
        "
        :back="`/zones`"
        class="mb-7"
      />
    </div>

    <div class="w-full mx-auto">
      <loader v-if="loading" />
      <VeeForm
        v-else
        :validation-schema="schema"
        @submit="handleSubmit"
        :initial-values="initialValues"
        v-slot="{ meta, values }"
        class="mt-7"
      >
        <base-card1>
          <v-switch
            color="success"
            :model-value:any="true"
            class="capitalize"
            :label="
              $t(
                initialValues.is_active
                  ? 'LABELS.activated'
                  : 'LABELS.inactivated'
              )
            "
            v-model="initialValues.is_active"
          ></v-switch>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <base-input
              id="postalCode"
              name="postalCode"
              :placeholder="$t('LABELS.postalCode')"
              :label="$t('LABELS.postalCode')"
              type="text"
            >
              <!-- :prepend="true" -->
              <!-- <template #prepend>
                <span class="text-sm text-gray-600">{{
                  $t("LABELS.postalCodeFormat")
                }}</span>
              </template> -->
            </base-input>
            <base-select
              id="city"
              name="city"
              :placeholder="$t('LABELS.choose')"
              :label="$t('LABELS.city')"
              url="cities-without-paginated"
              :filter="null"
              v-model:itemValue="initialValues.city"
            />
            <base-select
              id="district"
              name="district"
              :placeholder="$t('LABELS.choose')"
              :label="$t('LABELS.District')"
              :filter="null"
              :url="`districts-without-paginated?city_id=${values.city}`"
              :multiple="false"
              v-model:itemValue="initialValues.district"
            />
          </div>

          <div class="sm:col-span-2 mb-3">
            <Map
              :label="$t('LABELS.Select location from map')"
              :area="initialValues.areas"
              @setPath="setPath"
              :location="initialValues.location"
              @set-location="setLocation"
              canDraw
              :draggable="false"
            />
            <VeeErrorMessage
              v-if="!meta.valid && meta.touched"
              name="areas"
              as="div"
              class="text-error"
            />
          </div>
          <base-input
            id="desc"
            name="desc"
            type="textarea"
            :placeholder="t('LABELS.write')"
            :label="t('LABELS.location')"
            v-model:value="initialValues.desc"
          />

          <div class="flex items-center justify-end gap-7 mt-11">
            <router-link
              :to="`/store-setup/${$route.params.id}/delivery-areas`"
              class="capitalize font-semibold text-sub"
              :disabled="isLoading"
            >
              {{ $t("BUTTONS.cancel") }}
            </router-link>

            <button
              type="submit"
              class="base-btn rounded-md"
              :disabled="isLoading"
            >
              {{ $t("BUTTONS.save") }}
            </button>
          </div>
        </base-card1>
      </VeeForm>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, reactive, onBeforeMount, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue3-toastify";
import { useRoute, useRouter } from "vue-router";
import Map from "@/components/Map.vue";
import * as yup from "yup";

const loading = ref(true);
const props = defineProps({
  data: {
    required: false,
    type: Object,
  },
});
const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();

const breads = ref([
  {
    path: "/",
    imgIcon: "dashboard.svg",
    name: t("sidebar.dashboard"),
  },

  {
    path: `/zones`,
    imgIcon: "",
    name: t("LABELS.Zones"),
  },
  {
    name: t(`BUTTONS.${route.params.id ? "Edit" : "add"}`, {
      name: t("LABELS.zone"),
    }),
    path: `/zones/form${route.params.id ? "/" + route.params.id : ""}`,
  },
]);

const initialValues = reactive({
  nameAr: "",
  nameEn: "",
  nameUr: "",
  district: "",
  city: null,
  district: null,
  desc: "",
  postalCode: "",
  areas: [],

  location: {
    lat: 0,
    lng: 0,
  },
  is_active: true,
});

const schema = yup.object().shape({
  nameEn: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.Zone") }) + t("inEnglish")
    ),
  nameAr: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.Zone") }) + t("inArabic")
    ),
  nameUr: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.Zone") }) + t("inUrd")),
  city: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.city") })),
  postalCode: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.postalCode") })),
  district: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.District") })),
  areas: yup.array().min(1, t("ERRORS.isRequired", { name: t("LABELS.area") })),
  desc: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.location") })),
  location: yup.object().shape({
    lat: yup
      .string()
      .required(t("ERRORS.isRequired", { name: t("LABELS.coords") })),

    lng: yup
      .string()
      .min(1, t("ERRORS.isRequired", { name: t("LABELS.coords") })),
  }),
});

const isLoading = ref(false);
const areaError = ref(false);

function handleSubmit(values) {
  values.desc = initialValues.desc;

  isLoading.value = true;

  let url = `zones`;
  const frmData = new FormData();

  if (route.params.id) {
    frmData.append("_method", "PUT");
    url = `zones/${route.params.id}`;
  }

  frmData.append("lng", values.location.lng);
  frmData.append("lat", values.location.lat);
  frmData.append("location", values.desc);
  frmData.append("ar[name]", values.nameAr);
  frmData.append("en[name]", values.nameEn);
  frmData.append("urd[name]", values.nameUr);
  frmData.append("postal_code", values.postalCode);
  frmData.append("city_id", values.city);
  frmData.append("district_id", values.district);
  frmData.append("is_active", +initialValues.is_active);

  values.areas.map((el, i) => {
    frmData.append(`area[${i}][lat]`, el.lat);
    frmData.append(`area[${i}][lng]`, el.lng);
  });
  frmData.append(`area[${values.areas.length}][lat]`, values.areas[0].lat);
  frmData.append(`area[${values.areas.length}][lng]`, values.areas[0].lng);

  axios
    .post(url, frmData)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 300);
      isLoading.value = false;
      router.push(`/zones`);
    })
    .catch((e) => {
      isLoading.value = false;
      toast.error(e.response.data.message);
    });
}

function setLocation(loc) {
  initialValues.location.lat = loc.lat;
  initialValues.location.lng = loc.lng;
  if (loc.address) initialValues.desc = loc.address;
}

function setData(result) {
  initialValues.is_active = result.is_active;
  initialValues.nameAr = result.ar.name;
  initialValues.nameEn = result.en.name;
  initialValues.nameUr = result.urd.name;
  initialValues.city = result.city.id;
  initialValues.district = result.district.id;
  initialValues.desc = result.location;
  initialValues.location.lat = +result.lat;
  initialValues.location.lng = +result.lng;
  initialValues.areas = result.area.coordinates[0].map((coord) => ({
    lat: coord[1],
    lng: coord[0],
  }));
  loading.value = false;
}

async function getData() {
  axios.get(`zones/${route.params.id}`).then((res) => {
    const result = res.data.data;
    setData(result);
  });
}
const setPath = (coordinates) => {
  initialValues.areas = coordinates;
  areaError.value = false;
};
onMounted(() => {
  if (!route.params.id) {
    loading.value = false;
  }
});

onBeforeMount(async () => {
  if (route.params.id) {
    await getData();
  }
});
</script>
