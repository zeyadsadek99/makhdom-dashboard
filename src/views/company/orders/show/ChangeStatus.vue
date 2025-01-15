<template>
  <div>
    <button
      @click="showModal = true"
      :disabled="btnLoading"
      class="bg-primary/10 rounded-full px-5 py-3 font-medium text-primary"
    >
      {{ t("TITLES.ChangeOrderStatus") }}
    </button>
  </div>
  <teleport to="body">
    <modal
      :persist="true"
      v-if="showModal"
      :hideHeader="true"
      @close="showModal = false"
      classes="!w-full !max-w-[450px]"
    >
      <div class="w-full py-5">
        <h4 class="text-text font-bold text-xl text-center mb-7">
          {{ t("TITLES.ChangeOrderStatus") }}
        </h4>
        <div class="flex flex-col gap-5">
          <button
            @click="acceptOrder(status.value)"
            type="button"
            class="text-center hover:scale-110 transition duration-300 ease-in-out"
            v-for="status in orderStatuses"
            :key="status.value"
            :class="
              current_status === status.value ? 'scale-110 text-primary' : ''
            "
          >
            {{ status.label }}
          </button>
        </div>
      </div>
    </modal>
  </teleport>
  <teleport to="body">
    <notify
      @close="failmodal = false"
      v-if="failmodal"
      class="z-[99999]"
      classes=" px-6  py-11 !w-full  !max-w-[350px]"
    >
      <svg-icon name="warning-2" class="mb-4 mx-auto" />
      <h3 class="text-text font-bold mb-2 text-2xl text-center">
        {{ $t("Sorry") }}
      </h3>
      <p class="text-center text-sub">
        {{ failmessage }}
      </p>
    </notify>
  </teleport>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { toast } from "vue3-toastify";
defineProps({
  current_status: {
    required: true,
    type: String,
  },
});

const route = useRoute();
const emit = defineEmits(["update-status"]);

const { t } = useI18n();
const btnLoading = ref(false);
const failmodal = ref(false);
const failmessage = ref("");
const showModal = ref(false);

const orderStatuses = [
  { value: "admin_processing", label: t("STATUS.admin_processing") },
  { value: "admin_shipping", label: t("STATUS.admin_shipping") },
  { value: "admin_delivered", label: t("STATUS.admin_delivered") },
];

function acceptOrder(status) {
  btnLoading.value = true;

  axios
    .put(`order/${route.params.id}/change_status`, {
      status: status,
    })
    .then((res) => {
      showModal.value = false;
      btnLoading.value = false;
      toast.success(res.data.message);
      if (res.data.data) emit("update-status", res.data.data);
    })
    .catch((err) => {
      showModal.value = false;
      btnLoading.value = false;
      failmodal.value = true;
      failmessage.value = err.response.data.message;
      setTimeout(() => {
        failmodal.value = false;
        failmessage.value = "";
      }, 3000);
    });
}
</script>
