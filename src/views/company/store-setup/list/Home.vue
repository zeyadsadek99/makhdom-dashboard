<template>
  <div>
    <Loader v-if="loading" />
    <router-view v-else :store-data="pageData" />
  </div>
</template>

<script setup>
import axios from "axios";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { onMounted, ref, watch } from "vue";
import { toast } from "vue3-toastify";

const { t } = useI18n();
const route = useRoute();
const pageData = ref(null);
const loading = ref(true);
function getData() {
  loading.value = true;
  axios
    .get(`store/${route.params.id}`)
    .then((res) => {
      pageData.value = res.data.data;

      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
      toast.error(err.response.data.message);
    });
}
watch(
  () => route.path,
  () => getData()
);
onMounted(() => getData());
</script>

<style></style>
