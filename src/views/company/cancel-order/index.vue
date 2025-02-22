<template>
  <div class="h-full flex flex-col">
    <breadcrumbs :items="breadItems" :title="$t('LABELS.cancel-order')" />
    <div
      class="bg-white rounded-3xl h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] md:p-7 flex-1 flex flex-col"
    >
    <base-filter
        name="status"
        :inputs="inputs"
        icon="fas fa-plus"
        :keyword="true"
        @action="$router.push('/page/form')"
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
                  name: $t("LABELS.cancel-orders"),
                })
              }}
            </h3>
            <div class="flex items-center justify-center mt-7 gap-2 flex-wrap">
              <router-link
                to="/cancel-order/"
                class="base-btn rounded-xl self-end"
              >
                <i class="fas fa-plus"></i>
                {{ $t(`BUTTONS.add`, { name: $t("LABELS.cancel-orders") }) }}
              </router-link>
            </div>
          </div>
          <h3 v-else class="mt-4 font-semibold text-text text-center">
            {{ $t("TITLES.No Search result") }}
          </h3>
        </template>
        <template v-slot:[`item.id`]="{ item }">
          <div class="flex gap-2 items-center flex-wrap">
            <small-details-card :title="`${item.order_id}`":text="item.reason"/>
          </div>
        </template>

        <template v-slot:[`item.cancel`]="{ item }">
          <div class="flex gap-2 items-center flex-wrap">
            <small-details-card :title="`${item.cancel_by}`" />
          </div>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <div class="flex gap-2 items-center flex-wrap">
            <small-details-card :title="`${item.status}`" />
          </div>
        </template>
        <template v-slot:[`item.action`]="{ item, index }">
          <div class="flex items-center gap-4">
            <router-link :to="`/cancel-order/form/${item.id}`">
              <svg-icon class="text-primary" name="edit" filled />
            </router-link>
            
          </div>
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

const route = useRoute();
const { t } = useI18n();
const inputs = [
  
  {
    name: "type",
    placeholder: "type",
    type: "select",
    // icon: "calendar",
    filter: null,
    options : [
    { id: "", name: t("STATUS.all")},
    { id: 'vendor', name: 'vendor' },
    { id: 'client', name: 'client' },
  ],

    multiple: false,
  },
];

const breadItems = [
  {
    name: t("TITLES.home"),
    path: "/",
    imgIcon: "settings.svg",
  },
  {
    name: t("LABELS.cancel-orders"),
    path: "/cancel-order",
    imgIcon: "",
  },
];

const items = ref([]);
const loading = ref(false);
const paginator = ref(null);

const headers = [
  {
    title: t("LABELS.id"),
    align: "start",
    sortable: false,
    key: "id",
  },

  
  {
    title: t("LABELS.cancelBy"),
    align: "start",
    sortable: false,
    key: "cancel",
  },
  {
    title: t("LABELS.status"),
    align: "start",
    sortable: false,
    key: "status",
  },
  {
    title: t("LABELS.Actions"),
    align: "start",
    sortable: false,
    key: "action",
  },
];

function fetchData() {
  const params = new URLSearchParams();
  // params.append("from", route.query.from_date || "");
  // params.append("to", route.query.to_date || "");
  params.append("cancelBy", route.query.type || "");

  params.append("status", route.query.keyword || "");
  params.append("page", +route.query.page || 1);
  loading.value = true;
  axios
    .get("cancel-orders", {
      params,
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
  () => fetchData()
);

onMounted(() => {
  fetchData();
});
</script>
