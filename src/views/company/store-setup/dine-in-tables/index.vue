<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="$t(`TITLES.Dine-in Tables`)"
      :back="`/store-setup/${$route.params.id}`"
      class="mb-7"
    />

    <base-card class="h-full border-none !p-0">
      <div class="flex items-center justify-between flex-wrap mb-3">
        <div
          class="flex items-center gap-2 order-2 sm:order-1"
          v-if="items.length || $route.query.keyword"
        >
          <button
            class="flex items-center"
            type="button"
            @click.stop="toggleAll"
          >
            <i
              class="fa-solid fa-square-check text-primary text-xl"
              v-if="isAllSelected"
            ></i>

            <i
              v-if="isSomeSelected && !isAllSelected"
              class="mdi mdi-minus-box-outline text-2xl text-primary opacity-60"
            ></i>
            <i
              v-if="!isSomeSelected && !isAllSelected"
              class="mdi mdi-checkbox-blank-outline text-sub text-2xl"
            ></i>
          </button>
          <span class="font-semibold text-text capitalize">
            {{ $t("selectAll") }}
          </span>
          <MultiSelect
            @print="printSelectedQR()"
            :message="$t('TITLES.areYouSureToPrintSelected')"
            :btn-name="$t('BUTTONS.Print Selected QR')"
            v-if="selectedRows.length"
          />
        </div>

        <base-filter
          v-if="items.length || $route.query.keyword"
          name="table"
          class="order-1 sm:order-2 !mb-0"
          keywordClass="ms-auto"
          :keyword="true"
          :inputs="[]"
          icon="fas fa-plus"
        />
      </div>
      <Loader v-if="loading" />
      <template v-else>
        <template v-if="items.length">
          <div class="dineInTable">
            <v-data-table-virtual
              :headers="headers"
              :items="items"
              :loading="loading"
              class="!h-full"
              item-key="id"
              show-select
              v-model="selectedRows"
              :loading-text="$t('TEXTS.loadingData')"
              :no-data-text="
                $t('TEXTS.noData', { name: $t('TITLES.Dine-in Tables') })
              "
            >
              <template v-slot:[`item.qr_code`]="{ item }">
                <base-card
                  class="flex mb-1 !py-1 justify-between flex-wrap gap-2 items-center"
                >
                  <div
                    class="flex justify-between flex-wrap gap-2 items-center"
                  >
                    <img
                      :src="item.qr_code"
                      :alt="`table ${item.table_num}`"
                      width="88"
                      height="88"
                    />
                    <div>
                      <small-details-card
                        :title="`${$t('LABELS.table')} ${item.table_num}`"
                      />
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <input-icon name="print" />

                    <button
                      type="button"
                      @click="printQR(item.qr_code, item.table_num)"
                      class="text-primary font-semibold text-md"
                    >
                      {{ $t("LABELS.PrintQR") }}
                    </button>
                  </div>
                </base-card>
              </template>
            </v-data-table-virtual>
          </div>
          <base-pagination :item="paginator" v-if="paginator" />
        </template>

        <div
          v-else-if="!items.length"
          class="items-center flex h-full justify-center"
        >
          <div class="space-y-6" v-if="!$route.query.keyword">
            <div class="text-center">
              <img
                class="mx-auto"
                src="@/assets/images/icons/store-setup/Dine-in_tables.png"
                alt=""
              />
              <h3 class="mt-4 font-semibold text-text text-center">
                {{
                  $t("TITLES.No have been added yet", {
                    name: $t("TITLES.Dine-in Tables"),
                  })
                }}
              </h3>
            </div>
          </div>
          <h3 v-else class="mt-4 font-semibold text-text text-center">
            {{ $t("TITLES.No Search result") }}
          </h3>
        </div>
      </template>
    </base-card>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import axios from "axios";
const { t } = useI18n();
const selectedRows = ref([]);
const paginator = ref(null);
const items = ref([]);
const loading = ref(true);
const route = useRoute();

const breads = [
  {
    path: "/store-setup",
    imgIcon: "storeSetup.svg",
    name: t("sidebar.storeSetup"),
  },
  {
    path: `/store-setup/${route.params.id}/dine-in-tables`,
    imgIcon: "",
    name: t("TITLES.Dine-in Tables"),
  },
];

const headers = ref([
  {
    title: "",
    align: "start",
    sortable: false,
    key: "qr_code",
  },
]);

function fetchData() {
  loading.value = true;
  selectedRows.value = [];

  axios
    .get("table", {
      params: {
        store_id: route.params.id,
        page: route.query.page || 1,
        keyword: route.query.keyword || "",
      },
    })
    .then((res) => {
      items.value = res.data.data;
      paginator.value = res.data.meta;
      loading.value = false;
    })
    .catch(() => (loading.value = false));
}
const isAllSelected = computed(
  () => selectedRows.value.length == items.value.length
);
const isSomeSelected = computed(() => selectedRows.value.length >= 1);

function printQR(qrCodeUrl, table_num) {
  const qrImage = new Image();
  qrImage.src = qrCodeUrl;
  qrImage.onload = () => {
    const qrWindow = window.open("");
    qrWindow.document.write(
      `<html><head><title>${t("LABELS.Print QR Code")}</title></head><body>`
    );
    qrWindow.document.write(
      `
      <h3 style="margin-bottom:10px">${
        t("LABELS.table") + " " + table_num
      } </h3>
      <img src="${qrCodeUrl}" width='300' height='300' center onload="window.print(); window.close();" />`
    );
  };
}

const itemsToPrint = ref([]);

function toggleAll() {
  if (isAllSelected.value) {
    selectedRows.value = [];
    itemsToPrint.value = [];
  } else {
    selectedRows.value = items.value.map((el) => el.id);
  }
}

function printSelectedQR() {
  items.value.map((item) => {
    selectedRows.value.map((el) => {
      if (el == item.id)
        itemsToPrint.value.push({
          qr: item.qr_code,
          table_num: item.table_num,
        });
    });
  });
  // itemsToPrint.value = selectedRows.value.map((selected)=>items.value.map((el) => el.qr_code); )
  const qrWindow = window.open("");
  qrWindow.document.write(
    `<html><head><title>${t("LABELS.Print QR Code")}</title></head><body>`
  );

  const selectedItems = itemsToPrint.value.map(
    (el) =>
      `
        <div style="width:45%;height:350px">
          <h3 style="margin-bottom:10px">${
            t("LABELS.table") + " " + el.table_num
          } </h3>
        <img src="${
          el.qr
        }" width='200' height='200' style='display:block; margin-bottom:20px;' onload="window.print(); window.close();" />
        </div>
      `
  );
  qrWindow.document.write(`
      <div style="display:flex;flex-wrap:wrap">

          ${selectedItems}

      </div>
    `);
}

watch(
  () => route.query,
  () => {
    fetchData();
  }
);

onMounted(() => fetchData());
</script>

<style lang="scss">
.dineInTable {
  td {
    padding: 0 !important;
    border-bottom: unset !important;
  }

  thead {
    display: none !important;
  }
}
</style>
