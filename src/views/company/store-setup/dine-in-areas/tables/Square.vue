<template>
  <div
    class="table_wrapper area_square"
    :class="
      item.num_of_chairs <= 2
        ? 'custom-area-2'
        : item.num_of_chairs > 2 && item.num_of_chairs <= 6
        ? 'custom-area-6'
        : item.num_of_chairs > 6 && item.num_of_chairs <= 8
        ? 'custom-area-8'
        : 'custom-area-10'
    "
  >
    <div
      class="chair"
      :class="`chair-${chair}`"
      v-for="chair in item.num_of_chairs"
      :key="chair"
    ></div>

    <div class="table_content">
      <p class="table_number">
        {{ item.table_num }}
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    required: true,
  },
});
</script>

<style lang="scss">
.table_wrapper.area_square {
  @apply grid;

  .chair-5 {
    transform: rotate(270deg) translateY(8px) !important;
  }
  .chair-6 {
    transform: rotate(90deg) translateY(8px) !important;
  }
  .chair-7 {
    transform: rotate(270deg) translateY(8px) !important;
  }
  .chair-8 {
    transform: rotate(90deg) translateY(8px) !important;
  }
  .chair-9 {
    transform: rotate(270deg) translateY(8px) !important;
  }
  .chair-10 {
    transform: rotate(90deg) translateY(8px) !important;
  }

  @apply rounded-md;
  .chair:nth-child(even) {
    transform: rotate(180deg);
  }

  &.custom-area-2 {
    @apply grid  gap-1;

    grid-template-areas:
      ". one ."
      "table table table"
      "table table table"
      ". two .";
  }

  &.custom-area-4 {
    @apply grid  gap-1;

    grid-template-areas:
      ". one three ."
      "five table table six"
      "chair-7 table table chair-8"
      ". two four .";
  }
  &.custom-area-6 {
    @apply grid  gap-1;
    .table_content {
      grid-area: table;
    }

    grid-template-areas:
      ". one three ."
      ". table table ."
      "five table table six"
      " . table table ."
      ". two four .";
  }
  &.custom-area-8 {
    @apply grid  gap-1;

    grid-template-areas:
      ". one three ."
      "five table table six"
      "chair-7 table table chair-8"
      ". two four .";
  }
  &.custom-area-10 {
    .table_content {
      width: 110px !important;
      height: 110px !important;
    }

    @apply grid  gap-1;

    grid-template-areas:
      ". one three ."
      "five table table six"
      "chair-7 table table chair-8"
      "chair-9 table table chair-10"
      ". two four .";
  }
}
</style>
