<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="$t('TITLES.webSettings')"
      back="/scope-settings"
      class="mb-7"
    />

    <loader v-if="loading" />

    <VeeForm
      v-else
      :validation-schema="schema"
      @submit="handleSubmit"
      :initial-values="initialValues"
      class="w-full"
    >
      <base-card1 :title="$t('TITLES.webSettings')" class="w-full mb-7">
        <div class="grid md:grid-cols-2 grid-cols-1 gap-5 mb-5">
          <base-input
            id="website_title_en"
            name="website_title_en"
            :placeholder="$t('LABELS.web_title') + t('inEnglish')"
            :label="$t('LABELS.web_title') + t('inEnglish')"
            type="text"
            icon="slug"
          />
          <base-input
            id="website_title_ar"
            name="website_title_ar"
            :placeholder="$t('LABELS.web_title') + t('inArabic')"
            :label="$t('LABELS.web_title') + t('inArabic')"
            type="text"
            icon="slug"
          />
          <base-input
            id="email"
            name="email"
            :placeholder="$t('LABELS.email')"
            :label="$t('LABELS.email')"
            type="email"
            icon="envelope"
          />

          <base-input
            id="phone"
            name="phone"
            :placeholder="$t('LABELS.phone')"
            :label="$t('LABELS.phone')"
            icon="phone"
            type="number"
          />
          <base-input
            id="locationInformation_en"
            name="locationInformation_en"
            :placeholder="$t('LABELS.Location Information') + $t('inEnglish')"
            :label="$t('LABELS.Location Information') + $t('inEnglish')"
            type="textarea"
          />
          <base-input
            id="locationInformation_ar"
            name="locationInformation_ar"
            :placeholder="$t('LABELS.Location Information') + $t('inArabic')"
            :label="$t('LABELS.Location Information') + $t('inArabic')"
            type="textarea"
          />
          <base-input
            id="footer_desc_en"
            name="footer_desc_en"
            :placeholder="$t('LABELS.Footer Description') + $t('inEnglish')"
            :label="$t('LABELS.Footer Description') + $t('inEnglish')"
            type="textarea"
          />
          <base-input
            id="footer_desc_ar"
            name="footer_desc_ar"
            :placeholder="$t('LABELS.Footer Description') + $t('inArabic')"
            :label="$t('LABELS.Footer Description') + $t('inArabic')"
            type="textarea"
          />
        </div>
      </base-card1>

      <base-card1 :title="$t('TITLES.socialLinks')" class="w-full mb-7">
        <div class="grid md:grid-cols-2 grid-cols-1 gap-5">
          <base-input
            id="facebook"
            name="facebook"
            :label="$t('LABELS.facebook')"
            :placeholder="
              $t(`LABELS.Enter`, { name: $t('LABELS.facebookLink') })
            "
            type="url"
            icon="facebook"
          />
          <base-input
            id="linkedIn"
            name="linkedin"
            :label="$t('LABELS.linkedIn')"
            :placeholder="
              $t(`LABELS.Enter`, { name: $t('LABELS.linkedInLink') })
            "
            type="url"
            icon="linkedIn"
          />
          <base-input
            id="twitter"
            name="x"
            :label="$t('LABELS.twitter')"
            :placeholder="
              $t(`LABELS.Enter`, { name: $t('LABELS.twitterLink') })
            "
            type="url"
            icon="twitter"
          />
          <base-input
            id="instagram"
            name="instagram"
            :label="$t('LABELS.instagram')"
            :placeholder="
              $t(`LABELS.Enter`, { name: $t('LABELS.instagramLink') })
            "
            type="url"
            icon="instagram"
          />
          <base-input
            id="youtube"
            name="youtube"
            :label="$t('LABELS.youtube')"
            :placeholder="
              $t(`LABELS.Enter`, { name: $t('LABELS.youtubeLink') })
            "
            type="url"
            icon="youtube"
          />
          <base-input
            id="snapchat"
            name="snapchat"
            :label="$t('LABELS.snapchat')"
            :placeholder="
              $t(`LABELS.Enter`, { name: $t('LABELS.snapchatLink') })
            "
            type="url"
            icon="snapchat"
          />

          <base-input
            id="whatsapp"
            name="whatsapp"
            :label="$t('LABELS.whatsapp')"
            :placeholder="$t(`LABELS.Enter`, { name: $t('LABELS.whatsapp') })"
            type="number"
            icon="whatsapp"
          />
          <base-input
            id="googlePlay"
            name="google_play"
            :label="$t('LABELS.googlePlay')"
            :placeholder="
              $t(`LABELS.Enter`, { name: $t('LABELS.googlePlayLink') })
            "
            type="url"
            icon="googlePlay"
          />
          <base-input
            id="app_store"
            name="app_store"
            :label="$t('LABELS.appStore')"
            :placeholder="
              $t(`LABELS.Enter`, { name: $t('LABELS.appStoreLink') })
            "
            type="url"
            icon="appStore"
          />
        </div>
      </base-card1>

      <base-card1 :title="$t('TITLES.SEO Settings')" class="w-full mb-7">
        <div class="grid md:grid-cols-2 grid-cols-1 gap-5">
          <base-input
            id="meta_title"
            name="meta_title_en"
            :placeholder="$t('LABELS.Meta Title') + $t('inEnglish')"
            :label="$t('LABELS.Meta Title') + $t('inEnglish')"
            type="textarea"
          />
          <base-input
            id="meta_title_ar"
            name="meta_title_ar"
            :placeholder="$t('LABELS.Meta Title') + $t('inArabic')"
            :label="$t('LABELS.Meta Title') + $t('inArabic')"
            type="textarea"
          />
          <base-input
            id="meta_desc_en"
            name="meta_desc_en"
            :placeholder="$t('LABELS.Meta Description') + $t('inEnglish')"
            :label="$t('LABELS.Meta Description') + $t('inEnglish')"
            type="textarea"
          />
          <base-input
            id="meta_desc_ar"
            name="meta_desc_ar"
            :placeholder="$t('LABELS.Meta Description') + $t('inArabic')"
            :label="$t('LABELS.Meta Description') + $t('inArabic')"
            type="textarea"
          />

          <base-input
            id="keywords_en"
            name="keywords_en"
            :placeholder="$t('LABELS.Keywords') + $t('inEnglish')"
            :label="$t('LABELS.Keywords') + $t('inEnglish')"
            type="textarea"
          />
          <base-input
            id="keywords_ar"
            name="keywords_ar"
            :placeholder="$t('LABELS.Keywords') + $t('inArabic')"
            :label="$t('LABELS.Keywords') + $t('inArabic')"
            type="textarea"
          />
        </div>
      </base-card1>

      <div class="flex items-center justify-end gap-7">
        <router-link
          to="/brand-settings"
          class="capitalize font-semibold text-sub"
        >
          {{ $t("BUTTONS.cancel") }}
        </router-link>

        <button
          v-if="checkPermission('settings', 'store')"
          type="submit"
          class="base-btn rounded-md"
          :disabled="isLoading"
        >
          {{ $t("BUTTONS.save") }}
        </button>
        <button
          type="button"
          disabled
          v-else
          class="base-btn-red text-error rounded-xl min-w-[90px] h-[42px] p-2"
        >
          {{ $t("BUTTONS.notAllow") }}
        </button>
      </div>
    </VeeForm>
  </div>
</template>

<script setup>
import axios from "axios";
import { checkPermission } from "@/utils/permissions";

import { onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";

import * as yup from "yup";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";
const router = useRouter();
const { t } = useI18n();

const btnLoading = ref(false);

const breads = [
  {
    path: "/scope-settings",
    imgIcon: "",
    name: t("sidebar.settings"),
  },
  {
    path: "/scope-settings/settings",
    imgIcon: "",
    name: t("TITLES.webSettings"),
  },
];
const validRegex =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

const schema = yup.object().shape({
  footer_desc_ar: yup.string().nullable(),
  footer_desc_en: yup.string().nullable(),

  website_title_ar: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.web_title") + t("inArabic") })
    ),
  website_title_en: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.web_title") + t("inEnglish") })
    ),

  phone: yup
    .string()

    .required(t("ERRORS.isRequired", { name: t("LABELS.phone") })),

  email: yup
    .string()
    .email(t("ERRORS.validEmailAddress"))
    .required(t("ERRORS.isRequired", { name: t("LABELS.email") }))
    .matches(validRegex, t("ERRORS.validEmailAddress")),

  facebook: yup
    .string()
    .url(t("LABELS.enterValidUrl"))
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable(),
  // .required(t("ERRORS.isRequired", { name: t("LABELS.facebook") })),
  linkedin: yup
    .string()
    .url(t("LABELS.enterValidUrl"))

    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable(),
  // .required(t("ERRORS.isRequired", { name: t("LABELS.linkedIn") })),
  x: yup
    .string()
    .url(t("LABELS.enterValidUrl"))
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable(),
  // .required(t("ERRORS.isRequired", { name: t("LABELS.twitter") })),
  instagram: yup
    .string()
    .url(t("LABELS.enterValidUrl"))
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable(),
  // .required(t("ERRORS.isRequired", { name: t("LABELS.instagram") })),
  youtube: yup
    .string()
    .url(t("LABELS.enterValidUrl"))
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable(),
  // .required(t("ERRORS.isRequired", { name: t("LABELS.youtube") })),
  snapchat: yup
    .string()
    .url(t("LABELS.enterValidUrl"))
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable(),
  // .required(t("ERRORS.isRequired", { name: t("LABELS.snapchat") })),

  whatsapp: yup
    .string()
    // .url(t("LABELS.enterValidUrl"))
    // .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable(),
  // .required(t("ERRORS.isRequired", { name: t("LABELS.whatsapp") })),
  google_play: yup
    .string()
    .url(t("LABELS.enterValidUrl"))
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable(),
  // .required(t("ERRORS.isRequired", { name: t("LABELS.googlePlay") })),
  app_store: yup
    .string()
    .url(t("LABELS.enterValidUrl"))
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable(),
  // .required(t("ERRORS.isRequired", { name: t("LABELS.appStore") })),

  meta_title_en: yup.string(),
  meta_title_ar: yup.string(),
  meta_desc_ar: yup.string(),
  meta_desc_en: yup.string(),
  keywords_ar: yup.string(),
  keywords_en: yup.string(),

  locationInformation_en: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Location Information") + t("inEnglish"),
    })
  ),
  locationInformation_ar: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Location Information") + t("inArabic"),
    })
  ),
});

const loading = ref(false);
const isLoading = ref(false);

const initialValues = reactive({
  meta_title_ar: "",
  meta_title_en: "",
  meta_desc_ar: "",
  meta_desc_en: "",
  keywords_ar: "",
  keywords_en: "",

  footer_desc_ar: "",
  footer_desc_en: "",
  website_title_en: "",
  website_title_ar: "",

  locationInformation_en: "",
  locationInformation_ar: "",

  email: "",
  phone: null,

  app_store: "",
  google_play: "",

  facebook: "",
  instagram: "",
  linkedin: "",
  whatsapp: "",
  youtube: "",
  x: "",
  snapchat: "",
});

function handleSubmit(values) {
  btnLoading.value = true;

  axios
    .post("settings", values)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 300);
      btnLoading.value = false;
      router.push("/scope-settings");
    })
    .catch((e) => {
      toast.error(e.response.data.message);
    })
    .finally(() => (btnLoading.value = false));
}

function getData() {
  loading.value = true;
  axios.get("settings").then((res) => {
    const result = res.data.data;
    if (result) {
      setData(result);
    } else {
      loading.value = false;
    }
  });
}

function setData(result) {
  result.map((el) => {
    initialValues[el.key] = el.value;
  });
  setTimeout(() => (loading.value = false), 300);
}

onMounted(() => {
  if (checkPermission("settings", "index")) {
    getData();
  }
});
</script>
<style lang="scss">
.orderTypes {
  label {
    color: var(--titles_color);
    font-weight: 500;
  }
}
.web-customization {
  .right {
    .v-switch__track {
      --v-theme-overlay-multiplier: var(--v-theme-success-overlay-multiplier);
      background-color: rgb(var(--v-theme-success)) !important;
      color: rgb(var(--v-theme-on-success)) !important;
    }
  }
}
</style>
