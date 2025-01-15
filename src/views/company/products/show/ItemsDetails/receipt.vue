<template>
  <div v-if="order" class="ordersTable">
    <!-- <v-data-table-virtual
      :headers="headers"
      :items="order.item"
      :loading="loading"
      item-value="id"
      class="project-table"
      item-key="id"
      :no-data-text="$t('TEXTS.noData')"
    >
      <template v-slot:loading>
        <loader class="py-7" />
      </template>
      <template v-slot:no-data>
        <div
          class="text-center"
          v-if="!$route.query.keyword && !$route.query.status"
        >
          <img
            class="mx-auto"
            src="@/assets/images/icons/brand/orders.png"
            alt=""
          />
          <h3 class="mt-4 font-semibold text-text text-center">
            {{
              $t("TITLES.No have been added yet", {
                name: $t("LABELS.orders"),
              })
            }}
          </h3>
        </div>
        <h3 v-else class="mt-4 font-semibold text-text text-center">
          {{ $t("TITLES.No Search result") }}
        </h3>
      </template>

      <template v-slot:[`item.name`]="{ item }">
        <small-details-card :title="item.name" :image="item.image" />
      </template>
      <template v-slot:[`item.item_price`]="{ item }">
        <small-details-card
          :title="item.item_price + ' ' + (item.price?.currency || '')"
        />
      </template>
      <template v-slot:[`item.size`]="{ item }">
        <small-details-card title="-" />
      </template>
      <template v-slot:[`item.modifiers`]="{ item }">
        <div v-if="item.sub_modifiers.length">
          <div
            v-if="item.combo.length"
            class="bg-[#FCC23014] col-span-6 rounded-lg flex items-center gap-2 flex-wrap my-2 p-2"
          >
            <span class="text-[#FCC230]">{{ $t("LABELS.Combo") }}:</span>
            <span v-for="(compo, i) in item.combo" :key="compo.id">
              {{ compo.qty }}x {{ compo.name }}
              <span v-if="i != item.combo.length - 1">,</span>
            </span>
          </div>

          <div v-if="item.sub_modifiers.length">
            <div
              v-for="sub_modifier in item.sub_modifiers"
              :key="sub_modifier.id"
            >
              <span
                v-for="(item_modifier, i) in sub_modifier.item_modifiers"
                :key="item_modifier.id"
              >
                <template v-if="item_modifier.qty">
                  {{ item_modifier.qty }}x {{ item_modifier.name }}

                  <span v-if="i != sub_modifier.item_modifiers.length - 1"
                    >,</span
                  >
                </template>
              </span>
            </div>
          </div>
          <div
            v-for="item in order.open_items"
            :key="item.id"
            class="grid grid-cols-12 font-medium p-5 items-center border-b border-border last:border-none"
          >
            <div class="col-span-4">
              <div class="flex items-center md:flex-row flex-col gap-2">
                <img
                  src="@/assets/images/open-item.png"
                  :alt="item.name"
                  class="md:w-[50px] w-[30px] md:h-[50px] h-[30px] rounded-xl"
                />
                <p class="truncate md:text-[16px] text-[14px]">
                  {{ item.name }}
                </p>
              </div>
            </div>

            <p class="col-span-3 md:text-[16px] text-[14px]">
              {{ item.price }} {{ pos_store?.currency ?? "" }}
            </p>
            <p class="col-span-2 md:text-[16px] text-[14px]">
              {{ $t("TITLES.Open Item") }}
            </p>
            <p class="col-span-3 md:text-[16px] text-[14px]">
              {{ item.price }} {{ pos_store?.currency ?? "" }}
            </p>
          </div>
        </div>
      </template>
    </v-data-table-virtual> -->
    <table class="w-full rounded-md mb-5">
      <thead class="bg-[#f9fafc] text-sub">
        <th class="text-start rounded-s-lg p-[10px] text-[15px] max-w-[250px]">
          {{ $t("LABELS.Items") }}
        </th>
        <th class="text-start p-[10px] text-[15px]">
          {{ $t("LABELS.Unit Price") }}
        </th>
        <th class="text-start p-[10px] text-[15px]">
          {{ $t("LABELS.Qty") }}
        </th>
        <th class="text-start rounded-e-lg p-[10px] text-[15px]">
          {{ $t("LABELS.amount") }}
        </th>
      </thead>
      <tbody>
        <tr
          class="border-b border-placeholder"
          v-for="item in order.item"
          :key="item.id"
        >
          <td
            class="text-[14px] p-[10px] font-medium w-[300px] flex items-center gap-2"
          >
            <img
              :src="item.image"
              :alt="item.name"
              class="w-[60px] h-[60px] rounded-lg object-cover"
            />
            <div>
              {{ item.name }}
              <div
                v-if="item.combo.length"
                class="bg-[#FCC23014] rounded-lg flex items-center gap-x-2 gap-y-1 flex-wrap my-2"
              >
                <span class="text-[#FCC230]">{{ $t("LABELS.Combo") }}:</span>
                <span v-for="(compo, i) in item.combo" :key="compo.id">
                  {{ compo.qty }}x {{ compo.name }}
                  <span v-if="i != item.combo.length - 1">,</span>
                </span>
              </div>

              <div
                v-if="item.sub_modifiers.length"
                class="bg-[#FCC23014] rounded-lg flex items-center gap-x-2 gap-y-1 flex-wrap my-2"
              >
                <span class="text-[#FCC230]">{{ $t("LABELS.Topping") }}:</span>
                <div
                  v-for="sub_modifier in item.sub_modifiers"
                  :key="sub_modifier.id"
                >
                  <span
                    v-for="(item_modifier, i) in sub_modifier.item_modifiers"
                    :key="item_modifier.id"
                  >
                    <template v-if="item_modifier.qty">
                      {{ item_modifier.qty }}x {{ item_modifier.name }}

                      <span v-if="i != sub_modifier.item_modifiers.length - 1"
                        >,</span
                      >
                    </template>
                  </span>
                </div>
              </div>

              <div class="my-1" v-if="item.note">
                <p class="bg-[#828ABA14] p-3 rounded-2xl font-medium">
                  <span class="font-bold"> {{ $t("TITLES.Note") }}:</span>
                  {{ item.note }}
                </p>
              </div>
            </div>
          </td>
          <td class="text-[14px] p-[10px] font-medium">
            {{ item.sub_total ?? item.item_price.toFixed(2) }}
          </td>
          <td class="text-[14px] p-[10px] font-medium">
            {{ item.qty }}
          </td>
          <td class="text-[14px] p-[10px] font-medium">
            {{ item.total_price.toFixed(2) }}
          </td>
        </tr>
        <tr
          class="border-b border-placeholder"
          v-for="item in order.open_items"
          :key="item.id"
        >
          <td class="text-[14px] p-[10px] font-medium">
            {{ item.name }}
          </td>
          <td class="text-[14px] p-[10px] font-medium">
            {{ item.price.toFixed(2) }}
          </td>
          <td class="text-[14px] p-[10px] font-medium">
            {{ $t("TITLES.Open Item") }}
          </td>
          <td class="text-[14px] p-[10px] font-medium">
            {{ item.price.toFixed(2) }}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="my-5" v-if="order.note">
      <h3 class="font-bold text-xl mb-2">{{ $t("TITLES.Notes") }}</h3>
      <p class="bg-[#828ABA14] p-4 rounded-2xl font-medium">
        {{ order.note }}
      </p>
    </div>
    <div class="flex justify-end md:mt-0 my-5">
      <div class="space-y-3">
        <div class="grid grid-cols-2 gap-12">
          <p class="text-sub font-medium">{{ $t("ORDER.Subtotal") }} :</p>
          <p class="uppercase font-semibold">
            {{ order.price_detail?.total_item_price_after_discount.toFixed(2) }}
            {{ order.price_detail?.currency }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-12">
          <p class="text-sub font-medium">{{ $t("ORDER.VAT") }} :</p>
          <p class="uppercase font-semibold">
            {{ order.price_detail?.tax_rate_value.toFixed(2) || 0 }}
            {{ order.price_detail?.currency }}
          </p>
        </div>

        <div
          class="grid grid-cols-2 gap-12"
          v-if="order.price_detail?.reservation_deposit"
        >
          <p class="text-sub font-medium">
            {{ $t("ORDER.reservation_deposit") }} :
          </p>
          <p class="uppercase font-semibold">
            {{ order.price_detail?.reservation_deposit }}
            {{ order.price_detail?.currency }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-12">
          <p class="text-sub font-medium">{{ $t("LABELS.Surcharge") }} :</p>
          <p class="uppercase font-semibold">
            {{ order.price_detail?.surcharge_value.toFixed(2) || 0 }}
            {{ order.price_detail?.currency }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-12">
          <p class="text-sub font-medium">{{ $t("LABELS.Tips") }} :</p>
          <p class="uppercase font-semibold">
            {{ order.price_detail?.tips_amount.toFixed(2) || 0 }}
            {{ order.price_detail?.currency }}
          </p>
        </div>

        <hr class="border-border w-full" />

        <div class="grid grid-cols-2 gap-12 font-semibold">
          <p class="font-medium">{{ $t("ORDER.Total") }} :</p>
          <p class="uppercase">
            {{ order.price_detail?.total_price.toFixed(2) }}
            {{ order.price_detail?.currency }}
          </p>
        </div>
      </div>
    </div>
    <base-card1 class="p-3" :title="$t('TITLES.Notes')" v-if="order.note">
      <div class="flex justify-between items-center gap-8 flex-wrap">
        <div class="w-full md:max-w-[600px]">
          {{ order.note }}
        </div>

        <div class="w-full md:max-w-[200px]" v-if="order.employee">
          <h3 class="text-sub">{{ $t("LABELS.by") }}</h3>
          <p>{{ order.employee.full_name }}</p>
        </div>
      </div>
    </base-card1>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { usePosStore } from "@/store/pos";
const posStore = usePosStore();
const pos_store = computed(() => posStore.getPosStore);
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const loading = ref(false);
defineProps({
  order: {
    type: Object,
    required: true,
  },
});

const headers = [
  {
    title: t("LABELS.items"),
    align: "start",
    sortable: false,
    key: "name",
  },
  {
    title: t("LABELS.Unit Price"),
    align: "start",
    sortable: false,
    key: "item_price",
  },
  {
    title: t("LABELS.Qty"),
    align: "start",
    sortable: false,
    key: "qty",
  },
  {
    title: t("TITLES.modifiers"),
    align: "start",
    sortable: false,
    key: "modifiers",
  },
  {
    title: t("LABELS.Size"),
    align: "start",
    sortable: false,
    key: "size",
  },
  {
    title: t("LABELS.Total"),
    align: "start",
    sortable: false,
    key: "total_price",
  },
];
</script>

<style lang="scss">
.ordersTable {
  .v-table__wrapper {
    @apply pb-5;
  }
}
</style>
