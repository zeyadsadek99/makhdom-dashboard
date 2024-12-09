<template>
  <div class="h-full flex flex-col">
    <breadcrumbs
      :items="breads"
      :title="t('TITLES.main-categories')"
      back="/"
      class="mb-7"
    />

    <div
      class="bg-white rounded-3xl h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] md:p-7 flex-1 flex flex-col"
    >
      <base-filter
        v-if="items.length || dataFilterd"
        name="main-categories"
        :inputs="[]"
        :btn-name="t(`BUTTONS.add`, { name: t('LABELS.main-category') })"
        icon="fas fa-plus"
        :keyword="true"
        @action="$router.push('/main-categories/form')"
        :canStore="checkPermission('categories', 'store')"
      />

      <Loader v-if="loading" />
      <template v-else>
        <NotFound v-if="errResponse?.status === 404" />
        <GlobalError v-else-if="errResponse?.status === 500" />

        <div :class="!items.length ? 'h-full' : ''" v-else>
          <div class="grid xl:grid-cols-2 gap-4" v-if="items.length">
            <DetailsCard
              @remove="remove"
              @reload="fetchData"
              @edit="$router.push(`/main-categories/form/${item.id}`)"
              v-for="item in items"
              :key="item.id"
              :item="item"
              url="categories"
              :activate="`categories/${item.id}/toggle-active-item`"
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
                    name: $t("LABELS.main-categories"),
                  })
                }}
              </h3>
            </div>
            <div
              class="flex items-center gap-2 flex-wrap"
              v-if="checkPermission('categories', 'store')"
            >
              <router-link
                to="/main-categories/form"
                class="text-white mx-auto bg-primary rounded-lg py-3 px-5 text-base self-end"
              >
                <i class="fas fa-plus"></i>
                {{ $t(`BUTTONS.add`, { name: $t("LABELS.main-category") }) }}
              </router-link>
            </div>
          </div>
        </div>
      </template>
    </div>
    <base-pagination :item="paginator" v-if="paginator" />

    <!-- End page content -->
  </div>
</template>

<script setup>
import { checkPermission } from "@/utils/permissions";
import axios from "axios";
import DetailsCard from "@/components/cards/Categories/Category.vue";
import { ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const { t } = useI18n();
const errResponse = ref(null);

const route = useRoute();

const breads = [
  {
    path: "/",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.home"),
  },
  {
    path: "/main-categories",
    imgIcon: "",
    name: t("TITLES.main-categories"),
  },
];
const loading = ref(true);
const btnLoading = ref(false);

const items = ref([]);

const paginator = ref(null);
function fetchData() {
  errResponse.value = null;
  loading.value = true;
  axios
    .get("categories", {
      params: {
        keyword: route.query.keyword || "",
        page: +route.query.page || 1,
      },
    })
    .then((res) => {
      items.value = res.data.data;
      paginator.value = res.data.meta;
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
      errResponse.value = err.response;
    });
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
