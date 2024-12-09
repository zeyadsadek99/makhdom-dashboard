<template>
  <div class="h-full flex flex-col">
    <div
      class="bg-white rounded-3xl h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] md:p-7 flex-1 flex flex-col"
    >
      <h2 class="font-extrabold text-3xl mb-6">
        {{ t("LABELS.orders") }}
      </h2>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div
          class="base-card-1 state_card"
          :class="{ active: route.query.status == 'pending' }"
          @click="setStatus('pending')"
        >
          <p
            class="!bg-white text-center font-medium mb-5"
            :class="getStatusColor('pending')"
          >
            {{ $t("STATUS.pending") }}
          </p>

          <p class="text-lg font-bold text-center">
            {{ stats.pending_orders }} {{ $t("LABELS.Order") }}
          </p>
          <button type="button" class="" @click.stop="setStatus('')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div
          class="base-card-1 state_card"
          @click="setStatus('admin_shipping')"
          :class="{ active: route.query.status == 'admin_shipping' }"
        >
          <p
            class="!bg-white text-center font-medium mb-5"
            :class="getStatusColor('admin_shipping')"
          >
            {{ $t("STATUS.admin_shipping") }}
          </p>

          <p class="text-lg font-bold text-center">
            {{ stats.shipping_orders }} {{ $t("LABELS.Order") }}
          </p>
          <button type="button" class="" @click.stop="setStatus('')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div
          class="base-card-1 state_card"
          @click="setStatus('admin_delivered')"
          :class="{ active: route.query.status == 'admin_delivered' }"
        >
          <p
            class="!bg-white text-center font-medium mb-5"
            :class="getStatusColor('admin_delivered')"
          >
            {{ $t("STATUS.admin_delivered") }}
          </p>

          <p class="text-lg font-bold text-center">
            {{ stats.delivered_orders }} {{ $t("LABELS.Order") }}
          </p>
          <button type="button" class="" @click.stop="setStatus('')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div
          class="base-card-1 state_card"
          @click="setStatus('admin_rejected')"
          :class="{ active: route.query.status == 'admin_rejected' }"
        >
          <p
            class="!bg-white text-center font-medium mb-5"
            :class="getStatusColor('admin_rejected')"
          >
            {{ $t("STATUS.cancelled") }}
          </p>

          <p class="text-lg font-bold text-center">
            {{ stats.canceled_orders }} {{ $t("LABELS.Order") }}
          </p>
          <button type="button" class="" @click.stop="setStatus('')">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <base-filter
        v-if="items.length || dataFilterd"
        name="Order"
        :inputs="inputs"
        :keyword="true"
        @action="openModal = true"
      >
      </base-filter>

      <v-data-table-virtual
        :headers="headers"
        :items="items"
        :loading="loading"
        item-value="id"
        class="project-table"
        item-key="id"
        :no-data-text="$t('TEXTS.noData')"
      >
        <template v-slot:loading>
          <loader class="py-7" />
        </template>
        <template v-slot:no-data>
          <div
            class="text-center"
            v-if="!$route.query.keyword && !$route.query.status"
          >
            <img
              class="mx-auto"
              src="@/assets/images/icons/brand/orders.png"
              alt=""
            />
            <h3 class="mt-4 font-semibold text-text text-center">
              {{
                $t("TITLES.No have been added yet", {
                  name: $t("LABELS.orders"),
                })
              }}
            </h3>
          </div>
          <h3 v-else class="mt-4 font-semibold text-text text-center">
            {{ $t("TITLES.No Search result") }}
          </h3>
        </template>

        <template v-slot:[`item.order_num`]="{ item }">
          <div class="flex gap-2 items-center flex-wrap">
            <small-details-card :title="`#${item.id}`" />
          </div>
        </template>
        <template v-slot:[`item.order_type`]="{ item }">
          <small-details-card :title="t(item.order_type)" />
        </template>
        <template v-slot:[`item.shipping`]="{ item }">
          <small-details-card :title="item.shipping_company?.name ?? null" />
        </template>

        <template v-slot:[`item.pay_type`]="{ item }">
          <small-details-card
            :title="item.pay_type ? $t(`LABELS.${item.pay_type}`) : null"
          />
        </template>
        <template v-slot:[`item.status_trans`]="{ item }">
          <p
            class="font-semibold text-sm capitalize rounded-md px-1 py-2 mb-2 text-center"
            :class="getStatusColor(item.status)"
          >
            {{ $t(`STATUS.${item.status}`) }}
          </p>
        </template>
        <template v-slot:[`item.client`]="{ item }">
          <small-details-card :title="item.client?.full_name" />
        </template>

        <template v-slot:[`item.price_detail`]="{ item }">
          <small-details-card
            :title="item.total.toFixed(2) + ' ' + $t('SAR')"
          />
        </template>
        <template v-slot:[`item.created_at`]="{ item }">
          <small-details-card
            :title="
              new Date(item.created_at).toLocaleDateString(
                locale == 'ar' ? 'ar-eg' : 'en-us',
                {
                  day: 'numeric',
                  month: '2-digit',
                  year: 'numeric',
                }
              )
            "
            :text="
              new Date(item.created_at).toLocaleTimeString(
                locale == 'ar' ? 'ar-eg' : 'en-us',
                {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                }
              )
            "
          />
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <router-link :to="`/orders/show/${item.id}`">
            <svg-icon class="text-primary" name="eye2" filled />
          </router-link>
        </template>
      </v-data-table-virtual>
    </div>
    <base-pagination :item="paginator" v-if="paginator" />

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
import axios from "axios";
import { ref, onMounted, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import * as yup from "yup";
import { toast } from "vue3-toastify";

const { t, locale } = useI18n();

const route = useRoute();
const router = useRouter();
const dataFilterd = ref(false);
const openModal = ref(false);
const btnLoading = ref(false);
const stats = reactive({
  canceled_orders: 0,
  delivered_orders: 0,
  pending_orders: 0,
  shipping_orders: 0,
});
const openConfirmModel = ref("");
const btnConfirmLoading = ref(false);
const openCancelModel = ref("");
const btnCancelLoading = ref(false);
const failmodal = ref(false);
const failmessage = ref("");
const items = ref([]);
const loading = ref(false);
const paginator = ref(null);

const headers = [
  {
    title: t("LABELS.Order") + " #",
    align: "start",
    sortable: false,
    key: "order_num",
  },
  {
    title: t("LABELS.Retailer"),
    align: "start",
    sortable: false,
    key: "client",
  },
  {
    title: t("LABELS.Order Date"),
    align: "start",
    sortable: false,
    key: "created_at",
  },
  {
    title: t("LABELS.Order Type"),
    align: "start",
    sortable: false,
    key: "order_type",
  },
  {
    title: t("LABELS.Shipping"),
    align: "start",
    sortable: false,
    key: "shipping",
  },
  {
    title: t("LABELS.Payment"),
    align: "start",
    sortable: false,
    key: "pay_type",
  },
  {
    title: t("LABELS.orderStatus"),
    align: "start",
    sortable: false,
    key: "status_trans",
  },

  {
    title: t("LABELS.total"),
    align: "start",
    sortable: false,
    key: "price_detail",
  },

  {
    title: t("LABELS.Actions"),
    align: "start",
    sortable: false,
    key: "actions",
  },
];

const inputs = [
  {
    name: "from_date",
    placeholder: "from_date",
    type: "date",
    icon: "calendar",
    filter: null,
    multiple: false,
    minDate: "",
  },
  {
    name: "to_date",
    placeholder: "to_date",
    type: "date",
    icon: "calendar",
    filter: null,
    multiple: false,
    minDate: "",
  },
];

function fetchData() {
  if (route.query.keyword || route.query.order_type || route.query.status) {
    dataFilterd.value = true;
  }

  const params = new URLSearchParams();
  params.append("from", route.query.from_date || "");
  params.append("to", route.query.to_date || "");
  params.append("status", route.query.status || "");

  params.append("keyword", route.query.keyword || "");
  params.append("page", +route.query.page || 1);
  loading.value = true;
  axios
    .get("statistics", {
      params: params,
    })
    .then((res) => {
      items.value = res.data.data.orders.data;
      stats.canceled_orders = res.data.data.canceled_orders;
      stats.delivered_orders = res.data.data.delivered_orders;
      stats.shipping_orders = res.data.data.shipping_orders;
      stats.pending_orders = res.data.data.pending_orders;
      paginator.value = res.data.data.orders.meta;
      loading.value = false;
    })
    .catch(() => (loading.value = false));
}

const initialValues = reactive({
  reject_reason: "",
});

const schema = yup.object().shape({
  reject_reason: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.Rejection reason") })),
});

function setStatus(status) {
  router.push({
    query: {
      ...route.query,
      status: status ?? "",
    },
  });
}

function resetCancelForm() {
  initialValues.reject_reason = "";
  openCancelModel.value = "";
}

function cancelOrder(values, id) {
  btnCancelLoading.value = true;
  const frmData = new FormData();

  frmData.append("status", "admin_rejected");
  frmData.append("_method", "PUT");
  frmData.append("rejected_reason", values.reject_reason);

  axios
    .post(`order/${id}/change_status`, frmData)
    .then((res) => {
      btnCancelLoading.value = false;
      toast.success(res.data.message);
      resetCancelForm();
      items.value.map((el) => {
        if (el.id == id) {
          el.status = res.data.data.status;

          return el;
        }
      });
    })
    .catch((err) => {
      btnCancelLoading.value = false;
      toast.error(err.response.data.message);
    });
}

function acceptOrder(id) {
  btnConfirmLoading.value = true;

  axios
    .put(`order/${id}/change_status`, {
      status: "admin_accept",
    })
    .then((res) => {
      btnConfirmLoading.value = false;
      openConfirmModel.value = "";
      toast.success(res.data.message);
      items.value.map((el) => {
        if (el.id == id) {
          el.status = res.data.data.status;

          return el;
        }
      });
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

onMounted(() => {
  if (route.query.keyword || route.query.from_date || route.query.to_date) {
    dataFilterd.value = true;
  }
  fetchData();
});

watch(
  () => route.query,
  () => {
    if (route.query.keyword) {
      dataFilterd.value = true;
    }
    fetchData();
  }
);
</script>

<style lang="scss">
.state_card {
  @apply rounded-xl  bg-white p-6 cursor-pointer relative;
  & > button {
    @apply hidden size-8 rounded-full shadow-card absolute start-2 -bottom-4 z-10 bg-primary text-white;
  }
  &.active {
    @apply border border-primary;
    & > button {
      @apply block;
    }
  }
}
</style>
