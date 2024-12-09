<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="$t('TITLES.Work Times')"
      :back="`/store-setup/${$route.params.id}`"
      class="mb-7"
    />

    <loader v-if="loading" />
    <VeeForm
      v-else
      :validation-schema="schema"
      @submit="handleSubmit"
      :initial-values="initialValues"
      class="md:max-w-[85%] w-full mx-auto"
    >
      <div class="mb-7 !rounded-2xl">
        <base-card1>
          <h2 class="font-bold text-xl mb-5">
            {{ $t("LABELS.Weekly Working Days") }}
          </h2>
          <v-data-table-virtual
            :headers="headers"
            :items="items"
            :loading="loading"
            item-value="id"
            v-model="selectedRows"
            class="worktime-table"
            item-key="id"
            :no-data-text="$t('TEXTS.noData')"
          >
            <template v-slot:loading>
              <loader class="py-7" />
            </template>
            <template v-slot:[`item.name`]="{ item }">
              <div class="flex items-center gap-1">
                <input-icon name="sun" />

                <small-details-card :title="item.name" />
              </div>
            </template>
            <template v-slot:[`item.from_time`]="{ item }">
              <BaseDate
                id="from_time"
                name="from_time"
                :time-picker="true"
                icon="hour"
                :is24="false"
                :placeholder="`${$t('LABELS.Choose Time')}`"
                v-model:itemValue="item.from_time"
                :disabled="!item.is_active"
              />
            </template>
            <template v-slot:[`item.to_time`]="{ item }">
              <BaseDate
                id="to_time"
                name="to_time"
                :time-picker="true"
                icon="hour"
                :is24="false"
                :placeholder="`${$t('LABELS.Choose Time')}`"
                v-model:itemValue="item.to_time"
                :disabled="!item.is_active"
              />
            </template>

            <template v-slot:[`item.is_active`]="{ item }">
              <v-switch
                color="success"
                :model-value:any="true"
                class="capitalize"
                v-model="item.is_active"
              ></v-switch>
            </template>
          </v-data-table-virtual>
        </base-card1>
        <base-card1 class="mt-7">
          <div class="flex flex-wrap justify-between mt-4">
            <div>
              <h2 class="font-semibold text-xl">
                {{ $t("LABELS.Report Schedule") }}
              </h2>
              <p class="text-sm">
                ({{
                  $t(
                    "LABELS.Reports will be sent after the time of end business day"
                  )
                }})
              </p>
            </div>
            <div>
              <BaseDate
                id="report_schedule"
                name="report_schedule"
                :time-picker="true"
                icon="hour"
                :is24="false"
                :label="$t('LABELS.End business Day')"
                :placeholder="`${$t('LABELS.Choose Time')}`"
                v-model:itemValue="initialValues.report_schedule"
              />
            </div>
          </div>
        </base-card1>

        <div class="flex items-center justify-end gap-7 mt-6">
          <router-link
            :to="`/store-setup/${$route.params.id}`"
            class="capitalize font-semibold text-sub"
          >
            {{ $t("BUTTONS.cancel") }}
          </router-link>

          <button
            type="submit"
            class="base-btn rounded-md"
            :disabled="isLoading"
          >
            {{ $t("BUTTONS.save") }}
          </button>
        </div>
        <holidays />
      </div>
    </VeeForm>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import * as yup from "yup";
import { toast } from "vue3-toastify";
import { useRoute } from "vue-router";
import holidays from "./annual-holidays/holidays.vue";

const { t, locale } = useI18n();
const route = useRoute();
const btnLoading = ref(false);
const loading = ref(true);
const isLoading = ref(false);
const selectedRows = ref([]);
const breads = ref([]);
const props = defineProps({
  storeData: {
    required: false,
  },
});

const schema = yup.object().shape({
  report_schedule: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.Report Schedule") })),
});

const initialValues = reactive({
  report_schedule: "",
});

const headers = [
  {
    title: t("LABELS.Day"),
    align: "start",
    sortable: false,
    key: "name",
  },
  {
    title: t("LABELS.From"),
    align: "start",
    sortable: false,
    key: "from_time",
    minWidth: "250",
  },
  {
    title: t("LABELS.To"),
    align: "start",
    sortable: false,
    key: "to_time",
    minWidth: "250",
  },
  {
    title: "",
    align: "start",
    sortable: false,
    key: "is_active",
    minWidth: "100",
    width: "100",
  },
];

const days = ref([
  {
    name: t("Saturday"),
    id: "sat",
  },
  {
    name: t("Sunday"),
    id: "sun",
  },
  {
    name: t("Monday"),
    id: "mon",
  },
  {
    name: t("Tuesday"),
    id: "tue",
  },
  {
    name: t("Wednesday"),
    id: "wed",
  },
  {
    name: t("Thursday"),
    id: "thurs",
  },
  {
    name: t("Friday"),
    id: "fri",
  },
]);

const items = ref([
  {
    id: "",
    name: t("Saturday"),
    available_at: "sat",
    from_time: null,
    to_time: null,
    is_active: false,
  },
  {
    id: "",
    name: t("Sunday"),
    available_at: "sun",
    from_time: null,
    to_time: null,
    is_active: false,
  },
  {
    id: "",
    name: t("Monday"),
    available_at: "mon",
    from_time: null,
    to_time: null,
    is_active: false,
  },
  {
    id: "",
    name: t("Tuesday"),
    available_at: "tue",
    from_time: null,
    to_time: null,
    is_active: false,
  },
  {
    id: "",
    name: t("Wednesday"),
    available_at: "wed",
    from_time: null,
    to_time: null,
    is_active: false,
  },
  {
    id: "",
    name: t("Thursday"),
    available_at: "thurs",
    from_time: null,
    to_time: null,
    is_active: false,
  },
  {
    id: "",
    name: t("Friday"),
    available_at: "fri",
    from_time: null,
    to_time: null,
    is_active: false,
  },
]);

function handleSubmit(values) {
  btnLoading.value = true;
  const frmData = new FormData();
  frmData.append("report_schedule", values.report_schedule);
  frmData.append("store_id", route.params.id);
  items.value.forEach((item, index) => {
    frmData.append(`work_times[${index}][is_active]`, +item.is_active);
    if (item.id) {
      frmData.append(`work_times[${index}][id]`, item.id);
    }
    if (item.from_time) {
      frmData.append(`work_times[${index}][available_at]`, item.available_at);
      frmData.append(`work_times[${index}][from_time]`, item.from_time);
    }
    if (item.to_time)
      frmData.append(`work_times[${index}][to_time]`, item.to_time);
  });
  axios
    .post("work_time", frmData)
    .then((res) => {
      setData(res.data.data);
      toast.success(res.data.message);
      btnLoading.value = false;
    })
    .catch((e) => {
      console.log(e);
      toast.error(e.response.data.message);
    })
    .finally(() => (btnLoading.value = false));
}

function getData() {
  loading.value = true;
  axios
    .get("work_time", { params: { store_id: route.params.id } })
    .then((res) => {
      const result = res.data.data;
      initialValues.report_schedule = res.data.report_schedule;
      if (result) {
        setData(result);
      } else {
        loading.value = false;
      }
    });
}

function setData(result) {
  for (const [key, value] of Object.entries(result)) {
    items.value[key] = value;
    for (const day of days.value) {
      if (day.id == items.value[key].available_at) {
        items.value[key].name = day.name;
      }
    }
  }
  loading.value = false;
}

watch(
  () => props.storeData,
  (value) => {
    breads.value = [
      {
        path: "/store-setup",
        imgIcon: "storeSetup.svg",
        name: t("sidebar.storeSetup"),
      },
      {
        path: `/store-setup/${value ? value.id : ""}`,
        imgIcon: "",
        name: value ? value[locale.value].name : "",
      },
      {
        path: `/store-setup/${route.params.id}/work-times`,
        imgIcon: "",
        name: t("TITLES.Work Times"),
      },
    ];
  },
  {
    immediate: true,
  }
);

onMounted(() => getData());
</script>
<style lang="scss">
.worktime-table {
  .v-table__wrapper {
    padding-bottom: 0 !important;
  }
  tr td {
    border-bottom: unset !important ;
    padding: 5px !important;
  }
  .input_wrapper {
    margin-bottom: 0;
  }
}
</style>
