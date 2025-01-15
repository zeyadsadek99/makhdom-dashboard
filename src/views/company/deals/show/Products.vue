<template>
  <deals-products :deal="deal" />
</template>

<script setup>
import DealsProducts from "@/components/deals/DealsProducts.vue";
defineProps({
  deal: {
    type: Object,
    required: true,
  },
});
</script>
