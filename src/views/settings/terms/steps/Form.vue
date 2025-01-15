<template>
  <div>
    <loader v-if="loading" />
    <VeeForm
      v-else
      class="space-y-5"
      :validation-schema="schema"
      @submit="handleSubmit"
      :initial-values="initialValues"
    >
      <base-card1 class="w-full grid grid-cols-1 gap-4">
        <base-input
          id="nameAr"
          name="nameAr"
          :placeholder="$t('LABELS.enterTitle') + $t('inArabic')"
          :label="$t('LABELS.Title') + $t('inArabic')"
          type="text"
        />
        <base-input
          id="nameEn"
          name="nameEn"
          :placeholder="$t('LABELS.enterTitle') + $t('inEnglish')"
          :label="$t('LABELS.Title') + $t('inEnglish')"
          type="text"
        />
        <base-input
          id="nameUr"
          name="nameUr"
          :placeholder="$t('LABELS.enterTitle') + $t('inUrd')"
          :label="$t('LABELS.Title') + $t('inUrd')"
          type="text"
        />
        <base-input
          id="descAr"
          name="descAr"
          :placeholder="
            $t('LABELS.Enter', { name: $t('LABELS.desc') }) + $t('inArabic')
          "
          :label="$t('LABELS.desc') + $t('inArabic')"
          type="textarea"
        />
        <base-input
          id="descEn"
          name="descEn"
          :placeholder="
            $t('LABELS.Enter', { name: $t('LABELS.desc') }) + $t('inEnglish')
          "
          :label="$t('LABELS.desc') + $t('inEnglish')"
          type="textarea"
        />
        <base-input
          id="descUr"
          name="descUr"
          :placeholder="
            $t('LABELS.Enter', { name: $t('LABELS.desc') }) + $t('inUrd')
          "
          :label="$t('LABELS.desc') + $t('inUrd')"
          type="textarea"
        />
        <base-input
          id="ordering"
          name="ordering"
          :placeholder="$t('LABELS.ordering')"
          :label="$t('LABELS.ordering')"
          type="number"
        />

        <div class="flex items-center justify-end mt-3 gap-5 mb-7">
          <router-link
            to="/scope-settings/terms"
            class="text-sub font-semibold capitalize"
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
      </base-card1>
    </VeeForm>
  </div>
</template>

<script setup>
import { onBeforeMount, reactive, ref, watch } from "vue";

import { useI18n } from "vue-i18n";

import * as yup from "yup";

const emit = defineEmits(["returned-data"]);
const loading = ref(true);
const props = defineProps({
  data: {
    required: false,
    type: Object,
  },
  isLoading: {
    required: true,
  },
});

const { t } = useI18n();

const initialValues = reactive({
  descEn: "",
  descAr: "",
  descUr: "",
  nameEn: "",
  nameAr: "",
  nameUr: "",
});

const schema = yup.object().shape({
  nameAr: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Title") + t("inArabic"),
    })
  ),
  nameEn: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Title") + t("inEnglish"),
    })
  ),
  nameUr: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Title") + t("inUrd"),
    })
  ),

  descAr: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.desc") + t("inArabic"),
    })
  ),
  descEn: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.desc") + t("inEnglish"),
    })
  ),
  descUr: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.desc") + t("inUrd"),
    })
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

function handleSubmit(values) {
  emit("returned-data", values);
}

function setData() {
  for (const [key, value] of Object.entries(props.data)) {
    if (key == "additionalData") {
      arrangedArray.value = value;
    }
    initialValues[key] = value;
  }

  loading.value = false;
}

onBeforeMount(async () => {
  if (props.data) {
    setData();
  } else {
    loading.value = false;
  }
});
</script>
