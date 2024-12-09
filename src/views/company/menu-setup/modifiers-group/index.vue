<template>
  <div class="h-full flex flex-col">
    <breadcrumbs
      :items="breads"
      :title="t('TITLES.modifierGroup')"
      back="/menu-setup"
      class="mb-7"
    />

    <div
      class="bg-white rounded-3xl h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] md:p-7 flex-1 flex flex-col"
    >
      <base-filter
        v-if="items.length || route.query.keyword"
        name="group"
        :inputs="[]"
        :btn-name="t(`BUTTONS.add`, { name: t('LABELS.modifierGroup') })"
        icon="fas fa-plus"
        :keyword="true"
        @action="$router.push('/menu-setup/modifiers-group/form')"
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
            to="/menu-setup/modifiers-group/archived"
            class="archive-btn"
          >
            <span>{{
              $t("BUTTONS.allTrashes", { name: $t("LABELS.modifierGroup") })
            }}</span>
          </router-link>
        </template>
      </base-filter>

      <Loader v-if="loading" />
      <div v-else :class="!items.length ? 'h-full' : ''">
        <div class="grid xl:grid-cols-2 gap-4" v-if="items.length">
          <ModifiersGroup
            v-for="item in items"
            :key="item.id"
            :item="item"
            url="modifier"
            @remove="remove"
            @reload="fetchData"
            @edit="$router.push(`/menu-setup/modifiers-group/form/${item.id}`)"
          />
        </div>
        <div v-else class="h-full flex flex-col items-center justify-center">
          <div class="space-y-6">
            <div class="text-center">
              <img
                class="mx-auto"
                src="@/assets/images/stats/modifier_group.png"
                alt=""
              />
              <h3
                class="mt-4 font-semibold text-text text-center"
                v-if="!$route.query.keyword"
              >
                {{
                  $t("TITLES.No have been added yet", {
                    name: $t("LABELS.modifierGroup"),
                  })
                }}
              </h3>
              <h3 class="mt-4 font-semibold text-text text-center" v-else>
                {{ $t("TITLES.No Search result") }}
              </h3>
            </div>
            <div
              class="flex items-center gap-2 flex-wrap"
              v-if="!$route.query.keyword"
            >
              <router-link
                to="/menu-setup/modifiers-group/form"
                class="text-white mx-auto bg-primary rounded-lg py-3 px-5 text-base self-end"
              >
                <i class="fas fa-plus"></i>
                {{ $t(`BUTTONS.add`, { name: $t("LABELS.modifierGroup") }) }}
              </router-link>
              <router-link
                to="/menu-setup/modifiers-group/archived"
                class="archive-btn"
              >
                <span>{{
                  $t("BUTTONS.allTrashes", { name: $t("LABELS.modifierGroup") })
                }}</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
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
import { toast } from "vue3-toastify";
import * as yup from "yup";
import { onMounted, ref, reactive, watch } from "vue";
import axios from "axios";
import ModifiersGroup from "@/components/cards/ModifiersGroup.vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const route = useRoute();
const { t } = useI18n();

const breads = [
  {
    path: "/menu-setup",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.menuSetup"),
  },
  {
    path: "/menu-setup/modifiers-group",
    imgIcon: "",
    name: t("TITLES.modifiers"),
  },
];

const paginator = ref(null);
const items = ref([]);

const loading = ref(false);
function fetchData() {
  loading.value = true;
  axios
    .get("modifier", {
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
    .post("modifier/excel-import", frmData)
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
    url: `modifier/excel-template`,
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
    url: `modifier/excel-export`,
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

<style lang="scss">
.hav-precentage {
  @apply relative;
  .with_icon {
    &::after {
      content: "%";
      @apply absolute   text-primary font-bold top-1/2 -translate-y-1/2;
      inset-inline-end: 8px;
    }
  }
}
</style>
