<template>
  <div>
    <deals-offers :deal="deal" />
  </div>
</template>

<script setup>
import DealsOffers from "@/components/deals/DealsOffers.vue";
defineProps({
  deal: {
    type: Object,
    required: true,
  },
});
</script>
