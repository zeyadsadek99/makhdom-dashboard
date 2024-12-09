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
            @change="handleSelectedProduct($event, `category${category.id}`)"
            icon="category"
            secondUrl="products?category_id="
            v-model:itemValue="selectedProducts"
          />
        </template>
      </base-card1>
      <!-- food items::End -->
      <div class="flex items-center justify-end gap-7">
        <router-link
          :to="`/store-setup/${route.params.id}/kot-kitchens`"
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
import { useRoute } from "vue-router";
import * as yup from "yup";
const props = defineProps({
  data: {
    required: false,
    type: Object,
  },
});
const route = useRoute();
const { t } = useI18n();

const selectedProduct = ref([]);
const selectedProducts = ref([]);

const schema = yup.object().shape({});

const emit = defineEmits(["returned-data"]);

const isLoading = ref(false);
function handleSubmit(values) {
  values.products = selectedProduct.value;
  emit("returned-data", values);
}

function setData() {
  selectedProducts.value = props.data.map((el) => el.id);
}

const categoriesLoader = ref(true);
const categories = ref([]);
const allProducts = reactive({});
function handleSelectedProduct(e, name) {
  allProducts[name] = e;
  selectedProduct.value = [];
  let newVals = [];
  for (const item of Object.values(allProducts)) {
    newVals.push(...item);
  }

  selectedProduct.value = newVals;
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
