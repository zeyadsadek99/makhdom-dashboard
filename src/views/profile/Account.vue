<template>
  <FormSkelton v-if="loading" />
  <template v-else>
    <base-card1 :title="$t('TITLES.Account Information')">
      <VeeForm
        as="div"
        :validation-schema="schema"
        @submit="handleSubmit"
        :initial-values="initialValues"
      >
        <form class="profile_page mt-11">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div class="md:col-span-2 relative">
              <base-file
                modalName="users"
                modalType="image"
                id="image"
                name="image"
                :placeholder="$t('LABELS.image')"
                label=""
                v-model:itemValue="initialValues.preview"
                v-model:image="initialValues.image"
                accept="image/png, image/webp, image/jpeg"
                :no_preview="true"
              />

              <label
                for="image"
                class="w-10 h-10 bg-primary rounded-full flex justify-center items-center absolute bottom-2"
                :class="$i18n.locale == 'en' ? 'left-[120px]' : 'right-[120px]'"
              >
                <img
                  class="!object-contain"
                  src="@/assets/images/icons/solar_upload-linear.png"
                  alt="solar icon"
                />
              </label>
            </div>
            <base-input
              id="name"
              name="name"
              :placeholder="$t('LABELS.name')"
              :label="$t('LABELS.name')"
              type="text"
            />

            <base-input
              id="email"
              name="email"
              :placeholder="$t('LABELS.email')"
              :label="$t('LABELS.email')"
              type="text"
            />

            <base-phone
              id="phoneNumber"
              name="phoneNumber"
              url="countries-without-paginated"
              :placeholder="$t('LABELS.phone')"
              phoneCode="phoneCode"
              v-model:phone_code="initialValues.phoneCode"
            />
          </div>

          <div class="flex items-center justify-end mt-3">
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
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import * as yup from "yup";
import { toast } from "vue3-toastify";
import { useI18n } from "vue-i18n";
import axios from "axios";
import { useAppAuth } from "@/store/auth";
const loading = ref(true);
const btnLoading = ref(false);
const appAuth = useAppAuth();
const { t } = useI18n();

const initialValues = reactive({
  name: "",
  email: "",
  phoneNumber: "",
  preview: "",
  phoneCode: "",
  image: "",
});

const schema = yup.object().shape({
  name: yup.string().required(t("ERRORS.name")),
  email: yup.string().required(t("ERRORS.emailAddress")),
  phoneCode: yup.mixed().required(t("ERRORS.phoneCode")),
  phoneNumber: yup.string().required(t("ERRORS.phoneNumber")),
  image: yup
    .mixed()
    .test(
      "image",
      t("ERRORS.isRequired", { name: t("LABELS.image") }),
      (value) => {
        if (value || initialValues.preview) {
          return true;
        }
      }
    ),
});

function handleSubmit(values) {
  btnLoading.value = true;
  const frmData = new FormData();

  if (initialValues.image) {
    frmData.append("image", initialValues.image);
  }
  frmData.append("_method", "PUT");
  frmData.append("full_name", values.name);
  frmData.append("phone", values.phoneNumber);
  frmData.append("phone_code", values.phoneCode.phone_code);
  frmData.append("email", values.email);

  axios({
    method: "POST",

    url: "profile/update",
    data: frmData,
  })
    .then((res) => {
      toast.success(res.data.message);
      const result = res.data.data;
      initialValues.name = result.full_name;
      initialValues.email = result.email;
      initialValues.phoneNumber = result.phone;
      initialValues.phoneCode = result.phone_code;
      initialValues.preview = result.image;
      initialValues.image = "";
      appAuth.userData = result;

      btnLoading.value = false;
    })
    .catch((e) => {
      btnLoading.value = false;
      toast.error(e.response.data.message);
    });
}

function getData() {
  axios({
    method: "GET",
    url: "profile",
  }).then((res) => {
    const result = res.data.data;

    localStorage.setItem("makhdum_user_data", JSON.stringify(result));
    initialValues.name = result.full_name;
    initialValues.email = result.email;
    initialValues.phoneNumber = result.phone;
    initialValues.phoneCode = result.country;
    appAuth.userData = result;
    initialValues.preview = result.image ?? result.logo;
    loading.value = false;
  });
}

onMounted(() => {
  getData();
});
</script>

<style lang="scss">
.profile_page {
  .upload {
    padding: 0;
    width: 180px;
    height: 180px;
    border-radius: 50% !important;
    overflow: hidden;
    label {
      padding: 0;
      margin: 0;
      width: 180px;
      height: 180px;
      @apply bg-white;
    }
    img {
      // width: 100% !important;
      // height: 100% !important;
      //object-fit: cover !important;
      @apply object-contain;
      border-radius: 50% !important;
    }
  }
}
</style>
