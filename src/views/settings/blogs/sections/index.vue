<template>
  <div class="h-full flex flex-col">
    <base-card1 :title="$t('LABELS.BlogSections')" class="mb-5">
      <template v-slot:topTitle>
        <button
          type="button"
          @click="openModal = true"
          class="base-btn rounded-md py-2 px-3 mb-3"
        >
          {{ $t("BUTTONS.add", { name: $t("LABELS.Section") }) }}
          <i class="fas fa-plus"></i>
        </button>
      </template>

      <base-card
        class="border mb-4 last:mb-0 h-full"
        v-for="item in items"
        :key="item.id"
      >
        <SectionCard :item="item" @remove="remove" @edit="openEdit(item)" />
      </base-card>
    </base-card1>

    <teleport to="body">
      <modal
        :persist="true"
        v-if="openModal"
        :title="
          t(`BUTTONS.${isEdit ? 'Edit' : 'add'}`, { name: t('LABELS.Blog') })
        "
        @close="resetEdit"
        class="z-[1009]"
        classes="!w-full !max-w-[1400px]"
      >
        <VeeForm
          id="inProduct"
          :validation-schema="schema"
          @submit="handleSubmit"
          :initial-values="initialValues"
        >
          <div class="mb-5">
            <base-file
              modalName="blog_sections"
              modalType="image"
              id="blog_sections"
              name="sectionImage"
              :placeholder="$t('LABELS.image')"
              :label="$t('LABELS.image')"
              accept="image/png, image/webp, image/jpeg"
              v-model:itemValue="initialValues.blogPrivew"
              v-model:image="initialValues.sectionImage"
              @uploading="btnLoading = $event"
            />
          </div>
          <div class="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            <base-input
              id="nameAr"
              name="nameAr"
              :placeholder="$t('LABELS.Title') + $t('inArabic')"
              :label="$t('LABELS.Title') + $t('inArabic')"
              type="text"
            />
            <base-input
              id="nameEn"
              name="nameEn"
              :placeholder="$t('LABELS.Title') + $t('inEnglish')"
              :label="$t('LABELS.Title') + $t('inEnglish')"
              type="text"
            />
            <base-input
              id="nameUr"
              name="nameUr"
              :placeholder="$t('LABELS.Title') + $t('inUrd')"
              :label="$t('LABELS.Title') + $t('inUrd')"
              type="text"
            />
          </div>
          <div class="mt-4">
            <base-input
              id="descAr"
              name="descAr"
              :placeholder="$t('LABELS.content') + $t('inArabic')"
              :label="$t('LABELS.content') + $t('inArabic')"
              type="textarea"
            />
            <base-input
              id="descEn"
              name="descEn"
              :placeholder="$t('LABELS.content') + $t('inEnglish')"
              :label="$t('LABELS.content') + $t('inEnglish')"
              type="textarea"
            />
            <base-input
              id="descUr"
              name="descUr"
              :placeholder="$t('LABELS.content') + $t('inUrd')"
              :label="$t('LABELS.content') + $t('inUrd')"
              type="textarea"
            />
          </div>

          <div class="flex items-center justify-end">
            <!--     class="base-btn rounded-lg" -->
            <button
              class="base-btn rounded-lg"
              :disabled="btnLoading"
              type="submit"
            >
              {{ $t("BUTTONS.save") }}
            </button>
          </div>
        </VeeForm>
      </modal>
    </teleport>
    <!-- End page content -->
  </div>
</template>

<script setup>
import * as yup from "yup";
import SectionCard from "./SectionCard.vue";
import { useI18n } from "vue-i18n";
import { ref, toRef, reactive } from "vue";
import { useField } from "vee-validate";
import { uuid } from "vue-uuid";

const sectionsField = useField("sections");

const props = defineProps({
  data: {
    required: false,
  },
});

const emit = defineEmits(["returnedData"]);

const { t } = useI18n();

const items = toRef(props.data);

const initialValues = reactive({
  nameAr: "",
  nameEn: "",
  nameUr: "",
  descEn: "",
  descAr: "",
  descUr: "",
  sectionImage: "",
  blogPrivew: "",
  uuid: uuid.v1(),
  id: "",
});

function remove(uuid) {
  items.value = items.value.filter((el) => el.uuid != uuid);

  emit("returnedData", items.value);
}

//  Form add & edit

const isEdit = ref(false);
function openEdit(item) {
  initialValues.nameAr = item.nameAr;
  initialValues.nameEn = item.nameEn;
  initialValues.nameUr = item.nameUr;
  initialValues.descEn = item.descEn;
  initialValues.descAr = item.descAr;
  initialValues.descUr = item.descUr;
  initialValues.blogPrivew = item.blogPrivew;
  initialValues.sectionImage = item.sectionImage;
  initialValues.id = item.id;
  initialValues.uuid = item.uuid;

  isEdit.value = true;
  openModal.value = true;
}
function resetEdit() {
  initialValues.nameAr = "";
  initialValues.nameEn = "";
  initialValues.nameUr = "";
  initialValues.descEn = "";
  initialValues.descAr = "";
  initialValues.descUr = "";
  initialValues.blogPrivew = "";
  initialValues.sectionImage = "";

  initialValues.id = "";
  initialValues.uuid = uuid.v1();

  isEdit.value = false;
  openModal.value = false;
}
const schema = yup.object().shape({
  nameEn: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.Title") }) + t("inEnglish")
    ),
  nameAr: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.Title") }) + t("inArabic")
    ),
  nameUr: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.Title") }) + t("inUrd")),
  descEn: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.content") }) + t("inEnglish")
    ),
  descAr: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.content") }) + t("inArabic")
    ),
  descUr: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.content") }) + t("inUrd")
    ),
  sectionImage: yup.mixed().test(
    "sectionImage",
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

const openModal = ref(false);
const btnLoading = ref(false);
function handleSubmit(values) {
  values.blogPrivew = initialValues.blogPrivew;
  if (isEdit.value) {
    items.value = items.value.filter((el) => el.uuid != values.uuid);
    resetEdit();
  }
  items.value.push(values);
  sectionsField.setValue(items.value);
  openModal.value = false;

  isEdit.value = false;
  emit("returnedData", items.value);
}
</script>

<style></style>
