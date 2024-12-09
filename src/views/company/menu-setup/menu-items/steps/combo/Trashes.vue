<template>
  <div class="h-full flex flex-col">
    <breadcrumbs
      :items="breads"
      :title="t('TITLES.Franchise group')"
      back="/brand-settings/franchise-group/all"
    />

    <!-- Start base filter   -->
    <base-card1 class="flex-1" :class="items.length ? '' : 'flex flex-col'">
      <div class="flex flex-wrap items-end justify-between" v-if="items.length">
        <h2 class="text-sub gap-2 mb-4">
          {{ (paginator?.total || 0) + " " + $t("LABELS.Franchises") }}
        </h2>
      </div>

      <div :class="items.length ? '' : 'my-auto'">
        <Loader v-if="loading" />
        <template v-else>
          <template v-if="items.length">
            <base-card
              class="border mb-4 last:mb-0 h-full"
              v-for="item in items"
              :key="item.id"
            >
              <franchise-card
                :trashed="true"
                :item="item"
                @remove="remove"
                @reload="fetchData"
                @edit="openEdit(item)"
              />
            </base-card>
          </template>

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
                    name: $t("LABELS.Franchise"),
                  })
                }}
              </h3>
            </div>
          </div>
        </template>
      </div>
    </base-card1>
    <base-pagination :item="paginator" v-if="paginator" />

    <!-- End page content -->
  </div>
</template>

<script setup>
import * as yup from "yup";
import FranchiseCard from "@/components/cards/franchise/FranchiseCard.vue";
import { useI18n } from "vue-i18n";
import { onMounted, ref, reactive } from "vue";
import axios from "axios";

const { t } = useI18n();

const breads = [
  {
    path: "/brand-settings",
    imgIcon: "brand-settings.svg",
    name: t("TITLES.brandSettings"),
  },
  {
    path: "/brand-settings/franchise-group/all",
    imgIcon: "",
    name: t("TITLES.Franchise group"),
  },
  {
    path: "/brand-settings/franchise-group/all-trashes",
    imgIcon: "",
    name: t("BUTTONS.allTrashes", { name: t("LABELS.Franchise") }),
  },
];

const paginator = ref(null);
const items = ref([]);
const loading = ref(true);

function fetchData() {
  loading.value = true;
  axios
    .get("franchise_group/trashed")
    .then((res) => {
      items.value = res.data.data;
      paginator.value = res.data.meta;
      loading.value = false;
    })
    .catch(() => (loading.value = false));
}

function remove(id) {
  items.value = items.value.filter((el) => el.id != id);
  paginator.value.total--;
}

onMounted(() => fetchData());

//  Form add & edit

const isEdit = ref(false);
function openEdit(item) {
  initialValues.franchiseNameAr = item.ar.name;
  initialValues.franchiseNameEn = item.en.name;
  initialValues.ordering = item.ordering;
  initialValues.id = item.id;
  is_active.value = item.is_active;
  isEdit.value = true;
  openModal.value = true;
}
function resetEdit() {
  initialValues.franchiseNameEn = "";
  initialValues.franchiseNameAr = "";
  initialValues.ordering = "";
  initialValues.id = "";
  is_active.value = true;
  isEdit.value = false;
  openModal.value = false;
}
const schema = yup.object().shape({
  franchiseNameEn: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.Franchise Name") }) +
        t("inEnglish")
    ),
  franchiseNameAr: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.Franchise Name") }) +
        t("inArabic")
    ),
  ordering: yup
    .string()
    .required(t("ERRORS.ordering"))
    .test(
      "Is positive?",
      t("ERRORS.moreThan0", { name: t("LABELS.ordering") }),
      (value) => value > 0
    ),
});

const initialValues = reactive({
  franchiseNameEn: "",
  franchiseNameAr: "",
  ordering: "",
  id: "",
});

const is_active = ref(true);
const openModal = ref(false);
const btnLoading = ref(false);
function handleSubmit(values) {
  btnLoading.value = true;
  const frmData = new FormData();

  let url = "franchise_group";

  if (isEdit.value) {
    frmData.append("_method", "PUT");
    url = `franchise_group/${values.id}`;
  }

  frmData.append("is_active", +is_active.value);
  frmData.append("ordering", values.ordering);
  frmData.append("ar[name]", values.franchiseNameAr);
  frmData.append("en[name]", values.franchiseNameEn);

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
            el.name = res.data.data[locale.value].name;

            return el;
          } else {
            return el;
          }
        });
      } else {
        let result = res.data.data;

        result.name = res.data.data[locale.value].name;

        items.value.unshift(result);
        resetEdit();
      }
    })
    .catch((e) => {
      toast.error(e.response.data.message);
    })
    .finally(() => (btnLoading.value = false));
}
</script>

<style></style>
