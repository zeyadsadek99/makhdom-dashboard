<template>
  <VeeForm
    as="div"
    :validation-schema="schema"
    @submit="handleSubmit"
    :initial-values="initialValues"
    class="w-full"
  >
    <form class="mt-7">
      <base-card1 :title="$t('TITLES.General Details')" class="p-7 mb-5">
        <v-switch
          color="success"
          :model-value:any="true"
          class="capitalize"
          :label="
            $t(
              initialValues.is_active
                ? 'LABELS.activated'
                : 'LABELS.inactivated'
            )
          "
          v-model="initialValues.is_active"
        ></v-switch>
        <div class="mb-5 grid md:grid-cols-2 gap-x-4">
          <base-input
            id="nameAr"
            name="nameAr"
            :placeholder="$t('LABELS.Surcharge Name') + $t('inArabic')"
            :label="$t('LABELS.Surcharge Name') + $t('inArabic')"
            type="text"
            icon="surcharge"
          />
          <base-input
            id="nameEn"
            name="nameEn"
            :placeholder="$t('LABELS.Surcharge Name') + $t('inEnglish')"
            :label="$t('LABELS.Surcharge Name') + $t('inEnglish')"
            type="text"
            icon="surcharge"
          />

          <div class="space-y-3 md:col-span-2 mt-3">
            <VeeField
              name="type"
              type="radio"
              v-slot="{ field, meta }"
              value="value"
            >
              <div
                class="w-fit"
                :class="{
                  error: !meta.valid && meta.touched,
                }"
              >
                <label for="value" class="flex gap-2 items-center w-fit">
                  <input
                    name="type"
                    id="value"
                    v-bind="field"
                    type="radio"
                    value="value"
                    v-model="initialValues.type"
                    class="w-5 h-5"
                  />

                  {{ $t("LABELS.value") }}
                </label>
              </div>
            </VeeField>

            <base-input
              v-if="initialValues.type == 'value'"
              id="value"
              name="value"
              :placeholder="$t('LABELS.value')"
              type="number"
              icon="percentage1"
              :prepend="true"
            >
              <template v-slot:prepend>
                <span class="text-primary font-medium">$</span>
              </template>
            </base-input>

            <VeeField
              name="type"
              type="radio"
              v-slot="{ field, meta }"
              value="percentage"
            >
              <div
                :class="{
                  error: !meta.valid && meta.touched,
                }"
              >
                <label for="percentage1" class="flex gap-2 items-center">
                  <input
                    name="type"
                    id="percentage1"
                    v-bind="field"
                    type="radio"
                    value="percentage"
                    class="w-5 h-5"
                    v-model="initialValues.type"
                  />

                  {{ $t("LABELS.percentage") }}
                </label>
              </div>
            </VeeField>

            <base-input
              v-if="initialValues.type == 'percentage'"
              id="percentage"
              name="percentage"
              :placeholder="$t('LABELS.Percentage')"
              type="number"
              icon="percentage1"
              :prepend="true"
            >
              <template v-slot:prepend>
                <span class="text-primary font-medium">%</span>
              </template>
            </base-input>
          </div>

          <VeeErrorMessage name="type" as="div" class="text-error mt-2" />
        </div>
      </base-card1>
      <base-card1 :title="$t('LABELS.Availability')" class="p-7 mb-5">
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
          modal-name="surcharge_availability"
          id="availabilities"
          v-model:itemValue="selectedAvailability"
        />
      </base-card1>

      <base-card1 :title="$t('TITLES.Order Types')" class="p-7 mb-5">
        <loader v-if="orderTypesLoader" />
        <div class="orderTypes" v-else>
          <h3 class="text-sub">{{ $t("TITLES.Available At") }}</h3>
          <v-checkbox
            v-for="item in orderTypes"
            :key="item.id"
            :model-value:any="true"
            :label="$t(item.name)"
            v-model="item.status"
          />
        </div>
      </base-card1>

      <base-card1
        :title="$t('TITLES.Order Types Aggregators')"
        class="p-7 mb-5"
      >
        <loader v-if="aggregatorsLoader" />
        <div class="orderTypes" v-else>
          <h3 class="text-sub">{{ $t("TITLES.Available At") }}</h3>
          <v-checkbox
            v-for="item in aggregators"
            :key="item.id"
            :model-value:any="true"
            :label="$t(item.name)"
            v-model="item.status"
          />
        </div>
      </base-card1>

      <div class="flex items-center justify-end gap-7">
        <router-link
          to="/menu-setup/surchargers"
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

import { ref, onBeforeMount, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import * as yup from "yup";

const route = useRoute();
const props = defineProps({
  data: {
    required: false,
    type: Object,
  },
});
const { t } = useI18n();
const initialValues = reactive({
  availabilities: [],
  is_active: true,
  type: "",
});

const schema = yup.object().shape({
  nameAr: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Surcharge Name") + t("inArabic"),
    })
  ),
  nameEn: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Surcharge Name") + t("inEnglish"),
    })
  ),
  type: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.type") })),

  value: yup
    .string()
    .test(
      "isRequired?",
      t("ERRORS.isRequired", { name: t("LABELS.value") }),
      (value) => {
        if (initialValues.type == "value") {
          if (value) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      }
    )
    .test(
      "Is positive?",
      t("ERRORS.moreThan0", { name: t("LABELS.value") }),
      (value) => {
        if (initialValues.type == "value") {
          return value > 0;
        } else {
          return true;
        }
      }
    )
    .nullable(),
  percentage: yup
    .string()

    .test(
      "isRequired?",
      t("ERRORS.isRequired", { name: t("LABELS.percentage") }),
      (value) => {
        if (initialValues.type == "percentage") {
          if (value) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      }
    )
    .test(
      "Is positive?",
      t("ERRORS.between 0 and 100", { name: t("LABELS.percentage") }),
      (value) => {
        if (initialValues.type == "percentage") {
          return value >= 0 && value <= 100;
        } else {
          return true;
        }
      }
    ),
  availabilities: yup
    .array()
    .test(
      "availabilities",
      t("ERRORS.isRequired", { name: t("LABELS.Availability") }),
      (values) => {
        if (values && values.length) {
          return true;
        }
      }
    ),
});

const selectedAvailability = ref([]);

const emit = defineEmits(["returned-data"]);

const isLoading = ref(false);
function handleSubmit(values) {
  values.is_active = initialValues.is_active;
  values.orderTypes = orderTypes.value;
  values.orderTypesAggregators = aggregators.value;
  emit("returned-data", values);
}

const orderTypesLoader = ref(false);
const orderTypes = ref([]);
const availabilitiesLoader = ref(false);
const aggregatorsLoader = ref(false);
const availabilities = ref([]);
const aggregators = ref([]);

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
function getOrderTypes() {
  orderTypesLoader.value = true;
  axios
    .get(`order_types`, {
      params: {
        id: route.params.id || "",
        type: "surcharges",
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

      orderTypes.value = vis;

      orderTypesLoader.value = false;
    })
    .catch(() => (orderTypesLoader.value = false));
}
function getOrderTypesAggregators() {
  aggregatorsLoader.value = true;
  axios
    .get(`order_type_aggregators`, {
      params: {
        id: route.params.id || "",
        type: "surcharges",
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
function setData() {
  for (const [key, value] of Object.entries(props.data)) {
    if (key != "availabilities") {
      initialValues[key] = value;
    }
    // console.log(key);
  }
}
onBeforeMount(async () => {
  getAvailabilities();
  getOrderTypesAggregators();
  getOrderTypes();
  if (props.data) {
    setData();
  }
});
</script>

<style lang="scss">
.orderTypes {
  label {
    color: var(--titles_color);
  }
}
</style>
