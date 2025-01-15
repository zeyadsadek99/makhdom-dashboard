<template>
  <div class="loyalty-card" v-if="provider">
    <div class="space-y-4 w-full">
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
          <div class="grid xl:grid-cols-2 grid-cols-1 gap-y-5">
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
                  <a :href="`tel:${provider?.phone_complete_form}`">
                    {{ provider?.phone_complete_form }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </base-card1>

      <base-card1
        :title="$t('TITLES.Details', { name: $t('LABELS.Facility') })"
        v-if="provider.company"
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
                  :href="`mailto:${provider.company.email}`"
                  class="font-semibold"
                >
                  {{ provider.company.email }}
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
                    :href="`https://wa.me/${provider.company.whats}`"
                    class="font-semibold"
                  >
                    {{ provider.company.whats }}
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
                  {{ provider.commercial_registration_number ?? "-" }}
                </p>
                <button
                  type="button"
                  class="text-blue bg-green/10 rounded-full p-1 flex items-center gap-1"
                  v-if="provider.commercial_registration_number"
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
                  {{ provider.commercial_registration_date ?? "-" }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </base-card1>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";
const { t } = useI18n();

const props = defineProps({
  provider: {
    required: true,
  },
});

function checkValidCommercial(number) {
  axios.get(
    `api.wathq.sa/v1/exp/search/commercialregistrations?crEntityNumber=${number}`,
    {
      headers: {
        apiKey: `1Y0x5pvG9FJh9IzywsXMSgrdcrQqCRAG`,
        Authorization: "YWdaz41tQAWvmkSG",
      },
    }
  );
}

onMounted(() => {
  checkValidCommercial(props.provider?.commercial_registration_number);
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
