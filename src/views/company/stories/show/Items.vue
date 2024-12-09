<template>
  <base-card1>
    <div
      class="flex items-center mb-6 border border-line rounded-xl p-2 justify-between gap-4 px-4 overflow-y-auto"
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
        @click="itemDetails = 'history'"
        :class="`py-2 ${
          itemDetails == 'history'
            ? 'text-primary border-b-2 border-primary'
            : 'text-placeholder'
        }`"
      >
        {{ $t("TITLES.History") }}
      </button>

      <button
        @click="itemDetails = 'modifications'"
        :class="`py-2 ${
          itemDetails == 'modifications'
            ? 'text-primary border-b-2 border-primary'
            : 'text-placeholder'
        }`"
      >
        {{ $t("TITLES.Modifications") }}
      </button>

      <button
        @click="itemDetails = 'payment'"
        :class="`py-2 ${
          itemDetails == 'payment'
            ? 'text-primary border-b-2 border-primary'
            : 'text-placeholder'
        }`"
      >
        {{ $t("LABELS.payment") }}
      </button>
    </div>

    <div v-if="order">
      <receipt v-if="itemDetails == 'receipt'" :order="order" />
      <history v-else-if="itemDetails == 'history'" :order="order" />
      <modifications
        v-else-if="itemDetails == 'modifications'"
        :order="order"
      />
      <payment v-else :order="order" />
    </div>
  </base-card1>
</template>

<script setup>
import { ref } from "vue";
import receipt from "./ItemsDetails/receipt.vue";
import history from "./ItemsDetails/history.vue";
import modifications from "./ItemsDetails/modifications.vue";
import payment from "./ItemsDetails/payment.vue";
const itemDetails = ref("receipt");
defineProps({
  order: {
    required: true,
  },
});
</script>
