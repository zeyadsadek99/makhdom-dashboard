<template>
  <div class="h-full flex flex-col">
    <breadcrumbs :items="breadItems" :title="$t('LABELS.Stories')" />

    <div
      class="bg-white rounded-3xl h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] flex-1 flex flex-col"
    >
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-11">
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
            {{ stats.pending_stories }} {{ $t("LABELS.Order") }}
          </p>
          <button type="button" class="" @click.stop="setStatus('')">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div
          class="base-card-1 state_card"
          @click="setStatus('active')"
          :class="{ active: route.query.status == 'active' }"
        >
          <p
            class="!bg-white text-center font-medium mb-5"
            :class="getStatusColor('accepted')"
          >
            {{ $t("STATUS.active_stories") }}
          </p>

          <p class="text-lg font-bold text-center">
            {{ stats.active_stories }} {{ $t("LABELS.Order") }}
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
            :class="getStatusColor('refused')"
          >
            {{ $t("STATUS.refused") }}
          </p>

          <p class="text-lg font-bold text-center">
            {{ stats.canceled_stories }} {{ $t("LABELS.Order") }}
          </p>
          <button type="button" class="" @click.stop="setStatus('')">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <!-- :btn-name="t(`BUTTONS.new`, { name: t('LABELS.Order') })"
      icon="fas fa-plus" -->

      <base-filter
        v-if="items.length || dataFilterd"
        name="Traders Stories"
        :inputs="inputs"
        :keyword="true"
      />

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

        <template v-slot:[`item.name`]="{ item }">
          <small-details-card
            :image="item.product?.main_image"
            :title="item.product?.name ?? null"
          />
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <div>
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
                  :title="t('LABELS.reject story')"
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
          </div>
        </template>
        <template v-slot:[`item.provider`]="{ item }">
          <router-link :to="`/provider/show/${item.provider?.id}`">
            <small-details-card
              :title="item.provider?.full_name ?? null"
              :text="item.provider?.facility_type?.name ?? null"
            />
          </router-link>
        </template>

        <template v-slot:[`item.category`]="{ item }">
          <small-details-card
            :title="item.product?.main_category?.name ?? null"
            :text="item.product?.sub_category?.name ?? null"
          />
        </template>
        <template v-slot:[`item.price`]="{ item }">
          <div class="text-center">
            <p class="text-text font-bold whitespace-nowrap">
              {{ item.price }} {{ $t("SAR") }}
            </p>
            <p class="text-sub line-through whitespace-nowrap">
              {{ item.price_before_discount }} {{ $t("SAR") }}
            </p>
          </div>
        </template>

        <template v-slot:[`item.discount`]="{ item }">
          <div class="flex items-center whitespace-nowrap">
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.012 0H8.1368L4.98779 11.338H8.14321L5.46025 21H6.4054L15.5389 9.6615H10.9119L16.012 0Z"
                fill="#A485C7"
              />
            </svg>

            {{ item.discount }}%
            {{ $t("LABELS.discount") }}
          </div>
        </template>
        <template v-slot:[`item.is_active`]="{ item }">
          <global-switcher
            :id="item.id"
            :url="`products/${item.id}/toggle-active-product`"
            v-model:modalValue="item.is_active"
          />
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <router-link :to="`/stories/show/${item.id}`">
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
import axios from "axios";
import { ref, onMounted, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import * as yup from "yup";
import { toast } from "vue3-toastify";
import getStatusColor from "@/utils/getStatusColor.ts";

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
    name: t("LABELS.Traders Stories"),
    path: "/stories",
    imgIcon: "",
  },
];
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
const stats = reactive({
  canceled_stories: 0,
  active_stories: 0,
  pending_stories: 0,
});

const headers = [
  {
    title: t("LABELS.Name"),
    align: "start",
    sortable: false,
    key: "name",
  },
  {
    title: t("LABELS.Category"),
    align: "start",
    sortable: false,
    key: "category",
  },
  {
    title: t("LABELS.Wholesaler"),
    align: "start",
    sortable: false,
    key: "provider",
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
    key: "price",
  },

  {
    title: t("LABELS.discount"),
    align: "start",
    sortable: false,
    key: "discount",
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

const inputs = [
  // {
  //   name: "status",
  //   placeholder: t("LABELS.status"),
  //   options: [
  //     {
  //       name: t("STATUS.All"),
  //       id: "",
  //     },
  //     {
  //       name: t("STATUS.pending"),
  //       id: "pending",
  //     },
  //     {
  //       name: t("STATUS.accepted"),
  //       id: "accepted",
  //     },
  //     {
  //       name: t("STATUS.refused"),
  //       id: "refused",
  //     },
  //     {
  //       name: t("LABELS.Almost sold out"),
  //       id: "almost_sold_out",
  //     },
  //   ],
  //   type: "select",
  //   filter: null,
  //   multiple: false,
  // },
  {
    name: "provider",
    placeholder: t("LABELS.Wholesaler"),
    url: "providers-without-paginated",
    type: "select",
    filter: null,
    multiple: false,
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

function setStatus(status) {
  router.push({
    query: {
      ...route.query,
      status: status ?? "",
    },
  });
}

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
    .get("stories", {
      params: params,
    })
    .then((res) => {
      items.value = res.data.data;
      paginator.value = res.data.meta;
      stats.pending_stories = res.data.pending_stories;
      stats.canceled_stories = res.data.canceled_stories;
      stats.active_stories = res.data.active_stories;
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
    .post(`stories/${id}/update-status`, frmData)
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
    .post(`stories/${id}/update-status`, {
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
