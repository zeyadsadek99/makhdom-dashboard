<template>
  <base-card1>
    <h3 class="text-text flex gap-2 items-center font-semibold text-xl mb-4">
      {{ $t("TITLES.Details") }}
    </h3>
    <div class="grid lg:grid-cols-2 grid-cols-1">
      <div class="space-y-3">
        <div class="grid md:grid-cols-2 grid-cols-2">
          <div class="flex gap-2">
            <svg-icon name="calendar" class="mt-1 svgIcon" />
            <h3 class="text-placeholder">{{ $t("TITLES.createdAt") }}:</h3>
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
        <div class="flex gap-2 md:col-span-2" v-if="item.company">
          <a
            target="_blank"
            :href="`https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${item.company.lat},${item.company.lng}`"
            class="font-semibold flex items-center gap-2 text-blue"
          >
            <svg-icon name="location" />
            {{ $t("LABELS.Get Directions") }}
          </a>
        </div>
        <div class="flex gap-2 md:col-span-2 mt-11">
          <div>
            <h3 class="text-placeholder">{{ $t("LABELS.Categories") }}:</h3>
            <p
              class="capitalize font-semibold"
              v-for="category in item.categories"
              :key="category.id"
            >
              {{ category.name }}
            </p>
          </div>
        </div>
        <div class="md:col-span-2 mt-11" v-if="item.status == 'refused'">
          <h3 class="text-placeholder">{{ $t("LABELS.Notes") }}:</h3>
          <p class="capitalize font-semibold">
            {{ item.notes }}
          </p>
        </div>
      </div>

      <div class="md:mt-0 mt-3 space-y-2">
        <div class="flex gap-2 items-center">
          <h3 class="text-placeholder">{{ $t("LABELS.Status") }}</h3>
          <p
            class="text-lg font-semibold capitalize"
            :class="getStatusColor(item.status)"
          >
            {{ $t(`STATUS.${item.status}`) }}
          </p>
        </div>
        <div class="flex gap-2 items-center">
          <h3 class="text-placeholder">{{ $t("LABELS.isCompletedData") }}</h3>
          <p
            class="text-lg font-semibold capitalize"
            :class="
              getStatusColor(
                item.account_verification ? 'completed' : 'unCompleted'
              )
            "
          >
            {{
              item.account_verification
                ? $t("STATUS.completed")
                : $t("STATUS.unCompleted")
            }}
          </p>
        </div>
        <div class="flex gap-2 items-center">
          <h3 class="text-placeholder">{{ $t("LABELS.activation") }}</h3>

          <global-switcher
            :id="item.id"
            :url="`users/${item.id}/toggle-active-user`"
            v-model:modalValue="item.is_admin_active_user"
          />
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
    case "refused":
      return "text-red";
    case "unCompleted":
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
    case "accepted":
      return "text-success";
    case "completed":
      return "text-success";
    default:
      return "text-sub";
  }
};
</script>
