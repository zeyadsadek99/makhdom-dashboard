<template>
  <div class="h-full flex flex-col">
    <breadcrumbs :items="breadItems" :title="$t('LABELS.page')" />
    <div
      class="bg-white rounded-3xl h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] md:p-7 flex-1 flex flex-col"
    >
      <base-filter
        name="page"
        :inputs="inputs"
        :btn-name="t(`BUTTONS.add`, { name: t('LABELS.page') })"
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
                  name: $t("LABELS.page"),
                })
              }}
            </h3>
            <div class="flex items-center justify-center mt-7 gap-2 flex-wrap">
              <router-link to="/page/form" class="base-btn rounded-xl self-end">
                <i class="fas fa-plus"></i>
                {{ $t(`BUTTONS.add`, { name: $t("LABELS.page") }) }}
              </router-link>
            </div>
          </div>
          <h3 v-else class="mt-4 font-semibold text-text text-center">
            {{ $t("TITLES.No Search result") }}
          </h3>
        </template>

        <template v-slot:[`item.title`]="{ item }">
          <div class="flex gap-2 items-center flex-wrap">
            <small-details-card :title="item.title" />
          </div>
        </template>

        <template v-slot:[`item.desc`]="{ item }">
  <div class="flex gap-2 items-center flex-wrap">
    <small-details-card :title="`${item.desc}`" class="truncate w-full max-w-xs" />
  </div>
</template>


        <!-- <template v-slot:[`item.is_admin_active_user`]="{ item }">
          <global-switcher
            :id="item.id"
            :url="`faq/${item.id}/toggle-active-user`"
            v-model:modalValue="item.is_admin_active_user"
          />
        </template> -->
        <template v-slot:[`item.actions`]="{ item, index }">
          <div class="flex items-center gap-4">
            <router-link :to="`/page/form/${item.id}`">
              <svg-icon class="text-primary" name="edit" filled />
            </router-link>
            <Deleter
              :url="`pages/${item.id}`"
              :id="item.id"
              method="DELETE"
              @remove="items.splice(index, 1)"
            />
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
  // {
  //   name: "from_date",
  //   placeholder: "from_date",
  //   type: "date",
  //   icon: "calendar",
  //   filter: null,
  //   multiple: false,
  //   minDate: "",
  // },
  // {
  //   name: "to_date",
  //   placeholder: "to_date",
  //   type: "date",
  //   icon: "calendar",
  //   filter: null,
  //   multiple: false,
  //   minDate: "",
  // },
  {
    name: "type",
    placeholder: "type",
    type: "select",
    // icon: "calendar",
    filter: null,
    options : [
    { id: "", name: t("STATUS.all")},
    { id: 'about', name: 'about' },
    { id: 'privacy-policy', name: 'privacy-policy' },
    { id: 'terms-conditions', name: 'terms-conditions' }
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
    name: t("LABELS.page"),
    path: "/page",
    imgIcon: "",
  },
];

const items = ref([]);
const loading = ref(false);
const paginator = ref(null);

const headers = [
  {
    title: t("LABELS.Title"),
    align: "start",
    sortable: false,
    key: "title",
  },
  {
    title: t("LABELS.Desc"),
    align: "start",
    sortable: false,
    key: "desc",
  },
  // {
  //   title: t("LABELS.Name", { name: t("LABELS.type") }),
  //   align: "start",
  //   sortable: false,
  //   key: "type",
  // },
  // {
  //   title: t("LABELS.Name", { name: t("LABELS.Slug") }),
  //   align: "start",
  //   sortable: false,
  //   key: "slug",
  // },
  // {
  //   title: t("LABELS.email"),
  //   align: "start",
  //   sortable: false,
  //   key: "email",
  // },
  // {
  //   title: t("LABELS.activation"),
  //   align: "start",
  //   sortable: false,
  //   key: "is_admin_active_user",
  // },

  {
    title: t("LABELS.Actions"),
    align: "start",
    sortable: false,
    key: "actions",
  },
];
// const pages = ref([{ id: 'about', name: 'about' },
//   { id: 'privacy-policy', name: 'privacy-policy' },
//   { id: 'terms-conditions', name: 'terms-conditions' }]);
function fetchData() {
  const params = new URLSearchParams();
  // params.append("from", route.query.from_date || "");
  // params.append("to", route.query.to_date || "");
  params.append("type", route.query.type || "");

  params.append("keyword", route.query.keyword || "");
  params.append("page", +route.query.page || 1);
  loading.value = true;
  axios
    .get("pages", {
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
