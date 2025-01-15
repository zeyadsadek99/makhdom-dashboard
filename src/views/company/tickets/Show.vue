<template>
  <div>
    <loader v-if="loading" />
    <div class="space-y-6 order-page-details" v-else>
      <div class="flex flex-wrap justify-between">
        <breadcrumbs
          :items="breads"
          :title="'#' + ticket?.id"
          back="/support-tickets"
          class="mb-7"
        />
      </div>

      <ticket-details v-if="ticket" :ticket="ticket" />
      <ticket-replies :pending="loading" :ticket="ticket" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { io } from "socket.io-client";
import { TicketType } from "./types";
import { onBeforeMount, ref, watch } from "vue";

import TicketDetails from "./show/TicketDetails.vue";
import TicketReplies from "./show/TicketReplies.vue";
const SOCKET_URL = import.meta.env.VITE_BASE_SOCKET_URL;

import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import axios from "axios";
const { t } = useI18n();
const route = useRoute();
const loading = ref<boolean>(true);
const ticket = ref<TicketType>();
const breads = ref<BreadType[]>([]);

function fetchData() {
  loading.value = true;
  axios
    .get(`tickets/${route.params.id}`, {
      params: {
        keyword: route.params.keyword || "",
      },
    })
    .then((res) => {
      ticket.value = res.data.data;

      loading.value = false;
    })
    .catch(() => (loading.value = false));
}

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 1000,
});
function setConnection(id: number) {
  socket.off(`ticket-details:${id}`);
  socket.on(`ticket-details:${id}`, (value) => {
    if (ticket.value) {
      ticket.value.replies = value.replies;
      ticket.value.status = value.status;
    }
  });
}

onBeforeMount(
  async () => await socket.off(`ticket-details:${route.params.id}`)
);

watch(
  () => ticket.value,
  (value) => {
    breads.value = [
      {
        path: "/support-tickets",
        imgIcon: "orders.svg",
        name: t("LABELS.supportTickets"),
      },
      {
        path: `/support-tickets/show/${route.params.id}`,
        imgIcon: "",
        name: `#${value?.id}`,
      },
    ];
  },
  {
    immediate: true,
  }
);
watch(
  () => route.params.id,
  () => {
    fetchData();
    setConnection(+route.params.id);
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss">
.order-page-details {
  .top-header {
    @apply relative mb-7 grid grid-cols-1 gap-3 pb-7  sm:grid-cols-2 lg:grid-cols-4;
    .title {
      @apply mb-2  text-sub;
    }
    .value {
      @apply text-lg text-text;
    }
  }
  .with-border {
    @apply relative;
    &::after {
      content: "";
      @apply absolute bottom-0 start-1/2 h-[1px] w-[90%] -translate-x-1/2 bg-[#D1D1D1];
    }
  }
  .address {
    @apply flex flex-wrap items-center justify-between;
    .location {
      @apply inline-flex items-center gap-2 rounded-full bg-[#F8FBFD] px-5 py-3 text-[#BBBDBF];
    }
  }
  .order-summary {
    @apply flex flex-col;
    li {
      @apply flex flex-wrap items-center justify-between;
      .title {
        @apply mb-0 text-lg;
      }
      .shipping_type {
        font-family: "Aclonica";
      }
    }
  }
}
</style>
