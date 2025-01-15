<template>
  <base-card1 :title="$t('TITLES.Details', { name: $t('LABELS.subCategory') })">
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
              $t('LABELS.Name', { name: $t('LABELS.subCategory') }) +
              $t('inArabic')
            "
            :label="
              $t('LABELS.Name', { name: $t('LABELS.subCategory') }) +
              $t('inArabic')
            "
            type="text"
          />
          <base-input
            id="nameEn"
            name="nameEn"
            :placeholder="
              $t('LABELS.Name', { name: $t('LABELS.subCategory') }) +
              $t('inEnglish')
            "
            :label="
              $t('LABELS.Name', { name: $t('LABELS.subCategory') }) +
              $t('inEnglish')
            "
            type="text"
          />
          <base-input
            id="nameUr"
            name="nameUr"
            :placeholder="
              $t('LABELS.Name', { name: $t('LABELS.subCategory') }) +
              $t('inUrd')
            "
            :label="
              $t('LABELS.Name', { name: $t('LABELS.subCategory') }) +
              $t('inUrd')
            "
            type="text"
          />

          <base-select
            id="main_category"
            name="main_category"
            :placeholder="$t('LABELS.choose')"
            :label="$t('LABELS.main-category')"
            url="categories-without-paginated"
            :filter="null"
            :multiple="false"
            :disabled="true"
            v-model:itemValue="initialValues.main_category"
          />
        </div>

        <div class="mb-5">
          <base-file
            modalName="categories"
            modalType="image"
            id="companyLogo"
            name="categoryImage"
            :placeholder="t('LABELS.image', { name: t('LABELS.subCategory') })"
            :label="t('LABELS.image', { name: t('LABELS.subCategory') })"
            accept="image/png, image/webp, image/jpeg"
            v-model:itemValue="initialValues.categoryPrivew"
            v-model:image="initialValues.categoryImage"
          />
        </div>

        <div class="flex items-center justify-end gap-7">
          <router-link
            :to="{
              name: 'sub-categories',
              params: { id: route.params.id },
            }"
            class="capitalize font-semibold text-sub"
          >
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
  categoryImage: "",
  categoryPrivew: "",
  main_category: null,

  is_active: true,
});

const schema = yup.object().shape({
  nameAr: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Name", { name: t("LABELS.subCategory") }) + t("inArabic"),
    })
  ),
  nameEn: yup.string().required(
    t("ERRORS.isRequired", {
      name:
        t("LABELS.Name", { name: t("LABELS.subCategory") }) + t("inEnglish"),
    })
  ),
  nameUr: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Name", { name: t("LABELS.subCategory") }) + t("inUrd"),
    })
  ),

  categoryImage: yup.mixed().test(
    "categoryImage",
    t("ERRORS.isRequired", {
      name: t("LABELS.image", { name: t("LABELS.subCategory") }),
    }),
    (value) => {
      if (value || initialValues.categoryPrivew) {
        return true;
      }
    }
  ),
});

const isLoading = ref(false);
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

  let url = `categories`;
  const frmData = new FormData();
  if (route.params.sub_id) {
    frmData.append("_method", "PUT");
    url = `categories/${route.params.sub_id}`;
  } else {
    frmData.append("parent_id", route.params.id);
  }
  frmData.append("is_active", +values.is_active);

  frmData.append("ar[name]", values.nameAr);
  frmData.append("en[name]", values.nameEn);
  frmData.append("urd[name]", values.nameUr);

  if (values.categoryImage) {
    frmData.append("image", values.categoryImage);
  }

  axios
    .post(url, frmData)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 300);

      btnLoading.value = false;

      router.push({
        name: "sub-categories",
        params: { id: route.params.id },
      });
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
  // getMainCategories();
  if (props.data) {
    setData();
  }
});
</script>
