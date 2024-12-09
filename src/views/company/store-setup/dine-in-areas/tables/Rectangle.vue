<template>
  <div
    class="table_wrapper area_rectangle"
    :class="
      item.num_of_chairs <= 2
        ? 'custom-area-2'
        : item.num_of_chairs > 2 && item.num_of_chairs <= 4
        ? 'custom-area-4'
        : item.num_of_chairs > 4 && item.num_of_chairs <= 6
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
.table_wrapper.area_rectangle {
  @apply grid  gap-1;
  .chair-7 {
    transform: rotate(270deg) translateY(6px) !important;
  }
  .chair-8 {
    transform: rotate(-270deg) translateY(7px) !important;
  }
  .chair:nth-child(even) {
    transform: rotate(180deg);
  }
  &.custom-area-2 {
    grid-template-areas:
      ". one ."
      "table table table"
      "table table table"
      ". two .";
  }
  &.custom-area-4 {
    .table_content {
      width: 80px !important;
    }
    grid-template-areas:
      "one three"
      "table table"
      "table table"
      "two four";
  }
  &.custom-area-6 {
    .table_content {
      width: 110px !important;
    }
    grid-template-areas:
      "one three five"
      "table table table"
      "table table table"
      "two four six";
  }

  &.custom-area-8 {
    .table_content {
      width: 150px !important;
    }
    grid-template-areas:
      ". one three five chair-9"
      "chair-7 table table table   chair-8"
      "chair-7 table table table   chair-8"
      ". two four six chair-10";
  }
  &.custom-area-10 {
    .table_content {
      width: 150px !important;
    }

    @apply grid  gap-1;

    grid-template-areas:
      ". one three five chair-9 ."
      "chair-7 table table table table chair-8"
      "chair-7 table table table table chair-8"
      ". two four six chair-10 .";
  }
}
</style>
