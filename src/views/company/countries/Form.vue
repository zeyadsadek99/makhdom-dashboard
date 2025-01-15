<template>
  <div>
    <breadcrumbs
      back="/countries"
      :title="$t('LABELS.countries')"
      :items="breads"
    />
    <div class="flex gap-4 flex-wrap">
      <div class="flex-1 w-full min-w-[250px]">
        <FormSkelton v-if="loading" />
        <template v-else>
          <base-card1
            :title="$t('TITLES.Details', { name: $t('LABELS.countries') })"
          >
            <VeeForm
              :validation-schema="schema"
              @submit="handleSubmit"
              :initial-values="initialValues"
              class="profile_page"
            >
              <div class="w-fit relative">
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
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <base-input
                  id="nameAr"
                  name="nameAr"
                  :placeholder="$t('LABELS.nameAr')"
                  :label="$t('LABELS.nameAr')"
                  type="text"
                />
                <base-input
                  id="nameEn"
                  name="nameEn"
                  :placeholder="$t('LABELS.nameEn')"
                  :label="$t('LABELS.nameEn')"
                  type="text"
                />
                <base-input
                  id="shortName"
                  name="shortName"
                  :placeholder="$t('LABELS.shortName')"
                  :label="$t('LABELS.shortName')"
                  type="text"
                />
                <base-input
                  id="natAr"
                  name="natAr"
                  :placeholder="$t('LABELS.natAr')"
                  :label="$t('LABELS.natAr')"
                  type="text"
                />
                <base-input
                  id="natEn"
                  name="natEn"
                  :placeholder="$t('LABELS.natEn')"
                  :label="$t('LABELS.natEn')"
                  type="text"
                  :disabled="true"
                />
                <base-input
                  id="curAr"
                  name="curAr"
                  :placeholder="$t('LABELS.curAr')"
                  :label="$t('LABELS.curAr')"
                  type="text"
                />
                <base-input
                  id="curEn"
                  name="curEn"
                  :placeholder="$t('LABELS.curEn')"
                  :label="$t('LABELS.curEn')"
                  type="text"
                />
                <base-input
                  id="natIdlimit"
                  name="natIdlimit"
                  :placeholder="$t('LABELS.natIdlimit')"
                  :label="$t('LABELS.natIdlimit')"
                  type="text"
                />
                <base-input
                  id="continent"
                  name="continent"
                  :placeholder="$t('LABELS.continent')"
                  :label="$t('LABELS.continent')"
                  type="text"
                />
                <base-input
                  id="phoneNumberLimit"
                  name="phoneNumberLimit"
                  :placeholder="$t('LABELS.phoneNumberLimit')"
                  :label="$t('LABELS.phoneNumberLimit')"
                  type="text"
                />
                <base-input
                  id="phoneCode"
                  name="phoneCode"
                  :placeholder="$t('LABELS.phoneCode')"
                  :label="$t('LABELS.phoneCode')"
                  type="text"
                
                />
                <!-- <base-input
                  id="name"
                  name="name"
                  :placeholder="$t('LABELS.name')"
                  :label="$t('LABELS.name')"
                  type="text"
                />

                <base-input
                  id="email"
                  name="email"
                  :placeholder="$t('LABELS.email')"
                  :label="$t('LABELS.email')"
                  type="text"
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
                <base-select
                  id="role"
                  name="role"
                  :placeholder="$t('LABELS.Role')"
                  :label="$t('LABELS.Role')"
                  url="role-names"
                  v-model:itemValue="initialValues.role"
                /> -->

                <!-- <base-select
                  id="countries"
                  name="countries"
                  :placeholder="$t('LABELS.countries')"
                  :label="$t('LABELS.countries')"
                  url="countries_without_pagination"
                  v-model:itemValue="initialValues.countries"
                /> -->
              </div>

              <!-- <div class="grid md:grid-cols-2 gap-2 mt-4">
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
              </div> -->

              <div
                class="flex items-center justify-end mt-7 gap-4 md:col-span-2 xl:col-span-3"
              >
                <router-link
                  to="/countries"
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
  shortName: "",
  natAr: "",
  natEn: "",
  curAr: "",
  curEn: "",
  natIdlimit: "",
  continent: "",
  id: "",
  // countries: "",
  // price: "",
  // flag:'',
  // name: "",
  // email: "",
  phoneNumberLimit: "",
  // preview: "",
  phoneCode: "",
  image: "",
  // role: "",
  // phone_code: "",
  // password: "",
  // cPassword: "",
});

const schema = yup.object().shape({
  // title: yup.string().required(t("ERRORS.name")),
  // price: yup.string().required(t("ERRORS.name")),
  // slug: yup.string().required(t("ERRORS.name")),
  // name: yup.string().required(t("ERRORS.name")),
  // email: yup.string().required(t("ERRORS.emailAddress")),
  // phoneCode: yup.mixed().required(t("ERRORS.phoneCode")),
  // phoneNumber: yup
  //   .string()
  //   .required(t("ERRORS.isRequired", { name: t("LABELS.phone") }))
  //   .test((value, context) => {
  //     let parent = context.parent.phoneCode?.phone_number_limit;
  //     if (value.length > parent || value.length < parent) {
  //       return context.createError({
  //         message: t("ERRORS.phoneLength", { value: parent }),
  //         path: "phoneNumber",
  //       });
  //     } else {
  //       return true;
  //     }
  //   }),
  // role: yup
  //   .string()
  //   .required(t("ERRORS.isRequired", { name: t("LABELS.Role") })),
  // image: yup
  //   .mixed()
  //   .test(
  //     "image",
  //     t("ERRORS.isRequired", { name: t("LABELS.image") }),
  //     (value) => {
  //       if (value || initialValues.preview) {
  //         return true;
  //       }
  //     }
  //   ),
  // password: yup.string().test("password", t("ERRORS.password"), (value) => {
  //   if (route.params.id) {
  //     return true;
  //   } else if (value) {
  //     return true;
  //   } else return false;
  // }),
  // cPassword: yup.string().when("password", (password, field) =>
  //   password
  //     ? field
  //         .test("cPassword", t("ERRORS.confirmPassword"), (value) => {
  //           if (route.params.id) {
  //             return true;
  //           } else if (value) {
  //             return true;
  //           } else return false;
  //         })
  //         .oneOf([yup.ref("password")], t("ERRORS.notEqualPasswords"))
  //     : field
  // ),
});
const btnLoading = ref(false);

function handleSubmit(values, actions) {
  btnLoading.value = true;
  const frmData = new FormData();

  let url = "countries";

  if (route.params.id) {
    frmData.append("_method", "PUT");
    url = `countries/${values.id}`;
  }

  if (initialValues.image) {
    frmData.append("flag[media]", initialValues.image);
  }

  frmData.append("ar[name]", values.nameAr);
  frmData.append("en[name]", values.nameEn);
  frmData.append("short_name", values.shortName);
  frmData.append("ar[nationality]", values.natAr);
  frmData.append("en[nationality]", values.natEn);
  frmData.append("ar[currency]", values.curAr);
  frmData.append("en[currency]", values.curEn);
  frmData.append("continent", values.continent);
  frmData.append("national_id_limit", values.natIdlimit);
;
  frmData.append("phone_code", values.phoneCode);
  frmData.append("phone_number_limit", values.phoneNumberLimit);
  // frmData.append("email", values.email);
  // frmData.append("role_id", values.role);
  // if (values.password) frmData.append("password", values.password);

  axios
    .post(url, frmData)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 300);
      router.push("/countries");
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
    name: t("LABELS.countries"),
    path: "/countries",
    imgIcon: "",
  },
  {
    name: t(`BUTTONS.${route.params.id ? "Edit" : "add"}`, {
      name: t("LABELS.countries"),
    }),
    path: `/countries/form${route.params.id ? "/" + route.params.id : ""}`,
  },
];

function getData() {
  axios.get(`countries/${route.params.id}`).then((res) => {
    const result = res.data.data;
    // initialValues.titleAr = result.ar[title];
    initialValues.nameAr = result.ar.name;
    initialValues.nameEn = result.en.name ;
    initialValues.shortName = result.short_name ;
    initialValues.natAr = result.ar.nationality ;
    initialValues.natEn = result.en.nationality ;
    initialValues.curAr = result.ar.currency ;
    initialValues.curEn = result.en.currency ;
    initialValues.natIdlimit = result["national_id_limit "  ];
    initialValues.continent = result["continent "] ;

    // initialValues.image = result.flag.media;
    initialValues.phoneNumberLimit = result.phone_number_limit;
    initialValues.phoneCode = result.phone_code;
    initialValues.id = result.id;

    loading.value = false;
  });
}

const categories = ref([]);

function getCategories() {
  axios.get("countries_without_pagination").then((res) => {
    categories.value = res.data.data.map((el) => {
      return {
        id: el.id,
        name: el.title,
      };
    });
  });
}
// getCategories();

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
