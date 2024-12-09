<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="$t('TITLES.Integration Settings')"
      :back="`/store-setup/${$route.params.id}`"
      class="mb-7"
    />
    <loader v-if="loading" />
    <VeeForm
      v-else
      :validation-schema="schema"
      @submit="handleSubmit"
      :initial-values="initialValues"
      class="md:max-w-[85%] w-full mx-auto"
    >
      <div class="">
        <FieldArray name="integrations" v-slot="{ fields }">
          <fieldset v-for="(field, idx) in fields" :key="field.key">
            <base-card1 class="w-full mx-auto mb-7">
              <div
                class="flex flex-wrap justify-between items-center !py-1 mb-5 border-b-[1px] border-line"
              >
                <label for="is_active" class="font-semibold text-[16px]">
                  {{ $t(field.value.type) }}
                </label>
                <div>
                  <v-switch
                    id="status"
                    color="success"
                    :model-value:any="true"
                    class="capitalize"
                    v-model="field.value.is_active"
                  ></v-switch>
                </div>
              </div>
              <div class="grid gap-5 md:grid-cols-2">
                <base-input
                  type="number"
                  id="brand_id"
                  :name="`integrations[${idx}].brand_id`"
                  :time-picker="true"
                  icon="integration"
                  :is24="true"
                  :label="`${
                    $t(field.value.type) + ' ' + $t('LABELS.Brand ID')
                  }:`"
                  :placeholder="`${$t('LABELS.Enter', {
                    name: $t('LABELS.number'),
                  })}`"
                  :disabled="!field.value.is_active"
                />
                <base-input
                  type="number"
                  id="vendor_branch_id"
                  :name="`integrations[${idx}].vendor_branch_id`"
                  :time-picker="true"
                  icon="integration"
                  :is24="true"
                  :label="`${$t('LABELS.Vendor Branch ID')}:`"
                  :placeholder="`${$t('LABELS.Enter', {
                    name: $t('LABELS.number'),
                  })}`"
                  :disabled="!field.value.is_active"
                />
                <base-input
                  type="number"
                  id="branch_id"
                  :name="`integrations[${idx}].branch_id`"
                  :time-picker="true"
                  icon="integration"
                  :is24="true"
                  :label="`${
                    $t(field.value.type) + ' ' + $t('LABELS.Branch ID')
                  }:`"
                  :placeholder="`${$t('LABELS.Enter', {
                    name: $t('LABELS.number'),
                  })}`"
                  :disabled="!field.value.is_active"
                />
              </div>
            </base-card1>
          </fieldset>
        </FieldArray>
      </div>
      <div class="flex items-center justify-end gap-7 mt-6">
        <router-link
          :to="`/store-setup/${$route.params.id}`"
          class="capitalize font-semibold text-sub"
        >
          {{ $t("BUTTONS.cancel") }}
        </router-link>

        <button
          type="submit"
          class="base-btn rounded-md"
          :disabled="btnLoading"
        >
          {{ $t("BUTTONS.save") }}
        </button>
      </div>
    </VeeForm>
  </div>
</template>

<script setup>
import { FieldArray } from "vee-validate";
import axios from "axios";
import { onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import * as yup from "yup";
import { toast } from "vue3-toastify";
import { useRoute } from "vue-router";
const { t, locale } = useI18n();
const route = useRoute();
const btnLoading = ref(false);
const aggregators = ref([]);
const aggregatorsLoader = ref(true);
const loading = ref(true);

const props = defineProps({
  storeData: {
    required: true,
  },
});

const breads = ref([
  {
    path: "/store-setup",
    imgIcon: "storeSetup.svg",
    name: t("sidebar.storeSetup"),
  },
  {
    path: `/store-setup/${route.params.id}`,
    imgIcon: "",
    name: props.storeData[locale.value].name,
  },
  {
    path: `/store-setup/${route.params.id}/integration-settings`,
    imgIcon: "",
    name: t("TITLES.Integration Settings"),
  },
]);

const schema = yup.object().shape({
  integrations: yup
    .array()
    .of(
      yup.object().shape({
        brand_id: yup
          .mixed()
          .test(
            "brand_id",
            t("ERRORS.isRequired", { name: t("LABELS.brand_id") }),
            (values, ctx) => {
              if (ctx.parent.is_active) {
                if (values) {
                  return true;
                }
              } else {
                return true;
              }
            }
          )
          .nullable(),
        vendor_branch_id: yup
          .mixed()
          .test(
            "vendor_branch_id",
            t("ERRORS.isRequired", { name: t("LABELS.vendor_branch_id") }),
            (values, ctx) => {
              if (ctx.parent.is_active) {
                if (values) {
                  return true;
                }
              } else {
                return true;
              }
            }
          )
          .nullable(),
        branch_id: yup
          .mixed()
          .test(
            "branch_id",
            t("ERRORS.isRequired", { name: t("LABELS.branch_id") }),
            (values, ctx) => {
              if (ctx.parent.is_active) {
                if (values) {
                  return true;
                }
              } else {
                return true;
              }
            }
          )
          .nullable(),
      })
    )
    .strict(),
});

const initialValues = reactive({
  integrations: [
    {
      is_active: false,
      brand_id: null,
      vendor_branch_id: null,
      branch_id: null,
      id: null,
    },
  ],
});

function handleSubmit(values) {
  btnLoading.value = true;
  const frmData = new FormData();

  values.integrations.map((values, index) => {
    for (const [key, value] of Object.entries(values)) {
      if (key == "is_active") {
        frmData.append(`integration_setting[${index}][${key}]`, +value);
      } else {
        if (value)
          frmData.append(`integration_setting[${index}][${key}]`, value);
      }
    }
  });

  frmData.append(`store_id`, route.params.id);
  axios
    .post("integration_setting", frmData)
    .then((res) => {
      toast.success(res.data.message);
      btnLoading.value = false;
    })
    .catch((e) => {
      toast.error(e.response.data.message);
    })
    .finally(() => (btnLoading.value = false));
}

function getData() {
  loading.value = true;
  axios
    .get(`store/${route.params.id}/aggregators-integration-setting`)
    .then((res) => {
      initialValues.integrations = res.data.data.map((el) => ({
        is_active: el.is_active,
        brand_id: el.brand_id,
        vendor_branch_id: el.vendor_branch_id,
        branch_id: el.branch_id,
        type: el.type,
        id: el.id,
      }));
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
}

onMounted(() => getData());
</script>
<style lang="scss"></style>
