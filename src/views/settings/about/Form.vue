<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="
        t(`BUTTONS.${route.params.id ? 'Edit' : 'new'}`, {
          name: t('LABELS.About'),
        })
      "
      back="/scope-settings"
      class="mb-7"
    />

    <div class="flex gap-4 flex-col md:flex-row flex-wrap justify-center">
      <div class="flex-1 w-full md:max-w-[1200px]">
        <FormSkelton v-if="loading" />

        <template v-else>
          <Form
            @reload="getData"
            :data="values"
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

const values = ref(null);

function handleSubmit() {
  btnLoading.value = true;

  let url = `pages`;
  const frmData = new FormData();
  if (route.params.id) {
    frmData.append("_method", "PUT");
    url = `pages/${route.params.id}`;
  }

  frmData.append("type", "about");

  frmData.append("ar[title]", values.value.nameAr);
  frmData.append("en[title]", values.value.nameEn);
  frmData.append("urd[title]", values.value.nameEn);

  frmData.append("ar[desc]", values.value.descAr);
  frmData.append("en[desc]", values.value.descEn);
  frmData.append("urd[desc]", values.value.descEn);

  frmData.append(`ordering`, values.value.ordering);

  axios
    .post(url, frmData)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 300);
      router.push("/scope-settings/about");
      btnLoading.value = false;
    })
    .catch((e) => {
      btnLoading.value = false;
      toast.error(e.response.data.message);
    });
}

function setData(event) {
  values.value = event;
  handleSubmit();
}

const breads = [
  {
    path: "/scope-settings",
    imgIcon: "brand-settings.svg",
    name: t("sidebar.settings"),
  },
  {
    path: "/scope-settings/about",
    imgIcon: "",
    name: t("LABELS.About"),
  },
  {
    imgIcon: "",
    name: t(`BUTTONS.${route.params.id ? "Edit" : "new"}`, {
      name: t("LABELS.About"),
    }),
    path: `/scope-settings/about/form${
      route.params.id ? "/" + route.params.id : ""
    }`,
  },
];

function getData() {
  axios.get(`pages/${route.params.id}`).then((res) => {
    const result = res.data.data;
    values.value = {
      nameAr: result.ar.title,
      nameEn: result.en.title,
      nameUr: result.urd.title,
      descAr: result.ar.desc,
      descEn: result.en.desc,
      descUr: result.urd.desc,
      ordering: result.ordering,
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
