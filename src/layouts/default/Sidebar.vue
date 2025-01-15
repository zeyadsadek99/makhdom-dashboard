<template>
  <v-navigation-drawer
    v-model="appStore.sidebar"
    :rail="rail"
    permanent
    width="256"
    density="compact"
  >
    <!-- this is comment -->
    <button
      v-if="appStore.sidebar && smallScreen"
      type="button"
      @click="appStore.sidebar = !appStore.sidebar"
      class="me-auto px-2 text-2xl text-primary"
    >
      <i class="fa-solid fa-times"></i>
    </button>
    <v-list-item
      class="top_header hover:bg-transparent !justify-evenly"
      as="div"
      nav
    >
      <router-link to="/">
        <svg-icon path="logo" name="logo" />
      </router-link>
    </v-list-item>

    <v-list density="compact" nav :class="{ railed: rail }">
      <template v-for="(main, mainIndex) in sidebar" :key="mainIndex">
        <template v-if="main">
          <p class="text-sm my-2 text-sub px-4" v-if="main.label">
            <span>
              {{ $t(main.label) }}
            </span>
          </p>
          <v-list-item
            :class="{
              active:
                $route.path.includes(main.active) ||
                ($route.path == '/' && main.active == 'home-page'),
            }"
            v-if="main.type == 'general'"
            :to="`/${main.path}`"
            exact
            class="flex items-center"
          >
            <template v-slot:prepend>
              <svg-icon
                @click="rail = false"
                :class="!rail ? 'me-4' : ''"
                path="sidebar"
                class="text-xl"
                :name="main.icon"
              />
            </template>
            {{ $t(main.title) }}

            <p
              v-if="main.path === 'support-tickets' && appStore.unreadMessages"
              class="bg-error size-4 rounded-full text-[10px] text-white flex items-center justify-center"
            >
              {{ appStore.unreadMessages }}
            </p>
          </v-list-item>
        </template>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import axios from "axios";
import {
  checkRootPermission,
  settings,
  checkPermission,
} from "@/utils/permissions.ts";
import { useAppStore } from "@/store/app";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const appStore = useAppStore();

const unreadMessages = ref(0);
const sidebar = ref([
  // Dashboard
  {
    label: "",
    title: "TITLES.home",
    path: "",
    icon: "dashboard",
    type: "general",
    active: "home-page",
  },

  // Content Management
  {
    label: "Content",
    title: "TITLES.categories",
    path: "categories",
    icon: "grid",
    type: "general",
    active: "categories",
    permission: checkRootPermission(["categories"]),
  },
  {
    label: "",
    title: "LABELS.Sliders",
    path: "sliders",
    icon: "sliders",
    type: "general",
    active: "sliders",
    permission: checkRootPermission(["sliders"]),
  },
  {
    label: "",
    title: "LABELS.page",
    path: "page",
    icon: "pages",
    type: "general",
    active: "page",
    permission: checkRootPermission(["page"]),
  },
  {
    label: "",
    title: "LABELS.Links",
    path: "links",
    icon: "link",
    type: "general",
    active: "links",
    permission: checkRootPermission(["links"]),
  },
  {
    label: "",
    title: "LABELS.Services",
    path: "services",
    icon: "service",
    type: "general",
    active: "services",
    permission: checkRootPermission(["services"]),
  },

  // User & Role Management
  {
    label: "User",
    title: "LABELS.Admins",
    path: "admins",
    icon: "user-shield",
    type: "general",
    active: "admins",
    permission: checkRootPermission(["admins"]),
  },
  {
    label: "",
    title: "LABELS.profile",
    path: "profile",
    icon: "person-circle",
    type: "general",
    active: "profile",
    permission: checkRootPermission(["profile"]),
  },
  {
    label: "",
    title: "LABELS.clients",
    path: "clients",
    icon: "users",
    type: "general",
    active: "clients",
    permission: checkRootPermission(["clients"]),
  },
  {
    label: "",
    title: "LABELS.vendors",
    path: "vendors",
    icon: "users",
    type: "general",
    active: "vendors",
    permission: checkRootPermission(["vendors"]),
  },

  // Orders & Transactions
  {
    label: "Orders",
    title: "LABELS.orders",
    path: "orders",
    icon: "box",
    type: "general",
    active: "orders",
    permission: checkRootPermission(["orders"]),
  },
  {
    label: "",
    title: "LABELS.cancel-order",
    path: "cancel-order",
    icon: "close-circle",
    type: "general",
    active: "cancel-order",
    permission: checkRootPermission(["cancel-order"]),
  },
  {
    label: "",
    title: "LABELS.wallet",
    path: "wallet",
    icon: "wallet",
    type: "general",
    active: "wallet",
    permission: checkRootPermission(["wallet"]),
  },

  // Settings & Configuration
  {
    label: "Settings",
    title: "LABELS.settings",
    path: "settings",
    icon: "settings",
    type: "general",
    active: "settings",
    permission: checkRootPermission(["settings"]),
  },
  {
    label: "",
    title: "LABELS.Countries",
    path: "countries",
    icon: "globe",
    type: "general",
    active: "countries",
    permission: checkRootPermission(["countries"]),
  },
  {
    label: "",
    title: "LABELS.City",
    path: "cities",
    icon: "city",
    type: "general",
    active: "city",
    permission: checkRootPermission(["cities"]),
  },

  // Reports & Analytics
  {
    label: "Reports",
    title: "LABELS.statistics",
    path: "statistics",
    icon: "line-chart",
    type: "general",
    active: "statistics",
    permission: checkRootPermission(["statistics"]),
  },
  {
    label: "",
    title: "LABELS.rate",
    path: "rate",
    icon: "feedback",
    type: "general",
    active: "rate",
    permission: checkRootPermission(["rate"]),
  },

  // Help & Miscellaneous
  {
    label: "Help",
    title: "LABELS.Faqs",
    path: "faqs",
    icon: "question-answer",
    type: "general",
    active: "faqs",
    permission: checkRootPermission(["faqs"]),
  },
]);


const rail = ref(false);
const smallScreen = ref(false);

onMounted(() => {
  if (window.innerWidth < 992) {
    appStore.sidebar = false;
    smallScreen.value = true;
  } else {
    appStore.sidebar = true;
    smallScreen.value = false;
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth < 992) {
      appStore.sidebar = false;
      smallScreen.value = true;
    } else {
      appStore.sidebar = true;
      smallScreen.value = false;
    }
  });
  // getUnreadMessages();
});

watch(
  () => route.path,
  () => {
    if (smallScreen.value) {
      appStore.sidebar = false;
    }
  }
);

function getUnreadMessages() {
  axios
    .get("un-read-messages-count")
    .then((res) => (appStore.unreadMessages = res.data.data.un_read_replies));
}
</script>
<style lang="scss">
.v-navigation-drawer {
  // height: calc(100vh - 55px) !important;
  @apply border-none;
  .v-navigation-drawer__content {
    .top_header {
      height: 130px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .v-list {
      height: calc(100vh - 130px);
      @apply overflow-y-auto px-0;
      .v-list-item {
        @apply mb-0 text-sub  p-4 rounded-none relative font-semibold;
        .v-list-item__content {
          @apply flex items-center gap-1 justify-between;
        }
        &::before {
          content: "";
          @apply w-1 h-full absolute start-0 bg-white;
        }
        .v-list-item__overlay {
          @apply hidden;
        }
        &.active {
          @apply from-primary/30 to-white text-primary;
          &::before {
            @apply bg-primary;
          }
        }
      }
      &.railed {
        .v-list-item {
          @apply rounded-md p-2;
        }
        .v-list-item__prepend {
          > svg {
            margin-inline-end: 10px;
          }
        }
      }
    }
  }
}

body[dir="rtl"] {
  .v-navigation-drawer {
    .v-navigation-drawer__content {
      .v-list {
        .v-list-item {
          &.active {
            @apply bg-primary;
          }
        }
      }
    }
  }
}
</style>
