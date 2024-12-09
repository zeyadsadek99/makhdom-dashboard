<template>
  <div>
    <div class="flex flex-wrap justify-between">
      <breadcrumbs
        :items="breads"
        :title="$t(`LABELS.About`)"
        back="/scope-settings"
        class="mb-7"
      />

      <base-filter
        v-if="items.length || dataFilterd"
        name="About"
        :keyword="false"
        :inputs="[]"
        :btn-name="$t('BUTTONS.new', { name: $t('LABELS.About') })"
        icon="fas fa-plus"
        @action="$router.push('/scope-settings/about/form')"
      />
    </div>
    <base-card1 :class="items.length ? '' : 'my-auto'">
      <Loader v-if="loading" />
      <template v-else>
        <template v-if="items.length">
          <base-card
            class="border mb-4 last:mb-0"
            v-for="item in items"
            :key="item.id"
          >
            <terms-card
              :item="item"
              @remove="remove"
              @reload="fetchData"
              @edit="$router.push(`/scope-settings/about/form/${item.id}`)"
            />
          </base-card>
        </template>

        <div
          v-else-if="!items.length || !dataFilterd"
          class="items-center flex h-full justify-center"
        >
          <div class="space-y-6">
            <div class="text-center">
              <svg-icon class="m-auto" name="cms" />

              <h3 class="mt-4 font-semibold text-text text-center">
                {{
                  $t("TITLES.No have been added yet", {
                    name: $t("LABELS.About"),
                  })
                }}
              </h3>
            </div>
            <div class="flex items-center gap-2 justify-center">
              <router-link
                to="/scope-settings/about/form"
                class="base-btn rounded-xl self-end"
              >
                <i class="fas fa-plus"></i>
                {{ $t(`BUTTONS.new`, { name: $t("LABELS.About") }) }}
              </router-link>
            </div>
          </div>
        </div>
      </template>
    </base-card1>
    <base-pagination :item="paginator" v-if="paginator" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import TermsCard from "@/components/cards/TermsCard.vue";
import axios from "axios";
const { t } = useI18n();

const route = useRoute();

const breads = [
  {
    path: "/scope-settings",
    imgIcon: "brand-settings.svg",
    name: t("sidebar.settings"),
  },
  {
    path: "/scope-settings/about",
    imgIcon: "",
    name: t("LABELS.About"),
  },
];

const paginator = ref(null);
const items = ref([]);
const loading = ref(true);
const dataFilterd = ref(false);
function fetchData() {
  if (route.query.keyword) {
    dataFilterd.value = true;
  }

  loading.value = true;
  axios
    .get("pages", {
      params: {
        page: route.query.page || 1,
        type: "about",

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

onMounted(() => fetchData());
</script>
