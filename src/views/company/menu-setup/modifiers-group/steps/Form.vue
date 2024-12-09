<template>
  <VeeForm
    as="div"
    :validation-schema="schema"
    @submit="handleSubmit"
    :initial-values="initialValues"
  >
    <form class="mt-4">
      <v-switch
        color="success"
        :model-value:any="true"
        class="capitalize"
        :label="
          $t(
            initialValues.is_active ? 'STATUS.Available' : 'STATUS.Unavailable'
          )
        "
        v-model="initialValues.is_active"
      ></v-switch>
      <base-card1 :title="$t('TITLES.General Details')">
        <div class="mb-5 grid md:grid-cols-2 gap-x-4">
          <base-input
            id="nameAr"
            name="nameAr"
            :placeholder="
              $t('LABELS.Enter Modifier Group Title') + $t('inArabic')
            "
            :label="$t('LABELS.Modifier Group Title') + $t('inArabic')"
            type="text"
            icon="modifiers-group"
          />
          <base-input
            id="nameEn"
            name="nameEn"
            :placeholder="
              $t('LABELS.Enter Modifier Group Title') + $t('inEnglish')
            "
            :label="$t('LABELS.Modifier Group Title') + $t('inEnglish')"
            type="text"
            icon="modifiers-group"
          />
        </div>

        <div class="space-y-5 mb-5">
          <base-input
            id="descAr"
            name="descAr"
            :placeholder="$t('LABELS.write') + $t('inArabic')"
            :label="$t('LABELS.description') + $t('inArabic')"
            type="textarea"
          />
          <base-input
            id="descEn"
            name="descEn"
            :placeholder="$t('LABELS.write') + $t('inEnglish')"
            :label="$t('LABELS.description') + $t('inEnglish')"
            type="textarea"
          />
        </div>
      </base-card1>

      <!-- Availabilities::Start -->
      <base-card1 :title="$t('LABELS.Availability')" class="p-7 my-5">
        <AvailabilitySelect
          :label="
            $t('LABELS.store') +
            '/' +
            $t('LABELS.city') +
            '/' +
            $t('LABELS.country')
          "
          name="availabilities"
          icon="country"
          :options="availabilities"
          :loading="availabilitiesLoader"
          modal-name="modifier_availability"
          id="availabilities"
          v-model:itemValue="selectedAvailability"
        />
      </base-card1>

      <base-card1 :title="$t('TITLES.visibility')" class="p-7 mb-5">
        <loader v-if="visibilitiesLoader" />
        <div class="visibilities" v-else>
          <v-switch
            v-for="item in visibilities"
            :key="item.id"
            color="success"
            class="capitalize last-of-type:mb-0 text-text"
            :model-value:any="true"
            :label="$t(item.name)"
            v-model="item.status"
          ></v-switch>
          <!-- v-model="item" -->
        </div>
      </base-card1>
      <base-card1 :title="$t('TITLES.aggregatorsVisibility')" class="p-7 mb-5">
        <loader v-if="aggregatorsLoader" />
        <div class="visibilities" v-else>
          <v-switch
            v-for="item in aggregators"
            :key="item.id"
            color="success"
            class="capitalize last-of-type:mb-0 text-text"
            :model-value:any="true"
            :label="$t(item.name)"
            v-model="item.status"
          ></v-switch>
        </div>
      </base-card1>
      <!-- Availabilities::End -->

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
          to="/menu-setup/modifiers-group"
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
import { useRoute } from "vue-router";

const route = useRoute();
const props = defineProps({
  data: {
    required: false,
    type: Object,
  },
});

const selectedProduct = ref([]);

const { t } = useI18n();

const initialValues = reactive({
  nameAr: "",
  nameEn: "",
  descAr: "",
  descEn: "",
  products: [],
  is_active: true,
  availabilities: [],
});

const schema = yup.object().shape({
  nameAr: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Modifier Group Title") + t("inArabic"),
    })
  ),
  nameEn: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Modifier Group Title") + t("inEnglish"),
    })
  ),
  descAr: yup.string(),

  // .required(
  //   t("ERRORS.isRequired", { name: t("LABELS.description") + t("inArabic") })
  // ),
  descEn: yup.string(),
  //   .required(
  //   t("ERRORS.isRequired", {
  //     name: t("LABELS.description") + t("inEnglish"),
  //   })
  // ),
  availabilities: yup
    .array()
    .required(t("ERRORS.isRequired", { name: t("LABELS.Availability") }))
    .min(1, t("ERRORS.isRequired", { name: t("LABELS.Availability") })),
});

const emit = defineEmits(["returned-data"]);
const availabilitiesLoader = ref(false);
const visibilitiesLoader = ref(false);
const aggregatorsLoader = ref(false);
const selectedAvailability = ref([]);
const availabilities = ref([]);
const visibilities = ref([]);
const aggregators = ref([]);

const isLoading = ref(false);
function handleSubmit(values) {
  values.is_active = initialValues.is_active;
  values.visibility = visibilities.value;
  values.aggregators_visibility = aggregators.value;
  values.products = selectedProduct.value;

  emit("returned-data", values);
}

function setData() {
  selectedProduct.value = props.data.products;

  for (const [key, value] of Object.entries(props.data)) {
    initialValues[key] = value;
  }
}

function getAvailabilities() {
  availabilitiesLoader.value = true;
  axios
    .get(`availabilities`)
    .then((res) => {
      if (props.data) {
        selectedAvailability.value = props.data.availabilities;

        availabilities.value = res.data.data;
      } else {
        availabilities.value = res.data.data;
      }
      availabilitiesLoader.value = false;
    })
    .catch(() => (availabilitiesLoader.value = false));
}
function getVisibility() {
  visibilitiesLoader.value = true;
  axios
    .get(`visibility`, {
      params: {
        id: route.params.id || "",
        type: "modifiers",
      },
    })
    .then((res) => {
      let vis = [];

      for (const [name, status] of Object.entries(res.data.data)) {
        vis.push({
          name,
          status,
        });
      }
      visibilities.value = vis;

      visibilitiesLoader.value = false;
    })
    .catch(() => (visibilitiesLoader.value = false));
}
function getAggregators() {
  aggregatorsLoader.value = true;
  axios
    .get(`aggregators_visibility`, {
      params: {
        id: route.params.id || "",
        type: "modifiers",
      },
    })
    .then((res) => {
      let agg = [];
      for (const [name, status] of Object.entries(res.data.data)) {
        agg.push({
          name,
          status,
        });
      }
      aggregators.value = agg;
      aggregatorsLoader.value = false;
    })
    .catch(() => (aggregatorsLoader.value = false));
}

function handleSelectedProduct(e, reset) {
  selectedProduct.value = selectedProduct.value.filter((el) => !e.includes(el));
  if (!reset) {
    selectedProduct.value.push(...e);
  }
}

const categoriesLoader = ref(true);
const categories = ref([]);

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

onBeforeMount(async () => {
  getAvailabilities();
  getVisibility();
  getCategories();
  getAggregators();
  if (props.data) {
    setData();
  }
});
</script>

<style lang="scss">
.visibilities {
  .v-switch .v-selection-control {
    @apply flex-row-reverse justify-between font-medium;
    label {
      @apply opacity-100  text-lg;
      color: var(--titles_color) !important;
    }
  }
}
</style>
