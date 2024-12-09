<template>
  <VeeForm as="div" :validation-schema="schema" @submit="handleSubmit">
    <!-- :initial-values="initialValues" -->
    <form class="mt-4">
      <base-card1 :title="$t('LABELS.Schedule Discount')" class="p-7 mb-5">
        <div class="grid lg:grid-cols-2 gap-3">
          <BaseDate
            id="fromDate"
            name="from"
            :min-date="new Date()"
            :time-picker="false"
            icon="calendar"
            :label="`${$t('LABELS.Start at')}:`"
            :placeholder="`${$t('LABELS.fromDate')}`"
            v-model:itemValue="fromDate"
          />
          <BaseDate
            id="fromTime"
            name="fromTime"
            :time-picker="true"
            icon="hour"
            :is24="false"
            :label="`${$t('LABELS.fromTime')}:`"
            :placeholder="`${$t('LABELS.fromTime')}`"
            v-model:itemValue="fromTime"
          />
        </div>
        <div class="grid lg:grid-cols-2 gap-3">
          <BaseDate
            id="toDate"
            name="to"
            :time-picker="false"
            :min-date="fromDate || new Date()"
            icon="calendar"
            :label="`${$t('LABELS.End at')}:`"
            :placeholder="`${$t('LABELS.toDate')}`"
            v-model:itemValue="toDate"
          />

          <BaseDate
            id="toTime"
            name="toTime"
            :time-picker="true"
            :min-date="fromDate"
            icon="hour"
            :is24="false"
            :label="`${$t('LABELS.toTime')}:`"
            :placeholder="`${$t('LABELS.toTime')}`"
            v-model:itemValue="toTime"
          />
        </div>
      </base-card1>
      <div class="flex items-center justify-end gap-7 mt-5">
        <router-link
          to="/menu-setup/order-discounts"
          class="capitalize font-semibold text-sub"
        >
          {{ $t("BUTTONS.cancel") }}
        </router-link>

        <button type="submit" class="base-btn rounded-md" :disabled="isLoading">
          {{ $t("BUTTONS.save") }}
        </button>
      </div>
    </form>
  </VeeForm>
</template>

<script setup>
import { onBeforeMount, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import * as yup from "yup";
import axios from "axios";

const props = defineProps({
  data: {
    required: false,
    type: Object,
  },
});

const { t } = useI18n();

const schema = yup.object().shape({
  from: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.Start at") })),
  to: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.End at") })),
  fromTime: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.Start at") })),

  toTime: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.toTime") })),
});

const emit = defineEmits(["returned-data"]);
const toDate = ref(null);
const fromDate = ref(null);
const fromTime = ref(null);
const toTime = ref(null);
const isLoading = ref(false);
function handleSubmit(values) {
  emit("returned-data", values);
}

function setData() {
  toDate.value = props.data.to;
  fromDate.value = props.data.from;
  fromTime.value = props.data.fromTime;
  toTime.value = props.data.toTime;
}

onBeforeMount(() => {
  if (props.data) {
    setData();
  }
});
</script>
