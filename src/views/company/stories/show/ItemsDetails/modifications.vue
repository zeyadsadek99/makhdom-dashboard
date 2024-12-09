<template>
  <v-data-table-virtual
    :headers="headers"
    :items="order.modifications"
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
        <h3 class="mt-4 font-semibold text-text text-center">
          {{ $t("LABELS.Order has never been modified") }}
        </h3>
      </div>
      <h3 v-else class="mt-4 font-semibold text-text text-center">
        {{ $t("TITLES.No Search result") }}
      </h3>
    </template>

    <template v-slot:[`item.order_date`]="{ item }">
      <small-details-card :title="item.order_date + item.order_time" />
    </template>
    <template v-slot:[`item.user`]="{ item }">
      <small-details-card :title="item.user?.full_name" />
    </template>
    <template v-slot:[`item.status`]="{ item }">
      <small-details-card :title="item.status" />
    </template>
  </v-data-table-virtual>
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
    title: t("LABELS.createdAt"),
    align: "start",
    sortable: false,
    key: "order_date",
  },
  {
    title: t("LABELS.byWhom"),
    align: "start",
    sortable: false,
    key: "user",
  },
  {
    title: t("LABELS.orderStatus"),
    align: "start",
    sortable: false,
    key: "status",
  },
];
</script>

<style lang="scss"></style>
