<template>
  <div>
    <deals-details :deal="deal" />
  </div>
</template>

<script setup>
import DealsDetails from "@/components/deals/DealsDetails.vue";
defineProps({
  deal: {
    type: Object,
    required: true,
  },
});
</script>
