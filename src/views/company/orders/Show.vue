<template>
  <div>
    <loader v-if="loading" />
    <div class="space-y-6 order-page-details" v-else>
      <div class="flex flex-wrap justify-between">
        <breadcrumbs
          :items="breads"
          :title="`${t('LABELS.Order Number') + '#' + order.id}`"
          back="/orders"
          class="mb-7"
        />
      </div>
      <OrderStatus :order="order" />
       <order-details :item="order" />
      <!-- <customer-details :item="order" /> -->
      <OrderSummary :order="order" /> 
      <div class="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          class="white-btn capitalize"
          @click="print"
          :disabled="invoiceLoading"
        >
          {{ $t("BUTTONS.print") }}
        </button>
      </div>
    </div>

    <!-- <Teleport to="body">
      <Modal
        classes="!w-full"
        :title="$t('TITLES.Order Invoice')"
        v-if="modalInvoice"
        @close="modalInvoice = false"
      >
        <recept
          :print="printInvoice"
          :hide-details="true"
          v-if="order"
          :invoice="order"
          @printed="close"
        />
      </Modal>
    </Teleport>
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
    </teleport> -->
  </div>
</template>

<script setup>
import OrderStatus from "./show/OrderStatus.vue";
import { ref, watch } from "vue";
import CustomerDetails from "./show/CustomerDetails.vue";
import OrderDetails from "./show/OrderDetails.vue";
import Recept from "@/components/order/Recept.vue";
import OrderSummary from "./show/OrderSummary.vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import axios from "axios";
const { t } = useI18n();
const route = useRoute();
const loading = ref(true);

const order = ref(null);
const breads = ref([]);

const invoiceLoading = ref(false);
const printInvoice = ref(false);
const modalInvoice = ref(false);
const failmodal = ref(false);
const failmessage = ref("");

function fetchData() {
  loading.value = true;
  axios
    .get(`orders/${route.params.id}`)
    .then((res) => {
      order.value = res.data.data;
      loading.value = false;
    })
    .catch(() => (loading.value = false));
}

function print() {
  printInvoice.value = true;
  modalInvoice.value = true;
  invoiceLoading.value = true;
}
function close() {
  printInvoice.value = false;
  modalInvoice.value = false;
  invoiceLoading.value = false;
}

watch(
  () => order.value,
  (value) => {
    breads.value = [
      {
        path: "/orders",
        imgIcon: "orders.svg",
        name: t("LABELS.orders"),
      },
      {
        path: `/orders/show/${route.params.id}`,
        imgIcon: "",
        name: `${t("LABELS.Order Number")} #${value?.id}`,
      },
    ];
  },
  {
    immediate: true,
  }
);
watch(
  () => route.params.id,
  () => {
    fetchData();
  },
  {
    immediate: true,
  }
);

// onMounted(() => {
//   fetchData();
//   fetchCancelReasons();
// });
</script>

<style lang="scss">
.order-page-details {
  .top-header {
    @apply relative mb-7 grid grid-cols-1 gap-3 pb-7  sm:grid-cols-2 lg:grid-cols-4;
    .title {
      @apply mb-2  text-sub;
    }
    .value {
      @apply text-lg text-text;
    }
  }
  .with-border {
    @apply relative;
    &::after {
      content: "";
      @apply absolute bottom-0 start-1/2 h-[1px] w-[90%] -translate-x-1/2 bg-[#D1D1D1];
    }
  }
  .address {
    @apply flex flex-wrap items-center justify-between;
    .location {
      @apply inline-flex items-center gap-2 rounded-full bg-[#F8FBFD] px-5 py-3 text-[#BBBDBF];
    }
  }
  .order-summary {
    @apply flex flex-col;
    li {
      @apply flex flex-wrap items-center justify-between;
      .title {
        @apply mb-0 text-lg;
      }
      .shipping_type {
        font-family: "Aclonica";
      }
    }
  }
}
</style>
