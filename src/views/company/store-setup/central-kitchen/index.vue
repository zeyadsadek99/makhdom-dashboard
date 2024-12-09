<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="$t('TITLES.Central Kitchen')"
      :back="`/store-setup/${$route.params.id}`"
      class="mb-7"
    />
    <loader v-if="loading" />
    <VeeForm
      v-else
      @submit="handleSubmit"
      :initial-values="initialValues"
      class="md:max-w-[85%] w-full mx-auto"
    >
      <base-card1 class="md:w-[80%] m-auto mb-7 p-5 !rounded-2xl">
        <h2 class="font-bold text-xl mb-5">
          {{ $t("LABELS.Central Kitchen Settings") }}
        </h2>
        <div class="space-y-4">
          <base-card
            class="flex flex-wrap justify-between items-center !py-1 !rounded-2xl"
          >
            <label
              for="store_as_central_kitchen"
              class="font-semibold text-[16px]"
            >
              {{ $t("LABELS.Store as central kitchen") }}
            </label>
            <div>
              <v-switch
                id="store_as_central_kitchen"
                color="success"
                :model-value:any="true"
                class="capitalize"
                v-model="initialValues.store_as_central_kitchen"
              ></v-switch>
            </div>
          </base-card>
          <div
            class="bg-[#fff9ea] rounded-xl p-3 flex gap-1 font-medium text-[16px] w-fit"
          >
            <svg-icon name="warning" />
            {{
              $t(
                "LABELS.If enabled items of inventory will treated as Collected good"
              )
            }}
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
import { onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue3-toastify";
import { useRoute } from "vue-router";
const { t, locale } = useI18n();
const route = useRoute();
const btnLoading = ref(false);
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
    path: `/store-setup/${route.params.id}/central-kitchen`,
    imgIcon: "",
    name: t("TITLES.Central Kitchen"),
  },
]);

const loading = ref(true);
const isLoading = ref(false);

const initialValues = reactive({
  store_as_central_kitchen: false,
});

function handleSubmit() {
  btnLoading.value = true;
  const frmData = new FormData();
  frmData.append(
    "store_as_central_kitchen",
    +initialValues.store_as_central_kitchen
  );
  frmData.append(`store_id`, route.params.id);

  axios
    .post("central_kitchen", frmData)
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
    .get(`central_kitchen/${route.params.id}`)
    .then((res) => {
      const result = res.data.data;
      if (result) {
        setData(result);
      } else {
        loading.value = false;
      }
    })
    .catch(() => (loading.value = false));
}

function setData(result) {
  initialValues.store_as_central_kitchen = result.store_as_central_kitchen;
  // setTimeout(() => (loading.value = false), 300);
  loading.value = false;
}

onMounted(() => getData());
</script>
<style lang="scss"></style>
