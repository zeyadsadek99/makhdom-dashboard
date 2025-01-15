<template>
  <div class="h-full flex flex-col">
    <div
      class="bg-white rounded-3xl h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] md:p-7 flex-1 flex flex-col"
    >
      <base-filter
        v-if="items.length || dataFilterd"
        name="supportTickets"
        :inputs="[]"
        :keyword="true"
        :btn-name="t('LABELS.ticketTypes')"
        icon=""
        @action="showTicketsModal = true"
      />

      <v-data-table-virtual
        :headers="headers"
        :items="items"
        :loading="loading"
        item-value="id"
        class="project-table"
        item-key="id"
      >
        <template v-slot:loading>
          <loader class="py-7" />
        </template>
        <template v-slot:no-data>
          <div class="text-center">
            <h3 class="mt-4 font-semibold text-text text-center">
              {{
                $t("TITLES.No have been Found", {
                  name: $t("LABELS.supportTickets"),
                })
              }}
            </h3>
          </div>
        </template>

        <template v-slot:[`item.id`]="{ item }">
          #{{ item.ticket_number }}
        </template>

        <template v-slot:[`item.client`]="{ item }">
          <small-details-card
            :image="item.user?.image"
            :title="item.user?.full_name"
            :text="item.user?.facility_type?.name"
          />
        </template>
        <template v-slot:[`item.ticket_type`]="{ item }">
          <small-details-card :title="item.ticket_type?.title || null" />
        </template>

        <template v-slot:[`item.status`]="{ item }">
          <p
            class="flex items-center gap-1 text-green"
            v-if="item.status === 'opened'"
          >
            {{ $t("LABELS.Opened") }}
          </p>
          <p
            class="flex items-center gap-1 whitespace-nowrap text-primary"
            v-else
          >
            <span
              class="size-4 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <Check1 width="12" />
            </span>

            {{ $t("LABELS.Closed") }}
          </p>
        </template>

        <template v-slot:[`item.created_at`]="{ item }">
          <small-details-card
            :title="
              new Date(item.created_at).toLocaleDateString(
                locale == 'ar' ? 'ar-eg' : 'en-us',
                {
                  day: 'numeric',
                  month: '2-digit',
                  year: 'numeric',
                }
              )
            "
            :text="
              new Date(item.created_at).toLocaleTimeString(
                locale == 'ar' ? 'ar-eg' : 'en-us',
                {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                }
              )
            "
          />
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <div class="flex gap-3 items-center justify-end">
            <p
              v-if="item.unread_messages"
              class="bg-error size-4 rounded-full text-[10px] text-white flex items-center justify-center"
            >
              {{ item.unread_messages }}
            </p>
            <router-link
              class="text-primary"
              :to="`/support-tickets/show/${item.id}`"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-message-dots"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 11v.01" />
                <path d="M8 11v.01" />
                <path d="M16 11v.01" />
                <path
                  d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3z"
                />
              </svg>
            </router-link>
          </div>
        </template>
      </v-data-table-virtual>
    </div>
    <base-pagination :item="paginator" v-if="paginator" />

    <Reasons v-if="showTicketsModal" @close="showTicketsModal = false" />
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useAppAuth } from "@/store/auth";

import Reasons from "./reasons/index.vue";
import Check1 from "@/components/icons/Check1.vue";
import { io } from "socket.io-client";
const SOCKET_URL = import.meta.env.VITE_BASE_SOCKET_URL;

const { t, locale } = useI18n();

const appAuth = useAppAuth();

const route = useRoute();

const items = ref([]);
const loading = ref(false);

const showTicketsModal = ref(false);
const dataFilterd = ref(false);

const paginator = ref(null);

const headers = [
  {
    title: t("LABELS.ticketNumber"),
    align: "start",
    sortable: false,
    key: "id",
  },
  {
    title: t("LABELS.ticketType"),
    align: "start",
    sortable: false,
    key: "ticket_type",
  },
  {
    title: t("LABELS.ticketDate"),
    align: "start",
    sortable: false,
    key: "created_at",
  },
  {
    title: t("LABELS.Client"),
    align: "start",
    sortable: false,
    key: "client",
  },
  {
    title: t("LABELS.ticketStatus"),
    align: "start",
    sortable: false,
    key: "status",
  },

  {
    title: t("LABELS.Actions"),
    align: "start",
    sortable: false,
    key: "actions",
  },
];

function fetchData() {
  if (route.query.keyword) {
    dataFilterd.value = true;
  }

  const params = new URLSearchParams();

  params.append("page", +route.query.page || 1);
  params.append("keyword", route.query.keyword || "");
  loading.value = true;
  axios
    .get("tickets", {
      params: params,
    })
    .then((res) => {
      items.value = res.data.data;

      paginator.value = res.data.meta;
      setConnection();
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
function setConnection() {
  socket.off(`ticket-list:${appAuth.userData.id}`);
  socket.on(`ticket-list:${appAuth.userData.id}`, (value) => {
    console.log(value);
  });
}

onMounted(() => {
  fetchData();
});
onBeforeUnmount(
  async () => await socket.off(`ticket-list:${appAuth.userData.id}`)
);

watch(
  () => route.query,
  () => {
    fetchData();
  }
);
</script>

<style lang="scss">
.state_card {
  @apply rounded-xl  bg-white p-6 cursor-pointer relative;
  & > button {
    @apply hidden size-8 rounded-full shadow-card absolute start-2 -bottom-4 z-10 bg-primary text-white;
  }
  &.active {
    @apply border border-primary;
    & > button {
      @apply block;
    }
  }
}
</style>
