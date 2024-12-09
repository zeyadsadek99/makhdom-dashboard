<template>
  <teleport to="body">
    <modal
      :persist="true"
      v-if="openModal"
      :title="
        $t(`BUTTONS.${is_table_edit ? 'Edit' : 'new'}`, {
          name: $t('LABELS.table'),
        })
      "
      @close="
        openModal = false;
        resetTableForm();
      "
      class="!overflow-x-hidden"
    >
      <VeeForm
        @submit="handleTableSubmit"
        :validation-schema="tableSchema"
        v-slot="{ meta }"
        :initial-values="initialValues"
      >
        <div class="space-y-3 md:col-span-2 mb-3">
          <p class="text-sub">{{ $t("LABELS.table_type") }} :</p>
          <div class="flex flex-wrap gap-4">
            <VeeField
              name="table_type"
              type="radio"
              v-slot="{ field, meta }"
              value="circle"
            >
              <div
                class="w-fit"
                :class="{
                  error: !meta.valid && meta.touched,
                }"
              >
                <label
                  for="circle"
                  class="flex gap-2 items-center w-fit font-bold"
                >
                  <input
                    name="table_type"
                    id="circle"
                    v-bind="field"
                    type="radio"
                    value="circle"
                    v-model="initialValues.table_type"
                    class="w-5 h-5"
                  />

                  {{ $t("LABELS.Circle table") }}
                </label>
              </div>
            </VeeField>

            <VeeField
              name="table_type"
              type="radio"
              v-slot="{ field, meta }"
              value="square"
            >
              <div
                :class="{
                  error: !meta.valid && meta.touched,
                }"
              >
                <label for="square" class="flex gap-2 items-center font-bold">
                  <input
                    name="table_type"
                    id="square"
                    v-bind="field"
                    type="radio"
                    value="square"
                    class="w-5 h-5"
                    v-model="initialValues.table_type"
                  />

                  {{ $t("LABELS.Square table") }}
                </label>
              </div>
            </VeeField>

            <VeeField
              name="table_type"
              type="radio"
              v-slot="{ field, meta }"
              value="rectangle"
            >
              <div
                :class="{
                  error: !meta.valid && meta.touched,
                }"
              >
                <label
                  for="rectangle"
                  class="flex gap-2 items-center font-bold"
                >
                  <input
                    name="table_type"
                    id="rectangle"
                    v-bind="field"
                    type="radio"
                    value="rectangle"
                    class="w-5 h-5"
                    v-model="initialValues.table_type"
                  />

                  {{ $t("LABELS.Rectangle table") }}
                </label>
              </div>
            </VeeField>
          </div>
        </div>
        <VeeErrorMessage name="table_type" as="div" class="text-error mb-2" />
        <base-input
          id="table_number"
          name="table_number"
          :placeholder="$t('LABELS.Enter', { name: $t('LABELS.Table Number') })"
          :label="$t('LABELS.Table Number')"
          type="number"
          icon="dine-in-table"
        />

        <base-input
          id="number_of_chairs"
          name="number_of_chairs"
          :placeholder="
            $t('LABELS.Enter', { name: $t('LABELS.Number Of Chairs') })
          "
          :label="$t('LABELS.Number Of Chairs')"
          type="number"
          icon="chair"
        />

        <base-select
          id="areas"
          name="areas"
          :placeholder="$t('LABELS.choose')"
          :label="$t('LABELS.areaName')"
          icon="area"
          :options="areas"
          :filter="null"
          :multiple="false"
          :emptyFilterMessage="
            $t('LABELS.noFound', { name: $t('LABELS.area') })
          "
          v-model:itemValue="initialValues.areas"
        />

        <div class="flex items-center justify-end">
          <button
            type="submit"
            :disabled="btnLoading"
            class="base-btn rounded-lg capitalize"
          >
            {{ $t("BUTTONS.save") }}
          </button>
        </div>
      </VeeForm>
    </modal>

    <modal
      :persist="true"
      v-if="openAreaModal"
      :title="$t('BUTTONS.new', { name: $t('LABELS.area') })"
      @close="openAreaModal = false"
      class="!overflow-x-hidden"
    >
      <VeeForm
        @submit="handleAreaSubmit"
        :validation-schema="areaSchema"
        v-slot="{ meta }"
        :initial-values="areaInitialValues"
      >
        <!-- <div class="mb-2 grid md:grid-cols-2 gap-5 overflow-x-hidden"> -->
        <base-input
          id="name"
          name="name"
          :placeholder="$t('LABELS.Enter', { name: $t('LABELS.areaName') })"
          :label="$t('LABELS.areaName')"
          type="text"
          icon="area"
        />
        <!-- <base-input
            id="nameEn"
            name="nameEn"
            :placeholder="
              $t('LABELS.Enter', { name: $t('LABELS.areaName') }) +
              $t('inEnglish')
            "
            :label="$t('LABELS.areaName') + $t('inEnglish')"
            type="text"
            icon="area"
          /> -->
        <!-- </div> -->

        <div class="flex items-center justify-end">
          <button
            type="submit"
            :disabled="btnLoading"
            class="base-btn rounded-lg capitalize"
          >
            {{ $t("BUTTONS.save") }}
          </button>
        </div>
      </VeeForm>
    </modal>
  </teleport>

  <div class="">
    <div class="flex justify-between items-end flex-wrap mb-7">
      <breadcrumbs
        :items="breads"
        :title="$t('TITLES.Dine-in Areas')"
        :back="`/store-setup/${$route.params.id}`"
      />
    </div>
    <base-card1 class="!bg-[#f5f5fa] !shadow-sm">
      <div
        class="flex flex-col lg:flex-row flex-wrap items-start justify-between gap-2"
      >
        <loader v-if="areaLoading" />
        <div
          class="flex flex-1 gap-2 items-center flex-wrap order-2 lg:order-1"
          v-else
        >
          <template v-for="area in areas" :key="area.id">
            <button
              class="rounded-xl"
              :class="
                route.query.area_id == area.id ? 'base-btn' : 'base-btn-white'
              "
              type="button"
              @click="setFilter(area.id)"
            >
              {{ area.name }}
            </button>
          </template>
          <h3
            class="mt-4 font-semibold text-text text-center"
            v-if="!areas.length"
          >
            {{
              $t("TITLES.No have been added yet", {
                name: $t("TITLES.Dine-in Areas"),
              })
            }}
          </h3>
        </div>
        <base-filter
          :inputs="[]"
          name="taxRate"
          :btn-name="$t(`BUTTONS.new`, { name: $t('LABELS.table') })"
          icon="fas fa-plus"
          @action="openModal = true"
          class="!mb-0 ms-auto order-1 lg:order-2"
        >
          <template v-slot:button>
            <button
              type="button"
              @click="openAreaModal = true"
              class="base-btn-white rounded-xl border-primary"
            >
              <i class="fas fa-plus me-2" />
              <span>{{ $t("BUTTONS.new", { name: $t("LABELS.area") }) }}</span>
            </button>
          </template>
        </base-filter>
      </div>
      <div class="my-11">
        <loader v-if="loading" />
        <template v-else>
          <div class="my-5 flex gap-x-5 gap-y-10 items-start flex-wrap">
            <template v-for="table in items" :key="table.id">
              <square
                @click="editTable(table)"
                class="cursor-pointer"
                v-if="table.type == 'square'"
                :item="table"
              />
              <Circle
                @click="editTable(table)"
                class="cursor-pointer"
                v-if="table.type == 'circle'"
                :item="table"
              />
              <Rectangle
                @click="editTable(table)"
                class="cursor-pointer"
                v-if="table.type == 'rectangle'"
                :item="table"
              />
            </template>
          </div>
          <div
            v-if="!items.length"
            class="items-center flex h-full justify-center"
          >
            <div class="space-y-6" v-if="!$route.query.area_id">
              <div class="text-center">
                <img
                  class="mx-auto"
                  src="@/assets/images/icons/store-setup/Dine-in_tables.png"
                  alt=""
                />
                <h3 class="mt-4 font-semibold text-text text-center">
                  {{
                    $t("TITLES.No have been added yet", {
                      name: $t("TITLES.tables"),
                    })
                  }}
                </h3>
              </div>
            </div>
            <h3 v-else class="mt-4 font-semibold text-text text-center">
              {{ $t("TITLES.No tables added yet") }}
            </h3>
          </div>
        </template>
      </div>
    </base-card1>
  </div>
</template>

<script setup>
import { toast } from "vue3-toastify";
import { onMounted, ref, reactive, watch } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import * as yup from "yup";
import Square from "./tables/Square.vue";
import Circle from "./tables/Circle.vue";
import Rectangle from "./tables/Rectangle.vue";
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const paginator = ref(null);

const loading = ref(false);
const areaLoading = ref(true);
const items = ref([]);

const areas = ref([]);
const openModal = ref(false);
const openAreaModal = ref(false);
const btnLoading = ref(false);

defineProps({
  storeData: {
    required: true,
  },
});

const breads = [
  {
    path: "/store-setup",
    imgIcon: "storeSetup.svg",
    name: t("sidebar.storeSetup"),
  },
  {
    path: `/store-setup/${route.params.id}/dine-in-areas`,
    imgIcon: "",
    name: t("TITLES.Dine-in Areas"),
  },
];

const tableSchema = yup.object().shape({
  table_number: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.Table Number") }))
    .test(
      "Is positive?",
      t("ERRORS.moreThan0", { name: t("LABELS.Table Number") }),
      (value) => value > 0
    ),
  number_of_chairs: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.Number Of Chairs") }))
    .test(
      "Is positive?",
      t("ERRORS.moreThan0", { name: t("LABELS.Number Of Chairs") }),
      (value) => value > 0
    )
    .test(
      "Is positive?",
      t("ERRORS.lessThanOrEqual10", { name: t("LABELS.Number Of Chairs") }),
      (value) => value <= 10
    ),
  areas: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.areaName") })),
  table_type: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.table_type") })),
});

const areaSchema = yup.object().shape({
  // nameEn: yup
  //   .string()
  //   .required(
  //     t("ERRORS.isRequired", { name: t("LABELS.areaName") }) + t("inEnglish")
  //   ),
  name: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.areaName") })),
});

const initialValues = reactive({
  table_number: null,
  number_of_chairs: null,
  areas: Number(route.query.area_id),
  table_type: "",
  is_active: true,
  id: "",
});

watch(
  () => route.query.area_id,
  () => {
    initialValues.areas = Number(route.query.area_id);
  }
);

const is_table_edit = ref(false);
function editTable(table) {
  initialValues.table_number = table.table_num;
  initialValues.number_of_chairs = table.num_of_chairs;
  initialValues.table_type = table.type;
  initialValues.areas = table.area.id;
  initialValues.id = table.id;
  is_table_edit.value = true;
  openModal.value = true;
}

const areaInitialValues = reactive({
  // nameEn: "",
  name: "",
  is_active: false,
});

function handleTableSubmit(values) {
  btnLoading.value = true;
  const frmData = new FormData();

  let url = "table";
  frmData.append("num_of_chairs", values.number_of_chairs);
  frmData.append("table_num", values.table_number);
  frmData.append("type", values.table_type);
  frmData.append("area_id", values.areas);
  frmData.append("is_active", 1);
  frmData.append("store_id", route.params.id);
  if (is_table_edit.value) {
    url = "table/" + initialValues.id;
    frmData.append("_method", "PUT");
  }

  axios
    .post(url, frmData)
    .then((res) => {
      toast.success(res.data.message);
      btnLoading.value = false;
      openModal.value = false;
      fetchData();
      resetTableForm();
    })
    .catch((e) => {
      toast.error(e.response.data.message);
    })
    .finally(() => (btnLoading.value = false));
}

function handleAreaSubmit(values) {
  btnLoading.value = true;
  const frmData = new FormData();
  let url = "area";
  frmData.append("name", values.name);
  frmData.append("is_active", 1);
  frmData.append("store_id", route.params.id);
  // frmData.append("en[name]", values.nameEn);

  axios
    .post(url, frmData)
    .then((res) => {
      toast.success(res.data.message);
      btnLoading.value = false;
      openAreaModal.value = false;
      fetchArea();
      resetAreaForm();
    })
    .catch((e) => {
      toast.error(e.response.data.message);
    })
    .finally(() => (btnLoading.value = false));
}

function resetTableForm() {
  initialValues.table_number = "";
  initialValues.number_of_chairs = "";
  initialValues.areas = null;
  initialValues.id = "";
  initialValues.table_type = null;
  is_table_edit.value = false;
}

function resetAreaForm() {
  // initialValues.nameEn = "";
  areaInitialValues.name = "";
  areaInitialValues.is_active = false;
}

function fetchArea() {
  areaLoading.value = true;
  axios
    .get("all_area", {
      params: {
        store_id: route.params.id,
      },
    })
    .then((res) => {
      areas.value = res.data.data.map((el) => ({
        id: el.id,
        name: el.name,
      }));
      areaLoading.value = false;
    })
    .catch(() => {
      areaLoading.value = false;
    });
}
function fetchData() {
  loading.value = true;
  axios
    .get("table", {
      params: {
        store_id: route.params.id,
        page: route.query.page || 1,
        area_id: route.query.area_id || "",
      },
    })
    .then((res) => {
      items.value = res.data.data;
      if (route.query.area_id == undefined) {
        if (areas.value.length > 0) {
          setFilter(areas.value[0].id);
        }
      }
      loading.value = false;

      paginator.value = res.data.meta;
    })
    .catch(() => (loading.value = false));
}

watch(
  () => route.query,
  () => fetchData()
);
function setFilter(area_id) {
  router.push({
    query: {
      ...route.query,
      area_id,
    },
  });
}

onMounted(() => {
  fetchArea();
  fetchData();
});
</script>

<style lang="scss">
.table_wrapper {
  @apply w-fit items-center;
  .chair {
    @apply w-8 h-4 mx-auto relative inline-flex  rounded-t-full bg-white;
  }

  .table_content {
    @apply relative bg-white min-h-[80px] min-w-[80px]   justify-center items-center flex  mx-auto;
    .table_number {
      @apply bg-[#F1F1F9] transition duration-300 z-10 w-9 h-9 text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-text font-bold p-1 rounded-full;
    }
    &:hover {
      .table_number {
        @apply bg-primary text-white;
      }
    }
    grid-area: table;
  }

  .chair-1 {
    grid-area: one;
  }
  .chair-2 {
    grid-area: two;
  }
  .chair-3 {
    grid-area: three;
  }
  .chair-4 {
    grid-area: four;
  }
  .chair-5 {
    grid-area: five;
  }
  .chair-6 {
    grid-area: six;
  }
  .chair-7 {
    grid-area: chair-7;
  }
  .chair-8 {
    grid-area: chair-8;
  }
  .chair-9 {
    grid-area: chair-9;
  }
  .chair-10 {
    grid-area: chair-10;
  }
}
</style>
