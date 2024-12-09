<template>
  <v-app>
    <v-main class="flex flex-col main_app">
      <sidebar />
      <navbar class="z-[1006]" />
      <div class="app_warpper flex-1 p-4">
        <router-view />
      </div>
      <footer class="mt-auto">
        <p class="text-sub py-3 text-center text-sm">
          {{ $t("TITLES.All Copyrights are reserved by") }}

          <bdi>
            <span class="text-primary font-medium"> SUBOLAAYS </span> @{{
              currentYear
            }}
          </bdi>
        </p>
      </footer>
    </v-main>
  </v-app>
</template>

<script setup>
import Navbar from "./Navbar.vue";
import { onMounted, watch } from "vue";
import Sidebar from "./Sidebar.vue";
import { io } from "socket.io-client";
import { toast } from "vue3-toastify";

import { useAppAuth } from "@/store/auth";
import { useAppStore } from "@/store/app";
import { useI18n } from "vue-i18n";
const appStore = useAppStore();

const SOCKET_URL = import.meta.env.VITE_BASE_SOCKET_URL;
const socket = io(SOCKET_URL);

const { locale } = useI18n();

const appAuth = useAppAuth();
onMounted(() => appAuth.getProfile());

watch(
  () => appAuth.userData,
  async (value, old) => {
    if (value?.id != old?.id) {
      appStore.getNotifications();

      setConnection();
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

function setConnection() {
  socket.off(`sybolaays-notification:${appAuth.userData.id}`);
  socket.off(`un-read-messages:${appAuth.userData.id}`);
  socket.on(`sybolaays-notification:${appAuth.userData.id}`, (value) => {
    toast.success(value.title[locale.value], {
      content: value.body[locale.value],
    });
    appStore.unreadNotification += 1;
  });
  socket.on(`un-read-messages:${appAuth.userData.id}`, (value) => {
    appStore.unreadMessages = value.un_read_replies;
  });
}

const currentYear = new Date().getFullYear();
</script>
<style lang="scss">
.main_app {
  min-height: calc(100vh - 55px);
}
.app_warpper {
  > div {
    @apply w-full flex flex-col;
  }
}
</style>
