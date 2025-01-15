<template>
  <div>
    <breadcrumbs
      back="/services"
      :title="$t('LABELS.Services')"
      :items="breads"
    />
    <div class="flex gap-4 flex-wrap">
      <div class="flex-1 w-full min-w-[250px]">
        <FormSkelton v-if="loading" />
        <template v-else>
          <base-card1
            :title="$t('TITLES.Details', { name: $t('LABELS.Services') })"
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
                  id="titleAr"
                  name="titleAr"
                  :placeholder="$t('LABELS.titleAr')"
                  :label="$t('LABELS.titleAr')"
                  type="text"
                />
                <base-input
                  id="titleEn"
                  name="titleEn"
                  :placeholder="$t('LABELS.titleEn')"
                  :label="$t('LABELS.titleEn')"
                  type="text"
                />
                <base-input
                  id="price"
                  name="price"
                  :placeholder="$t('LABELS.price')"
                  :label="$t('LABELS.price')"
                  type="text"
                />
                <base-input
                  id="slugAr"
                  name="slugAr"
                  :placeholder="$t('LABELS.slugAr')"
                  :label="$t('LABELS.slugAr')"
                  type="text"
                />
                <base-input
                  id="slugEn"
                  name="slugEn"
                  :placeholder="$t('LABELS.slugEn')"
                  :label="$t('LABELS.slugEn')"
                  type="text"
                />
                <base-input
                  id="desAr"
                  name="desAr"
                  :placeholder="$t('LABELS.desAr')"
                  :label="$t('LABELS.desAr')"
                  type="text"
                />
                <base-input
                  id="desEn"
                  name="desEn"
                  :placeholder="$t('LABELS.desEn')"
                  :label="$t('LABELS.desEn')"
                  type="text"
                />
                <base-input
                  id="shortDesAr"
                  name="shortDesAr"
                  :placeholder="$t('LABELS.shortDesAr')"
                  :label="$t('LABELS.shortDesAr')"
                  type="text"
                />
                <base-input
                  id="shortDesEn"
                  name="shortDesEn"
                  :placeholder="$t('LABELS.shortDesEn')"
                  :label="$t('LABELS.shortDesEn')"
                  type="text"
                />
                
                

                <base-select
                  id="category"
                  name="category"
                  :placeholder="$t('LABELS.category')"
                  :label="$t('LABELS.category')"
                  :options="categories"
                  v-model:itemValue="initialValues.category"
                />
              </div>

              

              <div
                class="flex items-center justify-end mt-7 gap-4 md:col-span-2 xl:col-span-3"
              >
                <router-link
                  to="/services"
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
  titleAr: "",
  titleEn: "",
  slugAr: "",
  slugEn: "",
  desAr: "",
  desEn: "",
  shortDesAr: "",
  shortDesEn: "",
  price: "",

  id: "",
  // email: "",
  // phoneNumber: "",
  // preview: "",
  // phoneCode: "",
  image: "",
  category: "",
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

  let url = "services";

  if (route.params.id) {
    frmData.append("_method", "PUT");
    url = `services/${values.id}`;
  }

  if (initialValues.image) {
    frmData.append("image[media]", initialValues.image);
  }

  frmData.append("ar[title]", values.titleAr);
  frmData.append("en[title]", values.titleEn);
  frmData.append("ar[slug]", values.slugAr);
  frmData.append("en[slug]", values.slugEn);
  frmData.append("ar[short_description]", values.shortDesAr);
  frmData.append("en[short_description]", values.shortDesEn);
  frmData.append("ar[description]", values.desAr);
  frmData.append("en[description]", values.desEn);
  frmData.append("price", values.price);
  frmData.append("sub_category_id", values.category);
  // frmData.append("full_name", values.name);
  // frmData.append("phone", values.phoneNumber);
  // frmData.append("phone_code", values.phoneCode.phone_code);
  // frmData.append("email", values.email);
  // frmData.append("role_id", values.role);
  // if (values.password) frmData.append("password", values.password);

  axios
    .post(url, frmData)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 300);
      router.push("/services");
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
    name: t("LABELS.Services"),
    path: "/services",
    imgIcon: "",
  },
  {
    name: t(`BUTTONS.${route.params.id ? "Edit" : "add"}`, {
      name: t("LABELS.services"),
    }),
    path: `/services/form${route.params.id ? "/" + route.params.id : ""}`,
  },
];

function getData() {
  axios.get(`services/${route.params.id}`).then((res) => {
    console.log(route.params.id)
    const result = res.data.data;
    initialValues.titleAr = result.ar.title;
    initialValues.titleEn = result.en.title;
    initialValues.price = result.price;
    initialValues.slugAr = result.ar.slug;
    initialValues.slugEn = result.en.slug;
    initialValues.shortDesAr = result.ar.short_description;
    initialValues.shortDesEn = result.en.short_description;
    initialValues.desAr = result.ar.description;
    initialValues.desEn = result.en.description;
    // initialValues.name = result.full_name;
    // initialValues.email = result.email;
    // initialValues.phoneNumber = result.phone;
    // initialValues.phoneCode = result.country;
    // initialValues.phone_code = result.country;
    // initialValues.role = result.role.id;

    // initialValues.preview = result.image;
    
    initialValues.id = result.id;
    initialValues.category = result.sub_category_id;

    loading.value = false;
  });
}

const categories = ref([]);

function getCategories() {
  axios.get("index-without-pagination").then((res) => {
    categories.value = res.data.data.map((el) => {
      return {
        id: el.id,
        name: el.title,
      };
    });
  });
}
getCategories();

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
