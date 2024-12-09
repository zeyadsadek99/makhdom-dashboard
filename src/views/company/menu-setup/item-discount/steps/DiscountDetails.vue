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
            initialValues.is_active ? 'LABELS.activated' : 'LABELS.inactivated'
          )
        "
        v-model="initialValues.is_active"
      ></v-switch>
      <base-card1 :title="$t('TITLES.discountDetails')">
        <div class="mb-5 grid md:grid-cols-2 gap-x-4">
          <base-input
            id="nameAr"
            name="nameAr"
            :placeholder="$t('LABELS.Discount Name') + $t('inArabic')"
            :label="$t('LABELS.Discount Name') + $t('inArabic')"
            type="text"
            icon="newDiscount"
          />
          <base-input
            id="nameEn"
            name="nameEn"
            :placeholder="$t('LABELS.Discount Name') + $t('inEnglish')"
            :label="$t('LABELS.Discount Name') + $t('inEnglish')"
            type="text"
            icon="newDiscount"
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
                <p class="text-sub">{{ $t("TITLES.Discount Type") }}</p>
                <label for="value" class="flex gap-2 items-center w-fit mt-3">
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
              icon="currency"
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
              icon="currency"
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
      <base-card1 class="mt-5">
        <div class="flex items-center justify-between font-bold">
          <p>{{ $t("LABELS.Include surcharge") }}</p>
          <div>
            <v-switch
              color="success"
              :model-value:any="true"
              class="capitalize"
              v-model="initialValues.have_surcharge"
            ></v-switch>
          </div>
        </div>
      </base-card1>
      <div class="flex items-center justify-end gap-7 mt-5">
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

const initialValues = reactive({
  is_active: true,
  have_surcharge: false,
  type: "",
});

const schema = yup.object().shape({
  nameAr: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Discount Name") + t("inArabic"),
    })
  ),
  nameEn: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Discount Name") + t("inEnglish"),
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
  // availabilities: yup
  //   .array()
  //   .test(
  //     "availabilities",
  //     t("ERRORS.isRequired", { name: t("LABELS.Availability") }),
  //     (values) => {
  //       if (values && values.length) {
  //         return true;
  //       }
  //     }
  //   ),
});
const emit = defineEmits(["returned-data"]);

const isLoading = ref(false);
function handleSubmit(values) {
  values.is_active = initialValues.is_active;
  values.have_surcharge = initialValues.have_surcharge;
  values.nameAr = nameAr.value;
  values.nameEn = nameEn.value;
  values.type = initialValues.type;
  // values.orderTypesAggregators = aggregators.value;
  emit("returned-data", values);
}

function setData() {
  for (const [key, value] of Object.entries(props.data)) {
    initialValues[key] = value;
  }
}

onBeforeMount(() => {
  if (props.data) {
    setData();
  }
});
</script>
