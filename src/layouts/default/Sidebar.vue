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
  {
    label: "",
    title: "TITLES.home",
    path: "",
    icon: "dashboard",
    type: "general",
    active: "home-page",
  },
  {
    label: "LABELS.Sliders",
    title: "LABELS.Sliders",
    path: "sliders",
    icon: "brand-settings",
    type: "general",
    active: "sliders",
    permission: checkRootPermission(["sliders"]),
  },
  // {
  //   label: "TITLES.facilities types",
  //   title: "TITLES.facilities",
  //   path: "facility",
  //   icon: "brand-settings",
  //   type: "general",
  //   active: "facility",
  //   permission: checkRootPermission(["facility-types"]),
  // },
  {
    label: "",
    title: "TITLES.main-categories",
    path: "main-categories",
    icon: "brand-settings",
    type: "general",
    active: "main-categories",
    permission: checkRootPermission(["categories"]),
  },
  // {
  //   label: "",
  //   title: "LABELS.Brands",
  //   path: "brands",
  //   icon: "menu-setup",
  //   type: "general",
  //   active: "brands",
  //   permission: checkRootPermission(["brands"]),
  // },

  // {
  //   label: "",
  //   title: "LABELS.Traders Products",
  //   path: "products",
  //   icon: "brand-settings",
  //   type: "general",
  //   active: "products",
  //   permission: checkRootPermission(["products"]),
  // },
  // {
  //   label: "",
  //   title: "LABELS.Traders Stories",
  //   path: "stories",
  //   icon: "brand-settings",
  //   type: "general",
  //   active: "stories",
  //   permission: checkRootPermission(["stories"]),
  // },
  // {
  //   label: "LABELS.Orders And Deals",
  //   title: "LABELS.Deals",
  //   path: "deals",
  //   icon: "brand-settings",
  //   type: "general",
  //   active: "deals",
  //   permission: checkRootPermission(["deals"]),
  // },
  // {
  //   label: "",
  //   title: "LABELS.Orders",
  //   path: "orders",
  //   icon: "brand-settings",
  //   type: "general",
  //   active: "orders",
  //   permission: checkRootPermission(["order"]),
  // },
  // {
  //   label: "",
  //   title: "sidebar.reports",
  //   path: "reports",
  //   icon: "reports1",
  //   type: "general",
  //   active: "reports",
  //   permission: checkRootPermission(["reports"]),
  // },

  // {
  //   label: "LABELS.Wholesalers",
  //   title: "LABELS.Show Wholesalers",
  //   path: "wholesalers",
  //   icon: "OUTLINE",
  //   type: "general",
  //   active: "wholesalers",
  //   permission: checkRootPermission(["providers"]),
  // },
  // {
  //   label: "",
  //   title: "LABELS.JoiningRequests",
  //   path: "wholesalers/requests",
  //   icon: "contract",
  //   type: "general",
  //   active: "wholesalers/requests",
  //   permission: checkRootPermission(["providers"]),
  // },
  // {
  //   label: "",
  //   title: "LABELS.AddWholesaler",
  //   path: "wholesalers/form",
  //   icon: "plus",
  //   type: "general",
  //   active: "wholesalers/form",

  //   permission: checkPermission("providers", "store"),
  // },
  // {
  //   label: "LABELS.Retailers",
  //   title: "LABELS.Show Retailers",
  //   path: "retailers",
  //   icon: "brand-settings",
  //   type: "general",
  //   active: "retailers",
  //   permission: checkRootPermission(["users"]),
  // },
  // {
  //   label: "LABELS.Themes",
  //   title: "LABELS.Themes",
  //   path: "themes",
  //   icon: "brand-settings",
  //   type: "general",
  //   active: "themes",
  //   permission: checkRootPermission(["story_themes"]),
  // },

  // {
  //   label: "LABELS.settings",
  //   title: "LABELS.Shipping and Delivery",
  //   path: "shipping-companies",
  //   icon: "fast",
  //   type: "general",
  //   active: "shipping-companies",
  //   permission: checkRootPermission(["shipping_companies"]),
  // },

  // {
  //   label: "",
  //   title: "LABELS.Cancel Reasons",
  //   path: "cancel-reasons",
  //   icon: "storeSetup",
  //   type: "general",
  //   active: "cancel-reasons",
  //   permission: checkRootPermission(["cancel_reasons"]),
  // },
  // {
  //   label: "",
  //   title: "LABELS.rating-questions",
  //   path: "rating-questions",
  //   icon: "star",
  //   type: "general",
  //   active: "rating-questions",
  //   permission: checkRootPermission(["review_questions"]),
  // },
  // {
  //   label: "",
  //   title: "LABELS.banks",
  //   path: "banks",
  //   icon: "wallet",
  //   type: "general",
  //   active: "banks",
  //   permission: checkRootPermission(["banks"]),
  // },
  // {
  //   label: "",
  //   title: "LABELS.supportTickets",
  //   path: "support-tickets",
  //   icon: "feedback",
  //   type: "general",
  //   active: "support-tickets",
  //   permission: checkRootPermission(["tickets"]),
  //   count: unreadMessages.value,
  // },
  // {
  //   label: "",
  //   title: "LABELS.ManageZones",
  //   path: "zones",
  //   icon: "storeSetup",
  //   type: "general",
  //   active: "zones",
  //   permission: checkRootPermission(["zones"]),
  // },
  // {
  //   label: "",
  //   title: "LABELS.settings",
  //   path: "scope-settings",
  //   icon: "settings",
  //   type: "general",
  //   active: "scope-settings",
  //   permission: checkRootPermission(settings),
  // },
  // {
  //   label: "LABELS.manageTeams",
  //   title: "LABELS.Roles",
  //   path: "roles",
  //   icon: "user-shield",
  //   type: "general",
  //   active: "roles",
  //   permission: checkRootPermission(["role"]),
  // },
  {
    label: "",
    title: "LABELS.Admins",
    path: "admins",
    icon: "user-shield",
    type: "general",
    active: "admins",
    permission: checkRootPermission(["admins"]),
  },
  {
    label: "",
    title: "LABELS.Faqs",
    path: "faqs",
    icon: "user-shield",
    type: "general",
    active: "faqs",
    permission: checkRootPermission(["faqs"]),
  },
  {
    label: "",
    title: "LABELS.wallet",
    path: "wallet",
    icon: "user-shield",
    type: "general",
    active: "wallet",
    permission: checkRootPermission(["wallet"]),
  },
  {
    label: "",
    title: "LABELS.Countries",
    path: "countries",
    icon: "user-shield",
    type: "general",
    active: "countries",
    permission: checkRootPermission(["countries"]),
  },
  {
    label: "",
    title: "LABELS.profile",
    path: "profile",
    icon: "user-shield",
    type: "general",
    active: "profile",
    permission: checkRootPermission(["profile"]),
  },
  {
    label: "",
    title: "LABELS.Services",
    path: "services",
    icon: "user-shield",
    type: "general",
    active: "services",
    permission: checkRootPermission(["services"]),
  },
  {
    label: "",
    title: "LABELS.page",
    path: "page",
    icon: "user-shield",
    type: "general",
    active: "page",
    permission: checkRootPermission(["page"]),
  },
  {
    label: "",
    title: "LABELS.links",
    path: "links",
    icon: "user-shield",
    type: "general",
    active: "links",
    permission: checkRootPermission(["links"]),
  },
  {
    label: "",
    title: "LABELS.cancel-order",
    path: "cancel-order",
    icon: "user-shield",
    type: "general",
    active: "cancel-order",
    permission: checkRootPermission(["cancel-order"]),
  },
  {
    label: "",
    title: "LABELS.vendors",
    path: "vendors",
    icon: "user-shield",
    type: "general",
    active: "vendors",
    permission: checkRootPermission(["vendors"]),
  },
  {
    label: "",
    title: "LABELS.clients",
    path: "clients",
    icon: "user-shield",
    type: "general",
    active: "clients",
    permission: checkRootPermission(["clients"]),
  },
  {
    label: "",
    title: "LABELS.rate",
    path: "rate",
    icon: "user-shield",
    type: "general",
    active: "rate",
    permission: checkRootPermission(["rate"]),
  },
  {
    label: "",
    title: "LABELS.statistics",
    path: "statistics",
    icon: "user-shield",
    type: "general",
    active: "statistics",
    permission: checkRootPermission(["statistics"]),
  },
  {
    label: "",
    title: "LABELS.City",
    path: "cities",
    icon: "user-shield",
    type: "general",
    active: "city",
    permission: checkRootPermission(["cities"]),
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
