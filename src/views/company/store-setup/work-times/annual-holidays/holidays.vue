<template>
  <teleport to="body">
    <modal
      :persist="true"
      v-if="openModal"
      :title="
        $t(isEdit ? 'BUTTONS.Edit' : 'BUTTONS.add', {
          name: $t('LABELS.Annual holiday'),
        })
      "
      @close="
        openModal = false;
        resetEdit();
      "
      class="!overflow-x-hidden"
    >
      <VeeForm
        @submit="handleSubmit"
        :validation-schema="schema"
        v-slot="{ meta }"
        :initial-values="initialValues"
      >
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
        <div class="mb-2 grid md:grid-cols-2 gap-5 overflow-x-hidden">
          <base-input
            id="nameAr"
            name="nameAr"
            :placeholder="
              $t('LABELS.Enter', { name: $t('LABELS.Holiday Name') }) +
              $t('inArabic')
            "
            :label="$t('LABELS.Holiday Name') + $t('inArabic')"
            type="text"
            icon="holiday"
          />
          <base-input
            id="nameEn"
            name="nameEn"
            :placeholder="
              $t('LABELS.Enter', { name: $t('LABELS.Holiday Name') }) +
              $t('inEnglish')
            "
            :label="$t('LABELS.Holiday Name') + $t('inEnglish')"
            type="text"
            icon="holiday"
          />
          <BaseDate
            id="fromDate"
            name="from"
            :time-picker="false"
            :enable-time-picker="true"
            icon="calendar"
            :label="`${$t('LABELS.Start Date')}:`"
            :placeholder="`${$t('LABELS.select')}`"
            v-model:itemValue="initialValues.from"
          />
          <BaseDate
            id="toDate"
            name="to"
            :time-picker="false"
            :enable-time-picker="true"
            icon="calendar"
            :label="`${$t('LABELS.End Date')}:`"
            :placeholder="`${$t('LABELS.select')}`"
            v-model:itemValue="initialValues.to"
          />
        </div>

        <div class="flex justify-between">
          <button
            v-if="isEdit"
            class="text-primary flex flex-wrap gap-2 items-center capitalize"
            type="button"
            @click="deleteItem(initialValues.id)"
          >
            <input-icon name="trash" />
            {{ $t("BUTTONS.delete") }}
          </button>

          <base-button
            :meta="meta"
            type="submit"
            :loading="isLoading"
            name="save"
            classes="!bg-primary !text-white min-w-[140px] h-[50px] rounded-[10px] ms-auto"
          />
        </div>
      </VeeForm>
    </modal>
  </teleport>

  <base-card1 class="mt-7">
    <div class="">
      <div class="flex flex-wrap gap-4" v-if="items.length">
        <h2 class="font-semibold text-xl">
          {{ $t("LABELS.Annual holidays") }}
        </h2>
        <button
          type="button"
          class="flex justify-between items-center flex-wrap gap-2 mb-7"
          @click="openModal = true"
        >
          <div
            class="border-2 border-primary rounded-full w-[25px] h-[25px] flex items-center justify-center"
          >
            <i class="fas fa-plus text-primary"></i>
          </div>
          <span class="font-bold text-primary">{{ $t("BUTTONS.add") }}</span>
        </button>
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
          <div class="text-center space-y-3 pt-5">
            <input-icon name="calender" class="mx-auto" />

            <h3 class="font-semibold text-xl">
              {{ $t("LABELS.Annual holidays") }}
            </h3>
            <p class="mt-4 text-text text-center">
              {{
                $t(
                  "LABELS.use work schedules to see when store’s schedules to work"
                )
              }}
            </p>
            <button
              class="base-btn m-auto !rounded-lg"
              type="button"
              @click="openModal = true"
            >
              {{ $t(`BUTTONS.add`, { name: $t("LABELS.Annual holiday") }) }}
            </button>
          </div>
        </template>
        <template v-slot:[`item.name`]="{ item }">
          <div class="flex flex-wrap items-center gap-2">
            <input-icon name="holidayImg" />

            <div>
              <small-details-card :title="item[$i18n.locale].name" />
            </div>
          </div>
        </template>
        <template v-slot:[`item.from_day`]="{ item }">
          <small-details-card
            :title="
              new Date(item.from_day).toLocaleDateString(
                $i18n.locale == 'en' ? 'en-GB' : 'ar-EG',
                {
                  day: 'numeric',
                  month: 'long',
                }
              )
            "
          />
        </template>
        <template v-slot:[`item.to_day`]="{ item }">
          <small-details-card
            :title="
              new Date(item.to_day).toLocaleDateString(
                $i18n.locale == 'en' ? 'en-GB' : 'ar-EG',
                {
                  day: 'numeric',
                  month: 'long',
                }
              )
            "
          />
        </template>

        <template v-slot:[`item.is_active`]="{ item }">
          <div class="flex flex-wrap items-center gap-4">
            <button
              @click="openEdit(item)"
              type="button"
              class="text-primary flex flex-wrap gap-1 items-center"
            >
              <svg-icon name="edit" />
              {{ $t("BUTTONS.edit") }}
            </button>
            <global-switcher
              :id="item.id"
              model="holidays"
              :holiday="true"
              v-model:modalValue="item.is_active"
            />
          </div>
        </template>
      </v-data-table-virtual>
    </div>
  </base-card1>
</template>

<script setup>
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
const btnLoading = ref(false);
const items = ref([]);
const isLoading = ref(false);
const openModal = ref(false);
const isEdit = ref(false);

const headers = [
  {
    title: t("LABELS.Holiday Name"),
    align: "start",
    sortable: false,
    key: "name",
  },
  {
    title: t("LABELS.Start Date"),
    align: "start",
    sortable: false,
    key: "from_day",
  },
  {
    title: t("LABELS.End Date"),
    align: "start",
    sortable: false,
    key: "to_day",
  },
  {
    title: "",
    align: "start",
    sortable: false,
    key: "is_active",
  },
];

function fetchData() {
  loading.value = true;
  axios
    .get("holiday", {
      params: {
        store_id: route.params.id,
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

function deleteItem(id) {
  axios
    .delete(`holiday/${id}`)
    .then((res) => {
      toast.success(t(res.data.messages));
      openModal.value = false;
      fetchData();
      resetEdit();
      loading.value = false;
    })
    .catch(() => (loading.value = false));
}

function openEdit(item) {
  initialValues.nameAr = item.ar.name;
  initialValues.nameEn = item.en.name;
  initialValues.from = item.from_day;
  initialValues.to = item.to_day;
  initialValues.id = item.id;
  initialValues.is_active = item.is_active;
  isEdit.value = true;
  openModal.value = true;
}
function resetEdit() {
  initialValues.nameEn = "";
  initialValues.nameAr = "";
  initialValues.from = "";
  initialValues.to = "";
  initialValues.id = "";
  initialValues.is_active = true;
  isEdit.value = false;
  openModal.value = false;
}
const schema = yup.object().shape({
  nameEn: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.Holiday Name") }) +
        t("inEnglish")
    ),
  nameAr: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.Holiday Name") }) + t("inArabic")
    ),
  from: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.Start Date") })),
  to: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.End Date") })),
});

const initialValues = reactive({
  nameEn: "",
  nameAr: "",
  from: "",
  to: "",
  is_active: true,
  id: "",
});

function handleSubmit(values) {
  btnLoading.value = true;
  const frmData = new FormData();

  let url = "holiday";
  if (initialValues.icon) {
    values.icon = initialValues.icon;
  }
  if (isEdit.value) {
    frmData.append("_method", "PUT");
    url = `holiday/${values.id}`;
  }

  frmData.append("is_active", +initialValues.is_active);
  frmData.append("ar[name]", values.nameAr);
  frmData.append("en[name]", values.nameEn);
  frmData.append("from_day", values.from);
  frmData.append("to_day", values.to);
  frmData.append("store_id", route.params.id);

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

watch(
  () => route.query,
  () => {
    fetchData();
  }
);

onMounted(() => fetchData());
</script>

<style lang="scss"></style>
