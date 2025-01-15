<template>
  <div>
    <breadcrumbs back="/roles" :title="$t('LABELS.Roles')" :items="breads" />
    <div class="flex gap-4 flex-wrap">
      <div class="flex-1 w-full min-w-[250px]">
        <FormSkelton v-if="loading" />
        <template v-else>
          <base-card1
            :title="$t('TITLES.Details', { name: $t('LABELS.Role') })"
          >
            <VeeForm
              :validation-schema="schema"
              @submit="handleSubmit"
              :initial-values="initialValues"
              v-slot="{ meta, errors }"
            >
              <div class="grid gap-2 md:grid-cols-2 xl:grid-cols-3 mb-2">
                <base-input
                  id="nameAr"
                  name="nameAr"
                  :placeholder="
                    $t('LABELS.Name', { name: $t('LABELS.Role') }) +
                    $t('inArabic')
                  "
                  :label="
                    $t('LABELS.Name', { name: $t('LABELS.Role') }) +
                    $t('inArabic')
                  "
                  type="text"
                />
                <base-input
                  id="nameEn"
                  name="nameEn"
                  :placeholder="
                    $t('LABELS.Name', { name: $t('LABELS.Role') }) +
                    $t('inEnglish')
                  "
                  :label="
                    $t('LABELS.Name', { name: $t('LABELS.Role') }) +
                    $t('inEnglish')
                  "
                  type="text"
                />
                <base-input
                  id="nameUr"
                  name="nameUr"
                  :placeholder="
                    $t('LABELS.Name', { name: $t('LABELS.Role') }) + $t('inUrd')
                  "
                  :label="
                    $t('LABELS.Name', { name: $t('LABELS.Role') }) + $t('inUrd')
                  "
                  type="text"
                />
              </div>

              <div v-if="permissionsloading" class="space-y-4">
                <div class="flex items-center gap-3">
                  <p><Skeleton width="15rem" height="1rem" /></p>
                  <ul class="flex items-center gap-3 flex-1">
                    <li><Skeleton width="1rem" height="1rem" /></li>
                    <li><Skeleton width="5rem" height="1rem" /></li>
                    <li><Skeleton width="1rem" height="1rem" /></li>
                    <li><Skeleton width="5rem" height="1rem" /></li>
                    <li><Skeleton width="1rem" height="1rem" /></li>
                    <li><Skeleton width="5rem" height="1rem" /></li>
                    <li><Skeleton width="1rem" height="1rem" /></li>
                  </ul>
                </div>
                <div class="flex items-center gap-3">
                  <p><Skeleton width="15rem" height="1rem" /></p>
                  <ul class="flex items-center gap-3 flex-1">
                    <li><Skeleton width="1rem" height="1rem" /></li>
                    <li><Skeleton width="5rem" height="1rem" /></li>
                    <li><Skeleton width="1rem" height="1rem" /></li>
                    <li><Skeleton width="5rem" height="1rem" /></li>
                    <li><Skeleton width="1rem" height="1rem" /></li>
                    <li><Skeleton width="5rem" height="1rem" /></li>
                    <li><Skeleton width="1rem" height="1rem" /></li>
                  </ul>
                </div>
              </div>
              <div v-else class="space-y-4">
                <div class="v-table">
                  <div class="table-wrapper">
                    <table>
                      <thead></thead>
                      <tbody>
                        <tr>
                          <td>
                            <p class="text-text font-semibold">
                              {{ $t("LABELS.AdministratorAccess") }}
                            </p>
                          </td>
                          <td></td>
                        </tr>
                        <Row
                          :class="
                            !meta.valid && meta.touched && errors.permissions
                              ? 'error'
                              : ''
                          "
                          v-for="(value, key) of permissions"
                          :key="key"
                          :name="key"
                          :value="value"
                          v-model:permissions="initialValues.permissions"
                        />
                      </tbody>
                    </table>
                    <VeeErrorMessage
                      v-if="!meta.valid && meta.touched"
                      name="permissions"
                      as="div"
                      class="text-error"
                    />
                  </div>
                </div>
              </div>

              <div
                class="flex items-center justify-end mt-7 gap-4 md:col-span-2 xl:col-span-3"
              >
                <router-link
                  to="/roles"
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
import Row from "./Row.vue";

import Skeleton from "primevue/skeleton";
import * as yup from "yup";
import { toast } from "vue3-toastify";
import axios from "axios";
import { reactive, ref, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";

import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const { t } = useI18n();
const permissions = ref([]);

const initialValues = reactive({
  nameAr: "",
  nameEn: "",
  nameUr: "",
  permissions: [],
});

const schema = yup.object().shape({
  nameEn: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.Role") }) + t("inEnglish")
    ),
  nameAr: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.Role") }) + t("inArabic")
    ),
  nameUr: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.Role") }) + t("inUrd")),
  permissions: yup
    .array()
    .min(1, t("ERRORS.isRequired", { name: t("LABELS.Permissions") })),
});

const btnLoading = ref(false);

function handleSubmit(values, actions) {
  btnLoading.value = true;
  const frmData = new FormData();

  let url = "role";

  if (route.params.id) {
    frmData.append("_method", "PUT");
    url = `role/${values.id}`;
  }

  frmData.append("ar[name]", values.nameAr);
  frmData.append("en[name]", values.nameEn);
  frmData.append("urd[name]", values.nameUr);

  values.permissions.map((permission, index) => {
    frmData.append(`permission_ids[${index}]`, permission);
  });

  axios
    .post(url, frmData)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 300);
      router.push("/roles");
      btnLoading.value = false;
      actions.resetForm();
    })
    .catch((e) => {
      toast.error(e.response.data.message);
    })
    .finally(() => (btnLoading.value = false));
}

const loading = ref(false);
const permissionsloading = ref(false);

const breads = [
  {
    path: "/",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.home"),
  },
  {
    name: t("LABELS.Roles"),
    path: "/roles",
    imgIcon: "",
  },
  {
    name: t(`BUTTONS.${route.params.id ? "Edit" : "add"}`, {
      name: t("LABELS.Role"),
    }),
    path: `/roles/form${route.params.id ? "/" + route.params.id : ""}`,
  },
];

function getData() {
  axios.get(`role/${route.params.id}`).then((res) => {
    const result = res.data.data;

    initialValues.nameAr = result.ar.name;
    initialValues.nameEn = result.en.name;
    initialValues.nameUr = result.urd.name;
    initialValues.permissions = result.permission.map((el) => el.id);

    initialValues.id = result.id;

    loading.value = false;
  });
}

function fetchPermissions() {
  permissionsloading.value = true;
  axios
    .get("permission-not-paginated")
    .then((res) => {
      permissions.value = res.data.data;

      permissionsloading.value = false;
    })
    .catch(() => (permissionsloading.value = false));
}

onBeforeMount(() => {
  if (route.params.id) {
    loading.value = true;
    getData();
  }
  fetchPermissions();
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
</style>
