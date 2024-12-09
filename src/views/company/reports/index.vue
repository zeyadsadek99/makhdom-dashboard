<template>
  <div class="home_wrraper border-b border-line">
    <div class="home-content">
      <h2 class="font-bold text-2xl xl:text-3xl mb-5">
        {{ $t("sidebar.reports") }}
      </h2>

      <loader v-if="statisticsLoader" />
      <div class="space-y-5" v-else>
        <base-card class="bg-third-trans">
          <div class="flex flex-wrap justify-between items-center mb-3">
            <div class="flex gap-2 items-center">
              <h2 class="font-semibold text-xl xl:text-2xl">
                {{ $t("LABELS.Date") }}
              </h2>
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
            <button class="base-btn" type="button">
              {{ $t("BUTTONS.export") }}
              <svg-icon name="install2" />
            </button>
          </div>
          <div
            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-4"
          >
            <StaticsCard v-for="item in items" :key="item.title" :data="item" />
          </div>
        </base-card>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-4">
          <base-card
            class="border border-border bg-white col-span-3 xl:col-span-2"
          >
            <h3>{{ $t("LABELS.total_sales_count") }}</h3>
            <Bar
              :data="statistics.total_sales_count"
              class="mt-32"
              :title="$t('LABELS.total_sales_count')"
              :hasIcon="false"
            />
          </base-card>
          <base-card
            class="border border-border bg-white col-span-3 xl:col-span-2"
          >
            <h3>{{ $t("LABELS.total_sales_values") }}</h3>
            <Bar
              :data="statistics.total_sales_values"
              class="mt-32"
              :title="$t('LABELS.total_sales_values')"
              :showStatistics="false"
              :hasIcon="false"
            />
          </base-card>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-4">
          <base-card
            class="border border-border bg-white col-span-3 xl:col-span-2"
          >
            <h3>{{ $t("LABELS.Total app download times") }}</h3>
            <Bar
              :data="statistics.total_sales_values"
              class="mt-32"
              :title="$t('LABELS.App download')"
              :hasIcon="false"
            />
          </base-card>
          <base-card
            class="border border-border bg-white col-span-3 xl:col-span-2"
          >
            <h3>{{ $t("LABELS.Visit the website") }}</h3>
            <Doughnut data="0" />
          </base-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import StaticsCard from "@/components/cards/StaticsCard.vue";
import Bar from "@/components/charts/Bar.vue";
import Doughnut from "@/components/charts/Doughnut.vue";

import { useRouter } from "vue-router";
import { ref, onMounted, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";

const { t } = useI18n();
const dateFilter = ref(null);
const router = useRouter();

const statistics = ref({});

const statisticsLoader = ref(false);

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
  stories: {
    title: t("LABELS.stories num"),
    past_week: 0,
    this_week: 0,
  },
  deals: {
    title: t("LABELS.deals"),
    past_week: 0,
    this_week: 0,
  },
  joining_requests: {
    title: t("LABELS.joining_requests"),
    past_week: 0,
    this_week: 0,
  },
  contacts: {
    title: t("LABELS.Number of complaints"),
    past_week: 0,
    this_week: 0,
  },
});

function getStatistics() {
  statisticsLoader.value = true;
  axios
    .get(`reports`)
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
