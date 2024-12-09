<template>
  <div class="my-11 px-2 lg:container">
    <loader v-if="loading" />
    <template v-else>
      <breadcrumbs
        :items="breads"
        :title="t('LABELS.Deals')"
        back="/deals"
        class="mb-7"
      />
      <NotFound v-if="error && error.status == 404" />
      <BackError v-else-if="error && error.status == 500" />
      <div class="deal-page" v-else>
        <div class="tabs">
          <ul>
            <li>
              <router-link :to="`/deals/${deal.id}`">{{
                t("TITLES.Deal Details")
              }}</router-link>
            </li>
            <li>
              <router-link :to="`/deals/${deal.id}/products`">{{
                t("TITLES.Products Details")
              }}</router-link>
            </li>
            <li>
              <router-link :to="`/deals/${deal.id}/offers`">{{
                t("TITLES.merchantsOffers")
              }}</router-link>
            </li>
          </ul>
        </div>

        <div class="page-content">
          <router-view :deal="deal" />
        </div>

        <div class="flex items-center justify-between gap-3 mt-4">
          <p
            class="font-semibold text-sm capitalize rounded-full px-6 py-2 text-center"
            :class="getStatusColor(deal.status)"
          >
            {{ $t(`STATUS.${deal.status}`) }}
          </p>
          <div class="flex flex-wrap gap-2" v-if="deal.status == 'pending'">
            <button
              type="button"
              class="bg-error rounded-full p-2 flex items-center gap-2"
              @click="openCancelModel = true"
            >
              {{ $t("BUTTONS.Reject") }}
              <svg-icon name="refuse" class="m-auto" />
            </button>
            <button
              type="button"
              class="bg-collected text-white rounded-full p-2 flex items-center gap-2"
              @click="openConfirmModel = true"
            >
              {{ $t("BUTTONS.Accept") }}
              <svg-icon name="accept" class="m-auto" />
            </button>
          </div>
        </div>
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
        <teleport to="body">
          <ConfirmModal
            :disabled="btnConfirmLoading"
            v-if="openConfirmModel"
            message=""
            @cancel="openConfirmModel = false"
            btn-confirm="base-btn py-4 rounded-xl"
            button-name="BUTTONS.Yes Accept"
            @confirm="acceptOrder(deal.id)"
          />
        </teleport>
        <teleport to="body">
          <modal
            :persist="true"
            v-if="openCancelModel == true"
            :title="t('LABELS.reject deal')"
            @close="resetCancelForm"
          >
            <VeeForm
              :validation-schema="schema"
              @submit="(values) => cancelOrder(values, deal.id)"
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
  </div>
</template>

<script setup>
import { object, string } from "yup";
import { ref, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useI18n } from "vue-i18n";
import { onMounted } from "vue";

const deal = ref(null);
const error = ref(null);
const loading = ref(false);

const route = useRoute();
const { t } = useI18n();

const btnLoading = ref(false);
const failmodal = ref(false);
const failmessage = ref("");
const openConfirmModel = ref(false);
const btnConfirmLoading = ref(false);
const openCancelModel = ref(false);
const btnCancelLoading = ref(false);
const initialValues = reactive({
  reject_reason: "",
});

const breads = ref([]);

const schema = object().shape({
  reject_reason: string().required(
    t("ERRORS.isRequired", { name: t("LABELS.Rejection reason") })
  ),
});
function resetCancelForm() {
  initialValues.reject_reason = "";
  openCancelModel.value = false;
}

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "text-[#FCC230] bg-[#FCC2302D]";
    case "refused":
      return "text-red bg-[#FF445B0D]";
    case "accepted":
      return "text-success bg-[#06D6A01A]";
    default:
      return "text-sub bg-[#9ea1c10D]";
  }
};

function cancelOrder(values, id) {
  btnCancelLoading.value = true;
  const frmData = new FormData();
  frmData.append("status", "refused");
  frmData.append("notes", values.reject_reason);

  axios
    .post(`deals/${id}/update-status`, frmData)
    .then((res) => {
      btnCancelLoading.value = false;

      deal.value.status = res.data.data.status;
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
    .post(`deals/${id}/update-status`, {
      status: "accepted",
    })
    .then((res) => {
      btnConfirmLoading.value = false;
      deal.value.status = res.data.data.status;
      openConfirmModel.value = false;
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

function getDealsData() {
  loading.value = true;

  axios
    .get(`deals/${route.params.id}`)
    .then((res) => (deal.value = res.data.data))
    .catch((err) => (error.value = err.response))
    .finally(() => {
      loading.value = false;
      breads.value = [
        {
          path: "/",
          imgIcon: "menu-setup.svg",
          name: t("TITLES.home"),
        },
        {
          path: "/deals",
          imgIcon: "",
          name: t("LABELS.Deals"),
        },
        {
          path: `/deals/${route.params.id}`,
          imgIcon: "",
          name: "#" + route.params.id,
        },
      ];
    });
}

watch(
  () => route.params.id,
  () => getDealsData(),
  {
    immediate: true,
    deep: true,
  }
);
</script>

<style lang="scss">
.deal-page {
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
    @apply mt-3 rounded-lg  border border-[#DEDEDE] bg-white  px-6 py-8 md:px-8 lg:px-12;
  }
}
</style>
