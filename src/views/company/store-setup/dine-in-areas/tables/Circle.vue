<template>
  <div
    class="table_wrapper area_circle"
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
.table_wrapper.area_circle {
  .table_content {
    @apply rounded-full;
  }
  .chair-2 {
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
      ". one one ."
      "three table table four"
      ". two two .";

    .chair-3 {
      transform: rotate(-90deg) translateY(8px) !important;
    }
    .chair-4 {
      transform: rotate(90deg) translateY(8px) !important;
    }
  }
  &.custom-area-6 {
    @apply grid  gap-1;

    grid-template-areas:
      ". one one ."
      "three table table four"
      "five table table six"
      ". two two .";

    .chair-3 {
      transform: rotate(301deg) translate(14px, 12px) !important;
    }
    .chair-4 {
      transform: rotate(66deg) translate(-12px, 13px) !important;
    }
    .chair-5 {
      transform: rotate(241deg) translate(-9px, 12px) !important;
    }
    .chair-6 {
      transform: rotate(-244deg) translate(6px, 14px) !important;
    }
  }
  &.custom-area-8 {
    @apply grid  gap-1;

    grid-template-areas:
      ". one three ."
      "five table table six"
      "chair-7 table table chair-8"
      ". two four .";

    .chair-1 {
      transform: rotate(-20deg) translateY(4px) !important;
    }
    .chair-2 {
      transform: rotate(-150deg) translateY(4px) !important;
    }
    .chair-3 {
      transform: rotate(25deg) translateY(4px) !important;
    }
    .chair-4 {
      transform: rotate(150deg) translateY(4px) !important;
    }
    .chair-5 {
      transform: rotate(286deg) translateY(10px) !important;
    }
    .chair-6 {
      transform: rotate(68deg) translate(-5px, 9px) !important;
    }
    .chair-7 {
      transform: rotate(245deg) translate(-5px, 9px) !important;
    }
    .chair-8 {
      transform: rotate(109deg) translate(3px, 11px) !important;
    }
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

    .chair-1 {
      transform: rotate(-16deg) translate(8px, 5px) !important;
    }
    .chair-2 {
      transform: rotate(-161deg) translate(-6px, 5px) !important;
    }
    .chair-3 {
      transform: rotate(24deg) translate(-1px, 5px) !important;
    }
    .chair-4 {
      transform: rotate(159deg) translate(2px, 6px) !important;
    }
    .chair-5 {
      transform: rotate(301deg) translate(9px, 16px) !important;
    }
    .chair-6 {
      transform: rotate(58deg) translate(-8px, 16px) !important;
    }
    .chair-7 {
      transform: rotate(270deg) translate(0px, 8px) !important;
    }
    .chair-8 {
      transform: rotate(91deg) translate(0px, 9px) !important;
    }
    .chair-9 {
      transform: rotate(236deg) translate(-11px, 16px) !important;
    }
    .chair-10 {
      transform: rotate(124deg) translate(9px, 16px) !important;
    }
  }
}
</style>
