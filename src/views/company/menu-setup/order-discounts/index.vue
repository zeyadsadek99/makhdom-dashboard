<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-wrap justify-between">
      <breadcrumbs
        :items="breads"
        :title="t('TITLES.orderDiscounts')"
        back="/menu-setup"
        class="mb-7"
      />
      <div class="flex items-center">
        <router-link
          to="/menu-setup/order-discounts/archived"
          class="archive-btn"
          v-if="items.length"
        >
          <span>{{
            $t("BUTTONS.allTrashes", { name: $t("LABELS.discount") })
          }}</span>
        </router-link>
      </div>
    </div>
    <div
      class="bg-white rounded-3xl h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] md:p-7 flex-1 flex flex-col"
    >
      <base-filter
        v-if="items.length || dataFilterd"
        name="orderDiscount"
        :inputs="inputs"
        :btn-name="t(`BUTTONS.new`, { name: t('LABELS.discount') })"
        icon="fas fa-plus"
        :keyword="true"
        @action="$router.push('/menu-setup/order-discounts/form')"
      >
      </base-filter>

      <MultiArchive
        url="delete_ids"
        @reload="
          selectedRows = [];
          fetchData();
        "
        :message="$t('TITLES.areYouSureToArchiveSelected')"
        :items="selectedRows"
        model="order_discounts"
        :btn-name="$t('BUTTONS.Archive selected')"
        v-if="selectedRows.length"
      />
      <v-data-table-virtual
        :headers="headers"
        show-select
        :items="items"
        :loading="loading"
        v-model="selectedRows"
        item-value="id"
        class="project-table"
        item-key="id"
        :no-data-text="$t('TEXTS.noData')"
      >
        <template v-slot:loading>
          <loader class="py-7" />
        </template>
        <template v-slot:no-data>
          <div class="text-center">
            <img
              class="mx-auto"
              src="@/assets/images/icons/brand/other-discounts.png"
              alt="order discounts"
            />
            <h3
              class="mt-4 font-semibold text-text text-center"
              v-if="dataFilterd"
            >
              {{ $t("TITLES.No Search result") }}
            </h3>
            <h3 class="mt-4 font-semibold text-text text-center" v-else>
              {{
                $t("TITLES.No have been added yet", {
                  name: $t("TITLES.orderDiscounts"),
                })
              }}
            </h3>
            <div
              class="flex items-center justify-center mt-7 gap-2 flex-wrap"
              v-if="!dataFilterd"
            >
              <router-link
                to="/menu-setup/order-discounts/form"
                class="base-btn rounded-xl self-end"
              >
                <i class="fas fa-plus"></i>
                {{ $t(`BUTTONS.add`, { name: $t("LABELS.discount") }) }}
              </router-link>
              <router-link
                to="/menu-setup/order-discounts/archived"
                class="archive-btn"
              >
                <span>{{
                  $t("BUTTONS.allTrashes", {
                    name: $t("LABELS.discount"),
                  })
                }}</span>
              </router-link>
            </div>
          </div>
        </template>
        <template v-slot:[`item.name`]="{ item }">
          <small-details-card :title="item.name" />
        </template>

        <template v-slot:[`item.is_active`]="{ item }">
          <div class="flex items-center gap-2">
            <global-switcher
              :id="item.id"
              model="order_discounts"
              v-model:modalValue="item.is_active"
            />
          </div>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <action-menu
            :edit="true"
            :archive="true"
            :item="item"
            name="order_discount"
            @edit="$router.push(`/menu-setup/order-discounts/form/${item.id}`)"
            @reload="fetchData"
            @remove="remove(item.id)"
          />
        </template>
        <template v-slot:[`item.amount_value`]="{ item }">
          <small-details-card
            :title="
              item.amount_value +
              ' ' +
              (item.amount_type == 'value' ? item.currency : '%')
            "
            :text="$t(item.amount_type)"
          />
        </template>
      </v-data-table-virtual>
    </div>
    <base-pagination :item="paginator" v-if="paginator" />
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
const { t } = useI18n();
const route = useRoute();
const breads = [
  {
    path: "/menu-setup",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.menuSetup"),
  },
  {
    path: "/menu-setup/order-discounts",
    imgIcon: "",
    name: t("TITLES.orderDiscounts"),
  },
];

const headers = [
  {
    title: t("LABELS.orderDiscountName"),
    align: "start",
    sortable: false,
    key: "name",
  },
  {
    title: t("LABELS.Coupon Code"),
    align: "start",
    sortable: false,
    key: "code",
  },
  {
    title: t("LABELS.orderDiscountType"),
    align: "start",
    sortable: false,
    key: "amount_value",
  },
  {
    title: t("LABELS.status"),
    align: "start",
    sortable: false,
    key: "is_active",
  },
  {
    title: "",
    align: "center",
    sortable: false,
    key: "actions",
  },
];

const loading = ref(false);
const items = ref([]);
const dataFilterd = ref(false);
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
        name: t("STATUS.Available"),
        id: 1,
      },
      {
        name: t("STATUS.Unavailable"),
        id: "0",
      },
    ],
    type: "select",
    filter: null,
    multiple: false,
  },
  {
    name: "type",
    placeholder: "discountType",
    options: [
      {
        name: t("STATUS.All"),
        id: "",
      },
      {
        name: t("value"),
        id: "value",
      },
      {
        name: t("percentage"),
        id: "percentage",
      },
    ],
    type: "select",
    filter: null,
    multiple: false,
  },
];

const paginator = ref(null);
function fetchData() {
  if (
    route.query.keyword ||
    route.query.type ||
    route.query.status ||
    route.query.status === 0
  ) {
    dataFilterd.value = true;
  } else {
    dataFilterd.value = false;
  }
  loading.value = true;
  axios
    .get("order_discount", {
      params: {
        keyword: route.query.keyword || "",
        is_active: route.query.status || "",
        amount_type: route.query.type || "",
        page: +route.query.page || 1,
      },
    })
    .then((res) => {
      items.value = res.data.data;

      paginator.value = res.data.meta;
      loading.value = false;
    })
    .catch(() => (loading.value = false));
}
onMounted(() => {
  fetchData();
});

watch(
  () => route.query,
  () => {
    if (
      route.query.keyword ||
      route.query.type ||
      route.query.status ||
      route.query.status == 0
    ) {
      dataFilterd.value = true;
    } else {
      dataFilterd.value = false;
    }
    fetchData();
    selectedRows.value = [];
  }
);
function remove(id) {
  items.value = items.value.filter((el) => el.id != id);
  selectedRows.value = selectedRows.value.filter((el) => el != id);
  paginator.value.total--;
}
const selectedRows = ref([]);
</script>
