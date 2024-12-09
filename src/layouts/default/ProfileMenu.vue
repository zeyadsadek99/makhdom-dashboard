<template>
  <Menu as="div" class="relative inline-block" v-slot="{ open }">
    <MenuButton>
      <div
        class="flex items-center min-w-[220px] border-e-2 px-2 md:px-4 border-line pe-2 gap-2 order-2 md:order-1 py-2"
      >
        <img
          :src="profile.image ?? profile.logo"
          alt="profile-image"
          width="48"
          height="48"
          @error="imgError"
          class="rounded-full object-contain h-12 w-12 border-2 gap-2 border-solid border-white"
        />

        <div>
          <h2 class="text-text font-medium text-start">
            {{ profile.full_name }}
          </h2>
          <p class="mb-0 text-sub text-start">{{ profile.email }}</p>
        </div>
        <i
          class="fa-solid text-lg ms-auto text-sub"
          :class="open ? 'fa-angle-up' : 'fa-angle-down'"
        ></i>
      </div>
    </MenuButton>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        class="absolute min-w-[220px] w-fit origin-top-right divide-y z-30 divide-gray-100 rounded-2xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        :class="$i18n.locale == 'ar' ? 'left-0' : ' right-0'"
      >
        <MenuItem>
          <button
            @click="$router.push('/profile')"
            type="button"
            class="flex items-center py-4 px-5 gap-2 w-full outline-none border-line"
          >
            <svg-icon name="profile" />

            <span class="font-semibold text-text">{{
              $t("BUTTONS.View Profile")
            }}</span>
          </button>
        </MenuItem>

        <MenuItem>
          <button
            @click="logout"
            type="button"
            class="flex items-center py-4 px-5 gap-2 w-full outline-none border-line"
          >
            <svg-icon name="logout" />

            <span class="font-semibold text-error">{{
              $t("BUTTONS.logout")
            }}</span>
          </button>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup>
import axios from "axios";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

import { toast } from "vue3-toastify";
const props = defineProps({
  profile: {
    required: true,
    type: Object,
  },
});

import { useI18n } from "vue-i18n";
import { useAppAuth } from "@/store/auth";

const { t } = useI18n();
const appAuth = useAppAuth();

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

function logout() {
  axios({
    method: "POST",
    url: "logout",
    baseURL: VITE_BASE_URL,
  })
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 400);

      appAuth.logout();
      // router.push("/auth/login");
    })
    .catch((err) => {
      if (err.response?.status == 401) {
        appAuth.logout();
        // router.push("/auth/login");
      }
    });
}
</script>

<style></style>
