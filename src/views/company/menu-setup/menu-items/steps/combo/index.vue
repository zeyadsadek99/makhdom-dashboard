<template>
  <div class="h-full flex flex-col">
    <base-card1 :title="$t('TITLES.Combo Items')" class="p-7 mb-5">
      <template v-slot:topTitle>
        <button
          type="button"
          @click="openModal = true"
          class="base-btn rounded-md py-2 px-3 mb-3"
        >
          {{ $t("BUTTONS.add", { name: $t("LABELS.combo") }) }}
          <i class="fas fa-plus"></i>
        </button>
      </template>

      <base-card
        class="border mb-4 last:mb-0 h-full"
        v-for="item in items"
        :key="item.id"
      >
        <ComboCard :item="item" @remove="remove(item)" @edit="openEdit(item)" />
      </base-card>
    </base-card1>

    <teleport to="body">
      <modal
        :persist="true"
        v-if="openModal"
        :title="
          t(`BUTTONS.${isEdit ? 'Edit' : 'add'}`, { name: t('LABELS.combo') })
        "
        @close="resetEdit"
        class="z-[1009]"
        classes="!w-full"
      >
        <VeeForm
          id="inProduct"
          as="div"
          :validation-schema="schema"
          @submit="handleSubmit"
          :initial-values="initialValues"
        >
          <form>
            <div class="grid sm:grid-cols-2 gap-3">
              <base-input
                id="nameAr"
                name="nameAr"
                :placeholder="$t('LABELS.Combo Name') + t('inArabic')"
                :label="$t('LABELS.Combo Name') + $t('inArabic')"
                type="text"
                icon="category"
              />
              <base-input
                id="nameEn"
                name="nameEn"
                :placeholder="$t('LABELS.Combo Name') + t('inEnglish')"
                :label="$t('LABELS.Combo Name') + $t('inEnglish')"
                type="text"
                icon="category"
              />
              <base-input
                id="selection"
                name="selection"
                :placeholder="$t('LABELS.No of selection')"
                :label="$t('LABELS.No of selection')"
                type="number"
                icon="barcode"
              />
              <div class="grid sm:grid-cols-2 gap-3 sm:col-span-2">
                <base-checkbox
                  v-for="category in categories"
                  :key="category.id"
                  :item="category"
                  id="category"
                  @change="handleSelectedProduct"
                  @reset="handleSelectedProduct($event, 'reset')"
                  icon="category"
                  name="products"
                  secondUrl="products?category_id="
                  v-model:selectedItems="selectedProducts"
                  v-model:itemValue="selectedProduct"
                />
                <VeeErrorMessage name="products" as="div" class="text-error" />
              </div>

              <base-card1 class="mb-4 sm:col-span-2">
                <div>
                  <FieldArray
                    name="ruleBased"
                    v-slot="{ fields, push, remove }"
                  >
                    <h3 class="text-text font-semibold mb-3">
                      {{ $t("TITLES.Rule Based Values") }}
                    </h3>
                    <NoramlSelect
                      :label="
                        $t('LABELS.store') +
                        '/' +
                        $t('LABELS.city') +
                        '/' +
                        $t('LABELS.country')
                      "
                      icon="pricing"
                      :options="basedAvailabilities"
                      id="availabilities"
                      @change="
                        push({ ...$event, price: null });
                        pushItem($event);
                      "
                    />
                    <div
                      class="mb-3 last:mb-0 bg-[#FAFAFF] mt-2 rounded-2xl"
                      :class="fields.length ? 'p-1 md:p-3' : ''"
                    >
                      <fieldset v-for="(field, idx) in fields" :key="field.key">
                        <div
                          class="flex items-start justify-between flex-wrap gap-4 relative"
                        >
                          <h4 class="mt-4 font-medium text-text">
                            {{ field.value.name }}
                          </h4>
                          <div class="flex items-start gap-2">
                            <base-input
                              :id="`ruleBased[${idx}].price`"
                              :name="`ruleBased[${idx}].price`"
                              :placeholder="$t('LABELS.Enter Price')"
                              type="number"
                              :prepend="true"
                            >
                              <template v-slot:prepend>
                                <span class="text-primary font-medium">
                                  $
                                </span>
                              </template>
                            </base-input>

                            <Deleter
                              classes="mt-4"
                              url="delete_availability"
                              :id="field.value.availability_id"
                              modal-type="combo_prices"
                              @remove="
                                remove(idx);
                                removeItem(field);
                              "
                              v-if="field.value.availability_id"
                            />

                            <button
                              v-else
                              type="button"
                              class="text-sub mt-4"
                              @click="
                                remove(idx);
                                removeItem(field);
                              "
                            >
                            <input-icon name="trash" />
                            </button>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                    <VeeErrorMessage
                      name="ruleBased"
                      as="div"
                      class="text-error"
                    />
                  </FieldArray>
                </div>
              </base-card1>
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
          </form>
        </VeeForm>
      </modal>
    </teleport>
    <!-- End page content -->
  </div>
</template>

<script setup>
import * as yup from "yup";
import ComboCard from "./ComboCard.vue";
import { useI18n } from "vue-i18n";
import { onMounted, ref, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import { FieldArray } from "vee-validate";
const props = defineProps({
  categories: {
    required: true,
  },
  availabilities: {
    required: true,
  },
  data: {
    required: false,
  },
});

const emit = defineEmits(["returnedData"]);

const route = useRoute();

const { t } = useI18n();

const items = ref([]);
const loading = ref(true);
const selectedProduct = ref([]);
const selectedProducts = ref([]);

function handleSelectedProduct(e, reset) {
  selectedProduct.value = selectedProduct.value.filter((el) => !e.includes(el));
  if (!reset) {
    selectedProduct.value.push(...e);
  }
}

function remove(item) {
  if (item.id) {
    items.value = items.value.filter((el) => el.id != item.id);
  } else {
    items.value = items.value.filter((el) => el != item);
  }

  emit("returnedData", items.value);
}

//  Form add & edit

const isEdit = ref(false);
function openEdit(item) {
  initialValues.nameAr = item.nameAr;
  initialValues.nameEn = item.nameEn;
  initialValues.products = item.products;
  initialValues.selection = item.selection;
  selectedProduct.value = item.products;
  selectedProducts.value = item.selectedProducts;

  initialValues.ruleBased = item.ruleBased;

  initialValues.id = item.id ?? new Date().getTime();

  isEdit.value = true;
  openModal.value = true;
}
function resetEdit() {
  selectedProduct.value = [];
  selectedProducts.value = [];
  initialValues.nameEn = "";
  initialValues.nameAr = "";
  initialValues.products = [];
  initialValues.selection = [];
  initialValues.selectedProducts = [];
  initialValues.ruleBased = [];
  initialValues.id = "";

  isEdit.value = false;
  openModal.value = false;
}
const schema = yup.object().shape({
  nameEn: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.Combo Name") }) + t("inEnglish")
    ),
  nameAr: yup
    .string()
    .required(
      t("ERRORS.isRequired", { name: t("LABELS.Combo Name") }) + t("inArabic")
    ),
  selection: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.No of selection") })),
  products: yup
    .array()
    .test(
      "products",
      t("ERRORS.isRequired", { name: t("LABELS.Items") }),
      () => {
        if (selectedProduct.value.length) {
          return true;
        }
      }
    ),
  ruleBased: yup
    .array()
    .required(t("ERRORS.isRequired", { name: t("TITLES.Rule Based Values") }))
    .min(1, t("ERRORS.isRequired", { name: t("TITLES.Rule Based Values") }))
    .of(
      yup.object().shape({
        price: yup
          .mixed()
          .required(t("ERRORS.isRequired", { name: t("LABELS.price") })),
      })
    )
    .strict(),
});

const initialValues = reactive({
  nameEn: "",
  nameAr: "",
  ordering: "",
  id: "",
});

const openModal = ref(false);
const btnLoading = ref(false);
function handleSubmit(values) {
  values.products = selectedProduct.value;
  values.selectedProducts = selectedProducts.value;
  if (isEdit.value) {
    items.value = items.value.filter((el) => el.id != values.id);
    resetEdit();
  }
  items.value.push(values);
  openModal.value = false;

  isEdit.value = false;
  emit("returnedData", items.value);
}
const basedAvailabilities = ref([]);

function pushItem(event) {
  basedAvailabilities.value = basedAvailabilities.value.filter(
    (el) => el != event
  );
}

function removeItem(item) {
  const found = basedAvailabilities.value.find(
    (el) => el.id && el.type == item.value.id && item.value.type
  );
  if (!found) basedAvailabilities.value.push(item.value);
}

watch(
  () => props.availabilities,
  () => (basedAvailabilities.value = props.availabilities),
  {
    deep: true,
    immediate: true,
  }
);
watch(
  () => props.data,
  () => {
    items.value = props.data;
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>

<style></style>
