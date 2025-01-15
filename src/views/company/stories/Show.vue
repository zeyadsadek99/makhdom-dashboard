<template>
  <div class="mb-11 px-2 lg:container">
    <loader v-if="status === 'pending'" />
    <template v-if="status === 'success'">
      <breadcrumbs
        :items="breads"
        :title="story?.product?.name"
        back="/stories"
        class="mb-7"
      />
      <NotFound v-if="error && error.status == 404" />
      <BackError v-else-if="error && error.status == 500" />
      <base-card1 class="" v-else>
        <div class="flex justify-between">
          <div>
            <h3 class="text-2xl text-text font-semibold">
              {{ story.product.name }}
            </h3>
            <p class="text-text font-medium">#{{ story.id }}</p>
          </div>
          <div class="flex gap-3 items-center flex-wrap">
            <div class="flex items-center gap-2">
              <p
                class="font-semibold text-sm capitalize rounded-md px-1 py-2 text-center"
                :class="getStatusColor(story.status)"
              >
                {{ $t(`STATUS.${story.status}`) }}
              </p>
              <div
                class="flex items-center mt-1 gap-2"
                v-if="story.status == 'pending'"
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
                    @confirm="acceptOrder(story.id)"
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
                      @submit="(values) => cancelOrder(values, story.id)"
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
            <button
              type="button"
              @click="showStatistics = true"
              class="bg-[#FFF6E5] text-[#47ada9] flex items-center justify-center rounded-full h-11 py-2 px-4"
            >
              {{ $t("LABELS.statistics") }}
            </button>
          </div>
        </div>
        <div
          class="mt-1 text-end text-error"
          v-if="story.notes && story.status == 'refused'"
        >
          {{ story.notes }}
        </div>

        <ImagesSwiper :product="story.product" />

        <div class="grid lg:grid-cols-2 gap-8 grid-cols-1 mt-8">
          <div>
            <div>
              <h4 class="text-[#C4C4C4] mb-4">
                {{ $t("LABELS.product desc") }}
              </h4>
              <p class="text-text text-lg">{{ story.product.desc }}</p>
            </div>
            <div class="my-7 w-[200px] h-[1px] bg-line"></div>
            <div>
              <h4 class="text-[#C4C4C4] mb-4">
                {{ $t("LABELS.Product Features") }}
              </h4>

              <ul class="border border-line rounded-lg">
                <li
                  v-for="feature in story.product.features"
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
          </div>
          <div class="space-y-4 lg:border-s-[1px] lg:ps-11 lg:border-line">
            <div>
              <h4 class="text-[#C4C4C4] mb-1">
                {{ $t("LABELS.current price") }}
              </h4>
              <p class="text-2xl font-bold text-text">
                {{ story.price }} {{ $t("SAR") }}
              </p>
            </div>
            <div>
              <h4 class="text-[#C4C4C4] mb-1">
                {{ $t("LABELS.active discount") }}
              </h4>

              <p class="text-[#A485C7] flex items-center gap-1">
                <svg-icon name="discount" />
                <span> {{ story.discount }}% </span>

                <span>
                  {{ $t("LABELS.discount") }}
                </span>
              </p>
            </div>
            <div class="flex justify-between flex-wrap">
              <p class="text-[#C4C4C4]">
                {{ $t("LABELS.price before discount") }}
              </p>
              <p class="text-text text-lg">
                ({{ story.price_before_discount }} {{ $t("SAR") }})
              </p>
            </div>
            <div class="flex justify-between flex-wrap">
              <p class="text-[#C4C4C4]">
                {{ $t("LABELS.price after discount") }}
              </p>
              <p>({{ story.price }} {{ $t("SAR") }})</p>
            </div>
          </div>
        </div>
      </base-card1>
      <teleport to="body">
        <Modal
          class="z-[1009]"
          :hide-header="true"
          v-if="showStatistics"
          @close="showStatistics = false"
          classes="!w-full !max-w-[1200px]"
        >
          <h4 class="text-center font-bold text-lg mt-4">
            {{ $t("LABELS.statistics") }}
          </h4>
          <p class="text-center text-sub">
            {{ $t("LABELS.Story statistics since its creation until now") }}
          </p>
          <div class="w-3/4 h-[1px] bg-line my-6 mx-auto"></div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-5">
            <base-card class="items-center gap-3 flex flex-col">
              <svg
                width="46"
                height="46"
                viewBox="0 0 46 46"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.0015 2.50674e-05C18.9985 -0.00588817 15.0635 1.03447 11.5866 3.01796C8.10965 5.00145 5.21151 7.85919 3.17948 11.3079C1.14745 14.7566 0.0521024 18.6764 0.00201802 22.6789C-0.0480664 26.6814 0.948855 30.6274 2.89395 34.1259L0.058684 44.0465C-0.0063308 44.2747 -0.0175003 44.5149 0.0260543 44.7481C0.0696089 44.9814 0.166699 45.2013 0.309685 45.3907C0.45267 45.58 0.63765 45.7336 0.850067 45.8393C1.06248 45.9451 1.29654 46.0001 1.53382 46C1.67587 45.9998 1.81723 45.9802 1.95397 45.9417L11.8751 43.1066C14.9456 44.8058 18.3644 45.7796 21.8694 45.9534C25.3745 46.1272 28.8728 45.4964 32.0963 44.1093C35.3199 42.7221 38.1831 40.6156 40.4666 37.9509C42.7502 35.2863 44.3934 32.1343 45.2704 28.7365C46.1475 25.3386 46.235 21.7851 45.5264 18.3483C44.8177 14.9114 43.3317 11.6823 41.1821 8.90845C39.0326 6.13461 36.2766 3.88961 33.1252 2.34547C29.9739 0.801325 26.5109 -0.000979733 23.0015 2.50674e-05ZM32.202 32.2H13.8011C13.3944 32.2 13.0044 32.0385 12.7168 31.7509C12.4292 31.4634 12.2677 31.0733 12.2677 30.6667C12.2677 30.26 12.4292 29.87 12.7168 29.5824C13.0044 29.2949 13.3944 29.1333 13.8011 29.1333H32.202C32.6086 29.1333 32.9987 29.2949 33.2862 29.5824C33.5738 29.87 33.7354 30.26 33.7354 30.6667C33.7354 31.0733 33.5738 31.4634 33.2862 31.7509C32.9987 32.0385 32.6086 32.2 32.202 32.2ZM32.202 24.5333H13.8011C13.3944 24.5333 13.0044 24.3718 12.7168 24.0842C12.4292 23.7967 12.2677 23.4067 12.2677 23C12.2677 22.5933 12.4292 22.2033 12.7168 21.9158C13.0044 21.6282 13.3944 21.4667 13.8011 21.4667H32.202C32.6086 21.4667 32.9987 21.6282 33.2862 21.9158C33.5738 22.2033 33.7354 22.5933 33.7354 23C33.7354 23.4067 33.5738 23.7967 33.2862 24.0842C32.9987 24.3718 32.6086 24.5333 32.202 24.5333ZM32.202 16.8667H13.8011C13.3944 16.8667 13.0044 16.7051 12.7168 16.4176C12.4292 16.13 12.2677 15.74 12.2677 15.3333C12.2677 14.9267 12.4292 14.5367 12.7168 14.2491C13.0044 13.9616 13.3944 13.8 13.8011 13.8H32.202C32.6086 13.8 32.9987 13.9616 33.2862 14.2491C33.5738 14.5367 33.7354 14.9267 33.7354 15.3333C33.7354 15.74 33.5738 16.13 33.2862 16.4176C32.9987 16.7051 32.6086 16.8667 32.202 16.8667Z"
                  fill="url(#paint0_linear_213_4276)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_213_4276"
                    x1="-7.38601"
                    y1="50.8193"
                    x2="37.5715"
                    y2="9.65785"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#47ada9" />
                    <stop offset="1" stop-color="#FFE8BA" />
                  </linearGradient>
                </defs>
              </svg>

              <h4
                class="text-center font-medium text-sm sm:text-base lg:text-lg"
              >
                {{ t("LABELS.Number of inquiries") }}
              </h4>

              <p class="text-primary font-bold">
                {{ story.enquiries_count }} {{ $t("LABELS.inquiry") }}
              </p>
            </base-card>
            <base-card class="items-center gap-3 flex flex-col">
              <svg-icon name="views" />
              <h4
                class="text-center font-medium text-sm sm:text-base lg:text-lg"
              >
                {{ t("LABELS.Number of views") }}
              </h4>
              <p class="text-primary font-bold">
                {{ story.views_count }} {{ $t("LABELS.view") }}
              </p>
            </base-card>
            <base-card class="items-center gap-3 flex flex-col">
              <svg-icon name="likes" />
              <h4
                class="text-center font-medium text-sm sm:text-base lg:text-lg"
              >
                {{ t("LABELS.Number of likes") }}
              </h4>
              <p class="text-primary font-bold">
                {{ story.likes_count }} {{ $t("LABELS.like") }}
              </p>
            </base-card>
            <base-card class="items-center gap-3 flex flex-col">
              <svg-icon name="cart1" />
              <h4
                class="text-center font-medium text-sm sm:text-base lg:text-lg"
              >
                {{ t("LABELS.Number of purchases") }}
              </h4>
              <p class="text-primary font-bold">
                {{ story.orders_count }} {{ $t("LABELS.purchase") }}
              </p>
            </base-card>
          </div>
        </Modal>
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
  </div>
</template>

<script setup>
import getStatusColor from "@/utils/getStatusColor.ts";
import ImagesSwiper from "@/components/ImagesSwiper";
import { ref, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useI18n } from "vue-i18n";

import * as yup from "yup";
import { toast } from "vue3-toastify";
const { t } = useI18n();
const route = useRoute();

const breads = ref([]);

const story = ref(null);
const error = ref(null);
const status = ref("pending");
const showStatistics = ref(false);

function getStoriesData() {
  axios
    .get(`stories/${route.params.id}`)
    .then((res) => {
      story.value = res.data.data;

      breads.value = [
        {
          path: "/",
          imgIcon: "menu-setup.svg",
          name: t("TITLES.home"),
        },
        {
          path: "/stories",
          imgIcon: "",
          name: t("LABELS.stories"),
        },
        {
          path: `/stories/show/${route.params.id}`,
          imgIcon: "",
          name: res.data.data.product.name,
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
    .post(`stories/${id}/update-status`, frmData)
    .then((res) => {
      btnCancelLoading.value = false;
      story.value.status = res.data.data.status;
      toast.success(res.data.message || res.data.messages);

      resetCancelForm();
    })
    .catch((err) => {
      btnCancelLoading.value = false;
      toast.error(err.response.data.message);
    });
}

function acceptOrder(id) {
  btnConfirmLoading.value = true;

  axios
    .post(`stories/${id}/update-status`, {
      status: "accepted",
    })
    .then((res) => {
      btnConfirmLoading.value = false;
      story.value.status = res.data.data.status;
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

onMounted(() => getStoriesData());
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
