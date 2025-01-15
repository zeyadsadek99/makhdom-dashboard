<template>
  <div>
    <loader v-if="loading" />
    <NotFound v-if="errResponse?.status === 404" />
    <GlobalError v-else-if="errResponse?.status === 500" />
    <div class="space-y-6" v-else-if="provider">
      <div class="flex flex-wrap justify-between">
        <breadcrumbs
          :items="breads"
          :title="provider?.full_name"
          back="/wholesalers"
        />
      </div>

      <div
        v-if="provider.status == 'pending'"
        class="flex flex-wrap items-center justify-end gap-4"
      >
        <button
          type="button"
          class="base-btn rounded-lg md:py-4"
          @click="openConfirmModel = true"
        >
          {{ $t("BUTTONS.Accept") }}
        </button>

        <button
          type="button"
          @click="openCancelModel = true"
          class="base-btn-red rounded-lg md:py-4"
        >
          {{ $t("BUTTONS.Reject") }}
        </button>
      </div>
      <provider-details :provider="provider" />
      <seller-details :item="provider" />

      <Map
        v-if="provider.company"
        :autoComplete="false"
        :draggable="false"
        :location="{
          lat: provider.company.lat,
          lng: provider.company.lng,
        }"
      />
    </div>
    <Teleport to="body">
      <ConfirmModal
        :disabled="btnConfirmLoading"
        v-if="openConfirmModel"
        message=""
        @cancel="openConfirmModel = false"
        btn-confirm="base-btn py-4 rounded-xl"
        button-name="BUTTONS.Yes Accept"
        @confirm="acceptUser"
      />
    </Teleport>

    <teleport to="body">
      <modal
        :persist="true"
        v-if="openCancelModel"
        :title="t('LABELS.Reject')"
        @close="resetCancelForm"
      >
        <VeeForm
          :validation-schema="schema"
          @submit="cancelUser"
          :initial-values="initialValues"
        >
          <base-input
            id="reject_reason"
            name="reject_reason"
            :placeholder="$t('LABELS.choose')"
            :label="$t('LABELS.Rejection reason')"
            type="textarea"
            rows="4"
          />

          <div class="flex items-center justify-end gap-2">
            <button
              class="white-btn rounded-lg"
              type="button"
              @click="openCancelModel = false"
            >
              {{ $t("BUTTONS.cancel") }}
            </button>
            <button
              class="base-btn rounded-lg py-3"
              :disabled="btnCancelLoading"
              type="submit"
            >
              {{ $t("BUTTONS.save") }}
            </button>
          </div>
        </VeeForm>
      </modal>
    </teleport>
  </div>
</template>

<script setup>
import getStatusColor from "@/utils/getStatusColor.ts";
import Map from "@/components/Map.vue";
import { ref, watch, reactive } from "vue";
import ProviderDetails from "./show/ProviderDetails.vue";
import SellerDetails from "./show/SellerDetails.vue";

import { toast } from "vue3-toastify";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import * as yup from "yup";
import axios from "axios";
const { t } = useI18n();
const route = useRoute();
const loading = ref(true);
const provider = ref(null);
const breads = ref([]);
const errResponse = ref(null);

const openCancelModel = ref(false);
const openConfirmModel = ref(false);
const btnCancelLoading = ref(false);
const btnConfirmLoading = ref(false);
const cancel_reason = ref(null);

function fetchData() {
  loading.value = true;
  errResponse.value = null;
  axios
    .get(`providers/${route.params.id}`)
    .then((res) => {
      provider.value = res.data.data;
      breads.value = [
        {
          path: "/wholesalers",
          imgIcon: "orders.svg",
          name: t("LABELS.Wholesalers"),
        },
        {
          path: `/wholesalers/show/${route.params.id}`,
          imgIcon: "",
          name: provider.value.full_name,
        },
      ];
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
      errResponse.value = err.response;
    });
}

const initialValues = reactive({
  reject_reason: "",
});

const schema = yup.object().shape({
  reject_reason: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.Rejection reason") })),
});
function resetCancelForm() {
  initialValues.reject_reason = "";
  openCancelModel.value = "";
}

function cancelUser(values) {
  btnCancelLoading.value = true;
  const frmData = new FormData();

  frmData.append("status", "refused");
  frmData.append("notes", values.reject_reason);

  axios
    .post(`change-provider-status/${provider.value.id}`, frmData)
    .then((res) => {
      btnCancelLoading.value = false;
      provider.value = res.data.data;
      resetCancelForm();
    })
    .catch((err) => {
      btnCancelLoading.value = false;
      toast.error(err.response.data.message);
    });
}

function acceptUser() {
  btnConfirmLoading.value = true;

  axios
    .post(`change-provider-status/${provider.value.id}`, {
      status: "accepted",
    })
    .then((res) => {
      btnConfirmLoading.value = false;
      provider.value = res.data.data;
      openConfirmModel.value = "";
      toast.success(res.data.message);
    })
    .catch((err) => {
      openConfirmModel.value = "";
      btnConfirmLoading.value = false;

      failmodal.value = true;
      failmessage.value = err.response.data.message;
      setTimeout(() => {
        failmodal.value = false;
        failmessage.value = "";
      }, 3000);
    });
}

watch(
  () => route.params.id,
  () => {
    fetchData();
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss"></style>
