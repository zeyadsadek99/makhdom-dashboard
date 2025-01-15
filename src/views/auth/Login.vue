<template>
  <div class="flex flex-col flex-1 justify-center">
    <!-- <img
      width="68"
      height="68"
      src="@/assets/images/hands.png"
      alt="hands"
      class="mb-6"
    /> -->
    <h2 class="text-text font-bold mb-4 text-2xl">
      {{ $t("TITLES.welcomeTo") }}
      <span>, {{ $t("TITLES.Login") }}</span>
    </h2>

    <VeeForm class="w-100" @submit="handleSubmit" :validation-schema="schema">
      <div class="space-y-4">
        <base-input
          id="emailAddress"
          name="emailAddress"
          :placeholder="$t('LABELS.Enter', { name: $t('LABELS.email') })"
          icon="envelope"
        />
        <!-- <base-phone
          id="phone"
          name="phone"
          :placeholder="$t('LABELS.phone')"
          :label="$t('LABELS.phone')"
          phoneCode="phone_code"
          :url="GENERAL_URL + '/general/countries'"
        /> -->
        <div class="mt-5 custom_input">
          <base-password
            id="password"
            name="password"
            :placeholder="$t('LABELS.Enter', { name: $t('LABELS.password') })"
            icon="key"
          />
        </div>
      </div>

      <button
        :disabled="loading"
        type="submit"
        class="base-btn w-full py-5 mt-6"
      >
        {{ $t("BUTTONS.login") }}
      </button>
    </VeeForm>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import * as yup from "yup";
import { configure } from "vee-validate";
import { toast } from "vue3-toastify";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import { useAppStore } from "@/store/app";
import { useAppAuth } from "@/store/auth";
const GENERAL_URL = import.meta.env.VITE_GENERAL_URL;
const appStore = useAppStore();
const appAuth = useAppAuth();

const router = useRouter();

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: false,
  validateOnModelUpdate: true,
});

const { t } = useI18n();

const schema = yup.object().shape({
  // phone: yup
  //   .string()
  //   .required(t("ERRORS.isRequired", { name: t("LABELS.phone") }))
  //   .test((value, context) => {
  //     let parent = context.parent.phone_code?.phone_number_limit;

  //     if (value.length > parent || value.length < parent) {
  //       return context.createError({
  //         message: t("ERRORS.phoneLength", { value: parent }),
  //         path: "phoneNumber",
  //       });
  //     } else {
  //       return true;
  //     }
  //   }),
  // phone_code: yup
  //   .object()
  //   .required(t("ERRORS.isRequired", { name: t("LABELS.phoneCode") })),
  emailAddress: yup
    .string()
    .email(t("ERRORS.validEmailAddress"))
    .required(t("ERRORS.emailAddress")),
  password: yup.string().required(t("ERRORS.password")),
});

const loading = ref(false);

type schem = {
  emailAddress: string;
  // phoneNumber: string;
  // phoneCode: string;
  password: string;
};

async function handleSubmit(values: schem) {
  loading.value = true;
  // const platform =
  //   window.navigator.appCodeName + " " + window.navigator.platform;
  await axios
    .post("login", { email: values.emailAddress, password: values.password })
    .then(async (res) => {
      localStorage.setItem("jwt_token_makhdum", res.data.data.token);
      localStorage.setItem("makhdum_user_data", JSON.stringify(res.data.data));

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.data.token}`;
      // await appAuth.getPermissions();
      setTimeout(() => toast.success(res.data.message), 400);

      appAuth.token = res.data.data.token;
      appAuth.userData = res.data.data;
      appAuth.user_type = res.data.data.user_type;
      appStore.is_auth = `Bearer ${res.data.data.token}`;

      const lastPage = localStorage.getItem("lastPage");

      if (lastPage) {
        localStorage.removeItem("lastPage");
        location.href = lastPage;
      } else {
        location.href = "/";
        localStorage.removeItem("lastPage");
      }

      loading.value = false;
    })
    .catch((e) => {
      loading.value = false;

      toast.error(e.response.data.message);
    });
}
</script>

<style lang="scss">
.custom_input {
  input {
    @apply p-5 rounded-full;
  }
}
</style>
