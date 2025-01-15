<template>
  <div>
    <breadcrumbs back="/admins" :title="$t('LABELS.Admins')" :items="breads" />
    <div class="flex gap-4 flex-wrap">
      <div class="flex-1 w-full min-w-[250px]">
        <FormSkelton v-if="loading" />
        <template v-else>
          <base-card1
            :title="$t('TITLES.Details', { name: $t('LABELS.Admin') })"
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
                <base-input
                  id="option"
                  name="option"
                  :placeholder="$t('LABELS.option')"
                  :label="$t('LABELS.option')"
                  type="text"
                />
                <base-input
                  id="phoneCode"
                  name="phoneCode"
                  :placeholder="$t('LABELS.phoneCode')"
                  :label="$t('LABELS.phoneCode')"
                  type="text"
                />

                <base-phone
                  id="phoneNumber"
                  name="phoneNumber"
                  :placeholder="$t('LABELS.phone')"
                  :top-label="$t('LABELS.phone')"
                  
                  :regular-phone="true"
                />
                <!-- <base-select
                  id="role"
                  name="role"
                  :placeholder="$t('LABELS.Role')"
                  :label="$t('LABELS.Role')"
                  url="role-names"
                  v-model:itemValue="initialValues.role"
                /> -->
              </div>

              <div class="grid md:grid-cols-2 gap-2 mt-4">
                <base-password
                  id="password"
                  name="password"
                  :placeholder="$t('LABELS.password')"
                  label="password"
                />
                <!-- <base-password
                  id="cPassword"
                  name="cPassword"
                  :placeholder="$t('LABELS.cPassword')"
                  label="cPassword"
                /> -->
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
  name: "",
  email: "",
  phoneNumber: "",
  preview: "",
  option: "",
  phoneCode: "",
  image: "",
  password: "",
});

const schema = yup.object().shape({
  name: yup.string().required(t("ERRORS.name")),
  email: yup.string().required(t("ERRORS.emailAddress")),
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

  let url = "admins";

  if (route.params.id) {
    frmData.append("_method", "PUT");
    url = `admins/${values.id}`;
  }

  if (initialValues.image) {
    frmData.append("image", initialValues.image);
  }

  frmData.append("full_name", values.name);
  frmData.append("option", values.option);
  frmData.append("phone", values.phoneNumber);
  frmData.append("phone_code", values.phoneCode);
  frmData.append("email", values.email);
  if (values.password) frmData.append("password", values.password);

  axios
    .post(url, frmData)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 300);
      router.push("/admins");
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
    name: t("LABELS.Admins"),
    path: "/admins",
    imgIcon: "",
  },
  {
    name: t(`BUTTONS.${route.params.id ? "Edit" : "add"}`, {
      name: t("LABELS.admin"),
    }),
    path: `/admins/form${route.params.id ? "/" + route.params.id : ""}`,
  },
];

function getData() {
  axios.get(`admins/${route.params.id}`).then((res) => {
    const result = res.data.data;

    initialValues.name = result.full_name;
    initialValues.email = result.email;
    initialValues.phoneNumber = result.phone;
    initialValues.phoneCode = result.phone_code;

    initialValues.preview = result.image ?? result.logo;

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
