<template>
  <base-card1>
    <div class="flex items-center justify-between gap-2 flex-wrap mb-5">
      <h3 class="text-text flex gap-2 items-center font-semibold text-xl">
        {{ $t("LABELS.orderStatus") }}
      </h3>
      <div class="flex items-center gap-2 flex-wrap">
        <p
          class="rounded-full !bg-transparent px-5 py-2 text-center text-sm font-semibold capitalize"
          :class="getStatusColor(order.status)"
        >
          {{ $t(`STATUS.${order.status}`) }}
        </p>
      </div>
    </div>
    <ul class="top-header">
      <li>
        <p class="title">{{ $t("TEXT.Estimated time of arrival") }}</p>
        <p class="value">
          {{
            new Date(order.delivery_at).toLocaleDateString(
              locale == "ar" ? "ar-eg" : "en-us",
              {
                day: "numeric",
                month: "2-digit",
                year: "numeric",
              }
            )
          }}
        </p>
      </li>
      <!-- <li>
        <p class="title">{{ $t("LABELS.Shipping company") }}</p>
        <p class="value">{{ order.shipping_company?.name ?? "-" }}</p>
      </li> -->
      <!-- <li>
        <p class="title">{{ $t("LABELS.Shipping type") }}</p>
        <p class="value font-aclonica text-error">Express</p>
      </li> -->
      <li>
        <p class="title">{{ $t("LABELS.Payment") }}</p>
        <p
          class="value font-aclonica"
          
        >
          {{ $t(`LABELS.${order.payment_method}`) }}
          <!-- {{ $t(`LABELS.${order.is_payment}`) }} -->
        </p>
      </li>
    </ul>
    <div class="flex items-center justify-between gap-3 mb-7">
      <!-- <div
        v-for="(status, index) in order.order_status"
        :key="status.key"
        class="flex-1"
      >
        <div class="flex items-center justify-between mb-2 gap-3">
          <img :src="status.icon" class="size-9 md:size-12" alt="ordered" />

          <p
            v-if="index + 1 != order.order_status.length"
            class="border-2 border-sub border-dashed flex-1"
            :class="
              status.status == 'done'
                ? '!border-success'
                : status.status == 'waiting'
                ? '!border-sub'
                : '!border-[#FCC230]'
            "
          />
        </div>

        <h3
          class="font-medium text-sm md:text-base"
          :class="
            status.status == 'done'
              ? 'text-success'
              : status.status == 'waiting'
              ? 'text-sub'
              : 'text-[#FCC230]'
          "
        >
          {{ $t(`STATUS.${status.key}`) }}
        </h3>
      </div> -->
    </div>
  </base-card1>
</template>

<script setup>
import getStatusColor from "@/utils/getStatusColor.ts";
import { useI18n } from "vue-i18n";
import { toRef } from "vue";

const { locale } = useI18n();
const { t } = useI18n();
const props = defineProps({
  order: {
    required: true,
  },
});

const order = toRef({ ...props.order });
</script>

<style></style>
