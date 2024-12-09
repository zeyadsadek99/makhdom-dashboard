<template>
  <div class="h-full flex flex-col">
    <breadcrumbs
      :items="breads"
      :title="t('LABELS.Cancel Reasons')"
      back="/"
      class="mb-7"
    />

    <div
      class="bg-white rounded-3xl h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] md:p-7 flex-1 flex flex-col"
    >
      <base-filter
        v-if="items.length || dataFilterd"
        name="Cancel Reasons"
        :inputs="inputs"
        :btn-name="t(`BUTTONS.add`, { name: t('LABELS.Cancel Reasons') })"
        icon="fas fa-plus"
        :keyword="true"
        @action="$router.push('/cancel-reasons/form')"
      />

      <Loader v-if="loading" />
      <div v-else :class="!items.length ? 'h-full' : ''">
        <div class="grid xl:grid-cols-2 gap-4" v-if="items.length">
          <details-card
            @remove="remove"
            @reload="fetchData"
            @edit="$router.push(`/cancel-reasons/form/${item.id}`)"
            v-for="item in items"
            :key="item.id"
            :item="item"
            url="cancel_reasons"
            :activate="`cancel_reasons/${item.id}/toggle-active-item`"
            :showAcivate="true"
          />
        </div>
        <div
          v-else
          class="h-full flex flex-col items-center justify-center space-y-6"
        >
          <div class="text-center">
            <img
              class="mx-auto"
              src="@/assets/images/icons/brand/franchise.png"
              alt=""
            />
            <h3 class="mt-4 font-semibold text-text text-center">
              {{
                $t("TITLES.No have been added yet", {
                  name: $t("LABELS.Cancel Reasons"),
                })
              }}
            </h3>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <router-link
              to="/cancel-reasons/form"
              class="text-white mx-auto bg-primary rounded-lg py-3 px-5 text-base self-end"
            >
              <i class="fas fa-plus"></i>
              {{ $t(`BUTTONS.add`, { name: $t("LABELS.Cancel Reason") }) }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <base-pagination :item="paginator" v-if="paginator" />

    <!-- End page content -->
  </div>
</template>

<script setup>
import axios from "axios";
import DetailsCard from "@/components/cards/DetailsCard.vue";
import { ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const { t } = useI18n();

const route = useRoute();

const breads = [
  {
    path: "/",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.home"),
  },
  {
    path: "/cancel-reasons",
    imgIcon: "",
    name: t("LABELS.Cancel Reasons"),
  },
];
const loading = ref(true);
const inputs = [
  {
    name: "type",
    placeholder: "type",
    options: [
      {
        name: t("STATUS.All"),
        id: "",
      },
      {
        id: "deal",
        name: t("order_type.deal"),
      },
      {
        id: "story",
        name: t("order_type.story"),
      },
      {
        id: "order",
        name: t("order_type.order"),
      },
    ],
    type: "select",
    filter: null,
    multiple: false,
  },
];

const items = ref([]);

const paginator = ref(null);
function fetchData() {
  loading.value = true;
  axios
    .get("cancel-orders", {
      params: {
        keyword: route.query.keyword || "",
        type: route.query.type || "",
        page: +route.query.page || 1,
      },
    })
    .then((res) => {
      items.value = res.data.data.map((item) => ({
        ...item,
        name: item.title,
        type: t(`order_type.${item.type}`),
      }));
      paginator.value = res.data.meta;
      loading.value = false;
    })
    .catch(() => (loading.value = false));
}

onMounted(() => {
  if (route.query.keyword) {
    dataFilterd.value = true;
  }
  fetchData();
});

const dataFilterd = ref(false);

watch(
  () => route.query,
  () => {
    if (route.query.keyword) {
      dataFilterd.value = true;
    }
    fetchData();
  }
);
function remove(id) {
  items.value = items.value.filter((el) => el.id != id);
  paginator.value.total--;
}
</script>
