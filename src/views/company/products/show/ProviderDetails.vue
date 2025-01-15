<template>
  <div class="loyalty-card" v-if="provider">
    <div class="grid md:grid-cols-2 grid-cols-1 gap-4 w-full">
      <base-card1>
        <div class="flex flex-wrap justify-between">
          <div class="flex flex-wrap gap-5">
            <h3
              class="text-text flex gap-2 items-center font-semibold text-xl capitalize"
            >
              {{ $t("TITLES.Details", { name: $t("LABELS.wholesaler") }) }}
            </h3>
          </div>
        </div>
        <div class="my-5">
          <div class="grid md:grid-cols-2 grid-cols-1 gap-y-5">
            <div class="flex flex-col flex-wrap gap-y-5">
              <div class="flex gap-2">
                <svg-icon name="profile" class="mt-1 svgIcon" />
                <div>
                  <h3 class="text-placeholder capitalize">
                    {{ $t("LABELS.Name", { name: $t("LABELS.wholesaler") }) }}:
                  </h3>
                  <p class="capitalize font-semibold">
                    {{ provider?.full_name }}
                  </p>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <svg-icon name="phone" class="mt-1" />
              <div>
                <h3 class="text-placeholder">
                  {{ $t("LABELS.phoneNumber") }}:
                </h3>
                <div class="text flex !items-center md:gap-2 font-semibold">
                  <img
                    width="24"
                    height="24"
                    :src="provider.country?.image"
                    :alt="provider.country?.name"
                  />
                  <a
                    :href="`tel:${
                      provider?.country?.phone_code + provider?.phone
                    }`"
                  >
                    <span>+{{ provider?.country?.phone_code }}</span>
                    {{ provider?.phone }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </base-card1>

      <base-card1 v-if="provider.store" class="h-full">
        <div class="my-5">
          <div class="grid md:grid-cols-2 grid-cols-1 gap-y-5">
            <div class="flex flex-col flex-wrap gap-y-5">
              <div class="flex gap-2">
                <svg-icon name="email_address" class="mt-1" />
                <div>
                  <h3 class="text-placeholder">
                    {{ $t("LABELS.emailAddress") }}:
                  </h3>
                  <a :href="`mailto:-`" class="font-semibold"> - </a>
                </div>
              </div>
              <div class="flex gap-2">
                <input-icon name="key" class="mt-1" />

                <div>
                  <h3 class="text-placeholder">{{ $t("LABELS.password") }}:</h3>
                  <p class="capitalize font-semibold">-</p>
                </div>
              </div>
            </div>
            <div class="flex flex-col flex-wrap gap-y-5">
              <div class="flex gap-2">
                <svg-icon name="phone" class="mt-1" />
                <div>
                  <h3 class="text-placeholder">
                    {{ $t("LABELS.phoneNumber") }}:
                  </h3>
                  <div class="text flex !items-center md:gap-2 font-semibold">
                    -
                    <!-- <img
                        width="24"
                        height="24"
                        :src="provider?.brand_country?.image"
                        :alt="provider?.brand_country?.name"
                      />
                      <a
                        :href="`tel:${
                          provider?.brand_country?.phone_code +
                          provider?.phone
                        }`"
                      >
                        <span
                          >+{{ provider?.brand_country?.phone_code }}</span
                        >
                        {{ provider?.phone }}
                      </a> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </base-card1>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import * as yup from "yup";
import axios from "axios";
import { toast } from "vue3-toastify";
const { t } = useI18n();

const props = defineProps({
  provider: {
    required: true,
  },
});
</script>

<style lang="scss">
.loyalty-card {
  .svgIcon {
    path {
      @apply fill-sub;
    }
  }
  .item-details {
    li {
      .name {
        @apply w-[170px] flex gap-2 items-center;
      }
    }
  }
}
</style>
