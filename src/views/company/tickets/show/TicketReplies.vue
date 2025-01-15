<template>
  <h3 class="text-text flex gap-2 items-center font-semibold text-xl mb-5">
    {{ $t("LABELS.replies") }}
  </h3>
  <base-card1 class="relative border border-border !bg-white">
    <div
      class="mb-5 flex h-[80px] items-center justify-between border-b border-line p-4"
    >
      <div v-if="pending" class="flex items-center gap-2">
        <Skeleton width="3rem" height="3rem" class="rounded-full" />
        <div>
          <Skeleton width="7rem" height="1rem" class="rounded-full" />
        </div>
      </div>

      <template v-else>
        <template v-if="ticket.user">
          <div class="flex items-center gap-3">
            <img
              :src="ticket.user.image"
              class="h-[45px] w-[45px] rounded-full object-cover"
              alt="profile-image"
              @error="imgError"
            />

            <div class="flex flex-col items-start">
              <h5 class="text-md font-medium">
                {{ ticket.user.full_name || "_" }}
              </h5>
            </div>
          </div>
          <div class="flex gap-3">
            <a
              :href="`tel:${ticket.user.phone_code + ticket.user.phone}`"
              class="flex size-9 items-center justify-center rounded-full bg-[#FFF6E5]"
            >
              <svg-icon name="phone" />
            </a>
            <a
              v-if="ticket.user.email"
              :href="`mailto:${ticket.user.email}`"
              class="flex size-9 items-center justify-center rounded-full bg-[#FFF6E5]"
            >
              <svg-icon name="email_address" class="text-primary" />
            </a>
          </div>
        </template>
      </template>
    </div>

    <div class="mt-5">
      <div
        id="messagesContainer"
        class="h-[500px] w-full justify-end overflow-auto px-2 py-3"
      >
        <div v-if="pending" class="flex items-center gap-2">
          <Skeleton width="3rem" height="3rem" class="rounded-full" />
          <div>
            <Skeleton width="9rem" height="2rem" class="rounded-full" />
          </div>
        </div>
        <template v-else>
          <div
            id="messagesContainer"
            class="flex flex-col items-end justify-end"
          >
            <p v-if="!messages.length" class="text-forth w-full text-center">
              {{ $t("LABELS.noMessages") }}
            </p>
            <template v-else>
              <div
                v-for="(message, i) in messages"
                :key="message.id"
                :id="`message${message.id}`"
                class="flex w-full flex-col justify-end gap-2"
                :class="[
                  i !== messages.length - 1 && 'mb-5',
                  message.sender.id !== ticket.user.id
                    ? 'items-end justify-center '
                    : 'items-start',
                ]"
              >
                <div class="flex gap-4">
                  <img
                    :src="message.sender.image"
                    :alt="message.sender.full_name"
                    class="size-10 rounded-full object-cover"
                    :class="
                      message.sender.id !== ticket.user.id
                        ? 'order-2'
                        : 'order-1'
                    "
                  />
                  <p
                    :class="
                      message.sender.id !== ticket.user.id
                        ? 'bg-primary text-white order-1'
                        : 'bg-line text-text order-2'
                    "
                    class="flex min-h-[48px] w-fit items-center justify-center rounded-3xl px-10"
                  >
                    {{ message.content }}
                  </p>
                </div>

                <div class="flex items-center justify-end gap-2">
                  <span class="text-sm text-[#ADB3DA]">{{
                    message.sender.full_name
                  }}</span>
                  <span class="text-sm text-[#ADB3DA]">|</span>
                  <span class="text-sm text-[#ADB3DA]">{{
                    message.created_at
                  }}</span>
                </div>
              </div>
            </template>
          </div>
        </template>
      </div>

      <div
        v-if="ticket.status != 'closed'"
        class="flex items-center justify-between gap-5 rounded-b-lg border-[1px] border-[#D1D1D1] bg-[#FCFCFC] px-6 py-2"
      >
        <div class="flex flex-grow items-center justify-between">
          <input
            type="text"
            class="block h-[60px] w-full bg-transparent outline-none placeholder:text-black"
            v-model.trim="message"
            :placeholder="$t('LABELS.typeYourReply')"
            @keydown.enter="addMessage"
          />
        </div>

        <button
          type="button"
          @click="addMessage"
          :disabled="!message || addMessageLoading"
          class="flex size-11 items-center justify-center rounded-full bg-primary text-xl text-white shadow-lg shadow-primary outline-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg-icon name="send" />
        </button>
      </div>
    </div>
  </base-card1>
</template>

<script setup>
import axios from "axios";
import { toast } from "vue3-toastify";
import { ref, watch, nextTick } from "vue";
import Skeleton from "primevue/skeleton";

import { useRoute } from "vue-router";
const props = defineProps({
  ticket: {
    type: Object,
    require: true,
  },

  pending: {
    type: Boolean,
    default: false,
  },
});

const messages = ref([]);
const route = useRoute();

watch(
  () => props.ticket,
  (value) => {
    if (value) {
      const list = [...value.replies];
      messages.value = list;
      scrollToBottom();
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

const message = ref("");
const addMessageLoading = ref(false);
function addMessage() {
  if (!message.value) return;
  addMessageLoading.value = true;
  const frmData = new FormData();
  const messageTosend = message.value;
  message.value = "";
  frmData.append("reply", messageTosend);

  axios
    .post(`tickets/${route.params.id}/reply`, frmData)
    .then((res) => {
      message.value = "";
      messages.value.push(res.data.data);
      scrollToBottom();
    })
    .catch((e) => {
      message.value = messageTosend;
      toast.error(e.message);
    })
    .finally(() => (addMessageLoading.value = false));
}

function scrollToBottom() {
  nextTick(() => {
    const container = document.getElementById("messagesContainer");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  });
}
</script>
