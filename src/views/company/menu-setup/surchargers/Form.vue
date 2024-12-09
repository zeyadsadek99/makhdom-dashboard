<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="
        t(`BUTTONS.${route.params.id ? 'Edit' : 'add'}`, {
          name: t('LABELS.Surcharge'),
        })
      "
      back="/menu-setup/surchargers"
      class="mb-7"
    />

    <div class="flex gap-4 flex-col md:flex-row flex-wrap justify-center">
      <div class="flex-1 w-full max-w-[800px]">
        <FormSkelton v-if="loading" />

        <template v-else>
          <Form :data="values" @returned-data="setData" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import Form from "./steps/Form.vue";

import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { toast } from "vue3-toastify";

const loading = ref(false);
const btnLoading = ref(false);
const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const values = ref(null);

function setData(event) {
  values.value = event;
  handleSubmit();
}

function handleSubmit() {
  btnLoading.value = true;

  let url = `surcharge`;
  const frmData = new FormData();

  const allOrderTypes = {};
  values.value.orderTypes.map((el) => (allOrderTypes[el.name] = el.status));
  const allAggOrderTypes = {};
  values.value.orderTypesAggregators.map(
    (el) => (allAggOrderTypes[el.name] = el.status)
  );

  if (route.params.id) {
    frmData.append("_method", "PUT");
    url = `surcharge/${route.params.id}`;
  }

  frmData.append("is_active", +values.value.is_active);
  frmData.append("amount_type", values.value.type);
  if (values.value.type == "value") {
    frmData.append("amount_value", values.value.value);
  } else {
    frmData.append("amount_value", values.value.percentage);
  }
  frmData.append("ar[name]", values.value.nameAr);
  frmData.append("en[name]", values.value.nameEn);

  frmData.append("order_type", JSON.stringify(allOrderTypes));

  frmData.append("order_type_aggregators", JSON.stringify(allAggOrderTypes));

  values.value.availabilities.map((el, index) => {
    frmData.append(`availability[${index}][availability_type]`, el.type);
    frmData.append(`availability[${index}][availability_id]`, el.id);
    if (el.availability_id) {
      frmData.append(`availability[${index}][id]`, el.availability_id);
    }
  });
  axios
    .post(url, frmData)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 300);

      btnLoading.value = false;

      router.push("/menu-setup/surchargers");
    })
    .catch((e) => {
      btnLoading.value = false;
      toast.error(e.response.data.message);
    });
}

const breads = [
  {
    path: "/menu-setup",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.menuSetup"),
  },
  {
    path: "/menu-setup/surchargers",
    imgIcon: "",
    name: t("TITLES.Surcharges"),
  },
  {
    name: t(`BUTTONS.${route.params.id ? "Edit" : "add"}`, {
      name: t("LABELS.Surcharge"),
    }),
    path: `/menu-setup/surchargers/form${
      route.params.id ? "/" + route.params.id : ""
    }`,
  },
];

function getData() {
  axios.get(`surcharge/${route.params.id}`).then((res) => {
    const result = res.data.data;

    values.value = {
      is_active: result.is_active,
      nameAr: result.ar.name,
      nameEn: result.en.name,
      type: result.amount_type,
      value: result.amount_type == "value" ? result.amount_value : "",
      percentage: result.amount_type == "percentage" ? result.amount_value : "",
      availabilities: result.availability.map((el) => ({
        id: el.availability.id,
        type: el.availability_type,
        name: el.availability?.complete_name ?? el.availability?.name,
        availability_id: el.id,
      })),
    };
    loading.value = false;
  });
}

onMounted(() => {
  if (route.params.id) {
    loading.value = true;
    getData();
  }
});
</script>
