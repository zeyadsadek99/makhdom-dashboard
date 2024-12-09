<template>
  <loader v-if="aggregatorsLoader" />
  <VeeForm
    v-else
    as="div"
    :validation-schema="schema"
    @submit="handleSubmit"
    v-slot="{ meta }"
    :initial-values="initialValues"
  >
    <form class="mt-4">
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
      <base-card1 :title="$t('TITLES.General Details')">
        <div class="mb-5 grid md:grid-cols-2 gap-x-4">
          <base-input
            id="nameAr"
            name="nameAr"
            :placeholder="
              $t('LABELS.Enter Item Modifier Name') + $t('inArabic')
            "
            :label="$t('LABELS.Item Modifier Name') + $t('inArabic')"
            type="text"
            icon="modifiers-group"
          />
          <base-input
            id="nameEn"
            name="nameEn"
            :placeholder="
              $t('LABELS.Enter Item Modifier Name') + $t('inEnglish')
            "
            :label="$t('LABELS.Item Modifier Name') + $t('inEnglish')"
            type="text"
            icon="modifiers-group"
          />
        </div>

        <div class="mb-5">
          <base-select
            id="modifier"
            name="modifier"
            :placeholder="$t('LABELS.choose')"
            :label="$t('TITLES.modifierGroup')"
            icon="modifiers-group"
            url="all_modifier"
            type="text"
            :filter="null"
            :multiple="false"
            @change="getSubModifiers"
            v-model:itemValue="initialValues.modifier"
          />

          <base-select
            id="sub_modifier"
            name="sub_modifier"
            :placeholder="$t('LABELS.choose')"
            :label="$t('TITLES.modifiersSubGroup')"
            type="text"
            icon="modifiers-group"
            :options="subModifiers"
            :filter="null"
            :multiple="false"
            :loading="subModifiersLoader"
            v-model:itemValue="initialValues.sub_modifier"
          />
        </div>

        <div class="space-y-5 mb-5">
          <base-input
            id="descAr"
            name="descAr"
            :placeholder="$t('LABELS.write') + $t('inArabic')"
            :label="$t('LABELS.description') + $t('inArabic')"
            type="textarea"
          />
          <base-input
            id="descEn"
            name="descEn"
            :placeholder="$t('LABELS.write') + $t('inEnglish')"
            :label="$t('LABELS.description') + $t('inEnglish')"
            type="textarea"
          />
        </div>
      </base-card1>

      <!-- Availabilities::Start -->
      <!-- <base-card1 :title="$t('LABELS.Availability')" class="p-7 my-5">
        <SingleSelect
          :label="
            $t('LABELS.store') +
            '/' +
            $t('LABELS.city') +
            '/' +
            $t('LABELS.country')
          "
          name="availabilities"
          icon="country"
          :options="availabilities"
          :loading="availabilitiesLoader"
          id="availabilities"
          v-model:itemValue="selectedAvailability"
        />
      </base-card1> -->
      <base-card1 class="mb-4" :title="$t('TITLES.Pricing')">
        <v-switch
          color="success"
          :model-value:any="true"
          class="capitalize mb-4"
          :label="$t('LABELS.Mandatory Price')"
          v-model="initialValues.is_mandatory_price"
        ></v-switch>
        <div class="grid gap-3">
          <div>
            <FieldArray name="RuleBasedValue" v-slot="{ fields, push, remove }">
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
                :options="basedaVailabilities"
                :loading="availabilitiesLoader"
                id="availabilities"
                @change="
                  push({ ...$event, price: '' });
                  pushItem($event, 'basedaVailabilities');
                "
              />
              <VeeErrorMessage
                v-if="!meta.valid && meta.touched"
                name="RuleBasedValue"
                as="div"
                class="text-error"
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
                        :id="`RuleBasedValue[${idx}].price`"
                        :name="`RuleBasedValue[${idx}].price`"
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
                        modal-type="item_modifier_pricing"
                        @remove="
                          remove(idx);
                          removeItem(field, 'basedaVailabilities');
                        "
                        v-if="field.value.availability_id"
                      />

                      <button
                        v-else
                        type="button"
                        class="text-sub mt-4"
                        @click="
                          remove(idx);
                          removeItem(field, 'basedaVailabilities');
                        "
                      >
                        <input-icon name="trash" />
                      </button>
                    </div>
                  </div>
                </fieldset>
              </div>
            </FieldArray>
          </div>

          <div>
            <FieldArray name="Online" v-slot="{ fields, push, remove }">
              <h3 class="text-text font-semibold mb-3">
                {{ $t("TITLES.Online") }}
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
                :options="online"
                :loading="availabilitiesLoader"
                id="availabilities"
                @change="
                  push({ ...$event, price: '' });
                  pushItem($event, 'online');
                "
              />
              <VeeErrorMessage
                v-if="!meta.valid && meta.touched"
                name="Online"
                as="div"
                class="text-error"
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
                        :id="`Online[${idx}].price`"
                        :name="`Online[${idx}].price`"
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

                      <!-- @remove="remove(item.id)" -->
                      <!-- :url="`package/force-delete/${item.id}`" -->
                      <Deleter
                        classes="mt-4"
                        url="delete_availability"
                        :id="field.value.availability_id"
                        modal-type="item_modifier_pricing"
                        @remove="
                          remove(idx);
                          removeItem(field, 'online');
                        "
                        v-if="field.value.availability_id"
                      />
                      <button
                        v-else
                        type="button"
                        class="text-sub mt-4"
                        @click="
                          remove(idx);
                          removeItem(field, 'online');
                        "
                      >
                        <input-icon name="trash" />
                      </button>
                    </div>
                  </div>
                </fieldset>
              </div>
            </FieldArray>
          </div>
          <div>
            <FieldArray name="DineIn" v-slot="{ fields, push, remove }">
              <h3 class="text-text font-semibold mb-3">
                {{ $t("TITLES.Dine-in") }}
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
                :options="dineIn"
                :loading="availabilitiesLoader"
                id="availabilities"
                @change="
                  push({ ...$event, price: '' });
                  pushItem($event, 'dineIn');
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
                        :id="`DineIn[${idx}].price`"
                        :name="`DineIn[${idx}].price`"
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
                        modal-type="item_modifier_pricing"
                        @remove="
                          remove(idx);
                          removeItem(field, 'dineIn');
                        "
                        v-if="field.value.availability_id"
                      />

                      <button
                        v-else
                        type="button"
                        class="text-sub mt-4"
                        @click="
                          remove(idx);
                          removeItem(field, 'dineIn');
                        "
                      >
                        <input-icon name="trash" />
                      </button>
                    </div>
                  </div>
                </fieldset>
              </div>

              <VeeErrorMessage
                v-if="!meta.valid && meta.touched"
                name="DineIn"
                as="div"
                class="text-error"
              />
            </FieldArray>
          </div>
          <div>
            <FieldArray name="Carhop" v-slot="{ fields, push, remove }">
              <h3 class="text-text font-semibold mb-3">
                {{ $t("TITLES.Carhop") }}
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
                :options="carhop"
                :loading="availabilitiesLoader"
                id="availabilities"
                @change="
                  push({ ...$event, price: '' });
                  pushItem($event, 'carhop');
                "
              />
              <VeeErrorMessage
                v-if="!meta.valid && meta.touched"
                name="Carhop"
                as="div"
                class="text-error"
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
                        :id="`Carhop[${idx}].price`"
                        :name="`Carhop[${idx}].price`"
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
                        modal-type="item_modifier_pricing"
                        @remove="
                          remove(idx);
                          removeItem(field, 'basedaVailabilities');
                        "
                        v-if="field.value.availability_id"
                      />
                      <button
                        v-else
                        type="button"
                        class="text-sub mt-4"
                        @click="
                          remove(idx);
                          removeItem(field, 'basedaVailabilities');
                        "
                      >
                        <input-icon name="trash" />
                      </button>
                    </div>
                  </div>
                </fieldset>
              </div>
            </FieldArray>
          </div>
          <div>
            <FieldArray name="Delivery" v-slot="{ fields, push, remove }">
              <h3 class="text-text font-semibold mb-3">
                {{ $t("TITLES.Delivery") }}
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
                :options="delivery"
                :loading="availabilitiesLoader"
                id="availabilities"
                @change="
                  push({ ...$event, price: '' });
                  pushItem($event, 'delivery');
                "
              />
              <VeeErrorMessage
                v-if="!meta.valid && meta.touched"
                name="Delivery"
                as="div"
                class="text-error"
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
                        :id="`Delivery[${idx}].price`"
                        :name="`Delivery[${idx}].price`"
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
                        modal-type="item_modifier_pricing"
                        @remove="
                          remove(idx);
                          removeItem(field, 'delivery');
                        "
                        v-if="field.value.availability_id"
                      />
                      <button
                        v-else
                        type="button"
                        class="text-sub mt-4"
                        @click="
                          remove(idx);
                          removeItem(field, 'delivery');
                        "
                      >
                        <input-icon name="trash" />
                      </button>
                    </div>
                  </div>
                </fieldset>
              </div>
            </FieldArray>
          </div>
          <div>
            <FieldArray name="TakeAway" v-slot="{ fields, push, remove }">
              <h3 class="text-text font-semibold mb-3">
                {{ $t("TITLES.Take away") }}
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
                :options="takeAway"
                :loading="availabilitiesLoader"
                id="availabilities"
                @change="
                  push({ ...$event, price: '' });
                  pushItem($event, 'takeAway');
                "
              />
              <VeeErrorMessage
                v-if="!meta.valid && meta.touched"
                name="TakeAway"
                as="div"
                class="text-error"
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
                        :id="`TakeAway[${idx}].price`"
                        :name="`TakeAway[${idx}].price`"
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
                        modal-type="item_modifier_pricing"
                        @remove="
                          remove(idx);
                          removeItem(field, 'takeAway');
                        "
                        v-if="field.value.availability_id"
                      />

                      <button
                        v-else
                        type="button"
                        class="text-sub mt-4"
                        @click="
                          remove(idx);
                          removeItem(field, 'takeAway');
                        "
                      >
                        <input-icon name="trash" />
                      </button>
                    </div>
                  </div>
                </fieldset>
              </div>
            </FieldArray>
          </div>
        </div>
      </base-card1>
      <base-card1 class="mb-4" :title="$t('TITLES.Aggregators')">
        <div class="grid gap-5">
          <FieldArray name="allAggregators" v-slot="{ fields }">
            <fieldset v-for="(aggregator, idx) in fields" :key="aggregator.key">
              <h3 class="text-text font-semibold mb-5">
                {{ $t(aggregator.value.name) }}
              </h3>

              <FieldArray
                :name="`allAggregators[${idx}].aggregator`"
                v-slot="{ fields: subFields, push, remove }"
              >
                <NoramlSelect
                  :label="
                    $t('LABELS.store') +
                    '/' +
                    $t('LABELS.city') +
                    '/' +
                    $t('LABELS.country')
                  "
                  icon="pricing"
                  :options="aggregatorsOptions[aggregator.value.name]"
                  :loading="availabilitiesLoader"
                  id="availabilities"
                  v-model:itemValue="selectedAvailability"
                  @change="
                    pushAgg($event, aggregator.value.name);
                    push({ ...$event, price: '' });
                  "
                />

                <div
                  v-if="subFields.length"
                  class="mb-3 last:mb-0 mt-2 bg-[#FAFAFF] rounded-2xl"
                  :class="subFields.length ? 'p-1 md:p-3' : ''"
                >
                  <fieldset
                    v-for="(field, sub_idx) in subFields"
                    :key="field.name"
                  >
                    <div
                      class="flex items-start justify-between flex-wrap gap-x-4 gap-y-1 relative"
                    >
                      <h4 class="mt-4 font-medium text-text">
                        {{ field.value.name }}
                      </h4>
                      <div class="flex items-start gap-2">
                        <base-input
                          :id="`allAggregators[${idx}].aggregator[${sub_idx}].price`"
                          :name="`allAggregators[${idx}].aggregator[${sub_idx}].price`"
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
                          modal-type="item_modifier_pricing"
                          @remove="
                            removeAgg(field, aggregator.value.name);
                            remove(sub_idx);
                          "
                          v-if="field.value.availability_id"
                        />

                        <button
                          v-else
                          type="button"
                          class="text-sub mt-4"
                          @click="
                            removeAgg(field, aggregator.value.name);
                            remove(sub_idx);
                          "
                        >
                          <input-icon name="trash" />
                        </button>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <VeeErrorMessage
                  v-if="!meta.valid && meta.touched"
                  :name="`allAggregators[${idx}].aggregator`"
                  as="div"
                  class="text-error"
                />
              </FieldArray>
            </fieldset>
          </FieldArray>
        </div>
      </base-card1>
      <base-card1 :title="$t('TITLES.visibility')" class="p-7 mb-5">
        <loader v-if="visibilitiesLoader" />
        <div class="visibilities" v-else>
          <v-switch
            v-for="item in visibilities"
            :key="item.id"
            color="success"
            class="capitalize last-of-type:mb-0 text-text"
            :model-value:any="true"
            :label="$t('LABELS.availableOn', { name: $t(item.name) })"
            v-model="item.status"
          ></v-switch>
          <!-- v-model="item" -->
        </div>
      </base-card1>
      <base-card1 :title="$t('TITLES.aggregatorsVisibility')" class="p-7 mb-5">
        <loader v-if="aggregatorsLoader" />
        <div class="visibilities" v-else>
          <v-switch
            v-for="item in aggregators"
            :key="item.id"
            color="success"
            class="capitalize last-of-type:mb-0 text-text"
            :model-value:any="true"
            :label="$t('LABELS.availableOn', { name: $t(item.name) })"
            v-model="item.status"
          ></v-switch>
        </div>
      </base-card1>
      <!-- Availabilities::End -->

      <div class="flex items-center justify-end gap-7">
        <router-link
          to="/menu-setup/modifiers-sub-group"
          class="capitalize font-semibold text-sub"
        >
          {{ $t("BUTTONS.cancel") }}
        </router-link>

        <button type="submit" class="base-btn rounded-md" :disabled="isLoading">
          {{ $t("BUTTONS.save") }}
        </button>
      </div>
    </form>
  </VeeForm>
</template>

<script setup>
import { onBeforeMount, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import * as yup from "yup";
import axios from "axios";
import { useRoute } from "vue-router";
import { useField } from "vee-validate";
import { FieldArray } from "vee-validate";
const route = useRoute();
const props = defineProps({
  data: {
    required: false,
    type: Object,
  },
});

const selectedProduct = ref([]);

const { t } = useI18n();

const initialValues = reactive({
  nameAr: "",
  nameEn: "",
  descAr: "",
  descEn: "",
  modifier: "",
  allAggregators: [],
  RuleBasedValue: [],
  sub_modifier: "",
  is_active: true,
  is_mandatory_price: false,
});

const schema = yup.object().shape({
  nameAr: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Modifier Group Title") + t("inArabic"),
    })
  ),
  nameEn: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Modifier Group Title") + t("inEnglish"),
    })
  ),
  modifier: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.modifierGroup"),
    })
  ),
  sub_modifier: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.modifiersSubGroup"),
    })
  ),
  allAggregators: yup
    .array()
    .required()
    .min(1, t("ERRORS.isRequired", { name: t("LABELS.aggregator") }))
    .of(
      yup.object().shape({
        aggregator: yup
          .array()
          .required()
          // .min(1, t("ERRORS.isRequired", { name: t("LABELS.aggregator") }))
          .of(
            yup.object().shape({
              price: yup.mixed().nullable(),
              // .test(
              //   "Is positive?",
              //   t("ERRORS.moreThan0", { name: t("LABELS.ordering") }),
              //   (value) => value > 0
              // )

              // .test(
              //   "price",
              //   t("ERRORS.isRequired", { name: t("LABELS.price") }),
              //   (values) => {
              //     if (initialValues.is_mandatory_price) {
              //       if (values || values === 0) {
              //         return true;
              //       } else {
              //         return false;
              //       }
              //     } else {
              //       return true;
              //     }
              //   }
              // ),
            })
          )
          .strict(),
      })
    )
    .strict(),
  descAr: yup.string(),

  // .required(
  //   t("ERRORS.isRequired", { name: t("LABELS.description") + t("inArabic") })
  // ),
  descEn: yup.string(),
  //   .required(
  //   t("ERRORS.isRequired", {
  //     name: t("LABELS.description") + t("inEnglish"),
  //   })
  // ),
  // availabilities: yup
  //   .array()
  //   .required(t("ERRORS.isRequired", { name: t("LABELS.Availability") }))
  //   .min(1, t("ERRORS.isRequired", { name: t("LABELS.Availability") })),
  RuleBasedValue: yup
    .array()
    .test(
      "RuleBasedValue",
      t("ERRORS.isRequired", { name: t("TITLES.Rule Based Values") }),
      (values) => {
        if (initialValues.is_mandatory_price) {
          if (values && values.length) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      }
    )
    // .required(t("ERRORS.isRequired", { name: t("TITLES.Rule Based Values") }))
    // .min(1, t("ERRORS.isRequired", { name: t("TITLES.Rule Based Values") }))
    .of(
      yup.object().shape({
        price: yup
          .mixed()

          .test(
            "price",
            t("ERRORS.isRequired", { name: t("LABELS.price") }),
            (values) => {
              if (initialValues.is_mandatory_price) {
                if (values) {
                  return true;
                } else {
                  return false;
                }
              } else {
                return true;
              }
            }
          )
          .nullable(),
      })
    )
    .strict(),
  Online: yup
    .array()
    .of(
      yup.object().shape({
        price: yup.mixed().nullable(),

        // .test(
        //   "price",
        //   t("ERRORS.isRequired", { name: t("LABELS.price") }),
        //   (values) => {
        //     if (initialValues.is_mandatory_price) {
        //       if (values) {
        //         return true;
        //       } else {
        //         return false;
        //       }
        //     } else {
        //       return true;
        //     }
        //   }
        // ),
      })
    )
    .strict(),
  DineIn: yup
    .array()
    .of(
      yup.object().shape({
        price: yup.mixed().nullable(),

        // .test(
        //   "price",
        //   t("ERRORS.isRequired", { name: t("LABELS.price") }),
        //   (values) => {
        //     if (initialValues.is_mandatory_price) {
        //       if (values) {
        //         return true;
        //       } else {
        //         return false;
        //       }
        //     } else {
        //       return true;
        //     }
        //   }
        // ),
      })
    )
    .strict(),
  Carhop: yup
    .array()
    .of(
      yup.object().shape({
        price: yup.mixed().nullable(),

        // .test(
        //   "price",
        //   t("ERRORS.isRequired", { name: t("LABELS.price") }),
        //   (values) => {
        //     if (initialValues.is_mandatory_price) {
        //       if (values) {
        //         return true;
        //       } else {
        //         return false;
        //       }
        //     } else {
        //       return true;
        //     }
        //   }
        // ),
      })
    )
    .strict(),
  Delivery: yup
    .array()
    .of(
      yup.object().shape({
        price: yup.mixed().nullable(),

        // .test(
        //   "price",
        //   t("ERRORS.isRequired", { name: t("LABELS.price") }),
        //   (values) => {
        //     if (initialValues.is_mandatory_price) {
        //       if (values) {
        //         return true;
        //       } else {
        //         return false;
        //       }
        //     } else {
        //       return true;
        //     }
        //   }
        // ),
      })
    )
    .strict(),
  TakeAway: yup
    .array()
    .of(
      yup.object().shape({
        price: yup.mixed().nullable(),

        // .test(
        //   "price",
        //   t("ERRORS.isRequired", { name: t("LABELS.price") }),
        //   (values) => {
        //     if (initialValues.is_mandatory_price) {
        //       if (values) {
        //         return true;
        //       } else {
        //         return false;
        //       }
        //     } else {
        //       return true;
        //     }
        //   }
        // ),
      })
    )
    .strict(),
});

const emit = defineEmits(["returned-data"]);
const availabilitiesLoader = ref(false);
const visibilitiesLoader = ref(false);
const aggregatorsLoader = ref(true);
const selectedAvailability = ref([]);
const availabilities = ref([]);
const visibilities = ref([]);
const aggregators = ref([]);
const isLoading = ref(false);

const basedaVailabilities = ref([]);
const online = ref([]);
const dineIn = ref([]);
const carhop = ref([]);
const delivery = ref([]);
const takeAway = ref([]);
function handleSubmit(values) {
  values.is_active = initialValues.is_active;
  values.is_mandatory_price = initialValues.is_mandatory_price;
  values.visibility = visibilities.value;
  values.aggregators_visibility = aggregators.value;
  let allAgg = [];

  values.allAggregators.map((el) => {
    el.aggregator.map((sub) => {
      allAgg.push({
        aggregator_type: el.name,
        ...sub,
      });
    });
  });
  values.allAggregators = allAgg;
  let prices = [];
  if (values.RuleBasedValue) {
    values.RuleBasedValue.map((el) => {
      el["price_type"] = "rule_based_value";
      prices.push(el);
    });
  }
  if (values.Online) {
    values.Online.map((el) => {
      el["price_type"] = "online";
      prices.push(el);
    });
  }

  if (values.DineIn) {
    values.DineIn.map((el) => {
      el["price_type"] = "dine_in";
      prices.push(el);
    });
  }

  if (values.Carhop) {
    values.Carhop.map((el) => {
      el["price_type"] = "carhop";
      prices.push(el);
    });
  }

  if (values.Delivery) {
    values.Delivery.map((el) => {
      el["price_type"] = "delivery";
      prices.push(el);
    });
  }
  if (values.TakeAway) {
    values.TakeAway.map((el) => {
      el["price_type"] = "take_away";
      prices.push(el);
    });
  }
  values.prices = prices;

  emit("returned-data", values);
}

function setData() {
  getSubModifiers(props.data.modifier);
  for (const [key, value] of Object.entries(props.data)) {
    initialValues[key] = value;
  }
}
const aggregatorsOptions = reactive({});

const subModifiers = ref([]);
const subModifiersLoader = ref([]);

function getSubModifiers(id) {
  if (id) {
    subModifiersLoader.value = true;

    axios.get(`modifier/${id}/sub_modifier`).then((res) => {
      subModifiers.value = res.data.data;
      subModifiersLoader.value = false;
    });
  }
}

function getAvailabilities() {
  availabilitiesLoader.value = true;
  axios
    .get(`availabilities`)
    .then((res) => {
      if (props.data) {
        selectedAvailability.value = props.data.availabilities;
        availabilities.value = res.data.data;
      } else {
        availabilities.value = res.data.data;
      }
      basedaVailabilities.value = res.data.data;
      online.value = res.data.data;
      dineIn.value = res.data.data;
      carhop.value = res.data.data;
      delivery.value = res.data.data;
      takeAway.value = res.data.data;
      availabilitiesLoader.value = false;
      getAggregators();
      availabilitiesLoader.value = false;
    })
    .catch(() => (availabilitiesLoader.value = false));
}
function getVisibility() {
  visibilitiesLoader.value = true;
  axios
    .get(`visibility`, {
      params: {
        id: route.params.id || "",
        type: "item_modifiers",
      },
    })
    .then((res) => {
      let vis = [];

      for (const [name, status] of Object.entries(res.data.data)) {
        vis.push({
          name,
          status,
        });
      }
      visibilities.value = vis;

      visibilitiesLoader.value = false;
    })
    .catch(() => (visibilitiesLoader.value = false));
}
function getAggregators() {
  aggregatorsLoader.value = true;
  axios
    .get(`aggregators_visibility`, {
      params: {
        id: route.params.id || "",
        type: "item_modifiers",
      },
    })
    .then((res) => {
      let agg = [];
      for (const [name, status] of Object.entries(res.data.data)) {
        agg.push({
          name,
          status,
        });
      }
      aggregators.value = agg;
      aggregatorsLoader.value = false;
      agg.map((el) => {
        aggregatorsOptions[el.name] = availabilities.value;
      });
      initialValues.allAggregators = agg.map((el) => ({
        aggregator: [],
        name: el.name,
        options: availabilities.value,
      }));

      if (props.data) {
        if (props.data.allAggregators.length) {
          initialValues.allAggregators.map((main) => {
            props.data.allAggregators.map((sub) => {
              if (main.name == sub.name) {
                main.aggregator = sub.aggregator;
              }
            });
          });
        }
      }
    })
    .catch(() => (aggregatorsLoader.value = false));
}
function pushItem(item, type) {
  if (type == "basedaVailabilities") {
    basedaVailabilities.value = basedaVailabilities.value.filter(
      (el) => el != item
    );
  }
  if (type == "online") {
    online.value = online.value.filter((el) => el != item);
  }
  if (type == "delivery") {
    delivery.value = delivery.value.filter((el) => el != item);
  }
  if (type == "takeAway") {
    takeAway.value = takeAway.value.filter((el) => el != item);
  }
  if (type == "dineIn") {
    dineIn.value = dineIn.value.filter((el) => el != item);
  }
  if (type == "carhop") {
    carhop.value = carhop.value.filter((el) => el != item);
  }
}
function removeItem(item, type) {
  if (type == "basedaVailabilities") {
    const found = basedaVailabilities.value.find(
      (el) => el.id && el.type == item.value.id && item.value.type
    );
    if (!found) basedaVailabilities.value.push(item.value);
  }
  if (type == "online") {
    const found = online.value.find(
      (el) => el.id && el.type == item.value.id && item.value.type
    );
    if (!found) online.value.push(item.value);
  }
  if (type == "delivery") {
    const found = delivery.value.find(
      (el) => el.id && el.type == item.value.id && item.value.type
    );
    if (!found) delivery.value.push(item.value);
  }
  if (type == "takeAway") {
    const found = takeAway.value.find(
      (el) => el.id && el.type == item.value.id && item.value.type
    );
    if (!found) takeAway.value.push(item.value);
  }
  if (type == "dineIn") {
    const found = dineIn.value.find(
      (el) => el.id && el.type == item.value.id && item.value.type
    );
    if (!found) dineIn.value.push(item.value);
  }
  if (type == "carhop") {
    const found = carhop.value.find(
      (el) => el.id && el.type == item.value.id && item.value.type
    );
    if (!found) carhop.value.push(item.value);
  }
}

function pushAgg(item, name) {
  aggregatorsOptions[name] = aggregatorsOptions[name].filter(
    (el) => el != item
  );
}

function removeAgg(item, name) {
  aggregatorsOptions[name].push(item.value);
}

onBeforeMount(async () => {
  if (props.data) {
    setData();
    getAvailabilities();
    getVisibility();
  } else {
    getAvailabilities();

    getVisibility();
  }
});
</script>

<style lang="scss">
.visibilities {
  .v-switch .v-selection-control {
    @apply flex-row-reverse justify-between font-medium;
    label {
      @apply opacity-100  text-lg;
      color: var(--titles_color) !important;
    }
  }
}
</style>
