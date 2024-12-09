<template>
  <base-card1>
    <h3 class="text-text flex gap-2 items-center font-semibold text-xl mb-4">
      {{ $t("LABELS.Order Details") }}
    </h3>
    <div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1" v-if="item">
      <div class="space-y-3">
        <div class="grid md:grid-cols-2 grid-cols-2">
          <div class="flex gap-2">
            <svg-icon name="calendar" class="mt-1 svgIcon" />
            <h3 class="text-placeholder">{{ $t("LABELS.Order Date") }}:</h3>
          </div>
          <p class="capitalize font-semibold">
            {{
              new Date(item.created_at).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }}
          </p>
        </div>
        <div class="flex gap-2 md:col-span-2">
          <svg-icon name="location" class="mt-1" />
          <div>
            <h3 class="text-placeholder">{{ $t("LABELS.address") }}:</h3>
            <p class="capitalize font-semibold">
              {{ item.location ? item.location : "-" }}
            </p>
          </div>
        </div>
      </div>

      <div class="grid items-center md:mt-0 mt-3">
        <div>
          <div class="flex gap-2 items-center">
            <h3 class="text-placeholder">{{ $t("LABELS.Status") }}</h3>
            <p
              class="text-2xl font-semibold capitalize"
              :class="getStatusColor(item.status)"
            >
              {{ item.status_trans }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </base-card1>
</template>

<script setup>
defineProps({
  item: {
    required: true,
  },
});

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "text-[#FCC230]";
    case "placed":
      return "text-[#FCC230]";
    case "customer_cancel":
      return "text-red";
    case "employee_cancel":
      return "text-red";
    case "progress":
      return "text-[#FCC230]";
    case "in_progress":
      return "text-[#FCC230] bg-[#FCC2300D]";
    case "collected":
      return "text-[#FF8600]";
    case "ready_to_finish":
      return "text-success";
    case "ready":
      return "text-success";
    case "finished":
      return "text-success";
    case "completed":
      return "text-success";
    default:
      return "text-sub";
  }
};
</script>
