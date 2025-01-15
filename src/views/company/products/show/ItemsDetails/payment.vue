<template>
  <div v-if="order" class="ordersTable">
    <v-data-table-virtual
      :headers="headers"
      :items="order.pay_type ?? []"
      :loading="loading"
      item-value="id"
      class="project-table"
      item-key="id"
      :no-data-text="$t('TEXTS.noData')"
    >
      <template v-slot:loading>
        <loader class="py-7" />
      </template>
      <template v-slot:no-data>
        <div
          class="text-center"
          v-if="!$route.query.keyword && !$route.query.status"
        >
          <h3 class="mt-4 font-semibold text-text text-center">
            {{ $t("LABELS.noPayment") }}
          </h3>
        </div>
        <h3 v-else class="mt-4 font-semibold text-text text-center">
          {{ $t("TITLES.No Search result") }}
        </h3>
      </template>

      <template v-slot:[`item.pay_type`]="{ item }">
        <div
          class="flex gap-2 items-center"
          v-for="(value, key, index) in item"
          :key="index"
        >
          <img src="/icons/cash.svg" class="w-[24px] h-[24px]" />
          <small-details-card :title="key" />
        </div>
      </template>
      <template v-slot:[`item.collected`]="{ item }">
        <div
          class="flex gap-2 items-center"
          v-for="(value, index) in item"
          :key="index"
        >
          <small-details-card :title="value" />
        </div>
      </template>
    </v-data-table-virtual>

    <div class="flex justify-end md:mt-0 my-5" v-if="order.pay_type">
      <div class="space-y-3">
        <div class="grid grid-cols-2 gap-12">
          <p class="text-sub font-medium">{{ $t("ORDER.VAT") }} :</p>
          <p class="uppercase font-semibold">
            {{ order.price_detail?.tax_rate_value }}
            {{ order.price_detail?.currency }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-12">
          <p class="text-sub font-medium">{{ $t("ORDER.Total Paid") }} :</p>
          <div class="uppercase font-semibold" v-if="sum">
            {{ sum }}
            {{ order.price_detail?.currency }}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-12">
          <p class="text-sub font-medium">{{ $t("LABELS.Tips") }} :</p>
          <p class="uppercase font-semibold">
            {{ order.price_detail?.tips_amount || 0 }}
            {{ order.price_detail?.currency }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const loading = ref(false);
const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
});

const sum = computed(() => {
  return props.order?.pay_type?.reduce((acc, value) => {
    const amount = Object.values(value)[0];
    return acc + amount;
  }, 0);
});

const headers = [
  {
    title: t("LABELS.Payment Method"),
    align: "start",
    sortable: false,
    key: "pay_type",
  },
  {
    title: t("collected"),
    align: "start",
    sortable: false,
    key: "collected",
  },
];
</script>

<style lang="scss">
.ordersTable {
  .v-table__wrapper {
    @apply pb-5;
  }
}
</style>
