<template>
  <v-app>
    <v-layout>
      <v-main>
        <div class="flex min-h-[100vh]">
          <!-- <div
            class="auth_bg w-[650px] 3xl:w-[800px] hidden xl:flex flex-col relative"
          >
            <img
              src="@/assets/images/bg/auth_photo.png"
              alt=""
              class="mt-auto max-w-[700px]"
            />
          </div> -->
          <div
            class="w-full auth_wrapper flex flex-col px-10 max-w-[600px] mx-auto space-y-9 overflow-y-auto"
          >
            <Navbar />
            <RouterView />
          </div>
        </div>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup>
import Navbar from "@/layouts/auth/Navbar.vue";
</script>
<style lang="scss" scoped>
.auth_bg {
  background: url("@/assets/images/bg/auth_bg.png");
  @apply bg-no-repeat bg-cover;
}
.auth_wrapper {
  @media (max-width: 1200px) {
    @apply mx-auto p-4;
  }
}
</style>
