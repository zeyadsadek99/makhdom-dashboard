<template>
  <loader v-if="loading" />
  <VeeForm
    v-else
    :validation-schema="schema"
    @submit="handleSubmit"
    :initial-values="initialValues"
  >
    <FieldArray name="available_products_ids" v-slot="{ fields }">
      <div class="v-table">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th class="w-[123px]">{{ $t("LABELS.Product") }}</th>
                <th>{{ $t("LABELS.Name") }}</th>
                <th>{{ $t("LABELS.Category") }}</th>
                <th>{{ $t("LABELS.Price") }}</th>
                <th class="!w-[150px] whitespace-nowrap">
                  {{ $t("LABELS.Offer Price") }}
                </th>
                <th>{{ $t("LABELS.Quantity") }}</th>
                <th>{{ $t("LABELS.Actions") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(field, idx) in fields" :key="field.id">
                <td><cart-images-swiper :product="field.value" /></td>
                <td class="text-lg">{{ field.value.name }}</td>
                <td>
                  <div>
                    <p class="text-xl text-text whitespace-nowrap">
                      {{ field.value.main_category?.name }}
                    </p>
                    <p class="text-sub-text whitespace-nowrap">
                      {{ field.value.sub_category?.name }}
                    </p>
                  </div>
                </td>
                <td>
                  <p class="text-xl whitespace-nowrap font-bold text-green">
                    {{ field.value.price }} {{ $t("SAR") }}
                  </p>
                </td>
                <td>
                  <base-input
                    :id="`available_products_ids[${idx}].offer_price`"
                    :name="`available_products_ids[${idx}].offer_price`"
                    :placeholder="$t('LABELS.Price')"
                    type="text"
                    class="!w-[200px]"
                    :disabled="!field.value.selected"
                  />
                </td>
                <td class="font-bold">{{ field.value.quantity }}</td>
                <td class="font-bold">
                  <label
                    class="flex gap-2 whitespace-nowrap cursor-pointer items-center px-6 py-3 rounded-full"
                    :for="`available_products_ids[${idx}].selected`"
                    :class="
                      field.value.selected
                        ? '  bg-[#47ada9] !text-white'
                        : 'bg-primary/20 text-primary'
                    "
                  >
                    <span
                      class="size-5 rounded-full bg-white flex items-center justify-center"
                    >
                      <Check1 width="20" />
                    </span>
                    {{ $t("LABELS.Available with me") }}
                    <VeeField
                      class="hidden"
                      type="checkbox"
                      :value="field.value.id"
                      :id="`available_products_ids[${idx}].selected`"
                      :name="`available_products_ids[${idx}].selected`"
                    />
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </FieldArray>
    <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-3 !mt-7">
      <BaseDate
        id="date"
        name="date"
        :min-date="new Date()"
        :time-picker="false"
        icon="calendar"
        :label="`${$t('LABELS.Shipping Date')}:`"
        :placeholder="`${$t('LABELS.Shipping Date')}`"
        v-model:itemValue="initialValues.date"
      />

      <BaseDate
        id="time"
        name="time"
        :time-picker="true"
        icon="hour"
        :is24="false"
        :label="`${$t('LABELS.Shipping Time')}:`"
        :placeholder="`${$t('LABELS.Shipping Time')}`"
        v-model:itemValue="initialValues.time"
      />
      <base-select
        id="shipping_type"
        name="shipping_type"
        :placeholder="$t('LABELS.Choose Shipping method')"
        :label="$t('LABELS.Shipping options')"
        :options="[]"
        :filter="null"
        v-model:itemValue="initialValues.shipping_type"
      />
    </div>

    <div class="flex items-center justify-end gap-7">
      <router-link
        to="/menu-setup/categories"
        class="capitalize font-semibold text-sub"
      >
        {{ $t("BUTTONS.cancel") }}
      </router-link>

      <button type="submit" class="base-btn rounded-md" :disabled="btnLoading">
        {{ $t("BUTTONS.save") }}
      </button>
    </div>
  </VeeForm>
</template>

<script setup>
import Check1 from "@/components/icons/Check1";
import CartImagesSwiper from "@/components/CartImagesSwiper";
import { FieldArray } from "vee-validate";
import axios from "axios";

import { ref, reactive, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";

import * as yup from "yup";
const loading = ref(true);

const btnLoading = ref(false);

const props = defineProps({
  data: {
    required: false,
    type: Object,
  },
});

const { t } = useI18n();
const initialValues = reactive({
  available_products_ids: [],

  date: "",
  time: "",
  notes: "",
  shipping_type: null,
});

const schema = yup.object().shape({
  date: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.Shipping Date") }))
    .nullable(),
  time: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.Shipping Time") }))
    .nullable(),
  available_products_ids: yup
    .array()
    .of(
      yup.object().shape({
        offer_price: yup
          .string()
          .test(
            "offer_price",
            t("ERRORS.isRequired", { name: t("LABELS.Price") }),
            (value, ctx) => {
              const selected = ctx.parent.selected;
              if (selected) {
                if (value) return true;
                return false;
              } else return true;
            }
          ),
        selected: yup.string(),
      })
    )
    .strict(),
});

function handleSubmit(values) {
  console.log(values);
}

function setData() {
  initialValues.available_products_ids = props.data.products.map((el) => ({
    ...el,
    selected: null,
    offer_price: "",
  }));
  setTimeout(() => (loading.value = false), 300);
}
onBeforeMount(async () => {
  if (props.data) {
    setData();
  }
});
</script>

<style lang="scss">
.v-table {
  @apply flex h-full w-full max-w-[100%] flex-col rounded-lg leading-[1.5];
  --v-table-header-height: 45px;

  .table-wrapper {
    @apply flex-auto overflow-auto;
    table {
      @apply w-full border-spacing-0;
      thead {
        @apply rounded-2xl bg-[#F8FBFD];
      }

      th {
        @apply px-4 text-start;
        height: calc(var(--v-table-header-height) + 15px);
      }

      td {
        @apply p-4 text-start;
      }
    }
  }
}
</style>
