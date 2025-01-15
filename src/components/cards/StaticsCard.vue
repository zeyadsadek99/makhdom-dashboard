<template>
  <base-card1>
    <h3 class="text-text text-lg capitalize text-center mb-4">
      {{ data.title }}
    </h3>
    <p class="text-text font-bold text-2xl text-center mb-2">
      {{ item.value ? $n(item.value) : 0 }}
    </p>
    <p class="text-sub text-center mb-1">
      {{ $t("LABELS.ThisWeek") }}
    </p>

    <p
      class="gap-1 flex items-center justify-center"
      :class="item.level === 'Up' ? 'text-green-500' : 'text-error'"
    >
      {{ item.percentage }}%
      <svg-icon v-if="item.level === 'Up'" name="trending-up" />
      <svg-icon v-else name="trending-down" />
    </p>
  </base-card1>
</template>

<script setup>
const props = defineProps({
  data: { type: Object, required: true },
});

const handleValues = (value) => {
  const calc = (value.past_week / value.this_week) * 100;
  const level = calc > 100 ? "Down" : "Up";
  const percentage = calc > 100 ? (calc - 100).toFixed(1) : calc.toFixed(1);
  return {
    level: level,
    percentage: isNaN(percentage) ? 0 : percentage,
    value: value.this_week,
  };
};

const item = handleValues(props.data);
</script>

<style></style>
