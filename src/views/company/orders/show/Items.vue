<template>
  <base-card1>
    <div
      class="flex items-center mb-6 border border-line rounded-xl p-2 gap-4 px-4 overflow-y-auto"
    >
      <button
        @click="itemDetails = 'receipt'"
        :class="`py-2 ${
          itemDetails == 'receipt'
            ? 'text-primary border-b-2 border-primary'
            : 'text-placeholder'
        }`"
      >
        {{ $t("TITLES.Receipt") }}
      </button>

      <button
        @click="itemDetails = 'order_status'"
        :class="`py-2 ${
          itemDetails == 'order_status'
            ? 'text-primary border-b-2 border-primary'
            : 'text-placeholder'
        }`"
      >
        {{ $t("LABELS.orderStatus") }}
      </button>
    </div>

    <div v-if="order">
      <receipt v-if="itemDetails == 'receipt'" :order="order" />
      <OrderStatus v-if="itemDetails == 'order_status'" :order="order" />
    </div>
  </base-card1>
</template>

<script setup>
import { ref } from "vue";
import receipt from "./ItemsDetails/receipt.vue";
import OrderStatus from "./ItemsDetails/OrderStatus.vue";

const itemDetails = ref("receipt");
defineProps({
  order: {
    required: true,
  },
});
</script>
