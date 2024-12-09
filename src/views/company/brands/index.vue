<template>
  <div class="h-full flex flex-col">
    <breadcrumbs
      :items="breads"
      :title="t('LABELS.Brands')"
      back="/"
      class="mb-7"
    />

    <div
      class="bg-white rounded-3xl h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] md:p-7 flex-1 flex flex-col"
    >
      <base-filter
        v-if="items.length || dataFilterd"
        name="brands"
        :inputs="[]"
        :btn-name="t(`BUTTONS.add`, { name: t('LABELS.brand') })"
        icon="fas fa-plus"
        :keyword="true"
        @action="$router.push('/brands/form')"
      >
        <!-- @action="
          $router.push({
            name: 'add-brand',
          })
        " -->
        <!-- <template v-slot:button>
          <button type="button" @click="openModal = true" class="export-btn">
            <svg-icon name="import" />

            <span>{{ $t("BUTTONS.import") }}</span>
          </button>

          <a
            target="_blank"
            :href="
              axios.defaults.baseURL +
              'export_sub_category?lang=' +
              $i18n.locale
            "
            class="export-btn"
          >
            <svg-icon name="export" />

            <span>{{ $t("BUTTONS.export") }}</span>
          </a>
          <a
            target="_blank"
            :href="
              axios.defaults.baseURL +
              'export_sample_sub_category_data?lang=' +
              $i18n.locale
            "
            class="export-btn"
          >
            <svg-icon name="export" />

            <span>{{ $t("BUTTONS.downloadSampleFile") }}</span>
          </a>
          <router-link
            to="/menu-setup/sub-categories/archived"
            class="archive-btn"
          >
            <span>{{
              $t("BUTTONS.allTrashes", { name: $t("LABELS.subCategories") })
            }}</span>
          </router-link>
        </template> -->
      </base-filter>
      <Loader v-if="loading" />
      <template v-else>
        <NotFound v-if="errResponse?.status === 404" />
        <GlobalError v-else-if="errResponse?.status === 500" />

        <div v-else :class="!items.length ? 'h-full' : ''">
          <div class="grid xl:grid-cols-2 gap-4" v-if="items.length">
            <brand-card
              @remove="remove"
              @reload="fetchData"
              :sub="true"
              url="brands"
              :activate="`brands/${item.id}/toggle-active-item`"
              v-for="item in items"
              :key="item.id"
              :item="item"
              @edit="
                $router.push({
                  name: 'add-brand',
                  params: { id: item.id },
                })
              "
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
                    name: $t("LABELS.brands"),
                  })
                }}
              </h3>
            </div>
            <div class="flex items-center gap-2 flex-wrap">
              <router-link
                :to="{
                  name: 'add-brand',
                }"
                class="text-white mx-auto bg-primary rounded-lg py-3 px-5 text-base self-end"
              >
                <i class="fas fa-plus"></i>
                {{ $t(`BUTTONS.add`, { name: $t("LABELS.brand") }) }}
              </router-link>
            </div>
          </div>
        </div>
      </template>
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
import * as yup from "yup";
import axios from "axios";
import BrandCard from "@/components/cards/brands/BrandCard.vue";
import { ref, onMounted, watch, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { toast } from "vue3-toastify";
const { t } = useI18n();

const route = useRoute();
const errResponse = ref(null);

const breads = [
  {
    path: "/",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.home"),
  },
  {
    path: "/brands",
    imgIcon: "",
    name: t("LABELS.Brands"),
  },
];

const loading = ref(true);

const items = ref([]);

const paginator = ref(null);
function fetchData() {
  errResponse.value = null;
  loading.value = true;
  axios
    .get("brands", {
      params: {
        category_id: route.query.category ?? null,
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
// if (
//   route.query.status == 0 ||
//   route.query.status == 1 ||
//   route.query.keyword
// ) {
//   dataFilterd.value = true;
// }

const openModal = ref(false);
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

const btnLoading = ref(false);
function handleSubmit(values) {
  btnLoading.value = true;

  const frmData = new FormData();
  frmData.append("subCategory_file", values.importFile);

  axios
    .post("import_sub_category", frmData)
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
