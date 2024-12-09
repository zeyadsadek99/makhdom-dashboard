<template>
  <teleport to="body">
    <modal
      :persist="true"
      v-if="openModal"
      :title="$t('BUTTONS.addFoodIcon')"
      @close="
        openModal = false;
        resetEdit();
      "
      class="!overflow-x-hidden"
    >
      <VeeForm
        as="div"
        @submit="handleSubmit"
        :validation-schema="schema"
        v-slot="{ meta }"
        :initial-values="initialValues"
      >
        <form>
          <div class="mb-2 grid md:grid-cols-2 gap-5 overflow-x-hidden">
            <base-input
              id="nameAr"
              name="nameAr"
              :placeholder="$t('LABELS.enterFoodIconName') + $t('inArabic')"
              :label="$t('LABELS.iconName') + $t('inArabic')"
              type="text"
              icon="food-icon"
            />
            <base-input
              id="nameEn"
              name="nameEn"
              :placeholder="$t('LABELS.enterFoodIconName') + $t('inEnglish')"
              :label="$t('LABELS.iconName') + $t('inEnglish')"
              type="text"
              icon="food-icon"
            />
          </div>

          <div class="mb- food-icon-quill">
            <Quill
              id="descAr"
              name="descAr"
              v-model:itemValue="initialValues.descAr"
              :label="$t(`LABELS.description`) + $t('inArabic')"
            />
          </div>
          <div class="mb-3 food-icon-quill">
            <Quill
              id="descEn"
              name="descEn"
              v-model:itemValue="initialValues.descEn"
              :label="$t(`LABELS.description`) + $t('inEnglish')"
            />
          </div>

          <div class="mb-5">
            <base-file
              modalName="food_icons"
              modalType="image"
              id="icon"
              name="icon"
              :placeholder="$t('LABELS.uploadFoodIcon')"
              :label="$t('LABELS.uploadFoodIcon')"
              multiple
              v-model:itemValue="initialValues.preview"
              v-model:image="initialValues.icon"
            />
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
            <base-button
              :meta="meta"
              type="submit"
              :loading="isLoading"
              name="save"
              classes="!bg-primary !text-white min-w-[140px] h-[50px] rounded-[10px]"
            />
          </div>
        </form>
      </VeeForm>
    </modal>
  </teleport>

  <div class="food-icons">
    <div class="flex justify-between items-end flex-wrap mb-7">
      <breadcrumbs
        :items="breads"
        :title="$t('TITLES.foodIcons')"
        back="/menu-setup"
      />
      <base-filter
        :inputs="[]"
        name="taxRate"
        :btn-name="$t(`BUTTONS.add`, { name: $t('LABELS.foodIcon') })"
        icon="fas fa-plus"
        @action="openModal = true"
        class="!mb-0"
      >
        <template v-slot:button>
          <router-link to="/menu-setup/food-icons/archived" class="archive-btn">
            <span>{{
              $t("BUTTONS.allTrashes", { name: $t("TITLES.foodIcons") })
            }}</span>
          </router-link>
        </template>
      </base-filter>
    </div>

    <v-data-table-virtual
      :headers="headers"
      :items="items"
      :loading="loading"
      item-value="name"
      class="project-table"
      item-key="id"
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
                name: $t("LABELS.foodIcon"),
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
      <template v-slot:[`item.is_active`]="{ item }">
        <div class="flex items-center gap-2">
          <global-switcher
            :id="item.id"
            model="food_icons"
            v-model:modalValue="item.is_active"
          />

          <!-- <span
            class="mb-2"
            :class="$i18n.locale == 'ar' ? 'font-neo-sans' : 'font-switzer'"
            >{{
              item.is_active ? $t("LABELS.active") : $t("LABELS.inactive")
            }}</span
          > -->
        </div>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <action-menu
          :edit="true"
          :archive="true"
          :item="item"
          name="food_icon"
          @edit="openEdit(item)"
          @reload="fetchData"
          @remove="remove(item.id)"
        />
      </template>
    </v-data-table-virtual>
  </div>
</template>

<script setup>
import Quill from "@/components/inputs/Quill.vue";
import { toast } from "vue3-toastify";
import { onMounted, ref, reactive, watch } from "vue";
import axios from "axios";

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
];

const headers = [
  {
    title: t("LABELS.foodIcon"),
    align: "start",
    sortable: false,
    key: "image",
    width: "270",
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
const isLoading = ref(false);

function fetchData() {
  loading.value = true;
  axios
    .get("food_icon", {
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

const openModal = ref(false);

const isEdit = ref(false);
function openEdit(item) {
  initialValues.nameAr = item.ar.name;
  initialValues.nameEn = item.en.name;
  initialValues.descAr = item.ar.desc;
  initialValues.descEn = item.en.desc;
  initialValues.preview = item.image;
  initialValues.id = item.id;
  initialValues.is_active = item.is_active;
  isEdit.value = true;
  openModal.value = true;
}
function resetEdit() {
  initialValues.nameEn = "";
  initialValues.nameAr = "";
  initialValues.descAr = null;
  initialValues.descEn = null;
  initialValues.preview = "";
  initialValues.id = "";
  initialValues.icon = "";
  initialValues.is_active = true;
  isEdit.value = false;
  openModal.value = false;
}
const schema = yup.object().shape({
  nameEn: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.iconName") }) + t("inEnglish")
    ),
  nameAr: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.iconName") }) + t("inArabic")
    ),
  descEn: yup
    .mixed()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.description") }) + t("inEnglish")
    ),
  descAr: yup
    .mixed()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.description") }) + t("inArabic")
    ),
  // ordering: yup
  //   .string()
  //   .required(t("ERRORS.ordering"))
  //   .test(
  //     "Is positive?",
  //     t("ERRORS.moreThan0", { name: t("LABELS.ordering") }),
  //     (value) => value > 0
  //   ),
  icon: yup
    .mixed()
    .test(
      "icon",
      t("ERRORS.isRequired", { name: t("LABELS.uploadFoodIcon") }),
      (value) => {
        if (value || initialValues.preview) {
          return true;
        }
      }
    ),
});

const initialValues = reactive({
  nameEn: "",
  nameAr: "",
  descAr: null,
  descEn: null,
  // ordering: "",
  preview: "",
  icon: "",
  is_active: true,
  id: "",
});

const btnLoading = ref(false);
function handleSubmit(values) {
  btnLoading.value = true;
  const frmData = new FormData();

  let url = "food_icon";
  if (initialValues.icon) {
    values.icon = initialValues.icon;
  }
  if (isEdit.value) {
    frmData.append("_method", "PUT");
    url = `food_icon/${values.id}`;
  }

  frmData.append("is_active", +initialValues.is_active);

  frmData.append("ar[name]", values.nameAr);
  frmData.append("en[name]", values.nameEn);
  frmData.append("ar[desc]", values.descAr);
  frmData.append("en[desc]", values.descEn);

  if (values.icon) {
    frmData.append("image", values.icon);
  }

  axios
    .post(url, frmData)
    .then((res) => {
      toast.success(t(res.data.message));
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
