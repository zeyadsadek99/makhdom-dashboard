<template>
  <div class="order-discounts">
    <breadcrumbs
      :items="breads"
      :title="$t('TITLES.orderDiscounts')"
      back="/menu-setup/order-discounts"
    />

    <div
      class="bg-white rounded-[24px] h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] p-7"
    >
      <base-filter
        v-if="items.length || dataFilterd"
        name="orderDiscount"
        :inputs="inputs"
        :keyword="true"
        @action="$router.push('/menu-setup/order-discounts/form')"
      >
      </base-filter>
      <multi-archive
        :message="$t('TITLES.areYouSureToRestoreSelected')"
        url="restore_ids"
        @reload="
          selectedRows = [];
          fetchData();
        "
        :items="selectedRows"
        model="order_discounts"
        :btn-name="$t('BUTTONS.Restore selected')"
        v-if="selectedRows.length"
      />
      <v-data-table-virtual
        :headers="headers"
        show-select
        :items="items"
        v-model="selectedRows"
        item-value="id"
        class="project-table"
        item-key="id"
        :loading="loading"
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
                  name: t("BUTTONS.allTrashes") + t("TITLES.orderDiscounts"),
                })
              }}
            </h3>
          </div>
        </template>

        <template v-slot:[`item.name`]="{ item }">
          <small-details-card :title="item.name" />
        </template>

        <template v-slot:[`item.amount_value`]="{ item }">
          <small-details-card
            :title="item.amount_value + ' ' + item.currency"
            :text="$t(item.amount_type)"
          />
        </template>
        <template v-slot:[`item.added_by`]="{ item }">
          <small-details-card :title="item.added_by?.full_name" />
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <action-menu
            :restore="true"
            :item="item"
            name="order_discount"
            @restore="openResotre(item.id)"
            @reload="
              fetchData();
              selectedRows = [];
            "
            @remove="remove(item.id)"
          />

          <Teleport to="body">
            <Restore
              v-if="showArchive && itemToShow == item.id"
              :url="`order_discount/restore/${item.id}`"
              @remove="
                itemToShow = '';
                remove(item.id);
                showArchive = false;
              "
              @close="showArchive = false"
            />
          </Teleport>
        </template>
      </v-data-table-virtual>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
const route = useRoute();
const { t } = useI18n();
const paginator = ref(null);
const loading = ref(false);
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
  {
    path: "/menu-setup/order-discounts/archived",
    imgIcon: "",
    name: t("BUTTONS.allTrashes", { name: t("TITLES.orderDiscounts") }),
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
    title: t("TITLES.archived date"),
    align: "start",
    sortable: false,
    key: "deleted_at",
  },

  {
    title: t("LABELS.by"),
    align: "start",
    sortable: false,
    key: "added_by",
  },
  {
    title: "",
    align: "center",
    sortable: false,
    key: "actions",
  },
];

const items = ref([]);

const inputs = [
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

const dataFilterd = ref(false);
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
    .get("order_discount/trashed", {
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
    selectedRows.value = [];
    fetchData();
  }
);
const showArchive = ref(false);
const itemToShow = ref("");

function openResotre(id) {
  itemToShow.value = id;
  showArchive.value = true;
}
const selectedRows = ref([]);
function remove(id) {
  items.value = items.value.filter((el) => el.id != id);
  selectedRows.value = selectedRows.value.filter((el) => el != id);
  paginator.value.total--;
}
onMounted(() => fetchData());
</script>

<style lang="scss">
.order-discounts {
  td {
    background: transparent !important;
  }
}
</style>
