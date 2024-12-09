<template>
  <div class="mb-11 px-2 lg:container">
    <loader v-if="status === 'pending'" />
    <template v-if="status === 'success'">
      <breadcrumbs
        :items="breads"
        :title="product?.name"
        back="/products"
        class="mb-7"
      />
      <NotFound v-if="error && error.status == 404" />
      <BackError v-else-if="error && error.status == 500" />
      <base-card1 class="" v-else>
        <div class="flex justify-between">
          <div>
            <h3 class="text-2xl text-text font-semibold">
              {{ product.name }}
            </h3>
            <p class="text-text font-medium">#{{ product.id }}</p>
          </div>
          <div class="flex items-center gap-2">
            <p
              class="font-semibold text-sm capitalize rounded-md px-1 py-2 text-center"
              :class="getStatusColor(product.status)"
            >
              {{ $t(`STATUS.${product.status}`) }}
            </p>
            <div
              class="flex items-center mt-1 gap-2"
              v-if="product.status == 'pending'"
            >
              <button
                type="button"
                class="bg-error rounded-full p-2 w-[32px] h-[32px]"
                @click="openCancelModel = true"
              >
                <svg-icon name="refuse" class="m-auto" />
              </button>
              <button
                type="button"
                class="bg-collected rounded-full w-[32px] h-[32px] p-1"
                @click="openConfirmModel = true"
              >
                <svg-icon name="accept" class="m-auto" />
              </button>
              <Teleport to="body">
                <ConfirmModal
                  :disabled="btnConfirmLoading"
                  v-if="openConfirmModel"
                  message=""
                  @cancel="openConfirmModel = false"
                  btn-confirm="base-btn py-4 rounded-xl"
                  button-name="BUTTONS.Yes Accept"
                  @confirm="acceptOrder(product.id)"
                />
              </Teleport>
              <teleport to="body">
                <modal
                  :persist="true"
                  v-if="openCancelModel"
                  :title="t('LABELS.reject order')"
                  @close="resetCancelForm"
                >
                  <VeeForm
                    :validation-schema="schema"
                    @submit="(values) => cancelOrder(values, product.id)"
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
                        :disabled="btnLoading"
                        type="submit"
                      >
                        {{ $t("BUTTONS.save") }}
                      </button>
                    </div>
                  </VeeForm>
                </modal>
              </teleport>
            </div>
          </div>
        </div>
        <div
          class="mt-1 text-end text-error"
          v-if="product.notes && product.status == 'refused'"
        >
          {{ product.notes }}
        </div>

        <ImagesSwiper :product="product" />

        <div class="grid lg:grid-cols-2 gap-8 grid-cols-1 mt-8">
          <div>
            <div>
              <h4 class="text-[#C4C4C4] mb-4">
                {{ $t("LABELS.product desc") }}
              </h4>
              <p class="text-text text-lg">{{ product.desc }}</p>
            </div>
            <div class="my-7 w-[200px] h-[1px] bg-line"></div>
            <div>
              <h4 class="text-[#C4C4C4] mb-4">
                {{ $t("LABELS.Product Features") }}
              </h4>

              <ul class="border border-line rounded-lg">
                <li
                  v-for="feature in product.features"
                  :key="feature.id"
                  class="flex flex-wrap justify-between gap-3 rounded-sm border-b bg-white px-8 py-3 last:border-b-0 odd:bg-[#FCFCFC]"
                >
                  <p class="capitalize text-text">
                    {{ feature.name }}
                  </p>

                  <p class="text-text">
                    {{ feature.value }}
                  </p>
                </li>
              </ul>
            </div>
            <div class="mt-7" v-if="product.intelligence_prices.length">
              <h3 class="mb-4 text-lg font-bold 2xl:text-xl">
                {{ $t("LABELS.Quantity table") }}
                <span class="font-normal text-[#77787B]">{{
                  $t("LABELS.more quantity lower price")
                }}</span>
              </h3>
              <ul
                class="grid w-full max-w-[500px] grid-cols-2 items-center gap-5 rounded-sm border border-line px-5 py-8"
              >
                <li
                  class="flex flex-col items-center"
                  v-for="price in product.intelligence_prices"
                  :key="price.id"
                >
                  <p class="text-xl font-bold capitalize text-text">
                    {{ price.price_per_unit }} {{ $t("SAR") }}
                  </p>

                  <p class="text-xl text-[#707070]">
                    {{ price.min_qty }} - {{ price.max_qty }}
                  </p>
                </li>
                <li class="col-span-2 flex items-center justify-center gap-3">
                  <p class="text-xl font-light capitalize text-[#707070]">
                    {{ $t("LABELS.Based price") }}
                  </p>

                  <p class="text-xl font-light text-[#707070]">
                    {{ product.price.toFixed(2) }} {{ $t("SAR") }}
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div class="space-y-4 lg:border-s-[1px] lg:ps-11 lg:border-line">
            <div>
              <h4 class="text-[#C4C4C4] mb-1">
                {{ $t("LABELS.current price") }}
              </h4>
              <p class="text-2xl font-bold text-text">
                {{ product.price }} {{ $t("SAR") }}
              </p>
            </div>
            <div v-if="product.discount">
              <h4 class="text-[#C4C4C4] mb-1">
                {{ $t("LABELS.active discount") }}
              </h4>

              <p class="text-[#A485C7] flex items-center gap-1">
                <svg-icon name="discount" />
                <span> {{ product.discount }}% </span>

                <span>
                  {{ $t("LABELS.discount") }}
                </span>
              </p>
            </div>
            <div class="flex justify-between flex-wrap" v-if="product.discount">
              <p class="text-[#C4C4C4]">
                {{ $t("LABELS.price before discount") }}
              </p>
              <p class="text-text text-lg">
                ({{ product.price_before_discount }} {{ $t("SAR") }})
              </p>
            </div>

            <div class="my-7 w-[200px] h-[1px] bg-line"></div>
            <div>
              <h4 class="text-[#C4C4C4] mb-1">
                {{ $t("LABELS.Product Status") }}
              </h4>
              <p
                class="text-2xl font-bold"
                :class="
                  product.minimum_stock_notification >= product.quantity
                    ? 'text-error'
                    : 'text-primary'
                "
              >
                <template
                  v-if="product.minimum_stock_notification >= product.quantity"
                >
                  {{ $t("LABELS.Almost sold out") }}
                </template>
                <template v-else>
                  {{ $t("LABELS.Available") }}
                </template>
              </p>
            </div>
            <div>
              <h4 class="text-[#C4C4C4] mb-1">
                {{ $t("LABELS.Available Quantity") }}
              </h4>
              <p
                class="text-2xl font-bold"
                :class="
                  product.minimum_stock_notification >= product.quantity
                    ? 'text-error'
                    : 'text-primary'
                "
              >
                <template
                  v-if="product.minimum_stock_notification >= product.quantity"
                >
                  {{
                    $t("LABELS.Only pieces left", { value: product.quantity })
                  }}
                </template>
                <template v-else>
                  {{ product.quantity }}
                </template>
              </p>
            </div>
          </div>
        </div>
        <div class="mt-5">
          <h4 class="text-[#C4C4C4] mb-1">
            {{ $t("LABELS.Zones") }}
          </h4>
          <div class="flex flex-wrap items-center gap-2">
            <p v-if="product.show_in_all_zones" class="text-primary">
              {{ $t("LABELS.All Zones") }}
            </p>

            <p
              class="text-text text-lg ps-1 border-s first:border-0 border-line"
              v-for="zone in product.zones"
              :key="zone.id"
            >
              {{ zone.name }}
            </p>
          </div>
        </div>
      </base-card1>
    </template>
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
  </div>
</template>

<script setup>
import getStatusColor from "@/utils/getStatusColor.ts";
import ImagesSwiper from "@/components/ImagesSwiper";
import { ref, reactive } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useI18n } from "vue-i18n";
import { onMounted } from "vue";

import * as yup from "yup";
import { toast } from "vue3-toastify";
const { t } = useI18n();
const route = useRoute();

const breads = ref([]);

const product = ref(null);
const error = ref(null);
const status = ref("pending");

function getProductData() {
  axios
    .get(`products/${route.params.id}`)
    .then((res) => {
      product.value = res.data.data;

      breads.value = [
        {
          path: "/",
          imgIcon: "menu-setup.svg",
          name: t("TITLES.home"),
        },
        {
          path: "/products",
          imgIcon: "",
          name: t("LABELS.products"),
        },
        {
          path: `/products/show/${route.params.id}`,
          imgIcon: "",
          name: res.data.data.name,
        },
      ];
    })
    .catch((err) => (error.value = err.response))
    .finally(() => (status.value = "success"));
}

// accept & reject
const openConfirmModel = ref(false);
const btnConfirmLoading = ref(false);
const openCancelModel = ref(false);
const btnCancelLoading = ref(false);
const btnLoading = ref(false);

const failmodal = ref(false);
const failmessage = ref("");

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
  openCancelModel.value = false;
}

function cancelOrder(values, id) {
  btnCancelLoading.value = true;
  const frmData = new FormData();
  frmData.append("status", "refused");
  frmData.append("notes", values.reject_reason);

  axios
    .post(`products/${id}/update-status`, frmData)
    .then((res) => {
      btnCancelLoading.value = false;
      product.value.status = res.data.data.status;

      resetCancelForm();
      toast.success(res.data.message || res.data.messages);
    })
    .catch((err) => {
      btnCancelLoading.value = false;
      toast.error(err.response.data.message);
    });
}

function acceptOrder(id) {
  btnConfirmLoading.value = true;

  axios
    .post(`products/${id}/update-status`, {
      status: "accepted",
    })
    .then((res) => {
      btnConfirmLoading.value = false;
      product.value.status = res.data.data.status;
      openConfirmModel.value = false;
      toast.success(res.data.message || res.data.messages);
    })
    .catch((err) => {
      openConfirmModel.value = false;
      btnConfirmLoading.value = false;

      failmodal.value = true;
      failmessage.value = err.response.data.message;
      setTimeout(() => {
        failmodal.value = false;
        failmessage.value = "";
      }, 3000);
    });
}

onMounted(() => getProductData());
</script>

<style lang="scss">
.story-page {
  @apply relative;
  .tabs {
    @apply rounded-se-lg rounded-ss-lg border border-[#DEDEDE] bg-white px-1 xs:px-4 md:px-6;
    ul {
      @apply flex items-center gap-x-3 xs:gap-x-5 md:gap-x-8;
      li {
        a {
          @apply relative inline-flex py-4 text-[#A9C0D3] transition duration-300 ease-in md:py-7 md:text-lg;
          &::before {
            content: "";
            @apply absolute bottom-0 start-0 h-1 w-0 rounded-md bg-primary;

            transition: all 0.3s ease-in-out;
          }

          &.router-link-active.router-link-exact-active {
            @apply font-bold text-primary;
            &::before {
              @apply w-full;
            }
          }
          &:hover {
            @apply text-primary;
            &::before {
              @apply w-full;
            }
          }
        }
      }
    }
  }
  .page-content {
    @apply mt-3 rounded-lg   bg-white  px-6 py-8;
  }
}
</style>
