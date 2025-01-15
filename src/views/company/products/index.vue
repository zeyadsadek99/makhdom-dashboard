<template>
  <div class="h-full flex flex-col">
    <breadcrumbs :items="breadItems" :title="$t('LABELS.Wholesalers')" />
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <div
        class="base-card-1 state_card"
        :class="{ active: route.query.status == 'accepted' }"
        @click="setStatus('accepted')"
      >
        <p
          class="!bg-white text-center font-medium mb-5"
          :class="getStatusColor('accepted')"
        >
          {{ $t("LABELS.activatedProducts") }}
        </p>

        <p class="text-lg font-bold text-center">
          {{ stats.accepted_products }} {{ $t("LABELS.product") }}
        </p>
        <button type="button" class="" @click.stop="setStatus('')">
          <i class="fas fa-times"></i>
        </button>
      </div>
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

        <p class="text-lg font-bold text-center capitalize">
          {{ stats.pending_products }} {{ $t("LABELS.product") }}
        </p>
        <button type="button" class="" @click.stop="setStatus('')">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div
        class="base-card-1 state_card"
        @click="setStatus('almost_sold_out')"
        :class="{ active: route.query.status == 'almost_sold_out' }"
      >
        <p
          class="!bg-white text-center font-medium mb-5"
          :class="getStatusColor('admin_rejected')"
        >
          {{ $t("LABELS.Almost sold out") }}
        </p>

        <p class="text-lg font-bold text-center">
          {{ stats.almost_sold_out_products }} {{ $t("LABELS.Product") }}
        </p>
        <button type="button" class="" @click.stop="setStatus('')">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div
        class="base-card-1 state_card"
        @click="setStatus('refused')"
        :class="{ active: route.query.status == 'refused' }"
      >
        <p
          class="!bg-white text-center font-medium mb-5"
          :class="getStatusColor('admin_rejected')"
        >
          {{ $t("STATUS.refused") }}
        </p>

        <p class="text-lg font-bold text-center capitalize">
          {{ stats.refused_products }} {{ $t("LABELS.product") }}
        </p>
        <button type="button" class="" @click.stop="setStatus('')">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
    <div
      class="bg-white rounded-3xl h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] flex-1 flex flex-col"
    >
      <!-- :btn-name="t(`BUTTONS.new`, { name: t('LABELS.Order') })"
      icon="fas fa-plus" -->
      <base-filter
        v-if="items.length || dataFilterd"
        name="Traders Products"
        :inputs="inputs"
        :keyword="true"
      >
      </base-filter>

      <v-data-table-virtual
        :headers="headers"
        :items="items"
        :loading="loading"
        item-value="id"
        class="project-table"
        item-key="id"
      >
        <template v-slot:loading>
          <loader class="py-7" />
        </template>
        <template v-slot:no-data>
          <div
            class="text-center"
            v-if="!$route.query.keyword && !$route.query.status"
          >
            <h3 class="mt-4 font-semibold text-text text-center">
              {{
                $t("TITLES.No have been added yet", {
                  name: $t("LABELS.Traders Products"),
                })
              }}
            </h3>
          </div>
          <h3 v-else class="mt-4 font-semibold text-text text-center">
            {{ $t("TITLES.No Search result") }}
          </h3>
        </template>

        <template v-slot:[`item.product`]="{ item }">
          <small-details-card
            :image="item.main_image"
            :title="item.name"
            :text="`#${item.id}`"
          />
        </template>
        <template v-slot:[`item.category`]="{ item }">
          <small-details-card
            :title="item.main_category?.name ?? null"
            :text="item.sub_category?.name ?? null"
          />
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <p
            class="font-semibold text-sm capitalize rounded-md px-1 py-2 text-center"
            :class="getStatusColor(item.status)"
          >
            {{ $t(`STATUS.${item.status}`) }}
          </p>
          <div
            class="flex items-center mt-1 gap-2"
            v-if="item.status == 'pending'"
          >
            <button
              type="button"
              class="bg-error rounded-full p-2 w-[32px] h-[32px]"
              @click="openCancelModel = item.id"
            >
              <svg-icon name="refuse" class="m-auto" />
            </button>
            <button
              type="button"
              class="bg-collected rounded-full w-[32px] h-[32px] p-1"
              @click="openConfirmModel = item.id"
            >
              <svg-icon name="accept" class="m-auto" />
            </button>
            <Teleport to="body">
              <ConfirmModal
                :disabled="btnConfirmLoading"
                v-if="openConfirmModel == item.id"
                message=""
                @cancel="openConfirmModel = ''"
                btn-confirm="base-btn py-4 rounded-xl"
                button-name="BUTTONS.Yes Accept"
                @confirm="acceptOrder(item.id)"
              />
            </Teleport>
            <teleport to="body">
              <modal
                :persist="true"
                v-if="openCancelModel == item.id"
                :title="t('LABELS.reject order')"
                @close="resetCancelForm"
              >
                <VeeForm
                  :validation-schema="schema"
                  @submit="(values) => cancelOrder(values, item.id)"
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
                      @click="openCancelModel = ''"
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
        </template>
        <template v-slot:[`item.product_status`]="{ item }">
          <p
            class="flex items-center gap-1 text-primary"
            v-if="item.quantity > item.minimum_stock_notification"
          >
            <span
              class="size-4 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <Check1 width="12" />
            </span>
            {{ $t("LABELS.Available") }}
          </p>
          <p
            class="flex items-center gap-1 whitespace-nowrap text-error"
            v-else
          >
            <span
              class="size-4 rounded-full bg-error/10 flex items-center justify-center"
            >
              <i class="fas fa-times"></i>
            </span>
            {{ $t("LABELS.Almost sold out") }}
          </p>
        </template>
        <template v-slot:[`item.provider`]="{ item }">
          <router-link :to="`/provider/show/${item.provider?.id}`">
            <small-details-card
              :title="item.add_by?.full_name ?? null"
              :text="item.add_by?.facility_type?.name ?? null"
            />
          </router-link>
        </template>

        <template v-slot:[`item.price_before_discount`]="{ item }">
          <small-details-card
            :title="item.price_before_discount.toFixed(2) + ' ' + $t('SAR')"
          />
        </template>
        <template v-slot:[`item.price`]="{ item }">
          <small-details-card
            :title="item.price.toFixed(2) + ' ' + $t('SAR')"
          />
        </template>
        <template v-slot:[`item.discount`]="{ item }">
          <small-details-card :title="item.discount + ' ' + '%'" />
        </template>
        <template v-slot:[`item.is_active`]="{ item }">
          <global-switcher
            :id="item.id"
            :url="`products/${item.id}/toggle-active-product`"
            v-model:modalValue="item.is_active"
          />
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <router-link :to="`/products/show/${item.id}`">
            <small-details-card :show="true" />
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
import Check1 from "@/components/icons/Check1.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const breadItems = [
  {
    name: t("TITLES.home"),
    path: "/",
    imgIcon: "settings.svg",
  },
  {
    name: t("LABELS.Traders Products"),
    path: "/products",
    imgIcon: "",
  },
];
const stats = reactive({
  refused_products: 0,
  accepted_products: 0,
  pending_products: 0,
  almost_sold_out_products: 0,
});
const dataFilterd = ref(false);
const btnLoading = ref(false);
const openConfirmModel = ref("");
const btnConfirmLoading = ref(false);
const openCancelModel = ref("");
const btnCancelLoading = ref(false);
const failmodal = ref(false);
const failmessage = ref("");
const items = ref([]);
const loading = ref(false);
const paginator = ref(null);

const inputs = [
  {
    name: "status",
    placeholder: "status",
    options: [
      {
        name: t("STATUS.All"),
        id: "",
      },
      {
        name: t("STATUS.pending"),
        id: "pending",
      },
      {
        name: t("STATUS.accepted"),
        id: "accepted",
      },
      {
        name: t("STATUS.refused"),
        id: "refused",
      },
      {
        name: t("LABELS.Almost sold out"),
        id: "almost_sold_out",
      },
    ],
    type: "select",
    filter: null,
    multiple: false,
  },
  {
    name: "provider",
    placeholder: "Wholesaler",
    url: "providers-without-paginated",
    type: "select",
    filter: null,
    multiple: false,
  },
];

const headers = [
  {
    title: t("LABELS.Product"),
    align: "start",
    sortable: false,
    key: "product",
  },

  {
    title: t("LABELS.category"),
    align: "start",
    sortable: false,
    key: "category",
  },
  {
    title: t("LABELS.wholesalers"),
    align: "start",
    sortable: false,
    key: "provider",
  },

  {
    title: t("LABELS.Product Status"),
    align: "start",
    sortable: false,
    key: "product_status",
  },

  {
    title: t("LABELS.Quantity"),
    align: "start",
    sortable: false,
    key: "quantity",
  },
  {
    title: t("LABELS.Price"),
    align: "start",
    sortable: false,
    key: "price_before_discount",
  },
  {
    title: t("LABELS.PriceAfterDiscount"),
    align: "start",
    sortable: false,
    key: "price",
  },
  {
    title: t("LABELS.discount"),
    align: "start",
    sortable: false,
    key: "discount",
  },

  {
    title: t("LABELS.activation"),
    align: "start",
    sortable: false,
    key: "is_active",
  },
  {
    title: t("LABELS.status"),
    align: "start",
    sortable: false,
    key: "status",
  },

  {
    title: "",
    align: "start",
    sortable: false,
    key: "actions",
  },
];

const initialValues = reactive({
  reject_reason: "",
});

const schema = yup.object().shape({
  reject_reason: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.Rejection reason") })),
});

function fetchData() {
  if (route.query.keyword || route.query.status || route.query.provider) {
    dataFilterd.value = true;
  }

  const params = new URLSearchParams();

  params.append("keyword", route.query.keyword || "");
  params.append("provider_id", route.query.provider || "");
  params.append("status", route.query.status || "");
  params.append("page", +route.query.page || 1);
  loading.value = true;
  axios
    .get("products", {
      params: params,
    })
    .then((res) => {
      items.value = res.data.data;
      paginator.value = res.data.meta;
      stats.accepted_products = res.data.accepted_products;
      stats.almost_sold_out_products = res.data.almost_sold_out_products;
      stats.pending_products = res.data.pending_products;
      stats.refused_products = res.data.refused_products;
      loading.value = false;
    })
    .catch(() => (loading.value = false));
}

function resetCancelForm() {
  initialValues.reject_reason = "";
  openCancelModel.value = "";
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
      items.value.map((el) => {
        if (el.id == id) {
          el.status = res.data.data.status;

          return el;
        }
      });
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
    .post(`products/${id}/update-status`, {
      status: "accepted",
    })
    .then((res) => {
      btnConfirmLoading.value = false;
      items.value.map((el) => {
        if (el.id == id) {
          el.status = res.data.data.status;

          return el;
        }
      });
      toast.success(res.data.message || res.data.messages);
      openConfirmModel.value = "";
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
function setStatus(status) {
  router.push({
    query: {
      ...route.query,
      status: status ?? "",
    },
  });
}

onMounted(() => {
  if (route.query.keyword) {
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
