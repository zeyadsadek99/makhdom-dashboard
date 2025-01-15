<template>
  <div class="loyalty-card" v-if="retailer">
    <div class="space-y-4 w-full">
      <base-card1>
        <div class="flex flex-wrap justify-between">
          <div class="flex flex-wrap gap-5">
            <h3
              class="text-text flex gap-2 items-center font-semibold text-xl capitalize"
            >
              {{ $t("TITLES.Details", { name: $t("LABELS.Retailer") }) }}
            </h3>
          </div>
        </div>
        <div class="my-5">
          <div class="grid xl:grid-cols-2 grid-cols-1 gap-y-5">
            <div class="flex flex-col flex-wrap gap-y-5">
              <div class="flex gap-2">
                <svg-icon name="profile" class="mt-1 svgIcon" />
                <div>
                  <h3 class="text-placeholder capitalize">
                    {{ $t("LABELS.Name", { name: $t("LABELS.Retailer") }) }}:
                  </h3>
                  <p class="capitalize font-semibold">
                    {{ retailer?.full_name }}
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
                  <a :href="`tel:${retailer?.phone_complete_form}`">
                    {{ retailer?.phone_complete_form }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </base-card1>

      <base-card1
        :title="$t('TITLES.Details', { name: $t('LABELS.Facility') })"
        v-if="retailer.company"
        class="h-full"
      >
        <div class="my-5">
          <div class="grid xl:grid-cols-2 grid-cols-1 gap-y-5">
            <div class="flex gap-2">
              <svg-icon name="email_address" class="mt-1" />
              <div>
                <h3 class="text-placeholder">
                  {{ $t("LABELS.emailAddress") }}:
                </h3>
                <a
                  :href="`mailto:${retailer.company.email}`"
                  class="font-semibold"
                >
                  {{ retailer.company.email }}
                </a>
              </div>
            </div>

            <div class="flex gap-2">
              <svg-icon name="phone" class="mt-1" />
              <div>
                <h3 class="text-placeholder">{{ $t("LABELS.whatsapp") }}:</h3>
                <div class="text flex !items-center md:gap-2 font-semibold">
                  <a
                    target="_blank"
                    :href="`https://wa.me/${retailer.company.whats}`"
                    class="font-semibold"
                  >
                    {{ retailer.company.whats }}
                  </a>
                </div>
              </div>
            </div>
            <div class="xl:col-span-2">
              <h3 class="text-placeholder">
                {{ $t("LABELS.Commercial Registration No") }}:
              </h3>
              <div class="text flex !items-center md:gap-2 font-semibold">
                <p class="font-semibold">
                  {{ retailer.commercial_registration_number ?? "-" }}
                </p>
                <button
                  type="button"
                  class="text-blue bg-green/10 rounded-full p-1 flex items-center gap-1"
                  v-if="retailer.commercial_registration_number"
                >
                  {{ $t("LABELS.verify") }}
                  <svg
                    width="14"
                    height="10"
                    viewBox="0 0 19 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.34375 0.993164L9.49249 8.94284L17.6412 0.993164"
                      stroke="#BDC1DF"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div class="xl:col-span-2">
              <h3 class="text-placeholder">{{ $t("LABELS.Expiry Date") }}:</h3>
              <div class="text flex !items-center md:gap-2 font-semibold">
                <p class="font-semibold">
                  {{ retailer.commercial_registration_date ?? "-" }}
                </p>
              </div>
            </div>
            <div class="xl:col-span-2" v-if="retailer.shop_image">
              <h3 class="text-placeholder">{{ $t("LABELS.Shop image") }}:</h3>
              <div class="text flex !items-center md:gap-2 font-semibold">
                <small-details-card :image="retailer.shop_image" />
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
const { t } = useI18n();

const props = defineProps({
  retailer: {
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
