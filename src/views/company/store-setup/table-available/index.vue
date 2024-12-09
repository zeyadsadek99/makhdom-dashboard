<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="$t('TITLES.Table available')"
      :back="`/store-setup/${$route.params.id}`"
      class="mb-7"
    />

    <loader v-if="loading" />

    <VeeForm
      v-else
      :validation-schema="schema"
      @submit="handleSubmit"
      :initial-values="initialValues"
      class="md:max-w-[80%] w-full mx-auto"
    >
      <base-card1 class="mb-7 !rounded-2xl">
        <div class="flex flex-wrap gap-5">
          <div>
            <img src="@/assets/images/clock.png" alt="clock" />
          </div>
          <div class="flex flex-col justify-center gap-2">
            <h2 class="text-2xl font-bold">{{ $t("LABELS.time_remain") }}</h2>
            <p>
              {{
                $t(
                  "LABELS.Time of table be available at after waiter change status of table is empty"
                )
              }}.
            </p>
          </div>
        </div>
      </base-card1>
      <base-card1 class="mb-7 p-5 !rounded-2xl">
        <!-- <BaseDate
          id="time_remain"
          name="time_remain"
          :time-picker="true"
          icon="hour"
          :is24="true"
          :label="`${$t('LABELS.time_remain')}:`"
          :placeholder="`${$t('LABELS.select')}`"
          v-model:itemValue="initialValues.time_remain"
        /> -->
        <base-input
          type="number"
          id="time_remain"
          name="time_remain"
          :time-picker="true"
          icon="hour"
          :is24="true"
          :label="`${$t('LABELS.time_remain')}:`"
          :placeholder="`${$t('LABELS.time_remain')}`"
          v-model:itemValue="initialValues.time_remain"
          :prepend="true"
        >
          <template v-slot:prepend>
            <p class="flex items-center gap-1 text-primary font-bold">
              {{ $t("LABELS.minutes") }}
            </p>
          </template>
        </base-input>
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
  time_remain: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .required(t("ERRORS.isRequired", { name: t("LABELS.time_remain") }))
    .integer(t("ERRORS.mustBeInteger", { name: t("LABELS.time_remain") }))
    .test(
      "Is positive?",
      t("ERRORS.moreThan0", { name: t("LABELS.time_remain") }),
      (value) => value > 0
    ),
});


const loading = ref(true);

const initialValues = reactive({
  time_remain: "",
});

function handleSubmit(values) {
  btnLoading.value = true;
  const frmData = new FormData();
  frmData.append(`time_available`, values.time_remain);
  frmData.append(`store_id`, route.params.id);

  axios
    .post("table_available", frmData)
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
    .get(`table_available/${route.params.id}`)
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

function setData(result) {
  initialValues.time_remain = result.time_available;
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
        path: `/store-setup/${route.params.id}/table-available`,
        imgIcon: "",
        name: t("TITLES.Table available"),
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
