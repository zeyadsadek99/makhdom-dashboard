<template>
  <base-card1>
    <div class="flex items-center justify-between gap-2 flex-wrap mb-5">
      <h3 class="text-text flex gap-2 items-center font-semibold text-xl">
        {{ $t("LABELS.Order Details") }}
      </h3>
      <div class="flex items-center gap-2 flex-wrap">
        <p
          class="rounded-full px-5 py-2 text-center text-sm font-semibold capitalize"
          :class="getStatusColor(item.status)"
        >
          {{ $t(`STATUS.${item.status}`) }}
        </p>
      </div>
    </div>

    <ul class="top-header with-border">
      <li>
        <p class="title">{{ $t("LABELS.Order Number") }}</p>
        <p class="value">#{{ item.id }}</p>
      </li>
      <li>
        <p class="title">{{ $t("TEXT.order date and time") }}</p>
        <p class="value">
          {{
            new Date(item.created_at)
              .toLocaleDateString(locale == "ar" ? "ar-eg" : "en-us", {
                day: "numeric",
                month: "2-digit",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })
              .replace("at", "-")
              .replace("pm", "PM")
              .replace("am", "AM")
          }}.
        </p>
      </li>
      <!-- <li>
        <p class="title">{{ $t("LABELS.Order Type") }}</p>
        <p class="value">{{ $t(`order_type.${item.order_type}`) }}</p>
      </li> -->
      <li>
        <p class="title">{{ $t("TEXT.Total order") }}</p>
        <p class="value">{{ item.total }} {{ $t("SAR") }}</p>
      </li>
        <!-- <li class="sm:col-span-2 lg:col-span-4" v-if="item.admin_reject_reason">
          <p class="title">{{ $t("LABELS.Rejection reason") }}</p>
          <p class="value text-error">{{ item.admin_reject_reason }}</p>
        </li> -->
    </ul>
    <h3 class="mb-3 text-text font-bold text-xl">
      {{ $t("LABELS.Vendor Details") }}
    </h3>
     <ul class="top-header">
      <!-- <li>
        <p class="title">{{ $t("LABELS.facility type") }}</p>
        <p class="value">{{ item.provider.facility_type?.name }}</p>
      </li> -->
      <li>
        <p class="title">
          {{ $t("LABELS.Name", { name: $t("LABELS.Vendor") }) }}
        </p>
        <p class="value">{{ item.vendor.full_name }}</p>
      </li>
      <li v-if="item.vendor?.rate">
        <p class="title">{{ $t("LABELS.rate") }}</p>
        <p class="value">
          {{ item.vendor.rate }}
        </p>
      </li>
      <!-- <li>
        <p class="title">{{ $t("LABELS.Member From") }}</p>
        <p class="value">
          {{ item.provider.created_at }}
        </p>
      </li> -->
    </ul> 
    <h3 class="mb-3 text-text font-bold text-xl">
      {{ $t("LABELS.Client Details") }}
    </h3>
    <ul class="top-header">
      <!-- <li>
        <p class="title">{{ $t("LABELS.facility type") }}</p>
        <p class="value">{{ item.client.facility_type?.name }}</p>
      </li> -->
      <li>
        <p class="title">{{ $t("LABELS.Client Name") }}</p>
        <p class="value">{{ item.client?.full_name }}</p>
      </li>
      <li v-if="item.client?.phone">
        <p class="title">{{ $t("LABELS.phoneNumber") }}</p>
        <p class="value">
          {{ item.client.phone }}
        </p>
      </li>
      <!-- <li>
        <p class="title">{{ $t("LABELS.Member From") }}</p>
        <p class="value">
          {{ item.client.created_at }}
        </p>
      </li> -->
    </ul>
    
  </base-card1>
</template>

<script setup>
import { ref, onMounted, toRef } from "vue";
import getStatusColor from "@/utils/getStatusColor.ts";
import { useI18n } from "vue-i18n";
const props = defineProps({
  item: {
    required: true,
  },
});

const item = toRef(props.item);

const { locale } = useI18n();
const location = ref(null);

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      location.value = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
    });
  }
}

onMounted(() => getLocation());
</script>
