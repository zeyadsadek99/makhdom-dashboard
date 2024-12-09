<template>
  <!-- Start Base Filter  -->
  <div class="h-full">
    <div
      class="flex items-center gap-2 justify-between"
      v-if="$route.path == '/scope-settings'"
    >
      <h1 class="page_title">{{ $t("sidebar.settings") }}</h1>
    </div>

    <h2
      class="text-text text-lg font-semibold"
      v-if="$route.path == '/scope-settings'"
    >
      {{ $t("TITLES.scopeSettings") }}
    </h2>

    <div
      class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 mt-11"
      v-if="$route.path == '/scope-settings' && checkRootPermission(settings)"
    >
      <router-link to="/scope-settings/countries/all" class="setting_card">
        <img
          src="@/assets/images/stats/map.png"
          width="80"
          height="70"
          alt="map icon"
        />
        <h3 class="font-bold text-lg">
          {{ $t("TITLES.countries") }}
        </h3>
      </router-link>
      <router-link to="/scope-settings/cities/all" class="setting_card">
        <img
          src="@/assets/images/stats/city.png"
          width="80"
          height="70"
          alt="city icon"
        />
        <h3 class="font-bold text-lg">
          {{ $t("TITLES.Cities") }}
        </h3>
      </router-link>
      <router-link to="/scope-settings/districts/all" class="setting_card">
        <img
          src="@/assets/images/stats/city.png"
          width="80"
          height="70"
          alt="city icon"
        />
        <h3 class="font-bold text-lg">
          {{ $t("LABELS.Districts") }}
        </h3>
      </router-link>
      <router-link to="/scope-settings/blogs" class="setting_card">
        <img
          src="@/assets/images/icons/brand/password.png"
          width="80"
          height="70"
          alt="city icon"
        />
        <h3 class="font-bold text-lg">
          {{ $t("LABELS.Blogs") }}
        </h3>
      </router-link>
      <router-link to="/scope-settings/about" class="setting_card">
        <img
          src="@/assets/images/icons/brand/password.png"
          width="80"
          height="70"
          alt="city icon"
        />
        <h3 class="font-bold text-lg">
          {{ $t("LABELS.About") }}
        </h3>
      </router-link>
      <router-link to="/scope-settings/terms" class="setting_card">
        <img
          src="@/assets/images/icons/brand/password.png"
          width="80"
          height="70"
          alt="city icon"
        />
        <h3 class="font-bold text-lg">
          {{ $t("TITLES.TermsAndConditions") }}
        </h3>
      </router-link>
      <router-link to="/scope-settings/privacy" class="setting_card">
        <img
          src="@/assets/images/icons/brand/password.png"
          width="80"
          height="70"
          alt="Privacy Policy"
        />
        <h3 class="font-bold text-lg">
          {{ $t("TITLES.Privacy Policy") }}
        </h3>
      </router-link>
      <router-link to="/scope-settings/settings" class="setting_card">
        <img
          src="@/assets/images/icons/brand/web.png"
          width="80"
          height="70"
          alt="Privacy Policy"
        />
        <h3 class="font-bold text-lg">
          {{ $t("TITLES.webSettings") }}
        </h3>
      </router-link>
    </div>
    <router-view />
  </div>
</template>

<script setup>
import { checkRootPermission, settings } from "@/utils/permissions";
</script>

<style lang="scss">
.setting_card {
  @apply border-2 border-line rounded-xl flex-col gap-5 p-3 flex justify-center items-center h-[200px];
}
</style>
