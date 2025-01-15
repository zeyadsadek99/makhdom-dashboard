<template>
  <div class="h-full">
    <breadcrumbs :items="breadItems" :title="$t('LABELS.Blogs')" />
    <div class="flex items-center gap-1 justify-end">
      <base-filter
        :inputs="[]"
        name="Blogs"
        :btn-name="t(`BUTTONS.add`, { name: t('LABELS.Blog') })"
        icon="fas fa-plus"
        :keyword="true"
        @action="$router.push('/scope-settings/blogs/form')"
      />
    </div>
    <!-- Start Base Filter  -->
    <!-- End Base Filter  -->

    <!-- Start data table  -->
    <Loader v-if="loading" />
    <template v-else>
      <NotFound v-if="errResponse?.status === 404" />
      <GlobalError v-else-if="errResponse?.status === 500" />

      <div :class="!items.length ? 'h-full' : ''" v-else>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4"
          v-if="items.length"
        >
          <blog-card
            @remove="remove"
            @reload="fetchData"
            @edit="$router.push(`/scope-settings/blogs/form/${item.id}`)"
            v-for="item in items"
            :key="item.id"
            :item="item"
            url="blogs"
            :activate="`blogs/${item.id}/toggle-active-item`"
          />
        </div>
        <div
          v-else
          class="h-full flex flex-col items-center justify-center space-y-6"
        >
          <div class="text-center">
            <img
              class="mx-auto"
              src="@/assets/images/icons/brand/question.png"
              alt=""
            />
            <h3 class="mt-4 font-semibold text-text text-center">
              {{
                $t("TITLES.No have been added yet", {
                  name: $t("LABELS.Blogs"),
                })
              }}
            </h3>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <router-link
              to="/scope-settings/blogs/form"
              class="text-white mx-auto bg-primary rounded-lg py-3 px-5 text-base self-end"
            >
              <i class="fas fa-plus"></i>
              {{ $t(`BUTTONS.add`, { name: $t("LABELS.Blog") }) }}
            </router-link>
          </div>
        </div>
      </div>
    </template>

    <base-pagination :item="paginator" v-if="paginator" />
  </div>
</template>

<script setup>
import BlogCard from "@/components/cards/BlogCard.vue";

import axios from "axios";
import { useI18n } from "vue-i18n";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const items = ref([]);
const loading = ref(false);
const errResponse = ref(null);
const route = useRoute();
const { t } = useI18n();
const inputs = [];

watch(
  () => route.query,
  () => {
    fetchData();
  }
);
const paginator = ref(null);
function fetchData() {
  loading.value = true;
  axios
    .get("blogs", {
      params: {
        page: route.query.page || 1,
        keyword: route.query.keyword || "",
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

const breadItems = [
  {
    name: t("TITLES.home"),
    path: "/",
    imgIcon: "settings.svg",
  },
  {
    name: t("LABELS.Blogs"),
    path: "/scope-settings/blogs",
    imgIcon: "",
  },
];

function remove(id) {
  items.value = items.value.filter((el) => el.id != id);
}

onMounted(() => fetchData());
</script>

<style></style>
