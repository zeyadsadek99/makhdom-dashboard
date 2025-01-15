<template>
  <div>
    <breadcrumbs
      back="/scope-settings/blogs"
      :title="$t('LABELS.Blogs')"
      :items="breads"
    />
    <div class="flex gap-4 flex-wrap">
      <div class="flex-1 w-full min-w-[250px]">
        <FormSkelton v-if="loading" />
        <template v-else>
          <base-card1 :title="$t('TITLES.Details')">
            <VeeForm
              :validation-schema="schema"
              @submit="handleSubmit"
              :initial-values="initialValues"
              v-slot="{ meta }"
            >
              <div class="mb-5">
                <base-file
                  modalName="blogs"
                  modalType="image"
                  id="companyLogo"
                  name="blogImage"
                  :placeholder="$t('LABELS.image')"
                  :label="$t('LABELS.image')"
                  accept="image/png, image/webp, image/jpeg"
                  v-model:itemValue="initialValues.blogPrivew"
                  v-model:image="initialValues.blogImage"
                  @uploading="btnLoading = $event"
                />
              </div>

              <div class="grid gap-2 md:grid-cols-2 mb-4">
                <base-input
                  id="author"
                  name="author"
                  :placeholder="$t('LABELS.author')"
                  :label="$t('LABELS.author')"
                  type="text"
                  icon="user1"
                />
                <base-date
                  id="date"
                  name="date"
                  :placeholder="$t('LABELS.publishDate')"
                  :label="$t('LABELS.publishDate')"
                  icon="calendar"
                  v-model:itemValue="initialValues.date"
                />
              </div>
              <div class="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                <base-input
                  id="nameAr"
                  name="nameAr"
                  :placeholder="$t('LABELS.BlogTitle') + $t('inArabic')"
                  :label="$t('LABELS.BlogTitle') + $t('inArabic')"
                  type="text"
                />
                <base-input
                  id="nameEn"
                  name="nameEn"
                  :placeholder="$t('LABELS.BlogTitle') + $t('inEnglish')"
                  :label="$t('LABELS.BlogTitle') + $t('inEnglish')"
                  type="text"
                />
                <base-input
                  id="nameUr"
                  name="nameUr"
                  :placeholder="$t('LABELS.BlogTitle') + $t('inUrd')"
                  :label="$t('LABELS.BlogTitle') + $t('inUrd')"
                  type="text"
                />
                <base-input
                  id="shortDescAr"
                  name="shortDescAr"
                  :placeholder="$t('LABELS.shortDesc') + $t('inArabic')"
                  :label="$t('LABELS.shortDesc') + $t('inArabic')"
                  type="textarea"
                />
                <base-input
                  id="shortDescEn"
                  name="shortDescEn"
                  :placeholder="$t('LABELS.shortDesc') + $t('inEnglish')"
                  :label="$t('LABELS.shortDesc') + $t('inEnglish')"
                  type="textarea"
                />
                <base-input
                  id="shortDescUr"
                  name="shortDescUr"
                  :placeholder="$t('LABELS.shortDesc') + $t('inUrd')"
                  :label="$t('LABELS.shortDesc') + $t('inUrd')"
                  type="textarea"
                />
              </div>
              <div class="mt-4">
                <base-input
                  id="longDescAr"
                  name="longDescAr"
                  :placeholder="$t('LABELS.content') + $t('inArabic')"
                  :label="$t('LABELS.content') + $t('inArabic')"
                  type="textarea"
                />
                <base-input
                  id="longDescEn"
                  name="longDescEn"
                  :placeholder="$t('LABELS.content') + $t('inEnglish')"
                  :label="$t('LABELS.content') + $t('inEnglish')"
                  type="textarea"
                />
                <base-input
                  id="longDescUr"
                  name="longDescUr"
                  :placeholder="$t('LABELS.content') + $t('inUrd')"
                  :label="$t('LABELS.content') + $t('inUrd')"
                  type="textarea"
                />
              </div>
              <div>
                <sections-list
                  @returned-data="initialValues.sections = $event"
                  :data="initialValues.sections"
                />
                <VeeErrorMessage
                  v-if="!meta.valid && meta.touched"
                  name="sections"
                  as="div"
                  class="text-error"
                />
              </div>

              <div
                class="flex items-center justify-end mt-7 gap-4 md:col-span-2 xl:col-span-3"
              >
                <router-link
                  to="/blogs"
                  class="capitalize font-semibold text-sub"
                >
                  {{ $t("BUTTONS.cancel") }}
                </router-link>
                <button class="base-btn" :disabled="btnLoading" type="submit">
                  {{ $t("BUTTONS.save") }}
                </button>
              </div>
            </VeeForm>
          </base-card1>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as yup from "yup";
import { toast } from "vue3-toastify";
import axios from "axios";
import { reactive, ref, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";

import { useRoute, useRouter } from "vue-router";
import SectionsList from "./sections";
import { uuid } from "vue-uuid";

const route = useRoute();
const router = useRouter();

const { t } = useI18n();

const breads = [
  {
    path: "/",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.home"),
  },
  {
    name: t("LABELS.Blogs"),
    path: "/scope-settings/blogs",
    imgIcon: "",
  },
  {
    name: t(`BUTTONS.${route.params.id ? "Edit" : "add"}`, {
      name: t("LABELS.Blog"),
    }),
    path: `/scope-settings/blogs/form${
      route.params.id ? "/" + route.params.id : ""
    }`,
  },
];

const initialValues = reactive({
  nameAr: "",
  nameEn: "",
  nameUr: "",
  blogImage: "",
  blogPrivew: "",
  shortDescEn: "",
  shortDescAr: "",
  shortDescUr: "",
  longDescEn: "",
  longDescAr: "",
  longDescUr: "",
  author: "",
  date: "",
  id: "",
  sections: [],
});

const schema = yup.object().shape({
  nameEn: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.BlogTitle") }) + t("inEnglish")
    ),
  nameAr: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.BlogTitle") }) + t("inArabic")
    ),
  nameUr: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.BlogTitle") }) + t("inUrd")
    ),
  shortDescEn: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.shortDesc") }) + t("inEnglish")
    ),
  shortDescAr: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.shortDesc") }) + t("inArabic")
    ),
  shortDescUr: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.shortDesc") }) + t("inUrd")
    ),
  longDescEn: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.content") }) + t("inEnglish")
    ),
  longDescAr: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.content") }) + t("inArabic")
    ),
  longDescUr: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.content") }) + t("inUrd")
    ),

  author: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.publisher") })),
  date: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.publishDate") })),

  sections: yup.array(),
  blogImage: yup.mixed().test(
    "blogImage",
    t("ERRORS.isRequired", {
      name: t("LABELS.image", { name: t("LABELS.Blog") }),
    }),
    (value) => {
      if (value || initialValues.blogPrivew) {
        return true;
      }
    }
  ),
});

const btnLoading = ref(false);

function handleSubmit(values, actions) {
  btnLoading.value = true;
  const frmData = new FormData();

  let url = "blogs";

  if (route.params.id) {
    frmData.append("_method", "PUT");
    url = `blogs/${route.params.id}`;
  }

  frmData.append("ar[title]", values.nameAr);
  frmData.append("en[title]", values.nameEn);
  frmData.append("urd[title]", values.nameUr);
  frmData.append("ar[short_desc]", values.shortDescAr);
  frmData.append("en[short_desc]", values.shortDescEn);
  frmData.append("urd[short_desc]", values.shortDescUr);
  frmData.append("ar[long_desc]", values.longDescAr);
  frmData.append("en[long_desc]", values.longDescEn);
  frmData.append("urd[long_desc]", values.longDescUr);
  frmData.append("author", values.author);
  frmData.append("date", values.date);
  if (values.blogImage) {
    frmData.append("image[media]", values.blogImage);
  }

  values.sections.map((section, index) => {
    if (section.id) frmData.append(`sections[${index}][id]`, section.id);
    frmData.append(`sections[${index}][ar][title]`, section.nameAr);
    frmData.append(`sections[${index}][ar][desc]`, section.descAr);
    frmData.append(`sections[${index}][en][title]`, section.nameEn);
    frmData.append(`sections[${index}][en][desc]`, section.descEn);
    frmData.append(`sections[${index}][urd][title]`, section.nameUr);
    frmData.append(`sections[${index}][urd][desc]`, section.descUr);
    if (section.sectionImage)
      frmData.append(`sections[${index}][image][media]`, section.sectionImage);
  });

  axios
    .post(url, frmData)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 300);
      router.push("/scope-settings/blogs");
      btnLoading.value = false;
      actions.resetForm();
    })
    .catch((e) => {
      toast.error(e.response.data.message);
    })
    .finally(() => (btnLoading.value = false));
}

const loading = ref(false);

function getData() {
  axios.get(`blogs/${route.params.id}`).then((res) => {
    const result = res.data.data;

    initialValues.nameAr = result.ar.title;
    initialValues.nameEn = result.en.title;
    initialValues.nameUr = result.urd.title;
    initialValues.shortDescAr = result.ar.short_desc;
    initialValues.shortDescEn = result.en.short_desc;
    initialValues.shortDescUr = result.urd.short_desc;
    initialValues.longDescAr = result.ar.long_desc;
    initialValues.longDescEn = result.en.long_desc;
    initialValues.longDescUr = result.urd.long_desc;
    initialValues.author = result.author;
    initialValues.date = result.date;

    initialValues.blogPrivew = result.image;

    initialValues.sections = result.sections.map((section) => ({
      nameAr: section.ar.title,
      nameEn: section.en.title,
      nameUr: section.urd.title,
      descAr: section.ar.desc,
      descEn: section.en.desc,
      descUr: section.urd.desc,
      blogPrivew: section.image,
      id: section.id,
      uuid: uuid.v1(),
    }));

    initialValues.id = result.id;

    loading.value = false;
  });
}

onBeforeMount(() => {
  if (route.params.id) {
    loading.value = true;
    getData();
  }
});
</script>

<style></style>
