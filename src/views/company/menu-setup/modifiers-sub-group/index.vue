<template>
  <div class="h-full flex flex-col">
    <breadcrumbs
      :items="breads"
      :title="t('TITLES.modifiersSubGroup')"
      back="/menu-setup"
      class="mb-7"
    />

    <div
      class="bg-white rounded-3xl h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] md:p-7 flex-1 flex flex-col"
    >
      <base-filter
        name="subGroup"
        :inputs="[]"
        :btn-name="t(`BUTTONS.add`, { name: t('LABELS.modifiersSubGroup') })"
        icon="fas fa-plus"
        v-if="items.length || $route.query.keyword"
        :keyword="true"
        @action="$router.push('/menu-setup/modifiers-sub-group/form')"
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

          <router-link
            to="/menu-setup/modifiers-sub-group/archived"
            class="archive-btn"
          >
            <span>{{
              $t("BUTTONS.allTrashes", { name: $t("LABELS.modifiersSubGroup") })
            }}</span>
          </router-link>
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
        model="sub_modifiers"
        :btn-name="$t('BUTTONS.Archive selected')"
        v-if="selectedRows.length"
      />

      <v-data-table-virtual
        :headers="headers"
        show-select
        :items="items"
        :loading="loading"
        item-value="id"
        class="project-table"
        item-key="id"
        v-model="selectedRows"
        :no-data-text="$t('TEXTS.noData')"
      >
        <template v-slot:loading>
          <loader class="py-7" />
        </template>
        <template v-slot:no-data>
          <div class="text-center">
            <img
              class="mx-auto"
              src="@/assets/images/stats/modifier_group.png"
              alt=""
            />
            <h3
              class="mt-4 font-semibold text-text text-center"
              v-if="$route.query.keyword"
            >
              {{ $t("TITLES.No Search result") }}
            </h3>
            <h3 v-else class="mt-4 font-semibold text-text text-center">
              {{
                $t("TITLES.No have been added yet", {
                  name: $t("LABELS.modifiersSubGroup"),
                })
              }}
            </h3>
            <div
              class="flex items-center justify-center mt-7 gap-2 flex-wrap"
              v-if="!$route.query.keyword"
            >
              <router-link
                to="/menu-setup/modifiers-sub-group/form"
                class="base-btn rounded-xl self-end"
              >
                <i class="fas fa-plus"></i>
                {{
                  $t(`BUTTONS.add`, { name: $t("LABELS.modifiersSubGroup") })
                }}
              </router-link>
              <router-link
                to="/menu-setup/modifiers-sub-group/archived"
                class="archive-btn"
              >
                <span>{{
                  $t("BUTTONS.allTrashes", {
                    name: $t("TITLES.modifiersSubGroup"),
                  })
                }}</span>
              </router-link>
            </div>
          </div>
        </template>
        <!-- <template v-slot:[`item.name`]="{ item }">
          <small-details-card :title="item[$i18n.locale].name" />
        </template> -->
        <template v-slot:[`item.is_active`]="{ item }">
          <div class="flex items-center gap-2">
            <global-switcher
              :id="item.id"
              model="sub_modifiers"
              v-model:modalValue="item.is_active"
            />
          </div>
        </template>
        <template v-slot:[`item.name`]="{ item }">
          <small-details-card :title="item.name" />
        </template>
        <template v-slot:[`item.modifiers_count`]="{ item }">
          <small-details-card :title="item.modifiers_count" />
        </template>
        <template v-slot:[`item.min_num_of_selection`]="{ item }">
          <small-details-card :title="item.min_num_of_selection" />
        </template>
        <template v-slot:[`item.max_num_of_selection`]="{ item }">
          <small-details-card :title="item.max_num_of_selection" />
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <action-menu
            :edit="true"
            :archive="true"
            :item="item"
            name="sub_modifier"
            @edit="
              $router.push(`/menu-setup/modifiers-sub-group/form/${item.id}`)
            "
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
import * as yup from "yup";
import { ref, onMounted, watch, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const { t } = useI18n();

const route = useRoute();

const breads = [
  {
    path: "/menu-setup",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.menuSetup"),
  },
  {
    path: "/menu-setup/modifiers-sub-group",
    imgIcon: "",
    name: t("TITLES.modifiersSubGroup"),
  },
];

const headers = [
  {
    title: t("LABELS.item"),
    align: "start",
    sortable: false,
    key: "name",
  },
  {
    title: t("LABELS.noOfModifierGroups"),
    align: "start",
    sortable: false,
    key: "modifiers_count",
  },
  {
    title: t("LABELS.minNoOfSelection"),
    align: "start",
    sortable: false,
    key: "min_num_of_selection",
  },
  {
    title: t("LABELS.maxNoOfSelection"),
    align: "start",
    sortable: false,
    key: "max_num_of_selection",
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

const loading = ref(false);

const items = ref([]);

const paginator = ref(null);
function fetchData() {
  loading.value = true;
  axios
    .get("sub_modifier", {
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
    .post("sub_modifier/excel-import", frmData)
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
    url: `sub_modifier/excel-template`,
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
    url: `sub_modifier/excel-export`,
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
