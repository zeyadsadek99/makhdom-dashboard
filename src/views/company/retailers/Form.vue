<template>
  <div>
    <breadcrumbs
      back="/retailers"
      :title="$t('LABELS.Retailers')"
      :items="breads"
    />
    <div class="flex gap-4 flex-wrap">
      <div class="flex-1 w-full min-w-[250px]">
        <FormSkelton v-if="loading" />
        <template v-else>
          <base-card1
            :title="$t('TITLES.Details', { name: $t('LABELS.Retailer') })"
          >
            <VeeForm
              :validation-schema="schema"
              @submit="handleSubmit"
              :initial-values="initialValues"
              class="profile_page"
              v-slot="{ values, meta }"
            >
              <div class="flex items-center gap-3">
                <div class="w-fit relative">
                  <p class="text-text mb-1">{{ $t("LABELS.image") }}</p>
                  <base-file
                    @uploading="btnLoading = $event"
                    modalName="users"
                    modalType="image"
                    id="image"
                    name="image"
                    :placeholder="$t('LABELS.image')"
                    label=""
                    v-model:itemValue="initialValues.preview"
                    v-model:image="initialValues.image"
                    accept="image/png, image/webp, image/jpeg"
                    :no_preview="true"
                  />

                  <label
                    for="image"
                    class="w-10 h-10 end-7 bg-primary rounded-full flex justify-center items-center absolute -bottom-2"
                  >
                    <img
                      class="!object-contain"
                      src="@/assets/images/icons/solar_upload-linear.png"
                      alt="solar icon"
                    />
                  </label>
                </div>
                <div class="w-fit relative">
                  <p class="text-text mb-1">{{ $t("LABELS.Shop image") }}</p>
                  <base-file
                    @uploading="btnLoading = $event"
                    modalName="users"
                    modalType="image"
                    id="shop_image"
                    name="shop_image"
                    :placeholder="$t('LABELS.image')"
                    label=""
                    v-model:itemValue="initialValues.shop_preview"
                    v-model:image="initialValues.shop_image"
                    accept="image/png, image/webp, image/jpeg"
                    :no_preview="true"
                  />

                  <label
                    for="image"
                    class="w-10 h-10 end-7 bg-primary rounded-full flex justify-center items-center absolute -bottom-2"
                  >
                    <img
                      class="!object-contain"
                      src="@/assets/images/icons/solar_upload-linear.png"
                      alt="solar icon"
                    />
                  </label>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div class="md:col-span-2">
                  <base-input
                    id="facilityName"
                    name="facilityName"
                    :placeholder="$t('LABELS.Name')"
                    :label="$t('LABELS.Name', { name: $t('LABELS.Facility') })"
                    icon="user1"
                  />
                </div>
                <base-input
                  id="applicant"
                  name="applicant"
                  :placeholder="
                    $t('LABELS.Name', { name: $t('LABELS.Applicant') })
                  "
                  :label="$t('LABELS.Name', { name: $t('LABELS.Applicant') })"
                  icon="user1"
                />

                <base-select
                  id="facility_type_id"
                  name="facility_type_id"
                  :placeholder="$t('LABELS.choose')"
                  :label="$t('LABELS.Facility')"
                  :url="GENERAL_URL + '/general/facility-types?type=wholesale'"
                  :filter="null"
                  :multiple="false"
                  v-model:itemValue="initialValues.facility_type_id"
                />
                <base-select
                  id="categories"
                  name="categories"
                  :placeholder="$t('LABELS.choose')"
                  :label="$t('LABELS.Categories')"
                  :url="
                    GENERAL_URL +
                    `/general/facility-type-categories/${values.facility_type_id}`
                  "
                  :filter="null"
                  :multiple="true"
                  v-model:itemValue="initialValues.categories"
                />

                <base-phone
                  id="phoneNumber"
                  name="phoneNumber"
                  url="countries-without-paginated"
                  :placeholder="$t('LABELS.phone')"
                  :top-label="$t('LABELS.phone')"
                  phoneCode="phoneCode"
                  v-model:phone_code="initialValues.phone_code"
                  :regular-phone="true"
                />
                <base-input
                  id="commercial_registration_number"
                  name="commercial_registration_number"
                  :placeholder="$t('LABELS.Commercial Registration No')"
                  :label="$t('LABELS.Commercial Registration No')"
                  type="text"
                />
                <base-date
                  :min-date="new Date()"
                  id="commercial_registration_date"
                  name="commercial_registration_date"
                  :placeholder="$t('LABELS.Expiry Date')"
                  :label="$t('LABELS.Expiry Date')"
                  type="text"
                  v-model:itemValue="initialValues.commercial_registration_date"
                />

                <base-input
                  id="emailAddress"
                  name="emailAddress"
                  :placeholder="
                    $t('LABELS.Facility') + ' ' + $t('LABELS.emailAddress')
                  "
                  :label="
                    $t('LABELS.Facility') + ' ' + $t('LABELS.emailAddress')
                  "
                  icon="envelope"
                />
                <base-input
                  id="whatsapp"
                  name="whatsapp"
                  :placeholder="$t('LABELS.whatsapp')"
                  :label="t('LABELS.facilityWhatsapp')"
                  icon="whatsapp"
                />
                <base-input
                  id="phone"
                  name="phone"
                  :placeholder="t('LABELS.Facility') + ' ' + t('LABELS.phone')"
                  :label="t('LABELS.Facility') + ' ' + t('LABELS.phone')"
                  icon="phone"
                />
              </div>

              <div class="grid md:grid-cols-2 gap-2 mt-4">
                <base-password
                  id="password"
                  name="password"
                  :placeholder="$t('LABELS.password')"
                  label="password"
                />
                <base-password
                  id="cPassword"
                  name="cPassword"
                  :placeholder="$t('LABELS.cPassword')"
                  label="cPassword"
                />
              </div>

              <div class="">
                <Map
                  :label="$t('LABELS.Select location from map')"
                  :location="initialValues.location"
                  :location-address="initialValues.locationAddress"
                  :draggable="true"
                  @setLocation="initialValues.locationAddress = $event.address"
                />
                <VeeErrorMessage
                  v-if="!meta.valid && meta.touched"
                  name="location.lat"
                  as="div"
                  class="text-error"
                />
                <VeeErrorMessage
                  v-if="!meta.valid && meta.touched"
                  name="location.lng"
                  as="div"
                  class="text-error"
                />
                <div class="mt-5">
                  <base-input
                    id="locationAddress"
                    :label="$t('LABELS.location')"
                    :placeholder="$t('LABELS.location')"
                    name="locationAddress"
                    v-model="initialValues.locationAddress"
                  />
                </div>
              </div>

              <div
                class="flex items-center justify-end mt-7 gap-4 md:col-span-2 xl:col-span-3"
              >
                <router-link
                  to="/admins"
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
const GENERAL_URL = import.meta.env.VITE_GENERAL_URL;
import * as yup from "yup";
import { toast } from "vue3-toastify";
import axios from "axios";
import { reactive, ref, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";

import { useRoute, useRouter } from "vue-router";
import Map from "@/components/Map1.vue";
const route = useRoute();
const router = useRouter();

const { t } = useI18n();

const initialValues = reactive({
  preview: "",
  image: "",
  shop_image: "",
  shop_preview: "",
  facilityName: "",
  applicant: "",
  phoneNumber: "",
  phoneCode: "",
  phone_code: "",
  facility_type_id: null,
  commercial_registration_date: null,
  commercial_registration_number: null,
  categories: [],
  emailAddress: "",
  whatsapp: "",
  phone: "",

  password: "",
  cPassword: "",
  location: {
    lat: null,
    lng: null,
  },
  locationAddress: "",
});

const schema = yup.object().shape({
  facilityName: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Name", { name: t("LABELS.Facility") }),
    })
  ),
  applicant: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Name", { name: t("LABELS.Applicant") }),
    })
  ),
  categories: yup.array().min(
    1,
    t("ERRORS.isRequired", {
      name: t("LABELS.Categories"),
    })
  ),
  facility_type_id: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Facility"),
    })
  ),
  emailAddress: yup
    .string()
    .email(t("ERRORS.validEmailAddress"))
    .required(t("ERRORS.emailAddress")),
  phoneCode: yup.mixed().required(t("ERRORS.phoneCode")),

  phoneNumber: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.phone") }))
    .test((value, context) => {
      let parent = context.parent.phoneCode?.phone_number_limit;

      if (value.length > parent || value.length < parent) {
        return context.createError({
          message: t("ERRORS.phoneLength", { value: parent }),
          path: "phoneNumber",
        });
      } else {
        return true;
      }
    }),

  image: yup
    .mixed()
    .test(
      "image",
      t("ERRORS.isRequired", { name: t("LABELS.image") }),
      (value) => {
        if (value || initialValues.preview) {
          return true;
        }
      }
    ),

  shop_image: yup
    .mixed()
    .test(
      "image",
      t("ERRORS.isRequired", { name: t("LABELS.Shop image") }),
      (value) => {
        if (value || initialValues.shop_preview) {
          return true;
        }
      }
    ),

  commercial_registration_number: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.Commercial Registration No") })
    ),
  commercial_registration_date: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Expiry Date"),
    })
  ),
  locationAddress: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.location"),
    })
  ),
  location: yup.object().shape({
    lat: yup
      .string()
      .required(t("ERRORS.isRequired", { name: t("LABELS.coords") })),
    lng: yup
      .string()
      .required(t("ERRORS.isRequired", { name: t("LABELS.coords") })),
  }),
  password: yup.string().test("password", t("ERRORS.password"), (value) => {
    if (route.params.id) {
      return true;
    } else if (value) {
      return true;
    } else return false;
  }),
  cPassword: yup.string().when("password", (password, field) =>
    password
      ? field
          .test("cPassword", t("ERRORS.confirmPassword"), (value) => {
            if (route.params.id) {
              return true;
            } else if (value) {
              return true;
            } else return false;
          })

          .oneOf([yup.ref("password")], t("ERRORS.notEqualPasswords"))
      : field
  ),
});
const btnLoading = ref(false);

function handleSubmit(values, actions) {
  btnLoading.value = true;
  const frmData = new FormData();

  let url = "users";

  if (route.params.id) {
    frmData.append("_method", "PUT");
    url = `users/${values.id}`;
  }

  if (initialValues.image) {
    frmData.append("image", initialValues.image);
  }

  frmData.append("facility_type_id", values.facility_type_id);
  values.categories.map((item, index) => {
    frmData.append(`categories[${index}][category_id]`, item.id);
  });
  frmData.append("lat", values.location.lat);
  frmData.append("lng", values.location.lng);
  if (values.locationAddress) {
    frmData.append("location", values.locationAddress);
  }
  frmData.append("phone", values.phoneNumber);
  frmData.append("phone_code", values.phoneCode.phone_code);
  frmData.append("full_name", values.applicant);
  frmData.append("name", values.facilityName);
  frmData.append("email", values.emailAddress);

  frmData.append(
    "commercial_registration_date",
    values.commercial_registration_date
  );
  frmData.append(
    "commercial_registration_number",
    values.commercial_registration_number
  );
  if (values.phone) frmData.append("company_phone", values.phone);
  if (values.whatsapp) frmData.append("whats", values.whatsapp);
  if (values.password) frmData.append("password", values.password);

  axios
    .post(url, frmData)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 300);
      router.push("/retailers");
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
    name: t("LABELS.Retailers"),
    path: "/retailers",
    imgIcon: "",
  },
  {
    name: t(`BUTTONS.${route.params.id ? "Edit" : "add"}`, {
      name: t("LABELS.Retailer"),
    }),
    path: `/retailers/form${route.params.id ? "/" + route.params.id : ""}`,
  },
];

function getData() {
  axios.get(`users/${route.params.id}`).then((res) => {
    const result = res.data.data;

    initialValues.applicant = result.full_name;
    initialValues.facilityName = result.company?.name;
    initialValues.emailAddress = result.company?.email;
    initialValues.whatsapp = result.company?.whats;
    initialValues.location.lat = result.company?.lat;
    initialValues.phone = result.company?.company_phone;
    initialValues.location.lng = result.company?.lng;
    initialValues.locationAddress = result.company?.location;
    initialValues.phoneNumber = result.phone;
    initialValues.facility_type_id = result.company?.facility_type.id;
    initialValues.categories = result.categories.map((el) => el.id);
    initialValues.commercial_registration_number =
      result.commercial_registration_number;
    initialValues.commercial_registration_date =
      result.commercial_registration_date;

    initialValues.preview = result.image;
    initialValues.phoneCode = result.country;
    initialValues.phone_code = result.country;

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

<style lang="scss">
.v-table {
  @apply flex h-full w-full max-w-[100%] flex-col rounded-lg leading-[1.5];
  --v-table-header-height: 45px;

  .table-wrapper {
    @apply flex-auto overflow-auto;
    table {
      @apply w-full border-spacing-0;
      thead {
        @apply rounded-2xl bg-[#F8FBFD];
      }

      th {
        @apply px-4 text-start;
        height: calc(var(--v-table-header-height) + 15px);
      }

      td {
        @apply p-4 text-start;
      }
      tr.error {
        label,
        input {
          @apply text-error;
        }
      }
    }
  }
}
.profile_page {
  .upload {
    padding: 0;
    width: 180px;
    height: 180px;
    border-radius: 50% !important;
    overflow: hidden;
    label {
      padding: 0;
      margin: 0;
      width: 180px;
      height: 180px;
    }
    img {
      // width: 100% !important;
      // height: 100% !important;
      object-fit: cover !important;
      border-radius: 50% !important;
    }
  }
}
</style>
