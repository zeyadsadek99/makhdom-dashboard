<template>
  <div class="loyalty-card" v-if="userData.client"></div>
</template>

<script setup>
import { toRef } from "vue";

import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  item: {
    required: true,
  },
});

const userData = toRef(props.item);
</script>
