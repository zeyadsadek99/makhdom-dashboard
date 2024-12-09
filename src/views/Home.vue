<template>
  <div class="home_wrraper border-b border-line">
    <div class="home-content">
      <h2 class="font-bold text-2xl xl:text-3xl mb-5">
        {{ $t("TITLES.home") }}
      </h2>

      <loader v-if="statisticsLoader" />
      <div class="space-y-5" v-else>
        <base-card class="bg-third-trans">
          <div
            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-4"
          >
            <StaticsCard v-for="item in items" :key="item.title" :data="item" />
          </div>
        </base-card>
        <div class="grid grid-cols-3 gap-4">
          <base-card1 class="border border-line col-span-3 lg:col-span-1">
            <section-title :title="$t('LABELS.Most popular retailer')" />

            <div class="h-[350px] overflow-y-auto space-y-3 pe-2">
              <div
                v-for="(item, index) in statistics?.most_sold_clients"
                :key="index"
                class="flex flex-wrap items-center justify-between"
              >
                <div class="flex gap-2 items-center">
                  <img
                    :src="item.image"
                    :alt="item.name"
                    class="w-[56px] h-[56px] rounded-full object-cover"
                    @error="imgError"
                  />
                  <div class="flex flex-col">
                    <h4 class="font-semibold">
                      {{ item.name }}
                    </h4>
                    <p class="text-sub">
                      {{ $t("LABELS.Customer since") }}
                      {{
                        new Date(item.created_at).toLocaleDateString(
                          locale == "ar" ? "ar-eg" : "en-us",
                          {
                            day: "numeric",
                            month: "numeric",
                            year: "numeric",
                          }
                        )
                      }}
                    </p>
                  </div>
                </div>
                <p class="font-semibold text-primary">
                  {{ item.total_orders }} {{ $t("SAR") }}
                </p>
              </div>
            </div>
          </base-card1>
          <base-card
            class="border border-border bg-white col-span-3 xl:col-span-2"
          >
            <div class="flex justify-between items-center">
              <h3 class="font-semibold text-lg mb-5">
                {{ $t("LABELS.Site profits") }}
              </h3>
              <div class="flex gap-2 items-center">
                <button
                  :class="{
                    'base-btn': selectedProfitFilter === 'month',
                    'rounded-full text-sub border-[1px] min-w-[140px] px-5 duration-300 py-2 border-[#EEEEEE]':
                      selectedProfitFilter !== 'month',
                  }"
                  type="button"
                  @click="selectedProfitFilter = 'month'"
                >
                  {{ $t("BUTTONS.this month") }}
                </button>

                <button
                  :class="{
                    'base-btn': selectedProfitFilter === 'year',
                    'rounded-full text-sub border-[1px] min-w-[140px] px-5 duration-300 py-2 border-[#EEEEEE]':
                      selectedProfitFilter !== 'year',
                  }"
                  type="button"
                  @click="selectedProfitFilter = 'year'"
                >
                  {{ $t("BUTTONS.this year") }}
                </button>
                <div class="statistcsPage">
                  <base-date
                    :min-date="new Date()"
                    id="date"
                    name="date"
                    icon="calendar"
                    placeholder="MM/LL/DD"
                    label=""
                    type="text"
                    v-model:itemValue="dateFilter"
                  />
                </div>
              </div>
            </div>
            <LineChart />
          </base-card>
        </div>

        <products :products="statistics.products" />
        <stories :products="statistics.stories" />
      </div>
    </div>
  </div>
</template>

<script setup>
import StaticsCard from "@/components/cards/StaticsCard.vue";
import Stories from "@/components/home/Stories";
import Products from "@/components/home/Products";
import LineChart from "@/components/charts/Line.vue";

import { ref, onMounted, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const { t, locale } = useI18n();
const selectedProfitFilter = ref("month");
const statistics = ref({});

const statisticsLoader = ref(false);

const dateFilter = ref(null);

const items = reactive({
  revenues: {
    title: t("LABELS.revenues"),
    past_week: 0,
    this_week: 0,
  },
  orders: {
    title: t("LABELS.orders"),
    past_week: 0,
    this_week: 0,
  },
  wholesale_users: {
    title: t("LABELS.wholesale_users"),
    past_week: 0,
    this_week: 0,
  },
  providers: {
    title: t("LABELS.Retailers Num"),
    past_week: 0,
    this_week: 0,
  },
});

function getStatistics() {
  statisticsLoader.value = true;
  axios
    .get(`home`)
    .then((res) => {
      for (const [key, value] of Object.entries(res.data.data)) {
        if (items.hasOwnProperty(key)) {
          items[key].past_week = value.past_week;
          items[key].this_week = value.this_week;
        }
      }
      statistics.value = res.data.data;
      statisticsLoader.value = false;
    })
    .catch(() => (statisticsLoader.value = false));
}

watch(
  () => dateFilter.value,
  (newValue) => {
    router.push({
      query: { date: newValue },
    });
    getStatistics();
  }
);

onMounted(() => {
  getStatistics();
});
</script>

<style>
.statistcsPage > .input_wrapper input {
  @apply rounded-[50px] py-2 mt-2;
}
</style>
