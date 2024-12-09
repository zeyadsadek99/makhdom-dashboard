<template>
  <VeeForm
    :validation-schema="schema"
    @submit="handleSubmit"
    :initial-values="initialValues"
  >
    <base-card1 :title="$t('TITLES.generalDetails')" class="p-7 mt-5">
      <v-switch
        color="success"
        :model-value:any="true"
        class="capitalize"
        :label="
          $t(
            initialValues.is_active ? 'LABELS.activated' : 'LABELS.inactivated'
          )
        "
        v-model="initialValues.is_active"
      ></v-switch>
      <div class="grid sm:grid-cols-2 gap-3">
        <base-input
          id="kotNameAr"
          name="kotNameAr"
          :placeholder="$t('LABELS.kotName') + $t('inArabic')"
          :label="$t('LABELS.kotName') + $t('inArabic')"
          icon="kotName"
        />
        <base-input
          id="kotNameEn"
          name="kotNameEn"
          :placeholder="$t('LABELS.kotName') + $t('inEnglish')"
          :label="$t('LABELS.kotName') + $t('inEnglish')"
          icon="kotName"
        />
      </div>

      <base-select
        id="printer_related_to"
        :placeholder="$t('LABELS.printer_related_to')"
        :label="$t('LABELS.printer_related_to')"
        name="printer_related_to"
        icon="printer"
        url="printer/all"
        :filter="null"
        :multiple="false"
        :emptyFilterMessage="$t('LABELS.noFound')"
        v-model:itemValue="initialValues.printer_related_to"
      />

      <div class="grid sm:grid-cols-2 gap-3">
        <base-input
          type="textarea"
          id="descAr"
          name="descAr"
          :placeholder="$t('LABELS.desc') + $t('inArabic')"
          :label="$t('LABELS.desc') + $t('inArabic')"
        />

        <base-input
          type="textarea"
          id="descEn"
          name="descEn"
          :placeholder="$t('LABELS.desc') + $t('inEnglish')"
          :label="$t('LABELS.desc') + $t('inEnglish')"
        />
      </div>

      <div class="flex items-center justify-end gap-7 mt-11">
        <router-link
          :to="`/store-setup/${route.params.id}/kot-kitchens`"
          class="capitalize font-semibold text-sub"
        >
          {{ $t("BUTTONS.cancel") }}
        </router-link>

        <button type="submit" class="base-btn rounded-md">
          {{ $t("BUTTONS.save") }}
        </button>
      </div>
    </base-card1>
  </VeeForm>
</template>

<script setup>
import axios from "axios";
import { ref, reactive, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import * as yup from "yup";
const route = useRoute();

const props = defineProps({
  data: {
    required: false,
    type: Object,
  },
});
const { t } = useI18n();

const initialValues = reactive({
  kotNameAr: "",
  kotNameEn: "",
  printer_related_to: null,
  is_active: true,
  descAr: "",
  descEn: "",
});

const schema = yup.object().shape({
  kotNameAr: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.kotName") + t("inArabic") })
    ),
  kotNameEn: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.kotName") + t("inEnglish") })
    ),
  printer_related_to: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.printer_related_to"),
    })
  ),
  descAr: yup.string(),
  // .required(
  //   t("ERRORS.isRequired", { name: t("LABELS.desc") + t("inArabic") })
  // ),
  descEn: yup.string(),
  // .required(
  //   t("ERRORS.isRequired", { name: t("LABELS.desc") + t("inEnglish") })
  // ),
});
const emit = defineEmits(["returned-data"]);

function handleSubmit(values) {
  values.is_active = initialValues.is_active;
  emit("returned-data", values);
}

function setData() {
  for (const [key, value] of Object.entries(props.data)) {
    initialValues[key] = value;
  }
}

onBeforeMount(() => {
  if (props.data) {
    setData();
  }
});
</script>
