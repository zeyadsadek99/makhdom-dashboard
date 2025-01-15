<template>
  <Suspense>
    <router-view />

    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

onMounted(() => {
  if (locale.value == "ar") {
    document.body.dir = "rtl";
  }
});
</script>
