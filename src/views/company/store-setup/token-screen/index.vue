<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="$t('TITLES.Token Screen')"
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
      <base-card1 class="mb-7 p-5 !rounded-2xl">
        <h2 class="font-semibold text-lg mb-5">
          {{ $t("LABELS.Token Manager") }}
        </h2>
        <base-card
          class="flex flex-wrap justify-between items-center !py-1 !rounded-2xl mb-5"
        >
          <VeeField type="checkbox" name="is_active" v-slot="{ field }">
            <label for="is_active" class="font-semibold text-[16px]">
              {{ $t("LABELS.Token screen status") }}
            </label>
            <div>
              <v-switch
                v-bind="field"
                id="is_active"
                color="success"
                :model-value:any="true"
                v-model="is_active"
                class="capitalize"
              ></v-switch>
            </div>
          </VeeField>
        </base-card>
        <div class="grid sm:grid-cols-2 items-center gap-5">
          <base-input
            type="number"
            id="token_number"
            name="token_number"
            :time-picker="true"
            icon="hour"
            :is24="true"
            :label="`${$t('LABELS.token starting number')}:`"
            :labelClass="is_active ? 'text-primary' : 'text-placeholder'"
            :placeholder="`${$t('LABELS.Enter', {
              name: $t('LABELS.number'),
            })}`"
            v-model:itemValue="initialValues.token_number"
            :disabled="is_active == false"
          />
          <div>
            <label
              for="reset_starting_number_daily"
              class="!flex gap-1 items-center !font-medium !text-base text-text"
              :class="is_active ? 'text-black' : 'text-placeholder'"
            >
              <input
                class="!w-5 h-5"
                id="reset_starting_number_daily"
                type="checkbox"
                v-model="initialValues.reset_starting_number_daily"
                :disabled="is_active == false"
              />
              {{ $t("LABELS.Reset Starting Number Daily") }}
            </label>
          </div>
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
      </base-card1>
    </VeeForm>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import * as yup from "yup";
import { toast } from "vue3-toastify";
import { useRoute } from "vue-router";
const { t, locale } = useI18n();
const route = useRoute();
const btnLoading = ref(false);
const breads = ref([]);
const props = defineProps({
  storeData: {
    required: false,
  },
});

const schema = yup.object().shape({
  is_active: yup.boolean(),
  token_number: yup
    .mixed()
    .test(
      "token_number",
      t("ERRORS.isRequired", { name: t("LABELS.token starting number") }),
      (values) => {
        if (is_active.value) {
          if (values) {
            return true;
          }
        } else {
          return true;
        }
      }
    )

    .test(
      "Is positive?",
      t("ERRORS.moreThan0", { name: t("LABELS.token starting number") }),
      (value, ctx) => {
        if (is_active.value) {
          return value >= 0;
        } else {
          return true;
        }
      }
    ).nullable(),
});

const loading = ref(true);
const initialValues = reactive({
  token_number: "",
  reset_starting_number_daily: false,
});

function handleSubmit(values) {
  
  btnLoading.value = true;
  const frmData = new FormData();
  if(values.token_number) frmData.append(`token_number`, values.token_number);
  frmData.append(`store_id`, route.params.id);
  frmData.append("is_active", +is_active.value);
  frmData.append(
    "reset_start_num_daily",
    +initialValues.reset_starting_number_daily
  );
  axios
    .post("token_screen", frmData)
    .then((res) => {
      setData(res.data.data);
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
    .get(`token_screen`, { params: { store_id: route.params.id } })
    .then((res) => {
      const result = res.data.data;
      if (result) {
        setData(result);
      } else {
        loading.value = false;
      }
    })
    .catch(() => {
      loading.value = false;
    });
}

const is_active = ref(false);
function setData(result) {
  is_active.value = result.is_active;
  initialValues.id = result.id;
  initialValues.reset_starting_number_daily = result.reset_start_num_daily;
  initialValues.token_number = result.token_number;
  loading.value = false;
}

watch(
  () => props.storeData,
  (value) => {
    breads.value = [
      {
        path: "/store-setup",
        imgIcon: "storeSetup.svg",
        name: t("sidebar.storeSetup"),
      },
      {
        path: `/store-setup/${value ? value.id : ""}`,
        imgIcon: "",
        name: value ? value[locale.value].name : "",
      },
      {
        path: `/store-setup/${route.params.id}/token-screen`,
        imgIcon: "",
        name: t("TITLES.Token Screen"),
      },
    ];
  },
  {
    immediate: true,
  }
);

onMounted(() => getData());
</script>
<style lang="scss"></style>
