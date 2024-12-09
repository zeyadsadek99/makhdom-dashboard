<template>
  <VeeForm as="div" @submit="handleSubmit" :validation-schema="schema">
    <form class="mt-7">
      <!-- food items::Start -->
      <base-card1 :title="$t('TITLES.Food Items')" class="p-7 mb-5 space-y-4">
        <loader v-if="categoriesLoader" />
        <template v-else>
          <base-checkbox
            v-for="category in categories"
            :key="category.id"
            :item="category"
            id="category"
            @change="handleSelectedProduct"
            @reset="handleSelectedProduct($event, 'reset')"
            icon="category"
            secondUrl="products?category_id="
            v-model:itemValue="selectedProduct"
          />
        </template>
      </base-card1>
      <!-- food items::End -->
      <div class="flex items-center justify-end gap-7">
        <router-link
          to="/menu-setup/item-discount"
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
import axios from "axios";
import { ref, reactive, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";
import * as yup from "yup";
const props = defineProps({
  data: {
    required: false,
    type: Object,
  },
});
const { t } = useI18n();

const selectedProduct = ref([]);
const schema = yup.object().shape({
  // selectedProduct: yup
  //   .array()
  //   .test(
  //     "selectedProduct",
  //     t("ERRORS.isRequired", { name: t("LABELS.products") }),
  //     (values) => {
  //       console.log("values");
  //       console.log(values);
  //       if (values && values.length) {
  //         return true;
  //       }
  //     }
  //   ),
});

const emit = defineEmits(["returned-data"]);

const isLoading = ref(false);
function handleSubmit(values) {
  values.products = selectedProduct.value;
  emit("returned-data", values);
}

function setData() {
  selectedProduct.value = props.data.products;

  // for (const [key, value] of Object.entries(props.data)) {
  //   initialValues[key] = value;
  // }
}

const categoriesLoader = ref(true);
const categories = ref([]);

function handleSelectedProduct(e, reset) {
  selectedProduct.value = selectedProduct.value.filter((el) => !e.includes(el));
  if (!reset) {
    selectedProduct.value.push(...e);
  }
}

function getCategories() {
  categoriesLoader.value = true;
  axios
    .get(`all_category`)
    .then((res) => {
      categories.value = res.data.data;
      categoriesLoader.value = false;
    })
    .catch(() => (categoriesLoader.value = false));
}

onBeforeMount(() => {
  getCategories();

  if (props.data) {
    setData();
  }
});
</script>
