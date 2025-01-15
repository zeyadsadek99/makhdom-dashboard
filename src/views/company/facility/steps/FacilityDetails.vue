<template>
  <base-card1 :title="$t('TITLES.Details', { name: $t('TITLES.Facility') })">
    <VeeForm
      as="div"
      :validation-schema="schema"
      @submit="handleSubmit"
      :initial-values="initialValues"
    >
      <form class="mt-4">
        <v-switch
          color="primary"
          :model-value:any="true"
          class="capitalize"
          :label="
            $t(
              initialValues.is_active
                ? 'LABELS.activated'
                : 'LABELS.inactivated'
            )
          "
          v-model="initialValues.is_active"
        ></v-switch>
        <div class="mb-5 grid md:grid-cols-2 gap-x-4">
          <base-input
            id="nameAr"
            name="nameAr"
            :placeholder="
              $t('LABELS.Name', { name: $t('LABELS.Facility') }) +
              $t('inArabic')
            "
            :label="
              $t('LABELS.Name', { name: $t('LABELS.Facility') }) +
              $t('inArabic')
            "
            type="text"
          />
          <base-input
            id="nameEn"
            name="nameEn"
            :placeholder="
              $t('LABELS.Name', { name: $t('LABELS.Facility') }) +
              $t('inEnglish')
            "
            :label="
              $t('LABELS.Name', { name: $t('LABELS.Facility') }) +
              $t('inEnglish')
            "
            type="text"
          />
          <base-input
            id="nameUr"
            name="nameUr"
            :placeholder="
              $t('LABELS.Name', { name: $t('LABELS.Facility') }) + $t('inUrd')
            "
            :label="
              $t('LABELS.Name', { name: $t('LABELS.Facility') }) + $t('inUrd')
            "
            type="text"
          />
          <base-select
            id="type"
            name="type"
            :placeholder="$t('LABELS.choose')"
            :label="$t('LABELS.type')"
            :options="types"
            :filter="null"
            :multiple="false"
            v-model:itemValue="initialValues.type"
          />
        </div>

        <div class="mb-5">
          <base-file
            modalName="facility_types"
            modalType="image"
            id="companyLogo"
            name="facilityImage"
            :placeholder="$t('LABELS.image', { name: $t('LABELS.Facility') })"
            :label="$t('LABELS.image', { name: $t('LABELS.Facility') })"
            accept="image/png, image/webp, image/jpeg"
            v-model:itemValue="initialValues.facilityPrivew"
            v-model:image="initialValues.facilityImage"
          />
        </div>

        <div class="flex items-center justify-end gap-7">
          <router-link to="/facility" class="capitalize font-semibold text-sub">
            {{ $t("BUTTONS.cancel") }}
          </router-link>

          <button
            type="submit"
            class="base-btn rounded-md"
            :disabled="btnLoading"
          >
            {{ $t("BUTTONS.save") }}
          </button>
        </div>
      </form>
    </VeeForm>
  </base-card1>
</template>

<script setup>
import { onBeforeMount, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import * as yup from "yup";
import axios from "axios";
import { toast } from "vue3-toastify";

const props = defineProps({
  data: {
    required: false,
    type: Object,
  },
});
const btnLoading = ref(false);

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const initialValues = reactive({
  nameAr: "",
  nameEn: "",
  nameUr: "",
  type: null,
  facilityImage: "",
  facilityPrivew: "",

  is_active: true,
});

const schema = yup.object().shape({
  nameAr: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Name", { name: t("LABELS.Facility") }) + t("inArabic"),
    })
  ),
  nameEn: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Name", { name: t("LABELS.Facility") }) + t("inEnglish"),
    })
  ),
  nameUr: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Name", { name: t("LABELS.Facility") }) + t("inUrd"),
    })
  ),
  type: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Name", { name: t("LABELS.type") }),
    })
  ),

  facilityImage: yup.mixed().test(
    "facilityImage",
    t("ERRORS.isRequired", {
      name: t("LABELS.image", { name: t("LABELS.Facility") }),
    }),
    (value) => {
      if (value || initialValues.facilityPrivew) {
        return true;
      }
    }
  ),
});

const types = [
  {
    id: "provider",
    name: t("LABELS.Wholesaler"),
  },
  {
    id: "wholesale",
    name: t("LABELS.Retailer"),
  },
];

function handleSubmit(values) {
  if (initialValues.categoryIcon) {
    values.categoryIcon = initialValues.categoryIcon;
  }
  if (initialValues.categoryImage) {
    values.categoryImage = initialValues.categoryImage;
  }
  values.is_active = initialValues.is_active;

  submitCategory(values);
}
function submitCategory(values) {
  btnLoading.value = true;

  let url = `facility-types`;
  const frmData = new FormData();
  if (route.params.id) {
    frmData.append("_method", "PUT");
    url = `facility-types/${route.params.id}`;
  }
  frmData.append("is_active", +values.is_active);
  frmData.append("ar[name]", values.nameAr);
  frmData.append("en[name]", values.nameEn);
  frmData.append("urd[name]", values.nameUr);
  frmData.append("type", values.type);

  if (values.facilityImage) {
    frmData.append("image", values.facilityImage);
  }

  axios
    .post(url, frmData)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 300);

      btnLoading.value = false;

      router.push("/facility");
    })
    .catch((e) => {
      btnLoading.value = false;
      toast.error(e.response.data.message);
    });
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
