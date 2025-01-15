<template>
  <base-card1 :title="$t('TITLES.Account Information')">
    <VeeForm
      @click.stop
      as="div"
      @submit="onSubmit"
      :validation-schema="schema"
    >
      <form>
        <div class="grid md:grid-cols-2 gap-2">
          <base-password
            id="oPassword"
            name="oPassword"
            :placeholder="$t('LABELS.oPassword')"
            label="oPassword"
          />

          <div></div>
          <base-password
            id="password"
            name="password"
            :placeholder="$t('LABELS.newPassword')"
            label="newPassword"
          />
          <base-password
            id="cPassword"
            name="cPassword"
            :placeholder="$t('LABELS.cNewPassword')"
            label="cNewPassword"
          />
        </div>

        <div class="flex items-center justify-end">
          <button
            type="submit"
            class="h-[57px] bg-primary !text-white w-full lg:w-[165px] rounded-[10px] disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="btnLoading"
          >
            {{ $t("BUTTONS.save") }}
          </button>
        </div>
      </form>
    </VeeForm>
  </base-card1>
</template>

<script setup>
import * as yup from "yup";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import { useI18n } from "vue-i18n";
import { useAppAuth } from "@/store/auth";

import axios from "axios";
const i18n = useI18n();
const schema = yup.object({
  oPassword: yup.string().required(i18n.t("ERRORS.oPassword")),
  password: yup.string().required(i18n.t("ERRORS.newPassword")),
  cPassword: yup
    .string()
    .when("password", (password, field) =>
      password
        ? field
            .required(i18n.t("ERRORS.confirmNewPassword"))
            .oneOf([yup.ref("password")], i18n.t("ERRORS.notEqualPasswords"))
        : field
    ),
});

const btnLoading = ref(false);

function onSubmit(e, actions) {
  const SUBMITDATA = new FormData();

  SUBMITDATA.append("_method", "put");

  SUBMITDATA.append("current_password", e.oPassword);
  SUBMITDATA.append("password", e.password);
  axios({
    method: "POST",
    url: "profile/update",
    data: SUBMITDATA,
  })
    .then((res) => {
      toast.success(res.data.message);
      btnLoading.value = false;
      actions.resetForm();
    })
    .catch((e) => {
      btnLoading.value = false;
      toast.error(e.response.data.message);
    });
}
</script>
<style scoped>
.inset-xe-3 {
  inset-inline-end: 1rem;
}
</style>
