<template>
  <div v-if="storeData" class="store-subscription-page h-full">
    <!-- bg-[url(~/assets/images/overlay.png)] -->
    <breadcrumbs
      :icon="storeData.image"
      :items="breads"
      :title="storeData[$i18n.locale].name"
      :back="`/store-setup/${$route.params.id}`"
    />

    <div
      class="flex flex-col xl:flex-row gap-7 flex-wrap mx-auto xl:mx-0 max-w-[600px] xl:max-w-[1060px]"
    >
      <div class="visa_card w-full max-w-[360px]">
        <div class="top_header p-4 flex flex-col justify-evenly items-start">
          <img src="@/assets/images/icons/union.svg" alt="" />
          <p class="text-text font-bold text-2xl self-center">
            **** **** **** 4244
          </p>
        </div>
        <div class="p-4 flex justify-between items-start bg-white">
          <div class="mt-1">
            <h3 class="text-text mb-1 font-medium text-sm">
              {{ storeData[$i18n.locale].name }}
            </h3>
            <p class="text-sm">{{ expDate }}</p>
          </div>
          <img src="@/assets/images/icons/visa_logo.png" alt="" />
        </div>
      </div>
      <div class="flex-1 max-w-[700px]">
        <VeeForm
          as="div"
          :validation-schema="schema"
          @submit="handleSubmit"
          :initial-values="initialValues"
        >
          <form>
            <div class=" ">
              <div class="mb-3">
                <h3 class="text-sm text-sub mb-2">
                  {{ $t("LABELS.Subscription") }}
                </h3>
                <div class="flex flex-wrap items-center gap-5">
                  <VeeField
                    name="subscription"
                    type="radio"
                    v-slot="{ field, meta }"
                    value="month"
                    v-model="subscription_type"
                  >
                    <div
                      class="w-fit"
                      :class="{
                        error: !meta.valid && meta.touched,
                      }"
                    >
                      <label
                        for="Monthly Subscription"
                        class="flex gap-2 items-center w-fit"
                      >
                        <input
                          name="subscription"
                          id="Monthly Subscription"
                          v-bind="field"
                          type="radio"
                          value="month"
                          class="w-5 h-5"
                        />
                        <span class="text-lg">
                          {{ $t("LABELS.Monthly Subscription") }}
                        </span>
                      </label>
                    </div>
                  </VeeField>
                  <VeeField
                    name="subscription"
                    type="radio"
                    v-slot="{ field, meta }"
                    value="year"
                    v-model="subscription_type"
                  >
                    <div
                      :class="{
                        error: !meta.valid && meta.touched,
                      }"
                    >
                      <label
                        for="Yearly Subscription"
                        class="flex gap-2 items-center"
                      >
                        <input
                          name="subscription"
                          id="Yearly Subscription"
                          v-bind="field"
                          type="radio"
                          value="year"
                          class="w-5 h-5"
                        />
                        <span class="text-lg">
                          {{ $t("LABELS.Yearly Subscription") }}
                        </span>
                      </label>
                    </div>
                  </VeeField>
                </div>
                <VeeErrorMessage
                  name="subscription"
                  as="div"
                  class="text-error"
                />
              </div>

              <base-select
                id="package"
                name="package"
                :placeholder="$t('LABELS.package')"
                :label="$t('LABELS.package')"
                type="text"
                icon="package"
                url="packages"
                :disabled="!subscription_type"
                :custom-name="`${subscription_type}ly_price`"
                custom-icon=" $ "
                :filter="null"
                :multiple="false"
                v-model:itemValue="initialValues.package"
              />

              <base-input
                id="cardName"
                name="cardName"
                :placeholder="$t('LABELS.cardHolderName')"
                :label="$t('LABELS.cardHolderName')"
                type="text"
                icon="profile_sub"
              />

              <base-input
                id="cardNumber"
                name="cardNumber"
                :placeholder="$t('LABELS.Card number')"
                :label="$t('LABELS.Card number')"
                type="text"
                icon="card"
              />
              <div class="grid grid-cols-2 gap-2">
                <base-date
                  id="expDate"
                  name="expDate"
                  :placeholder="$t('LABELS.Expiry date')"
                  :label="$t('LABELS.Expiry date')"
                  type="text"
                  icon="calendar"
                  :monthPicker="true"
                  v-model:itemValue="expDate"
                />

                <base-input
                  id="cvv"
                  name="cvv"
                  :placeholder="$t('LABELS.CVV')"
                  :label="$t('LABELS.CVV')"
                  type="text"
                  icon="cvv"
                />
              </div>
            </div>

            <div class="flex items-center gap-4 justify-end mt-3">
              <router-link
                class="text-sub capitalize font-semibold"
                :disabled="isLoading"
                to="/store-setup/1"
              >
                {{ $t("BUTTONS.cancel") }}
              </router-link>
              <button
                type="submit"
                class="h-[50px] bg-primary !text-white w-full lg:w-[188px] rounded-[10px] disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="isLoading"
              >
                {{ $t("BUTTONS.Subscribe Now") }}
              </button>
            </div>
          </form>
        </VeeForm>
      </div>
    </div>
  </div>
</template>

<script setup>
import icon from "@/assets/images/brand.png";
import axios from "axios";
import { configure, useField } from "vee-validate";
import { useRoute, useRouter } from "vue-router";
import * as yup from "yup";
import { toast } from "vue3-toastify";
import { onMounted, ref, reactive } from "vue";
import { useI18n } from "vue-i18n";

const { locale, t } = useI18n();
const props = defineProps({
  storeData: {
    required: true,
  },
});

const expDate = ref("");

const breads = [
  {
    path: "/store-setup",
    imgIcon: "storeSetup.svg",
    name: t("sidebar.storeSetup"),
  },
  {
    path: `/store-setup/${props.storeData.id}/show`,
    imgIcon: "",
    name: props.storeData[locale.value].name,
  },
  {
    path: `/store-setup/${props.storeData.id}/subscription`,
    imgIcon: "",
    name: t("SubscriptionDetails"),
  },
];
const router = useRouter();
const route = useRoute();
const phone_country = ref("");

const initialValues = reactive({
  package: "",
  subscription: "",
  cardName: "",
  cardNumber: "",
  expDate: "",
  cvv: "",
});

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: false,
  validateOnModelUpdate: true,
});

const schema = yup.object().shape({
  subscription: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.Subscription") })),
  package: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.package") })),
  cardName: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.cardHolderName") })),
  cardNumber: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.Card number") })),
  expDate: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.Expiry date") })),
  cvv: yup.string().required(t("ERRORS.isRequired", { name: t("LABELS.CVV") })),
});

const isLoading = ref(false);
const loading = ref(false);
const subscription_type = ref("");
function handleSubmit(values) {
  isLoading.value = true;

  const frmData = new FormData();

  frmData.append("package_id", values.package);
  frmData.append("store_id", props.storeData.id);
  frmData.append("type", values.subscription);

  axios
    .post("subscribe", frmData)
    .then((res) => {
      // setTimeout(() => toast.success(res.data.message), 500);
      confirmPayment(res.data.data);
    })
    .catch((e) => {
      toast.error(e.response.data.message);
    })
    .finally(() => (isLoading.value = false));
}
function confirmPayment(res) {
  isLoading.value = true;

  const frmData = new FormData();

  frmData.append("subscription_id", res.id);
  frmData.append("transaction_id", "231231521522");

  axios
    .post("subscribe_confirm", frmData)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 500);

      router.push(`/store-setup/${props.storeData.id}/show`);
    })
    .catch((e) => {
      toast.error(e.response.data.message);
    })
    .finally(() => (isLoading.value = false));
}

// function getData() {
//   loading.value = true;

//   axios
//     .get(`subscriptions/${route.params.id}`)
//     .then((res) => {
//       const result = res.data.data;
//       initialValues.package = result.package.id;
//       initialValues.subscription = result.type;

//       loading.value = false;
//     })
//     .catch(() => (loading.value = false));
// }
// onMounted(() => getData());
</script>

<style lang="scss">
.store-subscription-page {
  .input_wrapper {
    input,
    .p-dropdown-label {
      @apply py-5;
    }
    label {
      @apply text-sub;
    }
  }
  .p-dropdown-clear-icon {
    top: 30px;
  }
  .visa_card {
    box-shadow: 0px 7px 58px 0px #b1b1b11a;
    @apply rounded-3xl;

    .top_header {
      @apply h-[135px];
      background: url("@/assets/images/bg/visaBg.png");
      background-position: center center;
      background-size: cover;
    }
  }
}
</style>
