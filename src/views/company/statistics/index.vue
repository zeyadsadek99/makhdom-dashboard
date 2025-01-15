<template>
  <div>
    <breadcrumbs back="/statistics" :title="$t('LABELS.statistics')" :items="breads" />

    <div class="flex gap-4 flex-wrap mt-6">
      <div class="flex-1 w-full min-w-[250px]">
        <FormSkelton v-if="loading" />
        
        <template v-else>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div v-for="(value, key) in initialValues" :key="key" class="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <div class="font-semibold text-gray-600">{{ formatLabel(key) }}:</div>
              <div class="text-lg font-bold text-blue-600">{{ value }}</div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>


<script setup>
import { reactive, ref, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";
import { toast } from "vue3-toastify";

const { t } = useI18n();

const initialValues = reactive({
  client: '',
  order: '',
  order_cancelled: '',
  order_cancelled_by_client: '',
  order_cancelled_by_vendor: '',
  refund_order: '',
  vendor: ''
});

const loading = ref(true);
const breads = [
  {
    path: "/",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.home"),
  },
  {
    name: t("LABELS.statistics"),
    path: "/statistics",
    imgIcon: "",
  },
];

function getData() {
  axios.get(`statistics`).then((res) => {
    const result = res.data.data;
    console.log(result);

    initialValues.client = result.client;
    initialValues.order = result.order;
    initialValues.order_cancelled = result.order_cancelled;
    initialValues.order_cancelled_by_client = result.order_cancelled_by_client;
    initialValues.order_cancelled_by_vendor = result.order_cancelled_by_vendor;
    initialValues.refund_order = result.refund_order;
    initialValues.vendor = result.vendor;

    loading.value = false;
  }).catch((error) => {
    toast.error(t("STATUS.failedToLoadData"));
    loading.value = false;
  });
}

onBeforeMount(() => {
  getData();
});

const formatLabel = (key) => {
  return t(`LABELS.${key}`); 
};
</script>


<style scoped>
</style>
