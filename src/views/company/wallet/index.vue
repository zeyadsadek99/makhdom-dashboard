<template>
  <div class="h-full flex flex-col">
    <breadcrumbs :items="breadItems" :title="$t('LABELS.wallet')" />
    <div
      class="bg-white rounded-3xl h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] md:p-7 flex-1 flex flex-col"
    >
      <base-filter
        name="wallet"
        :inputs="[]"
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
                  name: $t("LABELS.wallet"),
                })
              }}
            </h3>
            <div class="flex items-center justify-center mt-7 gap-2 flex-wrap">
              <router-link to="/wallet/transaction" class="base-btn rounded-xl self-end">
                <i class="fas fa-plus"></i>
                {{ $t(`BUTTONS.add`, { name: $t("LABELS.wallet") }) }}
              </router-link>
            </div>
          </div>
          <h3 v-else class="mt-4 font-semibold text-text text-center">
            {{ $t("TITLES.No Search result") }}
          </h3>
        </template>
        <!-- <template v-slot:[`item.question`]="{ item }">
          <div class="flex gap-2 items-center flex-wrap">
            <small-details-card :title="`${item.question}`" />
          </div>
        </template>

        <template v-slot:[`item.answer`]="{ item }">
          <div class="flex gap-2 items-center flex-wrap">
            <small-details-card :title="`${item.answer}`" />
          </div>
        </template> -->

        <template v-slot:[`item.full_name`]="{ item }">
          <div class="flex gap-2 items-center flex-wrap">
            <small-details-card
              :title="`${item.full_name}`"
              :text="`${item.user_type}`"
            />
          </div>
        </template>
        <template  v-slot:[`item.icon`]="{ item }">
          <div class="flex justify-start">
            <router-link :to="`wallet/${item.id}`">
              <button class="icon-button w-5">
                <svg-icon name="eye2" />
              </button>
            </router-link>
          </div>
        
      </template>


        <!-- <template v-slot:[`item.email`]="{ item }">
          <div class="flex gap-2 items-center flex-wrap">
            <small-details-card :title="`${item.email}`" />
          </div>
        </template>

        <template v-slot:[`item.is_admin_active_user`]="{ item }">
          <global-switcher
            :id="item.id"
            :url="`wallet/${item.id}/toggle-active-user`"
            v-model:modalValue="item.is_admin_active_user"
          />
        </template>
        <template v-slot:[`item.actions`]="{ item, index }">
          <div class="flex items-center gap-4">
            <router-link :to="`/wallet/form/${item.id}`">
              <svg-icon class="text-primary" name="edit" filled />
            </router-link>
            <Deleter
              :url="`wallet/${item.id}`"
              :id="item.id"
              method="DELETE"
              @remove="items.splice(index, 1)"
            />
          </div>
        </template> -->
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

const breadItems = [
  {
    name: t("TITLES.home"),
    path: "/",
    imgIcon: "settings.svg",
  },
  {
    name: t("LABELS.wallet"),
    path: "/wallet",
    imgIcon: "",
  },
];

const items = ref([]);
const loading = ref(false);
const paginator = ref(null);

const headers = [
{
    title: t("LABELS.Name") ,
    align: "start",
    sortable: false,
    key: "full_name",
  },
  {
    title: t("LABELS.balance"),
    align: "start",
    sortable: false,
    key: "balance",
  },
  {
    title: t("LABELS.Actions"),
    align: "start",
    sortable: false,
    key: "icon",
  },
];

function fetchData() {
  loading.value = true;
  
  axios
    .get("wallet", {
      params: {
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

watch(
  () => route.query,
  () => fetchData()
);

onMounted(() => {
  fetchData();
});
</script>
