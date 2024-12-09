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
      class="lg:max-w-[85%] xl:max-w-[75%] w-full mx-auto"
    >
      <div class="mb-7 !rounded-2xl">
        <base-card1 classes="xl:!p-8 p-2">
          <h2 class="font-bold text-xl md:mb-7 md:mt-0 mt-3">
            {{ $t("LABELS.Weekly Working Days") }}
          </h2>

          <div
            class="bg-[#FAFAFC] text-sub px-6 py-3 text-sm rounded-lg hidden lg:block mb-3"
          >
            <div class="grid grid-cols-2 lg:flex flex-wrap items-center">
              <div class="flex !w-[130px] gap-1">{{ $t("LABELS.Day") }}</div>
              <div class="flex-1 grid grid-cols-2">
                <div>{{ $t("LABELS.From") }}</div>
                <div>{{ $t("LABELS.To") }}</div>
              </div>
            </div>
          </div>
          <FieldArray name="days" v-slot="{ fields }">
            <fieldset v-for="(field, idx) in fields" :key="field.key">
              <div
                class="grid grid-cols-2 lg:flex gap-2 justify-between flex-wrap xl:px-5"
              >
                <div class="flex !w-[130px] mt-4 gap-1 order-1 lg:order-1">
                  <input-icon name="sun" />

                  <small-details-card :title="field.value.name" />
                </div>
                <div
                  class="lg:flex-1 grid md:grid-cols-2 grid-cols-1 col-span-2 gap-2 order-3 lg:order-2"
                >
                  <BaseDate
                    :id="`days[${idx}].from_time`"
                    :name="`days[${idx}].from_time`"
                    :time-picker="true"
                    icon="hour"
                    :is24="false"
                    :placeholder="`${$t('LABELS.Choose Time')}`"
                    :disabled="!field.value.is_active"
                    v-model:itemValue="field.value.from_time"
                  />

                  <BaseDate
                    :id="`days[${idx}].to_time`"
                    :name="`days[${idx}].to_time`"
                    :time-picker="true"
                    icon="hour"
                    :is24="false"
                    v-model:itemValue="field.value.to_time"
                    :placeholder="`${$t('LABELS.Choose Time')}`"
                    :disabled="!field.value.is_active"
                  />
                </div>
                <div class="order-2 lg:order-3 mx-4 lg:ms-4 ms-auto">
                  <v-switch
                    color="success"
                    :model-value:any="true"
                    class="capitalize w-fit"
                    v-model="field.value.is_active"
                  ></v-switch>
                </div>
              </div>
              <hr v-if="idx != fields.length - 1" class="mb-3 border-line" />
            </fieldset>
          </FieldArray>
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
          <button @click="getData" class="capitalize font-semibold text-sub">
            {{ $t("BUTTONS.cancel") }}
          </button>

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
import { FieldArray } from "vee-validate";
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
const breads = ref([]);
const props = defineProps({
  storeData: {
    required: false,
  },
});

// const schema = yup.object().shape({
//   report_schedule: yup
//     .string()
//     .required(t("ERRORS.isRequired", { name: t("LABELS.Report Schedule") })),
// });

// const initialValues = reactive({
//   report_schedule: "",
// });

const schema = yup.object().shape({
  report_schedule: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.Report Schedule") })),
  days: yup
    .array()
    .of(
      yup.object().shape({
        from_time: yup
          .mixed()
          .test(
            "from_time",
            t("ERRORS.isRequired", { name: t("LABELS.fromTime") }),
            (values, ctx) => {
              if (ctx.parent.is_active) {
                if (values) {
                  return true;
                }
              } else {
                return true;
              }
            }
          )
          .nullable(),
        to_time: yup
          .mixed()
          .test(
            "to_time",
            t("ERRORS.isRequired", { name: t("LABELS.toTime") }),
            (values, ctx) => {
              if (ctx.parent.is_active) {
                if (values) {
                  return true;
                }
              } else {
                return true;
              }
            }
          )
          .nullable(),
      })
    )
    .strict(),
});
const initialValues = reactive({
  days: [
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
      available_at: "tues",
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
  ],
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
  values.days.map((item, index) => {
    frmData.append(`work_times[${index}][available_at]`, item.available_at);
    frmData.append(`work_times[${index}][is_active]`, +item.is_active);
    if (item.is_active) {
      if (item.id) frmData.append(`work_times[${index}][id]`, item.id);
      frmData.append(`work_times[${index}][from_time]`, item.from_time);
      frmData.append(`work_times[${index}][to_time]`, item.to_time);
    }
    if (!item.is_active) {
      if (item.id) frmData.append(`work_times[${index}][id]`, item.id);
      frmData.append(
        `work_times[${index}][from_time]`,
        item.from_time ? item.from_time : ""
      );
      frmData.append(
        `work_times[${index}][to_time]`,
        item.to_time ? item.to_time : ""
      );
    }
  });
  axios
    .post("work_time", frmData)
    .then((res) => {
      setData(res.data.data);
      toast.success(res.data.message);
      btnLoading.value = false;
    })
    .catch((e) => {
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

      setData(result);
    });
}

function setData(result) {
  result.map((main) => {
    initialValues.days.map((sub) => {
      if (main.available_at == sub.available_at) {
        sub.is_active = main.is_active;
        sub.available_at = main.available_at;
        sub.from_time = main.from_time;
        sub.to_time = main.to_time;
        sub.id = main.id;
      }
    });
  });

  // for (const [key, value] of Object.entries(result)) {
  //   items.value[key] = value;
  //   for (const day of days.value) {
  //     if (day.id == items.value[key].available_at) {
  //       items.value[key].name = day.name;
  //     }
  //   }
  // }
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
