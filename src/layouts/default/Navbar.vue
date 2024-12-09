<template>
  <header class="base-header relative px-2 md:px-5 py-3">
    <div class="flex justify-between items-center flex-wrap w-full">
      <div class="flex items-center">
        <button
          type="button"
          v-if="!appStore.sidebar"
          @click="appStore.sidebar = !appStore.sidebar"
          class="me-auto px-2 text-2xl text-primary"
        >
          <i class="fa-solid fa-bars"></i>
        </button>
      </div>
      <div class="flex items-center flex-wrap">
        <ProfileMenu v-if="profileData" :profile="profileData" />
        <button
          type="button"
          @click="
            navMenu = true;
            appStore.getNotifications();
          "
          class="top_button"
        >
          <span
            class="notificationLoader"
            v-if="appStore.notificationsLoading"
          ></span>
          <span class="count" v-else-if="appStore.unreadNotification > 0">{{
            appStore.unreadNotification
          }}</span>
          <svg-icon name="notification2" class="text-primary" />
        </button>
        <button
          type="button"
          class="flex items-center px-2 gap-2 text-primary"
          @click="changeLocale"
        >
          <svg-icon name="language-circle" />

          <span class="font-bold">{{ $t(`locale.${locale}`) }}</span>
        </button>

        <teleport to="body">
          <notification-menu @close="navMenu = false" v-if="navMenu" />
        </teleport>
      </div>
    </div>
  </header>
</template>
<script setup>
import { watch, ref, computed } from "vue";
import { useAppStore } from "@/store/app";
import { useAppAuth } from "@/store/auth";
import axios from "axios";
import ProfileMenu from "./ProfileMenu.vue";

import Cookies from "js-cookie";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import NotificationMenu from "@/components/menus/NotificationMenu.vue";

const { locale } = useI18n();
const appStore = useAppStore();
const appAuth = useAppAuth();
const route = useRoute();

const navMenu = ref(false);

function changeLocale() {
  if (locale.value === "ar") {
    Cookies.set("SAAS_DASHBOARD_LANG", "en");
  } else {
    Cookies.set("SAAS_DASHBOARD_LANG", "ar");
  }
  window.location.reload();
}

watch(
  () => route.path,
  () => {
    if (window.innerWidth < 678) {
      appStore.sidebar = false;
    }
  }
);

const profileData = computed(() => appAuth.getUserData);
</script>

<style lang="scss">
header.base-header {
  box-shadow: 35px 0px 58px 0px #b1b1b11a;

  // height: 300px;

  .logo-image {
    animation: rotation infinite 8s linear;
    z-index: 1;
  }
}

@keyframes rotation {
  100% {
    transform: rotate(360deg);
  }
}

.top_button {
  @apply relative flex h-[58px] w-[48px] items-center justify-center rounded-full;
  .count {
    @apply absolute end-4 top-4 flex h-[14px] w-[14px] items-center justify-center rounded-full border-[1px] border-white bg-red text-[9px] text-white;
  }
  .notificationLoader {
    @apply box-border inline-block h-[5px] w-[5px] animate-spin rounded-full border-[1px] border-white border-b-transparent;
  }
}
</style>
