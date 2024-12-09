<template>
  <div>
    <loader v-if="loading" />
    <VeeForm
      v-else
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
              initialValues.is_active
                ? 'LABELS.activated'
                : 'LABELS.inactivated'
            )
          "
          v-model="initialValues.is_active"
        ></v-switch>

        <base-card1 :title="$t('TITLES.discountDetails')">
          <div class="md:col-span-2 my-3">
            <p class="text-sub mb-2">{{ $t("LABELS.usedBy") }} :</p>
            <div class="flex flex-wrap gap-4 mb-1">
              <VeeField
                name="usedBy"
                type="radio"
                v-slot="{ field, meta }"
                value="employee"
              >
                <div
                  class="w-fit"
                  :class="{
                    error: !meta.valid && meta.touched,
                  }"
                >
                  <label
                    for="employee"
                    class="flex gap-2 items-center w-fit font-bold"
                  >
                    <input
                      name="usedBy"
                      id="employee"
                      v-bind="field"
                      type="radio"
                      value="employee"
                      v-model="initialValues.usedBy"
                      class="w-5 h-5"
                    />

                    {{ $t("LABELS.employee") }}
                  </label>
                </div>
              </VeeField>

              <VeeField
                name="usedBy"
                type="radio"
                v-slot="{ field, meta }"
                value="client"
              >
                <div
                  :class="{
                    error: !meta.valid && meta.touched,
                  }"
                >
                  <label for="client" class="flex gap-2 items-center font-bold">
                    <input
                      name="usedBy"
                      id="client"
                      v-bind="field"
                      type="radio"
                      value="client"
                      class="w-5 h-5"
                      v-model="initialValues.usedBy"
                    />

                    {{ $t("LABELS.client") }}
                  </label>
                </div>
              </VeeField>
            </div>
            <VeeErrorMessage name="usedBy" as="div" class="text-error mb-2" />
          </div>
          <div class="mb-5 grid md:grid-cols-2 gap-x-4">
            <base-input
              id="nameAr"
              name="nameAr"
              :placeholder="
                $t('LABELS.Enter', {
                  name: $t('LABELS.orderDiscount') + $t('inArabic'),
                })
              "
              :label="$t('LABELS.orderDiscountName') + $t('inArabic')"
              type="text"
              icon="newDiscount"
            />
            <base-input
              id="nameEn"
              name="nameEn"
              :placeholder="
                $t('LABELS.Enter', {
                  name: $t('LABELS.orderDiscount') + $t('inEnglish'),
                })
              "
              :label="$t('LABELS.orderDiscountName') + $t('inEnglish')"
              type="text"
              icon="newDiscount"
            />
            <div class="col-span-2">
              <base-input
                id="couponCode"
                name="couponCode"
                :placeholder="
                  $t('LABELS.Enter', { name: $t('LABELS.Coupon Code') })
                "
                :label="$t('LABELS.Coupon Code')"
                type="text"
                icon="couponCode"
                :prepend="true"
                v-model:value="couponCodeInput"
              >
                <template v-slot:prepend>
                  <span class="text-primary font-medium flex flex-wrap gap-2">
                    <input-icon name="autoCoupon" />
                    <button type="button" @click="generateAutoCoupon">
                      {{ $t("LABELS.Generate auto coupon") }}
                    </button>
                  </span>
                </template>
              </base-input>
            </div>

            <div class="col-span-2">
              <base-input
                id="maxNum"
                name="maxNum"
                :placeholder="
                  $t('LABELS.Enter', {
                    name: $t('LABELS.maximum Number of used'),
                  })
                "
                :label="$t('LABELS.maximum Number of used')"
                type="number"
                icon="maxNum"
              />
            </div>

            <div class="col-span-2">
              <base-input
                id="limitPerUser"
                name="limitPerUser"
                :placeholder="
                  $t('LABELS.Enter', { name: $t('LABELS.Limit Per user') })
                "
                :label="$t('LABELS.Limit Per user')"
                type="number"
                icon="LimitPerUser"
              />
            </div>

            <div class="col-span-2">
              <base-input
                id="minCost"
                name="minCost"
                :placeholder="
                  $t('LABELS.Enter', { name: $t('LABELS.Minimum Order Cost') })
                "
                :label="$t('LABELS.Minimum Order Cost')"
                type="number"
                icon="minCost"
              />
            </div>

            <div class="space-y-3 md:col-span-2 mt-3">
              <p class="text-sub">{{ $t("LABELS.orderDiscountType") }} :</p>
              <div class="flex flex-wrap gap-4">
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
                    <label
                      for="value"
                      class="flex gap-2 items-center w-fit font-bold"
                    >
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
                    <label
                      for="percentage1"
                      class="flex gap-2 items-center font-bold"
                    >
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
              </div>
              <base-input
                v-if="initialValues.type == 'value'"
                id="value"
                name="value"
                :label="$t('LABELS.Order Discount Value')"
                type="number"
                icon="price"
                :prepend="true"
                :placeholder="
                  $t('LABELS.Enter', {
                    name: $t('LABELS.Order Discount Value'),
                  })
                "
              >
                <template v-slot:prepend>
                  <span class="text-primary font-medium">$</span>
                </template>
              </base-input>
              <base-input
                v-if="initialValues.type == 'percentage'"
                id="percentage"
                name="percentage"
                :label="$t('LABELS.Order Discount percentage')"
                type="number"
                icon="price"
                :placeholder="
                  $t('LABELS.Enter', {
                    name: $t('LABELS.Order Discount percentage'),
                  })
                "
                :prepend="true"
              >
                <template v-slot:prepend>
                  <span class="text-primary font-medium">%</span>
                </template>
              </base-input>
              <base-input
                v-if="initialValues.type == 'percentage'"
                id="maxValue"
                name="maxValue"
                :label="$t('LABELS.Order Discount Maximum Value')"
                :placeholder="
                  $t('LABELS.Enter', {
                    name: $t('LABELS.Order Discount Maximum Value'),
                  })
                "
                type="number"
                icon="price"
                :prepend="true"
              >
                <template v-slot:prepend>
                  <span class="text-primary font-medium">$</span>
                </template>
              </base-input>
            </div>
            <VeeErrorMessage name="type" as="div" class="text-error mt-2" />
          </div>
        </base-card1>
        <base-card1 class="mt-5">
          <div class="flex items-center justify-between font-bold">
            <p>{{ $t("LABELS.Auto Apply Discount") }}</p>
            <div>
              <v-switch
                color="success"
                :model-value:any="true"
                class="capitalize"
                v-model="initialValues.auto_apply_discount"
              ></v-switch>
            </div>
          </div>
        </base-card1>
        <base-card1 class="mt-5">
          <div class="flex items-center justify-between font-bold capitalize">
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
            to="/menu-setup/order-discounts"
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
      </form>
    </VeeForm>
  </div>
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
  auto_apply_discount: false,
  usedBy: "",
  type: "",
});

const schema = yup.object().shape({
  nameAr: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.orderDiscountName") + t("inArabic"),
    })
  ),
  nameEn: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.orderDiscountName") + t("inEnglish"),
    })
  ),
  couponCode: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Coupon Code"),
    })
  ),
  maxNum: yup
    .string()
    .required(
      t("ERRORS.isRequired", {
        name: t("LABELS.maximum Number of used"),
      })
    )
    .test(
      "Is positive?",
      t("ERRORS.moreThan0", { name: t("LABELS.maximum Number of used") }),
      (value) => value >= 0
    )
    .nullable(),
  limitPerUser: yup
    .string()
    .required(
      t("ERRORS.isRequired", {
        name: t("LABELS.Limit Per user"),
      })
    )
    .test(
      "Is positive?",
      t("ERRORS.moreThan0", { name: t("LABELS.Limit Per user") }),
      (value) => value >= 0
    )
    .nullable(),
  minCost: yup
    .string()
    .required(
      t("ERRORS.isRequired", {
        name: t("LABELS.Minimum Order Cost"),
      })
    )
    .test(
      "Is positive?",
      t("ERRORS.moreThan0", { name: t("LABELS.Minimum Order Cost") }),
      (value) => value >= 0
    )
    .nullable(),
  type: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.type") })),
  usedBy: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.usedBy") })),

  value: yup
    .string()
    .test(
      "isRequired?",
      t("ERRORS.isRequired", { name: t("LABELS.Order Discount Value") }),
      (value, context) => {
        if (initialValues.type == "value") {
          if (value) {
            let parent = context.parent.minCost;

            if (value > parent) {
              return context.createError({
                message: t("ERRORS.smallThan", { value: parent }),
                path: context.path,
              });
            } else {
              return true;
            }
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
      t("ERRORS.moreThan0", { name: t("LABELS.Order Discount Value") }),
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
      t("ERRORS.isRequired", { name: t("LABELS.Order Discount percentage") }),
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
      t("ERRORS.between 0 and 100", {
        name: t("LABELS.Order Discount percentage"),
      }),
      (value) => {
        if (initialValues.type == "percentage") {
          return value >= 0 && value <= 100;
        } else {
          return true;
        }
      }
    )
    .nullable(),
  maxValue: yup
    .string()
    .test(
      "isRequired?",
      t("ERRORS.isRequired", {
        name: t("LABELS.Order Discount Maximum Value"),
      }),
      (value, context) => {
        if (initialValues.type == "percentage") {
          if (value) {
            // let parent = context.parent.minCost;

            // if (value > parent) {
            //   return context.createError({
            //     message: t("ERRORS.smallThan", { value: parent }),
            //     path: context.path,
            //   });
            // } else {
            // }
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
      t("ERRORS.moreThan0", { name: t("LABELS.Order Discount Maximum Value") }),
      (value) => {
        if (initialValues.type == "percentage") {
          return value > 0;
        } else {
          return true;
        }
      }
    )

    .nullable(),
});
const emit = defineEmits(["returned-data"]);

const couponCodeInput = ref(null);

const generateAutoCoupon = () => {
  couponCodeInput.value = Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase();
};

const loading = ref(false);
const isLoading = ref(false);
function handleSubmit(values) {
  values.is_active = initialValues.is_active;
  values.have_surcharge = initialValues.have_surcharge;
  values.auto_apply_discount = initialValues.auto_apply_discount;
  values.nameAr = nameAr.value;
  values.nameEn = nameEn.value;
  values.couponCode = couponCode.value;
  values.maxNum = maxNum.value;
  values.limitPerUser = limitPerUser.value;
  values.minCost = minCost.value;
  values.type = initialValues.type;
  values.usedBy = initialValues.usedBy;
  // values.orderTypesAggregators = aggregators.value;
  emit("returned-data", values);
}

function setData() {
  loading.value = true;
  for (const [key, value] of Object.entries(props.data)) {
    initialValues[key] = value;
  }
  loading.value = false;
}

onBeforeMount(() => {
  if (props.data) {
    setData();
  }
});
</script>
