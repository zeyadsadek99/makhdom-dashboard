<template>
  <router-view :store-data="storeData" />
</template>
<script setup>
defineProps({
  storeData: {
    required: false,
  },
});
</script>
