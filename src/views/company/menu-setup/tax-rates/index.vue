<template>
  <div class="h-full flex flex-col">
    <div
      class="flex lg:items-end items-start lg:flex-row flex-col justify-between mb-5"
    >
      <breadcrumbs
        :items="breads"
        :title="$t('TITLES.taxRates')"
        back="/menu-setup"
      />

      <base-filter
        :inputs="[]"
        name="taxRate"
        :btn-name="t(`BUTTONS.add`, { name: t('LABELS.tax rate') })"
        icon="fas fa-plus"
        @action="openModal = true"
      >
        <template v-slot:button>
          <router-link to="/menu-setup/tax-rates/archived" class="archive-btn">
            <span>{{
              $t("BUTTONS.allTrashes", { name: $t("TITLES.taxRates") })
            }}</span>
          </router-link>
        </template>
      </base-filter>
    </div>
    <base-card1
      class="flex-1 bg-white"
      :class="items.length ? '' : 'flex flex-col'"
    >
      <div :class="items.length ? 'space-y-5' : 'my-auto'">
        <Loader v-if="loading" />
        <template v-else>
          <template v-if="items.length">
            <TaxRate
              v-for="item in items"
              :key="item.id"
              :item="item"
              @remove="remove"
              @reload="fetchData"
              @edit="openEdit(item)"
            />
          </template>

          <div
            v-else
            class="h-full my-auto items-center justify-center space-y-6"
          >
            <div class="text-center">
              <img class="mx-auto" src="@/assets/images/tax-rate.png" alt="" />
              <h3 class="mt-4 font-semibold text-text text-center">
                {{
                  $t("TITLES.No have been added yet", {
                    name: $t("TITLES.taxRates"),
                  })
                }}
              </h3>
            </div>
          </div>
        </template>
      </div>
    </base-card1>

    <base-pagination :item="paginator" v-if="paginator" />

    <teleport to="body">
      <modal
        :persist="true"
        v-if="openModal"
        :title="
          t(`TITLES.${initialValues.id ? 'Edit' : 'new'}`, {
            name: t('LABELS.taxRate'),
          })
        "
        classes="!w-full"
        @close="
          openModal = false;
          resetEdit();
        "
      >
        <!-- @close="openModal = false" -->
        <!-- :title="t('TITLES.New Franchise')" -->
        <VeeForm
          as="div"
          :validation-schema="schema"
          @submit="handleSubmit"
          :initial-values="initialValues"
        >
          <form>
            <base-input
              id="nameAr"
              name="nameAr"
              :placeholder="$t('LABELS.Enter Tax Name') + t('inArabic')"
              :label="$t('LABELS.Tax Name') + $t('inArabic')"
              type="text"
              icon="file"
            />
            <base-input
              id="nameEn"
              name="nameEn"
              :placeholder="$t('LABELS.Enter Tax Name') + t('inEnglish')"
              :label="$t('LABELS.Tax Name') + $t('inEnglish')"
              type="text"
              icon="file"
            />
            <div class="hav-precentage">
              <base-input
                id="percentage"
                name="percentage"
                :placeholder="$t('LABELS.Enter Tax Percentage')"
                :label="$t('LABELS.Tax Percentage')"
                type="number"
                icon="percentage"
              />
            </div>
            <!-- <base-input
              id="ordering"
              name="ordering"
              :placeholder="$t('LABELS.ordering')"
              :label="$t('LABELS.ordering')"
              type="number"
              icon="file"
            /> -->
            <div>
              <h3 class="text-text font-semibold">
                {{ $t("LABELS.Availability") }}
              </h3>
              <AvailabilitySelect
                :label="
                  $t('LABELS.store') +
                  '/' +
                  $t('LABELS.city') +
                  '/' +
                  $t('LABELS.country')
                "
                name="availabilities"
                icon="country"
                :options="availabilities"
                :loading="availabilitiesLoader"
                modal-name="tax_rate_availability"
                id="availabilities"
                v-model:itemValue="selectedAvailability"
              />
            </div>

            <div class="mt-2 flex gap-5 items-center flex-wrap">
              <label
                for="is_applied_in_new_item"
                class="!flex gap-1 items-center !font-medium !text-base text-text"
              >
                <input
                  class="!w-5 h-5"
                  id="is_applied_in_new_item"
                  type="checkbox"
                  v-model="initialValues.is_applied_in_new_item"
                />
                {{ $t("LABELS.Applied in new items") }}
              </label>
              <label
                for="is_applied_in_open_item"
                class="!flex gap-1 items-center !font-medium !text-base text-text"
              >
                <input
                  class="!w-5 h-5"
                  id="is_applied_in_open_item"
                  type="checkbox"
                  v-model="initialValues.is_applied_in_open_item"
                />
                {{ $t("LABELS.Applied in open items") }}
              </label>
            </div>

            <div class="flex items-center gap-2">
              <label for="is_active" class="flex items-center gap-2 text-sub">
                <svg-icon name="folder-open" />
                {{ $t("LABELS.Availability") }} :</label
              >
              <v-switch
                color="success"
                :model-value="true"
                class="capitalize"
                v-model="initialValues.is_active"
              ></v-switch>
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
          </form>
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
import TaxRate from "@/components/cards/TaxRate.vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const availabilitiesLoader = ref(false);
const availabilities = ref([]);
const selectedAvailability = ref([]);
const route = useRoute();
const { t } = useI18n();

const breads = [
  {
    path: "/menu-setup",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.menuSetup"),
  },
  {
    path: "/menu-setup/tax-rates",
    imgIcon: "",
    name: t("TITLES.taxRates"),
  },
];

const paginator = ref(null);
const items = ref([]);
const loading = ref(true);
function fetchData() {
  loading.value = true;
  axios
    .get("tax_rate", {
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

onMounted(() => {
  fetchData();
  getAvailabilities();
});
const isEdit = ref(false);
function openEdit(item) {
  initialValues.nameAr = item.ar.name;
  initialValues.nameEn = item.en.name;
  // initialValues.ordering = item.ordering;
  initialValues.percentage = item.percentage;
  initialValues.is_applied_in_open_item = item.is_applied_in_open_item;
  initialValues.is_applied_in_new_item = item.is_applied_in_new_item;
  initialValues.id = item.id;
  initialValues.is_active = item.is_active;

  selectedAvailability.value = item.availability.map((el) => ({
    id: el.availability.id,
    type: el.availability_type,
    name: el.availability?.complete_name ?? el.availability?.name,
    availability_id: el.id,
  }));
  isEdit.value = true;
  openModal.value = true;
}
function resetEdit() {
  initialValues.nameEn = "";
  initialValues.nameAr = "";
  // initialValues.ordering = "";
  initialValues.percentage = "";
  initialValues.availabilities = [];
  initialValues.is_applied_in_open_item = false;
  initialValues.is_applied_in_new_item = false;
  initialValues.id = "";
  initialValues.is_active = true;
  isEdit.value = false;
  selectedAvailability.value = [];
  openModal.value = false;
}

const schema = yup.object().shape({
  nameEn: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.Tax Name") }) + t("inEnglish")
    ),
  nameAr: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.Tax Name") }) + t("inArabic")
    ),
  availabilities: yup
    .array()
    .required(t("ERRORS.isRequired", { name: t("LABELS.Availability") }))
    .min(1, t("ERRORS.isRequired", { name: t("LABELS.Availability") })),
  // ordering: yup
  //   .string()
  //   .required(t("ERRORS.ordering"))
  //   .test(
  //     "Is positive?",
  //     t("ERRORS.moreThan0", { name: t("LABELS.ordering") }),
  //     (value) => value > 0
  //   ),
  percentage: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.Tax Percentage") }))
    .test(
      "Is positive?",
      t("ERRORS.between 1 and 100", { name: t("LABELS.Tax Percentage") }),
      (value) => value >= 1 && value <= 100
    ),
});

const initialValues = reactive({
  nameEn: "",
  nameAr: "",
  // ordering: "",
  id: "",
  availabilities: [],
  is_active: true,
  is_applied_in_open_item: false,
  is_applied_in_new_item: false,
});

const openModal = ref(false);
const btnLoading = ref(false);
function handleSubmit(values) {
  btnLoading.value = true;
  const frmData = new FormData();

  let url = "tax_rate";

  if (isEdit.value) {
    frmData.append("_method", "PUT");
    url = `tax_rate/${values.id}`;
  }

  frmData.append("is_active", +initialValues.is_active);
  frmData.append(
    "is_applied_in_open_item",
    +initialValues.is_applied_in_open_item
  );
  frmData.append(
    "is_applied_in_new_item",
    +initialValues.is_applied_in_new_item
  );
  // frmData.append("ordering", values.ordering);
  frmData.append("ar[name]", values.nameAr);
  frmData.append("en[name]", values.nameEn);
  frmData.append("percentage", values.percentage);

  values.availabilities.map((el, index) => {
    frmData.append(`availability[${index}][availability_type]`, el.type);
    frmData.append(`availability[${index}][availability_id]`, el.id);
    if (el.availability_id) {
      frmData.append(`availability[${index}][id]`, el.availability_id);
    }
  });

  axios
    .post(url, frmData)
    .then((res) => {
      toast.success(res.data.message);
      btnLoading.value = false;
      if (isEdit.value) {
        resetEdit();
        items.value = items.value.map((el) => {
          if (el.id == values.id) {
            el = res.data.data;
            return el;
          } else {
            return el;
          }
        });
      } else {
        let result = res.data.data;

        items.value.unshift(result);
        resetEdit();
      }
    })
    .catch((e) => {
      toast.error(e.response.data.message);
    })
    .finally(() => (btnLoading.value = false));
}

function getAvailabilities() {
  availabilitiesLoader.value = true;
  axios
    .get(`availabilities`)
    .then((res) => {
      availabilities.value = res.data.data;

      availabilitiesLoader.value = false;
    })
    .catch(() => (availabilitiesLoader.value = false));
}
</script>

<style lang="scss">
.hav-precentage {
  @apply relative;
  .with_icon {
    &::after {
      content: "%";
      @apply absolute text-primary font-bold top-1/2 -translate-y-1/2;
      inset-inline-end: 8px;
    }
  }
}
</style>
