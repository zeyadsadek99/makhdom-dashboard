<template>
  <base-card1 class="border border-border">
    <div class="flex items-center justify-between gap-3 mb-5">
      <h3 class="text-text flex gap-2 items-center font-semibold text-xl">
        {{ $t("TITLES.Details", { name: $t("LABELS.Ticket") }) }}
      </h3>
      <button
        v-if="ticket.status != 'closed'"
        type="button"
        class="rounded-full px-5 py-2 bg-error hover:border-error hover:text-error"
        :disabled="btnLoading"
        @click="confirmModal = true"
      >
        {{ $t("TITLES.closeTicket") }}
      </button>
    </div>
    <teleport to="body">
      <ConfirmModal
        v-if="confirmModal"
        :title="$t('TITLES.closeTicket')"
        :message="$t('TITLES.AreYouDoneComplainingAndWantToClose')"
        @cancel="confirmModal = false"
        @confirm="closeTicket"
        :disabled="btnLoading"
      />
    </teleport>

    <ul class="top-header with-border">
      <li>
        <p class="title">{{ $t("LABELS.ticketNumber") }}</p>
        <p class="value">{{ ticket.ticket_number }}</p>
      </li>
      <li>
        <p class="title">{{ $t("LABELS.ticketDateTime") }}</p>
        <p class="value">
          {{
            new Date(ticket.created_at)
              .toLocaleDateString(locale == "ar" ? "ar-eg" : "en-us", {
                day: "numeric",
                month: "2-digit",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })
              .replace("at", "-")
              .replace("pm", "PM")
              .replace("am", "AM")
          }}.
        </p>
      </li>

      <li>
        <p class="title">{{ $t("LABELS.ticketType") }}</p>
        <p class="value">{{ ticket.ticket_type?.title ?? "-" }}</p>
      </li>
      <li>
        <p class="title">{{ $t("LABELS.ticketStatus") }}</p>

        <p
          class="flex items-center gap-1 text-green"
          v-if="ticket.status === 'opened'"
        >
          {{ $t("LABELS.Opened") }}
        </p>
        <p
          class="flex items-center gap-1 whitespace-nowrap text-primary"
          v-else
        >
          <span
            class="size-4 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <Check1 width="12" />
          </span>

          {{ $t("LABELS.Closed") }}
        </p>
      </li>
    </ul>
    <template v-if="ticket.user">
      <h3 class="mb-3 text-text font-bold text-xl">
        {{ $t("LABELS.Client Details") }}
      </h3>
      <ul class="top-header">
        <li>
          <p class="title">{{ $t("LABELS.Applicant") }}</p>
          <p class="value">{{ ticket.user.full_name }}</p>
        </li>
        <li v-if="ticket.user?.email">
          <p class="title">{{ $t("LABELS.emailAddress") }}</p>
          <p class="value">
            {{ ticket.user.email }}
          </p>
        </li>
        <li>
          <p class="title">{{ $t("LABELS.phoneNumber") }}</p>
          <p class="value">
            {{ ticket.phone }}
          </p>
        </li>
      </ul>
    </template>

    <div class="with-border mb-7 pb-7">
      <h3 class="text-text flex gap-2 items-center font-semibold text-xl mb-5">
        {{ $t("LABELS.TicketDetails") }}
      </h3>

      <p>{{ ticket.content }}</p>
    </div>
  </base-card1>
</template>

<script setup lang="ts">
import { TicketType } from "../types";
import { toRef, ref } from "vue";
import Check1 from "@/components/icons/Check1.vue";
import { useI18n } from "vue-i18n";
import axios from "axios";
import { toast } from "vue3-toastify";
type Props = {
  ticket: TicketType;
};
const props = defineProps<Props>();

const ticket = toRef(props.ticket);

const { locale } = useI18n();
const confirmModal = ref<boolean>(false);

const btnLoading = ref<boolean>(false);

function closeTicket() {
  btnLoading.value = true;

  axios
    .get(`close-ticket/${props.ticket.id}`)
    .then((res) => {
      toast.success(res.data.message);
      confirmModal.value = false;
      ticket.value.status = res.data.data.status;
    })
    .catch((e) => {
      toast.error(e.message);
    })
    .finally(() => (btnLoading.value = false));
}
</script>
