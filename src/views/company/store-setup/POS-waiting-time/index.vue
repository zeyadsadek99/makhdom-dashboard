<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="$t('TITLES.POS Waiting time')"
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
      <base-card1 class="md:w-[80%] m-auto mb-7 p-5 !rounded-2xl">
        <h2 class="font-semibold text-lg mb-5">
          {{ $t("LABELS.Waiting time for POS order") }}
        </h2>

        <base-input
          id="waiting_time"
          name="waiting_time"
          :time-picker="true"
          icon="hour"
          :is24="true"
          :label="`${$t('LABELS.Waiting time')}:`"
          :placeholder="`${$t('LABELS.Waiting time')}`"
          v-model:itemValue="initialValues.waiting_time"
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
            :disabled="isLoading"
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
  waiting_time: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .required(t("ERRORS.isRequired", { name: t("LABELS.Waiting time") }))
    .integer(t("ERRORS.mustBeInteger", { name: t("LABELS.Waiting time") })),
});

const loading = ref(true);
const isLoading = ref(false);

const initialValues = reactive({
  waiting_time: "",
});

function handleSubmit(values) {
  btnLoading.value = true;
  const frmData = new FormData();
  frmData.append(`pos_waiting_time`, values.waiting_time);
  frmData.append(`store_id`, route.params.id);

  axios
    .post("pos_waiting_time", frmData)
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
    .get(`pos_waiting_time/${route.params.id}`)
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
  initialValues.waiting_time = result.pos_waiting_time;
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
        path: `/store-setup/${route.params.id}/POS-waiting-time`,
        imgIcon: "",
        name: t("TITLES.POS Waiting time"),
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
