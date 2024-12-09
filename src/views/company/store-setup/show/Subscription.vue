<template>
  <base-card1>
    <div class="py-4 flex justify-between items-center border-b border-line">
      <h3 class="text-text flex gap-2 items-center font-semibold text-xl">
        <img
          width="24"
          height="24"
          src="@/assets/images/icons/subscription.png"
          alt="icon"
        />

        {{ $t("TITLES.subscription") }}
      </h3>
      <router-link
        :to="`/store-setup/${item.id}/subscriptions?store_id=${item.id}`"
        class="text-primary font-semibold"
      >
        {{ $t("Subscriptions Details") }}
        <i
          class="fas ms-2"
          :class="$i18n.locale == 'ar' ? 'fa-arrow-left' : 'fa-arrow-right'"
        ></i>
      </router-link>
    </div>
    <div
      v-if="item.subscription_type == 'no_subscription'"
      class="h-full flex flex-col items-center justify-center space-y-6"
    >
      <div class="text-center">
        <h3 class="mt-4 font-semibold text-text text-center">
          {{ item.subscription_status }}
        </h3>
      </div>
    </div>
    <div v-else>
      <div class="overflow-hidden rounded-xl !border !border-line mb-3">
        <div
          class="flex gap-2 justify-between flex-wrap items-end px-4 mt-4 py-4"
        >
          <ul class="item-details">
            <li>
              <div class="name capitalize">
                <svg-icon name="package" />
                {{ $t("LABELS.package") }}:
              </div>
              <div class="text flex gap-2 items-center">
                {{ item.subscription.package.name }}
                <span class="bg-third rounded-md text-primary font-semibold p-2"
                  >{{ item.subscription.price }}$</span
                >
              </div>
            </li>
            <li>
              <div class="name capitalize">
                <img
                  width="20"
                  height="20"
                  src="@/assets/images/icons/calendar.png"
                  alt="icon"
                />
                {{ $t("LABELS.startSubscriptionDate") }}:
              </div>
              <div class="text flex gap-2 items-center">
                {{
                  new Date(item.subscription.start_date).toLocaleDateString(
                    $i18n.locale == "en" ? "en-EG" : "ar-EG",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )
                }}
              </div>
            </li>
            <li>
              <div class="name capitalize">
                <img
                  width="20"
                  height="20"
                  src="@/assets/images/icons/calendar.png"
                  alt="icon"
                />
                {{ $t("LABELS.endSubscriptionDate") }}:
              </div>
              <div class="text flex gap-2 items-center">
                <!-- weekday: "long", -->
                {{
                  new Date(item.subscription.end_date).toLocaleDateString(
                    $i18n.locale == "en" ? "en-EG" : "ar-EG",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )
                }}
                <span
                  class="ms-2 font-semibold"
                  :class="
                    item.subscription_type == 'active'
                      ? 'text-success'
                      : 'text-error'
                  "
                  >{{ item.subscription_status }}</span
                >
              </div>
            </li>
          </ul>
          <button
            v-if="item.subscription_type == 'active'"
            type="button"
            @click="confirmSwith"
            :disabled="btnLoading"
            class="base-btn-red-bg !rounded-md"
          >
            {{ $t("BUTTONS.Cancel Subscription") }}
          </button>
          <!-- <modal>
            ss
          </modal> -->

          <router-link
            :to="`/store-setup/${item.id}/subscription`"
            v-else
            type="button"
            class="base-btn !rounded-md py-2"
          >
            {{ $t("BUTTONS.Renew Subscription") }}
          </router-link>
          <Teleport to="body">
            <Modal
              :title="$t('TITLES.confirmProcess')"
              v-if="openModal"
              @close="openModal = false"
            >
              <img
                width="60"
                class="mx-auto"
                src="@/assets/images/icons/list.png"
                alt="list"
              />
              <h4 class="text-center font-bold text-lg mt-4">
                {{ $t("TITLES.areYouSureCancelSubscription") }}
              </h4>

              <div class="flex items-center justify-center gap-2 mt-5">
                <button
                  type="button"
                  class="capitalize base-btn-white"
                  @click="openModal = false"
                >
                  {{ $t("BUTTONS.cancel") }}
                </button>
                <button
                  :disabled="disabled"
                  type="button"
                  class="capitalize base-btn-red"
                  @click="cancelSubscription(item.subscription.id)"
                >
                  {{ $t("BUTTONS.Cancel Subscription") }}
                </button>
              </div>
            </Modal>
          </Teleport>
        </div>
      </div>
    </div>
  </base-card1>
</template>

<script setup>
import axios from "axios";
import { ref, getCurrentInstance } from "vue";
import { toast } from "vue3-toastify";

// import { inject } from "vue";
const globalVariable = getCurrentInstance();

// import app from "v"
const emitter = globalVariable.appContext.config.globalProperties.emitter;
// import { getcurrentinstance } from "vue";
//
// const app = getcurrentinstance();

// const progressbar = app.appcontext.config.globalproperties.$globalvariable;
const props = defineProps({
  item: {
    required: false,
  },
});
const disabled = ref(false);
const openModal = ref(false);
function confirmSwith() {
  openModal.value = true;
}

const emit = defineEmits(["reload"]);

const btnLoading = ref(false);

function cancelSubscription(id) {
  btnLoading.value = true;
  axios.post(`cancel_subscription/${id}`).then((res) => {
    emit("reload", res.data.data);
    emitter.emit("reload");
    toast.success(res.data.message);
    btnLoading.value = false;
    openModal.value = false;
  });
}
</script>
