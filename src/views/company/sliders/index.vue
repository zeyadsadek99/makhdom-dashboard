<template>
  <div class="h-full flex flex-col">
    <breadcrumbs :items="breadItems" :title="$t('LABELS.sliders')" />
    <div
      class="bg-white rounded-3xl h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] md:p-7 flex-1 flex flex-col"
    >
      <base-filter
        name="sliders"
        :inputs="[]"
        :btn-name="t(`BUTTONS.add`, { name: t('LABELS.slider') })"
        icon="fas fa-plus"
        :keyword="true"
        @action="$router.push('/sliders/form')"
      />
      <h2>{{items.en.title}}</h2>

      
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
    name: t("LABELS.sliders"),
    path: "/sliders",
    imgIcon: "",
  },
];

const items = ref([]);
const loading = ref(false);
const paginator = ref(null);

  const headers = [
    // {
    //   title: t("LABELS.Name", { name: t("LABELS.slider") }),
    //   align: "start",
    //   sortable: false,
    //   key: "title",
    // },
    // {
    //   title: t("LABELS.phone"),
    //   align: "start",
    //   sortable: false,
    //   key: "phone",
    // },
    // {
    //   title: t("LABELS.phone_code"),
    //   align: "start",
    //   sortable: false,
    //   key: "phone_code",
    // },
    // {
    //   title: t("LABELS.activation"),
    //   align: "start",
    //   sortable: false,
    //   key: "is_admin_active_user",
    // },

    // {
    //   title: t("LABELS.Actions"),
    //   align: "start",
    //   sortable: false,
    //   key: "actions",
    // },
  ];

function fetchData() {
  loading.value = true;
  axios
    .get("sliders", {
      params: {
        keyword: route.query.keyword || "",
      },
    })
    .then((res) => {
      items.value = res.data.data;
      console.log(items.value.en.title)
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
