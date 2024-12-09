<template>
  <div class="food-icons">
    <breadcrumbs
      :items="breads"
      :title="$t('TITLES.foodIcons')"
      back="/menu-setup/food-icons"
    />

    <v-data-table-virtual
      :headers="headers"
      :items="items"
      item-value="name"
       
      class="project-table"
      item-key="id"
      :loading="loading"
      :loading-text="$t('TEXTS.loadingData')"
      :no-data-text="$t('TEXTS.noData')"
    >
      <template v-slot:loading>
        <loader class="py-7" />
      </template>
      <template v-slot:no-data>
        <div class="text-center">
          <img
            class="mx-auto"
            src="@/assets/images/stats/food-icon.png"
            alt=""
          />
          <h3 class="mt-4 font-semibold text-text text-center">
            {{
              $t("TITLES.No have been added yet", {
                name: t('BUTTONS.allTrashes') + t('TITLES.foodIcons')
              })
            }}
          </h3>
        </div>
      </template>
      <template v-slot:[`item.image`]="{ item }">
        <small-details-card :image="item.image" />
      </template>
      <template v-slot:[`item.name`]="{ item }">
        <small-details-card :title="item[$i18n.locale].name" />
      </template>
      <template v-slot:[`item.desc`]="{ item }">
        <small-details-card :title="item[$i18n.locale].desc" />
      </template>
      <template v-slot:[`item.deleted_at`]="{ item }">
        <small-details-card :title="item.deleted_at" />
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <action-menu
          :item="item"
          name="food_icon"
          :restore="true"
          @restore="showArchive = true"
          @reload="fetchData"
          @remove="remove(item.id)"
        />

        <Teleport to="body">
          <Restore
            v-if="showArchive"
            :url="`food_icon/restore/${item.id}`"
            @remove="
              remove(item.id);
              showArchive = false;
            "
            @close="showArchive = false"
          />
        </Teleport>
      </template>
    </v-data-table-virtual>
  </div>
</template>

<script setup>
import { toast } from "vue3-toastify";
import { onMounted, ref, reactive, watch } from "vue";
import axios from "axios";
import TaxRate from "@/components/cards/TaxRate.vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import * as yup from "yup";
const route = useRoute();
const { t } = useI18n();
const paginator = ref(null);
const loading = ref(true);
const breads = [
  {
    path: "/menu-setup",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.menuSetup"),
  },
  {
    path: "/menu-setup/food-icons",
    imgIcon: "",
    name: t("LABELS.foodIcons"),
  },
  {
    path: "/menu-setup/food-icons/archived",
    imgIcon: "",
    name: t("BUTTONS.allTrashes", { name: t("TITLES.foodIcons") }),
  },
];

const headers = [
  {
    title: t("LABELS.foodIcon"),
    align: "start",
    sortable: false,
    key: "image",
  },
  {
    title: t("LABELS.name"),
    align: "start",
    sortable: false,
    key: "name",
  },
  {
    title: t("LABELS.description"),
    align: "start",
    sortable: false,
    key: "desc",
  },
  {
    title: t("TITLES.archived date"),
    align: "start",
    sortable: false,
    key: "deleted_at",
  },

  {
    title: "",
    align: "center",
    sortable: false,
    key: "actions",
  },
];

const items = ref([]);
const isLoading = ref(false);

function fetchData() {
  loading.value = true;
  axios
    .get("food_icon/trashed", {
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
const showArchive = ref(false);
function remove(id) {
  items.value = items.value.filter((el) => el.id != id);
  paginator.value.total--;
}

onMounted(() => fetchData());
</script>

<style lang="scss">
.food-icon-quill {
  // .ql-toolbar.ql-snow {
  //   height: 50px;
  //   display: flex;
  //   align-items: center;
  // }
  .ql-container.ql-snow {
    height: 100px !important;
  }
}
.food-icons {
  td {
    background: transparent !important;
  }
}
</style>
