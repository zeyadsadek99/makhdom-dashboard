<template>
  <div class="h-full flex flex-col">
    <breadcrumbs
      :items="breads"
      :title="t('TITLES.menuItems')"
      back="/menu-setup"
      class="mb-7"
    />

    <div
      class="bg-white rounded-3xl h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] md:p-7 flex-1 flex flex-col"
    >
      <base-filter
        v-if="items.length || dataFilterd"
        name="menuItem"
        :inputs="[]"
        :btn-name="t(`BUTTONS.add`, { name: t('LABELS.menuItem') })"
        icon="fas fa-plus"
        :keyword="true"
        @action="$router.push('/menu-setup/menu-items/form')"
      >
        <template v-slot:button>
          <button type="button" @click="openModal = true" class="export-btn">
            <svg-icon name="import" />

            <span>{{ $t("BUTTONS.import") }}</span>
          </button>

          <button type="button" class="export-btn" @click="importSample">
            <svg-icon name="export" />

            <span>{{ $t("BUTTONS.downloadSampleFile") }}</span>
          </button>
          <button type="button" class="export-btn" @click="exportData">
            <svg-icon name="export" />

            <span>{{ $t("BUTTONS.export") }}</span>
          </button>

          <router-link to="/menu-setup/menu-items/archived" class="archive-btn">
            <span>{{
              $t("BUTTONS.allTrashes", { name: $t("LABELS.menuItems") })
            }}</span>
          </router-link>

          <BaseSideFilter v-if="!filterLoader" :inputs="inputs" />
        </template>
      </base-filter>

      <MultiArchive
        url="delete_ids"
        @reload="
          selectedRows = [];
          fetchData();
        "
        :message="$t('TITLES.areYouSureToArchiveSelected')"
        :items="selectedRows"
        model="products"
        :btn-name="$t('BUTTONS.Archive selected')"
        v-if="selectedRows.length"
      />
      <v-data-table-virtual
        :headers="headers"
        show-select
        :items="items"
        :loading="loading"
        item-value="id"
        v-model="selectedRows"
        class="project-table"
        item-key="id"
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
                  name: $t("LABELS.menuItem"),
                })
              }}
            </h3>
            <div class="flex items-center justify-center mt-7 gap-2 flex-wrap">
              <router-link
                to="/menu-setup/menu-items/form"
                class="base-btn rounded-xl self-end"
              >
                <i class="fas fa-plus"></i>
                {{ $t(`BUTTONS.add`, { name: $t("LABELS.menuItem") }) }}
              </router-link>
              <router-link
                to="/menu-setup/menu-items/archived"
                class="archive-btn"
              >
                <span>{{
                  $t("BUTTONS.allTrashes", { name: $t("TITLES.menuItems") })
                }}</span>
              </router-link>
            </div>
          </div>
        </template>
        <template v-slot:[`item.menuItem`]="{ item }">
          <small-details-card :image="item.image" :title="item.name" />
        </template>
        <template v-slot:[`item.category`]="{ item }">
          <small-details-card :title="item.category?.name ?? null" />
        </template>
        <template v-slot:[`item.sub_category`]="{ item }">
          <small-details-card :title="item.sub_category?.name ?? null" />
        </template>
        <template v-slot:[`item.type`]="{ item }">
          <small-details-card :title="item.type ? $t(item.type) : null" />
        </template>
        <template v-slot:[`item.is_active`]="{ item }">
          <global-switcher
            :id="item.id"
            model="products"
            v-model:modalValue="item.is_active"
          />
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <action-menu
            :edit="true"
            :archive="true"
            :item="item"
            name="product"
            @edit="$router.push(`/menu-setup/menu-items/form/${item.id}`)"
            @reload="fetchData"
            @remove="remove(item.id)"
          />
        </template>
      </v-data-table-virtual>
    </div>
    <base-pagination :item="paginator" v-if="paginator" />
    <teleport to="body">
      <modal
        :persist="true"
        v-if="openModal"
        :title="$t('LABELS.choose')"
        @close="openModal = false"
      >
        <VeeForm
          :validation-schema="schema"
          @submit="handleSubmit"
          :initial-values="initialValues"
        >
          <div class="mb-5">
            <base-file
              modalName="importFile"
              :return-file="true"
              modalType="image"
              id="importFile"
              name="importFile"
              :not-preview="true"
              :placeholder="$t('LABELS.importFile')"
              :label="$t('LABELS.importFile')"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              v-model:itemValue="initialValues.importFile"
              v-model:image="initialValues.importFile"
            />
          </div>
          <div class="flex items-center justify-end">
            <button
              class="base-btn rounded-lg"
              :disabled="btnLoading"
              type="submit"
            >
              {{ $t("BUTTONS.save") }}
            </button>
          </div>
        </VeeForm>
      </modal>
    </teleport>
  </div>
</template>

<script setup>
import axios from "axios";
import Category from "@/components/cards/Categories/Category.vue";
import { ref, onMounted, watch, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { toast } from "vue3-toastify";
import * as yup from "yup";

const { t } = useI18n();
const filterLoader = ref(true);
const categories = ref([]);
const subCategories = ref([]);

const inputs = [
  {
    name: "status",
    placeholder: "status",
    options: [
      {
        name: t("STATUS.All"),
        id: "",
      },
      {
        name: t("STATUS.Available"),
        id: 1,
      },
      {
        name: t("STATUS.Unavailable"),
        id: 0,
      },
    ],
    type: "select",
    filter: null,
    multiple: false,
  },
  {
    name: "type",
    placeholder: "Item Type",
    options: [
      {
        name: t("STATUS.All"),
        id: "",
      },
      {
        name: t("regularItem"),
        id: "regular",
      },
      {
        name: t("comboItem"),
        id: "combo",
      },
      {
        name: t("scaleItem"),
        id: "scale",
      },
    ],
    type: "select",
    filter: null,
    multiple: false,
  },
  {
    name: "category",
    placeholder: "category",
    options: categories.value,
    type: "select",
    filter: [],
    multiple: true,
  },
  {
    name: "subcategory",
    placeholder: "subCategory",
    options: subCategories.value,
    type: "select",
    filter: [],
    multiple: true,
  },
];

const route = useRoute();
const dataFilterd = ref(false);
const breads = [
  {
    path: "/menu-setup",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.menuSetup"),
  },
  {
    path: "/menu-setup/menu-items",
    imgIcon: "",
    name: t("TITLES.menuItems"),
  },
];
const headers = [
  {
    title: t("LABELS.menuItem"),
    align: "start",
    sortable: false,
    key: "menuItem",
  },
  {
    title: t("LABELS.category"),
    align: "start",
    sortable: false,
    key: "category",
  },
  {
    title: t("LABELS.subCategory"),
    align: "start",
    sortable: false,
    key: "sub_category",
  },
  {
    title: t("LABELS.itemType"),
    align: "start",
    sortable: false,
    key: "type",
  },
  {
    title: t("LABELS.status"),
    align: "start",
    sortable: false,
    key: "is_active",
  },
  {
    title: "",
    align: "center",
    sortable: false,
    key: "actions",
  },
];
const items = ref([]);
const loading = ref(false);
const paginator = ref(null);
function fetchData() {
  if (
    route.query.keyword ||
    (route.query.category && route.query.category.length) ||
    route.query.status == 0 ||
    route.query.status == 1 ||
    route.query.type ||
    (route.query.subcategory && route.query.subcategory.length)
  ) {
    dataFilterd.value = true;
  }

  const params = new URLSearchParams();
  params.append("keyword", route.query.keyword || "");
  params.append("type", route.query.type || "");
  params.append("page", route.query.type || +route.query.page || 1);
  params.append(
    "is_active",
    route.query.status == 0 || route.query.status == 1 ? route.query.status : ""
  );
  if (route.query.subcategory && route.query.subcategory.length) {
    JSON.parse(route.query.subcategory).map((el, index) => {
      params.append(`category_id[${index}]`, el);
    });
  }
  if (route.query.category && route.query.category.length) {
    JSON.parse(route.query.category).map((el, index) => {
      params.append(`category[${index}]`, el);
    });
  }

  loading.value = true;
  axios
    .get("product", {
      params: params,
    })
    .then((res) => {
      items.value = res.data.data;
      paginator.value = res.data.meta;
      loading.value = false;
    })
    .catch(() => (loading.value = false));
}

// const [gategories, subCategories] = Promise.all([
//   axios.get("all_category").then((res) => res.data.dat),
//   axios.get("all_sub_category").then(res.data.data),
// ]);

async function getCategories() {
  filterLoader.value = true;
  const category = await axios.get("all_category").then((res) => res.data);
  categories.value = category.data;

  if (!category.data.length) {
    filterLoader.value = false;
    return;
  } else {
    const subCategory = await axios
      .get(`all_sub_category/${category.data[0].id}`)
      .then((res) => res.data);

    subCategories.value = subCategory.data;
    filterLoader.value = false;
  }

  inputs.map((el) => {
    if (el.name == "category") {
      el.options = categories.value;
    }
    if (el.name == "subcategory") {
      el.options = subCategories.value;
    }
  });
}

onMounted(() => {
  getCategories();
  if (route.query.keyword) {
    dataFilterd.value = true;
  }
  fetchData();
});

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
  selectedRows.value = selectedRows.value.filter((el) => el != id);
  paginator.value.total--;
}
const selectedRows = ref([]);

const openModal = ref(false);
const btnLoading = ref(false);

const initialValues = reactive({
  importFile: null,
});

const schema = yup.object().shape({
  importFile: yup
    .mixed()
    .required(t("ERRORS.isRequired", { name: t("LABELS.importFile") })),
});

function exportItme() {
  openModal.value = true;
}
function handleSubmit(values) {
  btnLoading.value = true;

  const frmData = new FormData();
  frmData.append("file", values.importFile);

  axios
    .post("product/excel-import", frmData)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 300);
      btnLoading.value = false;
      openModal.value = false;
      fetchData();
    })
    .catch((e) => {
      btnLoading.value = false;
      toast.error(e.response.data.message);
    });
}

function importSample() {
  axios({
    url: `product/excel-template`,
    method: "GET",
    responseType: "blob", // Important
  }).then((res) => {
    const blob = new Blob([res.data], {
      type: res.data.type,
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    // link.download = "feedback-clients";
    link.click();
    URL.revokeObjectURL(link.href);
  });
}
function exportData() {
  axios({
    url: `product/excel-export`,
    method: "GET",
    responseType: "blob", // Important
  }).then((res) => {
    const blob = new Blob([res.data], {
      type: res.data.type,
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    // link.download = "feedback-clients";
    link.click();
    URL.revokeObjectURL(link.href);
  });
}
</script>
