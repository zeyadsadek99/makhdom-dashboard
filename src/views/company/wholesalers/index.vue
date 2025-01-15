<template>
  <div class="h-full flex flex-col">
    <breadcrumbs :items="breadItems" :title="$t('LABELS.Wholesalers')" />

    <div
      class="bg-white rounded-3xl h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] md:p-7 flex-1 flex flex-col"
    >
      <!-- :btn-name="t(`BUTTONS.new`, { name: t('LABELS.Order') })"
      icon="fas fa-plus" -->
      <base-filter
        v-if="items.length || dataFilterd"
        name="wholesaler"
        :inputs="[]"
        :keyword="true"
        :btn-name="t(`BUTTONS.add`, { name: t('LABELS.wholesaler') })"
        icon="fas fa-plus"
        @action="$router.push('/wholesalers/form')"
      />

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
                  name: $t("LABELS.wholesalers"),
                })
              }}
            </h3>
            <div class="flex items-center justify-center mt-7 gap-2 flex-wrap">
              <router-link
                to="/wholesalers/form"
                class="base-btn rounded-xl self-end"
              >
                <i class="fas fa-plus"></i>
                {{ $t(`BUTTONS.add`, { name: $t("LABELS.wholesaler") }) }}
              </router-link>
            </div>
          </div>
          <h3 v-else class="mt-4 font-semibold text-text text-center">
            {{ $t("TITLES.No Search result") }}
          </h3>
        </template>

        <template v-slot:[`item.full_name`]="{ item }">
          <small-details-card
            :image="item.image"
            :title="item.full_name ? item.full_name : null"
          />
        </template>
        <template v-slot:[`item.company`]="{ item }">
          <small-details-card :title="item.company?.name ?? null" />
        </template>
        <template v-slot:[`item.phone`]="{ item }">
          <a
            class="whitespace-normal"
            :href="`tel:${item.phone_code}${item.phone}`"
          >
            <bdi> {{ `+${item.phone_code}${item.phone}` }} </bdi>
          </a>
        </template>

        <template v-slot:[`item.is_admin_active_user`]="{ item }">
          <global-switcher
            :id="item.id"
            :url="`providers/${item.id}/toggle-active-user`"
            v-model:modalValue="item.is_admin_active_user"
          />
        </template>

        <template v-slot:[`item.action`]="{ item }">
          <div class="flex flex-wrap gap-2" v-if="item.status == 'pending'">
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
                :title="t('LABELS.Reject order')"
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
          <div v-else>
            <p
              :class="getStatusColor(item.status)"
              class="inline-flex p-1 rounded-full"
            >
              {{ $t(`STATUS.${item.status}`) }}
            </p>
          </div>
        </template>
        <template v-slot:[`item.account_verification`]="{ item }">
          <span
            class="inline-flex p-1 rounded-full"
            :class="
              getStatusColor(
                item.account_verification ? 'completed' : 'pending'
              )
            "
          >
            {{
              item.account_verification
                ? $t("STATUS.completed")
                : $t("STATUS.unCompleted")
            }}
          </span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <div class="flex items-center gap-2">
            <router-link :to="`/wholesalers/show/${item.id}`">
              <svg-icon name="eye2" />
            </router-link>
            <router-link :to="`/wholesalers/form/${item.id}`">
              <svg-icon name="edit" />
            </router-link>
            <Deleter
              :url="`providers/${item.id}`"
              :id="item.id"
              method="DELETE"
              @remove="items.splice(index, 1)"
            />
          </div>
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
import { useRoute } from "vue-router";
import * as yup from "yup";
import { toast } from "vue3-toastify";

const { t } = useI18n();
const route = useRoute();
const breadItems = [
  {
    name: t("TITLES.home"),
    path: "/",
    imgIcon: "settings.svg",
  },
  {
    name: t("LABELS.Wholesalers"),
    path: "/wholesalers",
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

const headers = [
  {
    title: t("LABELS.Name"),
    align: "start",
    sortable: false,
    key: "full_name",
  },
  {
    title: t("LABELS.Facility"),
    align: "start",
    sortable: false,
    key: "company",
  },
  {
    title: t("LABELS.phoneNumber"),
    align: "start",
    sortable: false,
    key: "phone",
  },
  {
    title: t("LABELS.isCompletedData"),
    align: "start",
    sortable: false,
    key: "account_verification",
  },
  {
    title: t("LABELS.activation"),
    align: "start",
    sortable: false,
    key: "is_admin_active_user",
  },

  {
    title: t("TITLES.actions"),
    align: "start",
    sortable: false,
    key: "action",
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
  if (route.query.keyword || route.query.order_type || route.query.status) {
    dataFilterd.value = true;
  }

  const params = new URLSearchParams();

  params.append("status", route.query.order_status || "");

  params.append("keyword", route.query.keyword || "");
  params.append("page", +route.query.page || 1);
  loading.value = true;
  axios
    .get("providers", {
      params: params,
    })
    .then((res) => {
      items.value = res.data.data;
      paginator.value = res.data.meta;
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
    .post(`change-provider-status/${id}`, frmData)
    .then((res) => {
      btnCancelLoading.value = false;
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
    .post(`change-provider-status/${id}`, {
      status: "accepted",
    })
    .then((res) => {
      btnConfirmLoading.value = false;
      openConfirmModel.value = "";
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
