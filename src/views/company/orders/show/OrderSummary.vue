<template>
  <div v-if="order" class="ordersTable">
    <table class="w-full rounded-md mb-5">
      <thead class="bg-[#f9fafc] text-sub">
        <th class="text-start rounded-s-lg p-[10px] text-[15px] max-w-[250px]">
          {{ $t("LABELS.Product") }}
        </th>
        <th class="text-start p-[10px] text-[15px]">
          {{ $t("LABELS.Price") }}
        </th>
        <th class="text-start p-[10px] text-[15px]">
          {{ $t("LABELS.Quantity") }}
        </th>
        <th class="text-start rounded-e-lg p-[10px] text-[15px]">
          {{ $t("ORDER.Total") }}
        </th>
      </thead>
      <tbody>
        <tr
          class="border-b border-placeholder"
          v-for="item in order.items"
          :key="item.id"
        >
          <td class="text-[14px] p-[10px] font-medium flex items-center gap-2">
            <img
              :src="item.image"
              :alt="item.name"
              class="w-[60px] h-[60px] rounded-lg object-cover"
            />
          </td>
          <td class="text-[14px] p-[10px] font-medium">
            {{ item.price.toFixed(2) }}
          </td>
          <td class="text-[14px] p-[10px] font-medium">
            {{ item.quantity }}
          </td>
          <td class="text-[14px] p-[10px] font-medium">
            {{ item.total.toFixed(2) }}
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-end md:mt-0 my-5">
      <div class="space-y-3">
        <div class="grid grid-cols-2 gap-12">
          <p class="text-sub font-medium">{{ $t("ORDER.Subtotal") }} :</p>
          <p class="uppercase font-semibold">
            {{ order.sub_total_after_discount.toFixed(2) }}
            {{ $t("SAR") }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-12">
          <p class="text-sub font-medium">{{ $t("ORDER.Delivery") }} :</p>
          <p class="uppercase font-semibold">
            {{ order.shipping_price.toFixed(2) }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-12">
          <p class="text-sub font-medium">{{ $t("ORDER.VAT") }} :</p>
          <p class="uppercase font-semibold">
            {{ order.vat_value }}
            {{ $t("SAR") }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-12">
          <p class="text-sub font-medium">{{ $t("LABELS.coupon_price") }} :</p>
          <p class="uppercase font-semibold">
            {{ order.coupon_value.toFixed(2) }}
            {{ $t("SAR") }}
          </p>
        </div>

        <hr class="border-border w-full" />

        <div class="grid grid-cols-2 gap-12 font-semibold">
          <p class="font-medium">{{ $t("ORDER.Total") }} :</p>
          <p class="uppercase">
            {{ order.total.toFixed(2) }}
            {{ $t("SAR") }}
          </p>
        </div>
      </div>
    </div>
    <base-card1 class="p-3" :title="$t('LABELS.Notes')" v-if="order.comment">
      <div class="flex justify-between items-center gap-8 flex-wrap">
        <div class="w-full md:max-w-[600px]">
          {{ order.comment }}
        </div>
      </div>
    </base-card1>
  </div>
</template>

<script setup>
defineProps({
  order: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss">
.ordersTable {
  .v-table__wrapper {
    @apply pb-5;
  }
}
</style>
