<template>
  <base-card1 :title="$t('TITLES.Details', { name: $t('LABELS.Brand') })">
    <VeeForm
      as="div"
      :validation-schema="schema"
      @submit="handleSubmit"
      :initial-values="initialValues"
      v-slot="{ values }"
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
              $t('LABELS.Name', { name: $t('LABELS.Brand') }) + $t('inArabic')
            "
            :label="
              $t('LABELS.Name', { name: $t('LABELS.Brand') }) + $t('inArabic')
            "
            type="text"
          />
          <base-input
            id="nameEn"
            name="nameEn"
            :placeholder="
              $t('LABELS.Name', { name: $t('LABELS.Brand') }) + $t('inEnglish')
            "
            :label="
              $t('LABELS.Name', { name: $t('LABELS.Brand') }) + $t('inEnglish')
            "
            type="text"
          />
          <base-input
            id="nameUr"
            name="nameUr"
            :placeholder="
              $t('LABELS.Name', { name: $t('LABELS.Brand') }) + $t('inUrd')
            "
            :label="
              $t('LABELS.Name', { name: $t('LABELS.Brand') }) + $t('inUrd')
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
            v-model:itemValue="initialValues.main_category"
          />
          <base-select
            id="sub_category"
            name="sub_category"
            :placeholder="$t('LABELS.choose')"
            :label="$t('LABELS.subCategory')"
            :url="`categories-without-paginated?category_id=${values.main_category}`"
            :filter="[]"
            :multiple="true"
            v-model:itemValue="initialValues.sub_category"
          />
        </div>

        <div class="mb-5">
          <base-file
            modalName="brands"
            modalType="image"
            id="companyLogo"
            name="brandImage"
            :placeholder="t('LABELS.image', { name: t('LABELS.Brand') })"
            :label="t('LABELS.image', { name: t('LABELS.Brand') })"
            accept="image/png, image/webp, image/jpeg"
            v-model:itemValue="initialValues.brandPrivew"
            v-model:image="initialValues.brandImage"
          />
        </div>

        <div class="flex items-center justify-end gap-7">
          <router-link
            :to="{
              name: 'brands',
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
const listLoading = ref(false);
const btnLoading = ref(false);
const subCategories = ref([]);

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const initialValues = reactive({
  nameAr: "",
  nameEn: "",
  nameUr: "",
  brandImage: "",
  brandPrivew: "",
  main_category: null,
  sub_category: [],

  is_active: true,
});

const schema = yup.object().shape({
  nameAr: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Name", { name: t("LABELS.Brand") }) + t("inArabic"),
    })
  ),
  nameEn: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Name", { name: t("LABELS.Brand") }) + t("inEnglish"),
    })
  ),
  nameUr: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Name", { name: t("LABELS.Brand") }) + t("inUrd"),
    })
  ),
  main_category: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.main-category"),
    })
  ),
  sub_category: yup.array().min(
    1,
    t("ERRORS.isRequired", {
      name: t("LABELS.subCategory"),
    })
  ),

  brandImage: yup.mixed().test(
    "brandImage",
    t("ERRORS.isRequired", {
      name: t("LABELS.image", { name: t("LABELS.Brand") }),
    }),
    (value) => {
      if (value || initialValues.brandPrivew) {
        return true;
      }
    }
  ),
});

function handleSubmit(values) {
  if (initialValues.categoryIcon) {
    values.categoryIcon = initialValues.categoryIcon;
  }
  if (initialValues.brandImage) {
    values.brandImage = initialValues.brandImage;
  }
  values.is_active = initialValues.is_active;

  submitCategory(values);
}
function submitCategory(values) {
  btnLoading.value = true;

  let url = `brands`;
  const frmData = new FormData();
  if (route.params.id) {
    frmData.append("_method", "PUT");
    url = `brands/${route.params.id}`;
  }
  frmData.append("is_active", +values.is_active);

  frmData.append("ar[name]", values.nameAr);
  frmData.append("en[name]", values.nameEn);
  frmData.append("urd[name]", values.nameUr);
  values.sub_category.map((el, index) => {
    frmData.append(`categories[${index}][category_id]`, el.id);
  });

  if (values.brandImage) {
    frmData.append("image", values.brandImage);
  }

  axios
    .post(url, frmData)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 300);

      btnLoading.value = false;

      router.push({
        name: "brands",
      });
    })
    .catch((e) => {
      btnLoading.value = false;
      toast.error(e.response.data.message);
    });
}
function getSubCategory(id) {
  console.log("fd");
  if (!id) {
    subCategories.value = [];
    return;
  }
  listLoading.value = true;
  axios
    .get(`categories-without-paginated`, {
      params: {
        category_id: id,
      },
    })
    .then((res) => {
      subCategories.value = res.data.data;

      listLoading.value = false;
    })
    .catch(() => (listLoading.value = false));
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
