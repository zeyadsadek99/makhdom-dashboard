<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="
        t(`BUTTONS.${route.params.id ? 'Edit' : 'add'}`, {
          name: t('TITLES.modifierGroup'),
        })
      "
      back="/menu-setup/modifiers-group"
      class="mb-7"
    />

    <div class="flex gap-4 flex-col md:flex-row flex-wrap justify-center">
      <div class="flex-1 w-full max-w-[85%]">
        <FormSkelton v-if="loading" />

        <template v-else>
          <Form
            :data="modifierDetails"
            :isLoading="btnLoading"
            @returned-data="setData"
          />
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

const modifierDetails = ref(null);

function setData(event) {
  modifierDetails.value = event;
  handleSubmit();
}

function handleSubmit() {
  btnLoading.value = true;

  let url = `modifier`;
  const frmData = new FormData();

  const allVisiabilities = {};
  modifierDetails.value.visibility.map(
    (el) => (allVisiabilities[el.name] = el.status)
  );
  const allAggVisiabilities = {};
  modifierDetails.value.aggregators_visibility.map(
    (el) => (allAggVisiabilities[el.name] = el.status)
  );

  if (route.params.id) {
    frmData.append("_method", "PUT");
    url = `modifier/${route.params.id}`;
  }

  frmData.append("is_active", +modifierDetails.value.is_active);
  frmData.append("ar[name]", modifierDetails.value.nameAr);
  frmData.append("en[name]", modifierDetails.value.nameEn);

  frmData.append("ar[desc]", modifierDetails.value.descAr);
  frmData.append("en[desc]", modifierDetails.value.descEn);

  frmData.append("visibility", JSON.stringify(allVisiabilities));

  frmData.append("aggregators_visibility", JSON.stringify(allAggVisiabilities));

  modifierDetails.value.availabilities.map((el, index) => {
    frmData.append(`availability[${index}][availability_type]`, el.type);
    if (el.availability_id) {
      frmData.append(`availability[${index}][id]`, el.availability_id);
    }
    frmData.append(`availability[${index}][availability_id]`, el.id);
  });

  modifierDetails.value.products.map((el, index) => {
    frmData.append(`products[${index}]`, el);
  });

  axios
    .post(url, frmData)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 400);

      btnLoading.value = false;
      router.push("/menu-setup/modifiers-group");
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
    path: "/menu-setup/modifiers-group",
    imgIcon: "",
    name: t("TITLES.modifiers"),
  },
  {
    name: t(`BUTTONS.${route.params.id ? "Edit" : "add"}`, {
      name: t("TITLES.modifier"),
    }),
    path: `/menu-setup/modifiers-group/form${
      route.params.id ? "/" + route.params.id : ""
    }`,
  },
];

function getData() {
  axios
    .get(`modifier/${route.params.id}`)
    .then((res) => {
      const result = res.data.data;
      const aggregators_visibility = [];
      // if (result.aggregators_visibility) {
      //   result.aggregators_visibility.map((el) => {
      //     for (const [key, value] of Object.entries(el)) {
      //       aggregators_visibility.push({
      //         name: key,
      //         status: value,
      //       });
      //     }
      //   });
      // }

      const visibility = [];

      // if (result.visibility) {
      //   result.visibility.map((el) => {
      //     for (const [key, value] of Object.entries(el)) {
      //       visibility.push({
      //         name: key,
      //         status: value,
      //       });
      //     }
      //   });
      // }

      modifierDetails.value = {
        nameAr: result.ar.name,
        nameEn: result.en.name,
        descAr: result.ar.desc,
        descEn: result.en.desc,
        is_active: result.is_active,
        aggregators_visibility: aggregators_visibility,
        visibility: visibility,
        products: result.products.map((el) => el.id),
        availabilities: result.availability.map((el) => ({
          id: el.availability?.id,
          type: el.availability_type,
          name: el.availability?.complete_name,
          availability_id: el.id,
        })),
      };

      loading.value = false;
    })
    .catch(() => (loading.value = false));
}

onMounted(() => {
  if (route.params.id) {
    loading.value = true;
    getData();
  }
});
</script>
