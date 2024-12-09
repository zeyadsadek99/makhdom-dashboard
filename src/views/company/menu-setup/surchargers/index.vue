<template>
  <div>
    <div class="flex justify-between items-center flex-wrap mb-7">
      <breadcrumbs
        :items="breads"
        :title="$t('TITLES.Surcharges')"
        back="/menu-setup"
      />
      <base-filter
        class="!mb-0"
        v-if="items.length"
        name="subCategory"
        :inputs="[]"
        :btn-name="t(`BUTTONS.add`, { name: t('LABELS.Surcharge') })"
        icon="fas fa-plus"
        :keyword="false"
        @action="$router.push('/menu-setup/surchargers/form')"
      >
        <template v-slot:button>
          <router-link
            to="/menu-setup/surchargers/archived"
            class="archive-btn"
          >
            <span>{{
              $t("BUTTONS.allTrashes", { name: $t("TITLES.Surcharges") })
            }}</span>
          </router-link>
        </template>
      </base-filter>
    </div>

    <base-card1
      class="flex-1 bg-white p-0 md:p-4"
      :class="items.length ? '' : 'flex flex-col'"
    >
      <div :class="items.length ? 'space-y-5' : 'my-auto'">
        <Loader v-if="loading" />
        <template v-else>
          <template v-if="items.length">
            <surchargers
              v-for="item in items"
              :key="item.id"
              :item="item"
              @remove="remove"
              @reload="fetchData"
              @edit="$router.push(`/menu-setup/surchargers/form/${item.id}`)"
            />
          </template>

          <div
            v-else
            class="h-full my-auto items-center justify-center space-y-6"
          >
            <div class="text-center">
              <img
                class="mx-auto"
                src="@/assets/images/surchargers.png"
                alt=""
              />
              <h3 class="mt-4 font-semibold text-text text-center">
                {{
                  $t("TITLES.No have been added yet", {
                    name: $t("TITLES.Surcharges"),
                  })
                }}
              </h3>
              <div
                class="flex items-center justify-center mt-7 gap-2 flex-wrap"
              >
                <router-link
                  to="/menu-setup/surchargers/form"
                  class="base-btn rounded-xl self-end"
                >
                  <i class="fas fa-plus"></i>
                  {{ $t(`BUTTONS.add`, { name: $t("LABELS.Surcharge") }) }}
                </router-link>
                <router-link
                  to="/menu-setup/surchargers/archived"
                  class="archive-btn"
                >
                  <span>{{
                    $t("BUTTONS.allTrashes", { name: $t("TITLES.Surcharges") })
                  }}</span>
                </router-link>
              </div>
            </div>
          </div>
        </template>
      </div>
    </base-card1>
    <base-pagination :item="paginator" v-if="paginator" />
  </div>
</template>

<script setup>
import Surchargers from "@/components/cards/Surchargers.vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue3-toastify";
import * as yup from "yup";
import { onMounted, ref, reactive, watch } from "vue";
import axios from "axios";
import TaxRate from "@/components/cards/TaxRate.vue";
import { useRoute } from "vue-router";

const { t } = useI18n();
const route = useRoute();
const paginator = ref(null);
const items = ref([]);
const loading = ref(true);
function fetchData() {
  loading.value = true;
  axios
    .get("surcharge", {
      params: {
        page: route.query.page || 1,
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
    fetchData();
  }
);

function remove(id) {
  items.value = items.value.filter((el) => el.id != id);
  paginator.value.total--;
}

onMounted(() => fetchData());

const breads = [
  {
    path: "/menu-setup",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.menuSetup"),
  },
  {
    path: "/menu-setup/surchargers",
    imgIcon: "",
    name: t("TITLES.Surcharges"),
  },
];
</script>
