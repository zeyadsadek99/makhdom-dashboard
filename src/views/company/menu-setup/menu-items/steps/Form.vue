<template>
  <loader v-if="assetsOptionsLoader" />
  <VeeForm
    v-else
    as="div"
    v-slot="{ meta }"
    :validation-schema="schema"
    @submit="handleSubmit"
    :initial-values="initialValues"
    class="w-full"
  >
    <form class="mt-7">
      <base-card1 :title="$t('TITLES.General Details')" class="p-7 mb-5">
        <v-switch
          color="success"
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
        <div class="grid md:grid-cols-2 gap-x-4 mb-4">
          <div class="md:col-span-2 mb-5">
            <p class="text-sub block mb-1">{{ $t("LABELS.itemType") }}</p>
            <div class="flex items-center gap-5 flex-wrap">
              <VeeField
                name="type"
                type="radio"
                v-slot="{ field, meta }"
                value="regular"
              >
                <div
                  class="w-fit"
                  :class="{
                    error: !meta.valid && meta.touched,
                  }"
                >
                  <label
                    for="regular"
                    class="flex gap-2 font-medium items-center w-fit"
                  >
                    <input
                      name="type"
                      id="regular"
                      v-bind="field"
                      type="radio"
                      value="regular"
                      v-model="initialValues.type"
                      class="w-5 h-5"
                    />

                    {{ $t("LABELS.Regular Item") }}
                  </label>
                </div>
              </VeeField>
              <VeeField
                name="type"
                type="radio"
                v-slot="{ field, meta }"
                value="combo"
              >
                <div
                  :class="{
                    error: !meta.valid && meta.touched,
                  }"
                >
                  <label
                    for="combo"
                    class="flex gap-2 font-medium items-center w-fit"
                  >
                    <input
                      name="type"
                      id="combo"
                      v-bind="field"
                      type="radio"
                      value="combo"
                      class="w-5 h-5"
                      v-model="initialValues.type"
                    />

                    {{ $t("LABELS.Combo Item") }}
                  </label>
                </div>
              </VeeField>
              <VeeField
                v-if="settings?.scale_menu_item"
                name="type"
                type="radio"
                v-slot="{ field, meta }"
                value="scale"
              >
                <div
                  :class="{
                    error: !meta.valid && meta.touched,
                  }"
                >
                  <label
                    for="scale"
                    class="flex gap-2 font-medium items-center w-fit"
                  >
                    <input
                      name="type"
                      id="scale"
                      v-bind="field"
                      type="radio"
                      value="scale"
                      class="w-5 h-5"
                      v-model="initialValues.type"
                    />

                    {{ $t("LABELS.Scale Item") }}
                  </label>
                </div>
              </VeeField>
            </div>

            <VeeErrorMessage name="type" as="div" class="text-error mt-2" />
          </div>
          <base-input
            id="nameAr"
            name="nameAr"
            :placeholder="$t('LABELS.Enter Item Name') + $t('inArabic')"
            :label="$t('LABELS.Item Name') + $t('inArabic')"
            type="text"
            icon="category"
          />
          <base-input
            id="nameEn"
            name="nameEn"
            :placeholder="$t('LABELS.Enter Item Name') + $t('inEnglish')"
            :label="$t('LABELS.Item Name') + $t('inEnglish')"
            type="text"
            icon="category"
          />
          <base-input
            id="descAr"
            name="descAr"
            :placeholder="
              $t('LABELS.Enter', { name: $t('LABELS.description') }) +
              $t('inArabic')
            "
            :label="$t('LABELS.description') + $t('inArabic')"
            type="textarea"
          />
          <base-input
            id="descEn"
            name="descEn"
            :placeholder="
              $t('LABELS.Enter', { name: $t('LABELS.description') }) +
              $t('inEnglish')
            "
            :label="$t('LABELS.description') + $t('inEnglish')"
            type="textarea"
          />

          <base-select
            id="category"
            name="category"
            :placeholder="$t('LABELS.choose')"
            :label="$t('LABELS.item Category')"
            icon="category1"
            :options="assetsOptions?.categories"
            :loading="assetsOptionsLoader"
            :filter="null"
            :multiple="false"
            v-model:itemValue="initialValues.category"
            @change="getSubCategories"
          />
          <base-select
            id="subCategory"
            name="subCategory"
            :placeholder="$t('LABELS.choose')"
            :label="$t('LABELS.item Sub Category')"
            icon="category2"
            :options="subCategories"
            :loading="subCategoriesLoading"
            :filter="null"
            :multiple="false"
            v-model:item="sub_category"
            v-model:itemValue="initialValues.subCategory"
          />

          <base-input
            id="barcode"
            name="barcode"
            :placeholder="$t('LABELS.Enter Barcode')"
            :label="$t('LABELS.Barcode')"
            type="text"
            icon="barcode"
          />
          <base-select
            v-if="initialValues.type == 'scale'"
            id="measured"
            name="measured"
            :placeholder="$t('LABELS.Measured in')"
            :label="$t('LABELS.Measured in')"
            icon="measured"
            url="all_unit"
            :filter="null"
            :multiple="false"
            v-model:itemValue="initialValues.measured"
          />

          <base-input
            v-if="initialValues.type == 'scale'"
            id="unitNum"
            name="unitNum"
            :placeholder="$t('LABELS.No of item units')"
            :label="$t('LABELS.No of item units')"
            type="number"
            icon="measured_num"
          />
        </div>

        <base-file-multi
          modalName="products"
          modalType="image"
          id="images"
          name="images"
          :placeholder="$t('LABELS.Item images')"
          :label="$t('LABELS.Item images')"
          accept="image/png, image/webp, image/jpeg"
          v-model:itemValue="initialValues.preview"
          v-model:image="initialValues.images"
          delete-url="product/image"
        />
      </base-card1>

      <div v-if="initialValues.type == 'combo'">
        <comboList
          @returned-data="initialValues.combos = $event"
          :data="initialValues.combos"
          :categories="categories"
          :availabilities="availabilities"
        />
      </div>
      <!-- <base-card1 :title="$t('TITLES.Applicable Taxes')" class="p-7 mb-5">
        <loader v-if="assetsOptionsLoader" />
        <div class="flex items-center gap-5 flex-wrap mt-4" v-else>
          <VeeField
            v-for="tax in assetsOptions.taxRates"
            :key="tax.id"
            name="taxRate"
            type="radio"
            v-slot="{ field, meta }"
            :value="tax.id"
          >
            <div
              class="w-fit"
              :class="{
                error: !meta.valid && meta.touched,
              }"
            >
              <label
                :for="`tax_${tax.id}`"
                class="flex gap-2 font-medium items-center w-fit"
              >
                <input
                  name="taxRate"
                  :id="`tax_${tax.id}`"
                  v-bind="field"
                  type="radio"
                  :value="tax.id"
                  v-model="initialValues.taxRate"
                  class="w-5 h-5"
                />

                {{ tax.name }}
              </label>
            </div>
          </VeeField>
        </div>

        <VeeErrorMessage name="taxRate" as="div" class="text-error mt-2" />
      </base-card1> -->
      <base-card1 class="mb-4" :title="$t('TITLES.Pricing')">
        <div class="grid md:grid-cols-2 gap-3">
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
                  push({ ...$event, price: null });
                  pushItem($event, 'basedaVailabilities');
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
                        :id="`RuleBasedValue[${idx}].price`"
                        :name="`RuleBasedValue[${idx}].price`"
                        :placeholder="$t('LABELS.Enter Price')"
                        type="number"
                        :min="0"
                        :prepend="true"
                      >
                        <template v-slot:prepend>
                          <span class="text-primary font-medium"> $ </span>
                        </template>
                      </base-input>
                      <Deleter
                        classes="mt-4"
                        url="delete_availability"
                        :id="field.value.availability_id"
                        modal-type="product_prices"
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
              <VeeErrorMessage
                v-if="!meta.valid && meta.touched"
                name="RuleBasedValue"
                as="div"
                class="text-error"
              />
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
                  push({ ...$event, price: null });
                  pushItem($event, 'online');
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
                        :id="`Online[${idx}].price`"
                        :name="`Online[${idx}].price`"
                        :placeholder="$t('LABELS.Enter Price')"
                        type="number"
                        :prepend="true"
                      >
                        <template v-slot:prepend>
                          <span class="text-primary font-medium"> $ </span>
                        </template>
                      </base-input>
                      <Deleter
                        classes="mt-4"
                        url="delete_availability"
                        :id="field.value.availability_id"
                        modal-type="product_prices"
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
              <VeeErrorMessage
                v-if="!meta.valid && meta.touched"
                name="Online"
                as="div"
                class="text-error"
              />
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
                  push({ ...$event, price: null });
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
                          <span class="text-primary font-medium"> $ </span>
                        </template>
                      </base-input>
                      <Deleter
                        classes="mt-4"
                        url="delete_availability"
                        :id="field.value.availability_id"
                        modal-type="product_prices"
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
                  push({ ...$event, price: null });
                  pushItem($event, 'carhop');
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
                        :id="`Carhop[${idx}].price`"
                        :name="`Carhop[${idx}].price`"
                        :placeholder="$t('LABELS.Enter Price')"
                        type="number"
                        :prepend="true"
                      >
                        <template v-slot:prepend>
                          <span class="text-primary font-medium"> $ </span>
                        </template>
                      </base-input>
                      <Deleter
                        classes="mt-4"
                        url="delete_availability"
                        :id="field.value.availability_id"
                        modal-type="product_prices"
                        @remove="
                          remove(idx);
                          removeItem(field, 'carhop');
                        "
                        v-if="field.value.availability_id"
                      />

                      <button
                        v-else
                        type="button"
                        class="text-sub mt-4"
                        @click="
                          remove(idx);
                          removeItem(field, 'carhop');
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
                name="Carhop"
                as="div"
                class="text-error"
              />
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
                  push({ ...$event, price: null });
                  pushItem($event, 'delivery');
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
                        :id="`Delivery[${idx}].price`"
                        :name="`Delivery[${idx}].price`"
                        :placeholder="$t('LABELS.Enter Price')"
                        type="number"
                        :prepend="true"
                      >
                        <template v-slot:prepend>
                          <span class="text-primary font-medium"> $ </span>
                        </template>
                      </base-input>
                      <Deleter
                        classes="mt-4"
                        url="delete_availability"
                        :id="field.value.availability_id"
                        modal-type="product_prices"
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

              <VeeErrorMessage
                v-if="!meta.valid && meta.touched"
                name="Delivery"
                as="div"
                class="text-error"
              />
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
                  push({ ...$event, price: null });
                  pushItem($event, 'takeAway');
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
                        :id="`TakeAway[${idx}].price`"
                        :name="`TakeAway[${idx}].price`"
                        :placeholder="$t('LABELS.Enter Price')"
                        type="number"
                        :prepend="true"
                      >
                        <template v-slot:prepend>
                          <span class="text-primary font-medium"> $ </span>
                        </template>
                      </base-input>
                      <Deleter
                        classes="mt-4"
                        url="delete_availability"
                        :id="field.value.availability_id"
                        modal-type="product_prices"
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

              <VeeErrorMessage
                v-if="!meta.valid && meta.touched"
                name="TakeAway"
                as="div"
                class="text-error"
              />
            </FieldArray>
          </div>
        </div>
      </base-card1>
      <base-card1 class="mb-4" :title="$t('TITLES.Aggregators')">
        <div class="grid md:grid-cols-2 gap-5">
          <FieldArray name="allAggregators" v-slot="{ fields }">
            <fieldset v-for="(aggregator, idx) in fields" :key="aggregator.key">
              <h3 class="text-text font-semibold mb-5">
                {{ aggregator.value.name }}
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
                    push({ ...$event, price: null });
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
                          :min="0"
                          :prepend="true"
                        >
                          <template v-slot:prepend>
                            <span class="text-primary font-medium"> $ </span>
                          </template>
                        </base-input>
                        <Deleter
                          classes="mt-4"
                          url="delete_availability"
                          :id="field.value.availability_id"
                          modal-type="product_prices"
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
      <base-card1 :title="$t('TITLES.availabilityDays')" class="p-7 mb-7">
        <div class="mt-7">
          <SingleSelect
            :label="`${$t('TITLES.availabilityDays')}:`"
            name="availableDays"
            icon="country"
            :options="days"
            id="availabilityDays"
            v-model:itemValue="selectedDay"
          />
        </div>

        <div class="grid lg:grid-cols-2 gap-3">
          <BaseDate
            id="fromDate"
            name="from"
            :time-picker="false"
            :enable-time-picker="true"
            icon="calendar"
            :min-date="minDate || new Date()"
            :max-date="maxDate"
            :min-time="minTime"
            :max-time="maxTime"
            :label="`${$t('LABELS.fromDate')}:`"
            :placeholder="`${$t('LABELS.fromDate')}`"
            v-model:itemValue="initialValues.from"
          />
          <BaseDate
            id="toDate"
            name="to"
            :time-picker="false"
            :enable-time-picker="true"
            :min-date="initialValues.from ?? minDate"
            :max-date="maxDate"
            :min-time="minTime"
            :max-time="maxTime"
            icon="calendar"
            :label="`${$t('LABELS.toDate')}:`"
            :placeholder="`${$t('LABELS.toDate')}`"
            v-model:itemValue="initialValues.to"
          />

          <div class="lg:col-span-2">
            <div class="label-lg">
              <v-switch
                color="success"
                class="capitalize font-medium text-text opacity-100"
                :model-value:any="true"
                :label="$t('LABELS.availableAllDay')"
                v-model="initialValues.availableAllDay"
              ></v-switch>
            </div>
          </div>
          <template v-if="!initialValues.availableAllDay">
            <BaseDate
              id="fromTime"
              name="fromTime"
              :time-picker="true"
              icon="hour"
              :is24="false"
              :label="`${$t('LABELS.fromTime')}:`"
              :placeholder="`${$t('LABELS.fromTime')}`"
              v-model:itemValue="initialValues.fromTime"
            />
            <BaseDate
              id="toTime"
              name="toTime"
              :time-picker="true"
              :min-date="initialValues.fromDate"
              icon="hour"
              :is24="false"
              :label="`${$t('LABELS.toTime')}:`"
              :placeholder="`${$t('LABELS.toTime')}`"
              v-model:itemValue="initialValues.toTime"
            />
          </template>
        </div>
      </base-card1>
      <base-card1 :title="$t('LABELS.foodIcon')" class="p-7 mb-7">
        <div class="mt-7">
          <SingleSelect
            :label="`${$t('LABELS.foodIcon')}:`"
            name="foodIcon"
            icon="country"
            :options="assetsOptions.foodIcons"
            id="foodIcon"
            v-model:itemValue="initialValues.foodIcon"
          />
        </div>
      </base-card1>
      <base-card1 :title="$t('TITLES.visibility')" class="p-7 mb-5">
        <loader v-if="assetsOptionsLoader" />
        <div class="visibilities" v-else>
          <v-switch
            v-for="item in assetsOptions.visibility"
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
        <loader v-if="assetsOptionsLoader" />
        <div class="visibilities" v-else>
          <v-switch
            v-for="item in assetsOptions.aggregator_visibility"
            :key="item.id"
            color="success"
            class="capitalize last-of-type:mb-0 text-text"
            :model-value:any="true"
            :label="$t('LABELS.availableOn', { name: $t(item.name) })"
            v-model="item.status"
          ></v-switch>
        </div>
      </base-card1>
      <base-card1
        :title="$t('TITLES.Upselling Item')"
        class="p-7 mb-5"
        v-if="initialValues.type == 'regular'"
      >
        <template v-slot:topTitle>
          <button
            type="button"
            @click="upSellingModal = true"
            class="base-btn rounded-md py-2 px-3 mb-3"
          >
            {{ $t("BUTTONS.add", { name: $t("TITLES.Upselling Item") }) }}
            <i class="fas fa-plus"></i>
          </button>
        </template>
        <base-card1 class="border border-line mt-5" v-if="selectedItems.length">
          <h5 class="text-sub text-sm mb-3">{{ $t("LABELS.Items") + " :" }}</h5>

          <div
            v-for="product in selectedItems"
            :key="product.id"
            class="flex items-center gap-2 justify-between"
          >
            <small-details-card :image="product.image" :title="product.name" />
            <button
              type="button"
              class="text-sub mt-4 flex items-center gap-1 text-sm"
              @click="removeProduct(product)"
            >
              <input-icon name="trash" />
              {{ $t("BUTTONS.remove") }}
            </button>
          </div>
        </base-card1>
      </base-card1>
      <base-card1 :title="$t('TITLES.seoSettings')" class="p-7 mt-5">
        <div class="grid md:grid-cols-2 gap-4">
          <base-input
            id="slugAr"
            name="slugAr"
            :placeholder="$t('LABELS.slug') + t('inArabic')"
            :label="$t('LABELS.slug') + t('inArabic')"
            icon="slug"
          />
          <base-input
            id="slugEn"
            name="slugEn"
            :placeholder="$t('LABELS.slug') + t('inEnglish')"
            :label="$t('LABELS.slug') + t('inEnglish')"
            icon="slug"
          />

          <base-input
            id="urlAr"
            name="urlAr"
            :placeholder="$t('LABELS.url') + $t('inArabic')"
            :label="$t('LABELS.url') + $t('inArabic')"
            icon="url"
          />
          <base-input
            id="urlEn"
            name="urlEn"
            :placeholder="$t('LABELS.url') + $t('inEnglish')"
            :label="$t('LABELS.url') + $t('inEnglish')"
            icon="url"
          />
          <base-input
            id="keywordsAr"
            name="keywordsAr"
            :placeholder="$t('LABELS.Meta Keywords') + $t('inArabic')"
            :label="$t('LABELS.Meta Keywords') + $t('inArabic')"
            type="textarea"
          />
          <base-input
            id="keywordsEn"
            name="keywordsEn"
            :placeholder="$t('LABELS.Meta Keywords') + $t('inEnglish')"
            :label="$t('LABELS.Meta Keywords') + $t('inEnglish')"
            type="textarea"
          />
          <base-input
            id="metaDescAr"
            name="metaDescAr"
            :placeholder="$t('LABELS.Meta / Item Description') + $t('inArabic')"
            :label="$t('LABELS.Meta / Item Description') + $t('inArabic')"
            type="textarea"
          />
          <base-input
            id="metaDescEn"
            name="metaDescEn"
            :placeholder="
              $t('LABELS.Meta / Item Description') + $t('inEnglish')
            "
            :label="$t('LABELS.Meta / Item Description') + $t('inEnglish')"
            type="textarea"
          />
        </div>
      </base-card1>
      <div class="flex items-center justify-end gap-7">
        <router-link
          to="/menu-setup/menu-items"
          class="capitalize font-semibold text-sub"
        >
          {{ $t("BUTTONS.cancel") }}
        </router-link>

        <button type="submit" class="base-btn rounded-md" :disabled="isLoading">
          {{ $t("BUTTONS.save") }}
        </button>
      </div>
    </form>

    <teleport to="body">
      <modal
        :persist="true"
        v-if="upSellingModal"
        :title="$t('BUTTONS.add', { name: $t('TITLES.Upselling Item') })"
        @close="upSellingModal = false"
        class="z-[1009]"
        classes="!w-full"
      >
        <loader v-if="categoriesLoader" />
        <template v-else>
          <h4 class="text-sub mb-3">{{ $t("LABELS.upselling Items") }}</h4>
          <div class="grid sm:grid-cols-2 gap-3">
            <base-checkbox
              v-for="category in categories"
              :key="category.id"
              :item="category"
              id="category"
              @change="handleSelectedProduct"
              @reset="handleSelectedProduct($event, 'reset')"
              icon="category"
              secondUrl="products?category_id="
              v-model:selectedItems="selectedProducts"
              v-model:itemValue="selectedProduct"
            />
          </div>
          <button
            @click.stop="saveSelectedUpselling"
            type="button"
            class="base-btn rounded-md mt-4 ms-auto"
          >
            {{ $t("BUTTONS.save") }}
          </button>
        </template>
      </modal>
    </teleport>
    <!-- End page content -->
  </VeeForm>
</template>

<script setup>
import comboList from "./combo/index.vue";
import axios from "axios";

import { ref, onMounted, reactive, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import * as yup from "yup";

import { FieldArray } from "vee-validate";
import { useAppStore } from "@/store/app";
const appStore = useAppStore();
const settings = computed(() => appStore.getSettings);

const route = useRoute();
const props = defineProps({
  data: {
    required: false,
    type: Object,
  },
  subCategory: {
    required: false,
    type: Object,
  },
});
const { t } = useI18n();
const initialValues = reactive({
  category: null,
  subCategory: null,
  is_active: true,
  combos: [],
  type: "regular",
  taxRate: "",
  preview: "",
  images: "",
  measured: "",
  unitNum: "",
  allAggregators: [],
  availableDays: [],
  foodIcon: [],
  availableAllDay: true,
  from: "",
  to: "",
  fromTime: "",
  toTime: "",
  nameAr: "",
  nameEn: "",
  descAr: "",
  descEn: "",
  slugAr: "",
  slugEn: "",
  urlAr: "",
  urlEn: "",
  metaDescEn: "",
  metaDescAr: "",
  keywordsEn: "",
  keywordsAr: "",
});

const validUrl =
  /^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w?[a-zA-Z-_%/@?]+)*([^/\w?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/;

// ###########################
//Availabilites Days
const days = ref([
  {
    name: t("Saturday"),
    id: "sat",
  },
  {
    name: t("Sunday"),
    id: "sun",
  },
  {
    name: t("Monday"),
    id: "mon",
  },
  {
    name: t("Tuesday"),
    id: "tue",
  },
  {
    name: t("Wednesday"),
    id: "wed",
  },
  {
    name: t("Thursday"),
    id: "thu",
  },
  {
    name: t("Friday"),
    id: "fri",
  },
]);

const selectedDay = ref(null);

// ###########################
//Availabilites Days
const selectedItems = ref([]);
const schema = yup.object().shape({
  nameAr: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Item Name") + t("inArabic"),
    })
  ),
  nameEn: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Item Name") + t("inEnglish"),
    })
  ),
  descAr: yup.string(),
  //   .required(
  //   t("ERRORS.isRequired", {
  //     name: t("LABELS.description") + t("inArabic"),
  //   })
  // ),
  descEn: yup.string(),
  //   .required(
  //   t("ERRORS.isRequired", {
  //     name: t("LABELS.description") + t("inEnglish"),
  //   })
  // ),

  category: yup.mixed().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.item Category"),
    })
  ),
  subCategory: yup.mixed().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.item Sub Category"),
    })
  ),

  barcode: yup.string().required(
    t("ERRORS.isRequired", {
      name: t("LABELS.Barcode"),
    })
  ),
  unitNum: yup
    .mixed()
    .test(
      "unitNum",
      t("ERRORS.isRequired", {
        name: t("LABELS.No of item units"),
      }),
      (value) => {
        if (initialValues.type != "scale") {
          return true;
        } else {
          if (value) {
            return true;
          } else {
            return false;
          }
        }
      }
    )
    .nullable(),
  measured: yup
    .mixed()
    .test(
      "measured",
      t("ERRORS.isRequired", {
        name: t("LABELS.Measured in"),
      }),
      (value) => {
        if (initialValues.type != "scale") {
          return true;
        } else {
          if (value) {
            return true;
          } else {
            return false;
          }
        }
      }
    )
    .nullable(),

  // taxRate: yup
  //   .string()
  //   .required(t("ERRORS.isRequired", { name: t("LABELS.taxRate") })),
  images: yup
    .mixed()
    .test(
      "Item_images",
      t("ERRORS.isRequired", { name: t("LABELS.Item images") }),
      (value) => {
        if (value || initialValues.preview) {
          return true;
        }
      }
    ),
  RuleBasedValue: yup
    .array()
    .required(t("ERRORS.isRequired", { name: t("TITLES.Rule Based Values") }))
    .min(1, t("ERRORS.isRequired", { name: t("TITLES.Rule Based Values") }))
    .of(
      yup.object().shape({
        price: yup
          .mixed()
          .required(t("ERRORS.isRequired", { name: t("LABELS.price") }))
          .test(
            "price",
            t("ERRORS.isRequired", { name: t("LABELS.price") }),
            (value) => {
              if (value) {
                return true;
              }
            }
          ),
      })
    )
    .strict(),
  Online: yup
    .array()
    .of(
      yup.object().shape({
        price: yup.mixed().nullable(),
        // .required(t("ERRORS.isRequired", { name: t("LABELS.price") }))
        // .test(
        //   "price",
        //   t("ERRORS.isRequired", { name: t("LABELS.price") }),
        //   (value) => {
        //     if (value) {
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
        // .required(t("ERRORS.isRequired", { name: t("LABELS.price") }))
        // .test(
        //   "price",
        //   t("ERRORS.isRequired", { name: t("LABELS.price") }),
        //   (value) => {
        //     if (value) {
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
        // .required(t("ERRORS.isRequired", { name: t("LABELS.price") }))
        // .test(
        //   "price",
        //   t("ERRORS.isRequired", { name: t("LABELS.price") }),
        //   (value) => {
        //     if (value) {
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
        // .required(t("ERRORS.isRequired", { name: t("LABELS.price") }))
        // .test(
        //   "price",
        //   t("ERRORS.isRequired", { name: t("LABELS.price") }),
        //   (value) => {
        //     if (value) {
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
        // .required(t("ERRORS.isRequired", { name: t("LABELS.price") }))
        // .test(
        //   "price",
        //   t("ERRORS.isRequired", { name: t("LABELS.price") }),
        //   (value) => {
        //     if (value) {
        //       return true;
        //     }
        //   }
        // ),
      })
    )
    .strict(),

  allAggregators: yup
    .array()
    // .required()
    // .min(1, t("ERRORS.isRequired", { name: t("LABELS.aggregator") }))
    .of(
      yup.object().shape({
        aggregator: yup
          .array()
          // .required()
          // .min(1, t("ERRORS.isRequired", { name: t("LABELS.aggregator") }))
          .of(
            yup.object().shape({
              price: yup.mixed().nullable(),
              // .required(t("ERRORS.isRequired", { name: t("LABELS.price") }))
              // .test(
              //   "price",
              //   t("ERRORS.isRequired", { name: t("LABELS.price") }),
              //   (value) => {
              //     if (value) {
              //       return true;
              //     }
              //   }
              // ),
            })
          ),
      })
    )
    .strict(),
  foodIcon: yup
    .array()
    .required(t("ERRORS.isRequired", { name: t("LABELS.foodIcon") }))
    .min(1, t("ERRORS.isRequired", { name: t("LABELS.foodIcon") })),
  availableDays: yup
    .array()
    .required(t("ERRORS.isRequired", { name: t("TITLES.availabilityDays") }))
    .min(1, t("ERRORS.isRequired", { name: t("TITLES.availabilityDays") })),

  from: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.fromDate") })),
  to: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.toDate") })),
  fromTime: yup
    .mixed()
    .test(
      "fromTime",
      t("ERRORS.isRequired", { name: t("LABELS.fromTime") }),
      (values) => {
        if (initialValues.availableAllDay) {
          return true;
        } else if (!initialValues.availableAllDay && values) {
          return true;
        }
      }
    ),

  toTime: yup
    .mixed()
    .test(
      "toTime",
      t("ERRORS.isRequired", { name: t("LABELS.toTime") }),
      (values) => {
        if (initialValues.availableAllDay) {
          return true;
        } else if (!initialValues.availableAllDay && values) {
          return true;
        }
      }
    ),

  slugAr: yup.string(),
  // .required(
  //   t("ERRORS.isRequired", { name: t("LABELS.slug") + t("inArabic") })
  // ),
  slugEn: yup.string(),
  // .required(
  //   t("ERRORS.isRequired", { name: t("LABELS.slug") + t("inEnglish") })
  // ),
  keywordsAr: yup.string(),
  //   .required(
  //   t("ERRORS.isRequired", {
  //     name: t("LABELS.Meta Keywords") + t("inArabic"),
  //   })
  // ),
  keywordsEn: yup.string(),
  //   .required(
  //   t("ERRORS.isRequired", {
  //     name: t("LABELS.Meta Keywords") + t("inEnglish"),
  //   })
  // ),
  metaDescAr: yup.string(),
  //   .required(
  //   t("ERRORS.isRequired", {
  //     name: t("LABELS.Meta / Item Description") + t("inArabic"),
  //   })
  // ),
  metaDescEn: yup.string(),
  //   .required(
  //   t("ERRORS.isRequired", {
  //     name: t("LABELS.Meta / Item Description") + t("inEnglish"),
  //   })
  // ),
  urlAr: yup.string().matches(validUrl, t("LABELS.enterValidUrl")),
  // .required(t("ERRORS.isRequired", { name: t("LABELS.url") + t("inArabic") }))
  urlEn: yup.string().matches(validUrl, t("LABELS.enterValidUrl")),
  // .required(
  //   t("ERRORS.isRequired", { name: t("LABELS.url") + t("inEnglish") })
  // )
});

const selectedAvailability = ref([]);
const aggregatorsOptions = reactive({});
const emit = defineEmits(["returned-data"]);
const isLoading = ref(false);
function handleSubmit(values) {
  values.is_active = initialValues.is_active;
  values.visibility = assetsOptions.visibility;
  values.combos = initialValues.combos;
  values.measured = initialValues.measured;
  values.availableAllDay = initialValues.availableAllDay;
  values.aggregators_visibility = assetsOptions.aggregator_visibility;
  values.upsellingProducts = selectedItems.value.map((el) => el.id);
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

// Availabilites Options

const assetsOptionsLoader = ref(true);
const assetsOptions = reactive({
  categories: [],
  taxRates: [],
  visibility: [],
  foodIcons: [],
  aggregator_visibility: [],
});

function getItemLists() {
  assetsOptionsLoader.value = true;
  const params = new URLSearchParams();
  params.append("type", "products");
  if (route.params.id) {
    params.append("id", route.params.id);
  }
  axios
    .get(`item_lists`, {
      params: params,
    })
    .then((res) => {
      res.data.data.map((el) => {
        if (el.type == "visibility") {
          let items = [];

          for (const [name, status] of Object.entries(el.value)) {
            items.push({
              name,
              status,
            });
          }

          assetsOptions[el.type] = items;
          items.map((el) => {
            aggregatorsOptions[el.name] = availabilities.value;
          });
        } else if (el.type == "aggregator_visibility") {
          let items = [];

          for (const [name, status] of Object.entries(el.value)) {
            items.push({
              name,
              status,
            });
          }
          assetsOptions[el.type] = items;
          items.map((el) => {
            aggregatorsOptions[el.name] = availabilities.value;
          });

          initialValues.allAggregators = items.map((el) => ({
            aggregator: [],
            name: el.name,
            options: availabilities.value,
          }));
          assetsOptions[el.type] = items;
        } else {
          assetsOptions[el.type] = el.value;
        }
      });

      // assetsOptions = obj;/
      if (props.data) {
        setData();
      } else {
        assetsOptionsLoader.value = false;
      }
    })
    .catch(() => (assetsOptionsLoader.value = false));
}

function removeProduct(item) {
  selectedItems.value = selectedItems.value.filter((el) => el.id != item.id);
  selectedProduct.value = selectedProduct.value.filter((el) => el != item.id);
  selectedProducts.value = selectedProduct.value.filter(
    (el) => el.id != item.id
  );
}

function setData() {
  selectedItems.value = props.data.selectedProducts;
  selectedProduct.value = props.data.upsellingProducts;
  selectedProducts.value = props.data.selectedProducts;

  getSubCategories(props.data.category);
  for (const [key, value] of Object.entries(props.data)) {
    if (key == "availableDays") {
      let sDays = [];

      days.value.map((el) => {
        value.map((item) => {
          if (el.id == item) {
            sDays.push(el);
          }
        });
      });

      selectedDay.value = sDays;
      days.value = days.value.filter((el) => !selectedDay.value.includes(el));
    }
    if (key != "availabilities") {
      if (key == "allAggregators") {
        if (value.length) {
          initialValues[key].map((main) => {
            value.map((sub) => {
              if (main.name == sub.name) {
                main.aggregator = sub.aggregator;
              }
            });
          });
        }
      } else {
        if (value) initialValues[key] = value;
      }
    }
  }

  setAvailabiltyPrice(initialValues);
  setTimeout(() => (assetsOptionsLoader.value = false), 300);
}

// ###########################
// sub categories handlers
const subCategories = ref([]);
const subCategoriesLoading = ref(false);
function getSubCategories(id) {
  if (id) {
    subCategoriesLoading.value = true;

    axios.get(`all_sub_category/${id}`).then((res) => {
      subCategoriesLoading.value = false;
      subCategories.value = res.data.data;
    });
  }
}
// sub categories handlers
// ###########################

// ###########################
//Availabilites Options
const availabilitiesLoader = ref(false);
const availabilities = ref([]);
const basedaVailabilities = ref([]);
const online = ref([]);
const dineIn = ref([]);
const carhop = ref([]);
const delivery = ref([]);
const takeAway = ref([]);
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
      getItemLists();
    })
    .catch(() => (availabilitiesLoader.value = false));
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
    let found;
    availabilities.value.map((el) => {
      if (
        item.value.id === el.id &&
        item.value.name === el.name &&
        item.value.type === el.type
      ) {
        found = el;
      }
    });

    if (found) {
      basedaVailabilities.value.push(found);
    }
  }
  if (type == "online") {
    let found;
    availabilities.value.map((el) => {
      if (
        item.value.id === el.id &&
        item.value.name === el.name &&
        item.value.type === el.type
      ) {
        found = el;
      }
    });
    if (found) {
      online.value.push(found);
    }
  }
  if (type == "delivery") {
    let found;
    availabilities.value.map((el) => {
      if (
        item.value.id === el.id &&
        item.value.name === el.name &&
        item.value.type === el.type
      ) {
        found = el;
      }
    });
    if (found) {
      delivery.value.push(found);
    }
  }
  if (type == "takeAway") {
    let found;
    availabilities.value.map((el) => {
      if (
        item.value.id === el.id &&
        item.value.name === el.name &&
        item.value.type === el.type
      ) {
        found = el;
      }
    });
    if (found) {
      takeAway.value.push(found);
    }
  }
  if (type == "dineIn") {
    let found;
    availabilities.value.map((el) => {
      if (
        item.value.id === el.id &&
        item.value.name === el.name &&
        item.value.type === el.type
      ) {
        found = el;
      }
    });
    if (found) {
      dineIn.value.push(found);
    }
  }
  if (type == "carhop") {
    let found;
    availabilities.value.map((el) => {
      if (
        item.value.id === el.id &&
        item.value.name === el.name &&
        item.value.type === el.type
      ) {
        found = el;
      }
    });
    if (found) {
      carhop.value.push(found);
    }
  }
}
// ###########################
//Availabilites Options

// ###########################
//Upselling Item Options
const selectedProduct = ref([]);
const selectedProducts = ref([]);

const upSellingModal = ref(false);

function handleSelectedProduct(e, reset) {
  selectedProduct.value = selectedProduct.value.filter((el) => !e.includes(el));
  if (!reset) {
    selectedProduct.value.push(...e);
  }
}

function saveSelectedUpselling() {
  selectedItems.value = selectedProducts.value;
  upSellingModal.value = false;
}

const categoriesLoader = ref(true);
const categories = ref([]);

function getCategories() {
  categoriesLoader.value = true;
  axios
    .get(`all_category`)
    .then((res) => {
      categories.value = res.data.data;
      categoriesLoader.value = false;
    })
    .catch(() => (categoriesLoader.value = false));
}

onMounted(() => {
  getCategories();
  getAvailabilities();
});

function pushAgg(item, name) {
  aggregatorsOptions[name] = aggregatorsOptions[name].filter(
    (el) => el != item
  );
}

function removeAgg(item, name) {
  let found;
  availabilities.value.map((el) => {
    if (
      item.value.id === el.id &&
      item.value.name === el.name &&
      item.value.type === el.type
    ) {
      found = el;
    }
  });
  if (found) {
    aggregatorsOptions[name].push(found);
  }
}
const convertTime12to24 = (time12h) => {
  const [time, modifier] = time12h.split(" ");

  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }

  return {
    hours,
    minutes,
  };
};

const minDate = ref(null);
const maxDate = ref(null);
const minTime = ref(null);
const maxTime = ref(null);

function setAvailabiltyLimit(value) {
  minDate.value = value?.availability_days?.from_day ?? "";
  maxDate.value = value?.availability_days?.to_day ?? "";
  if (!initialValues.from) {
    initialValues.from = value?.availability_days?.from_day ?? "";
  }
  if (!initialValues.to) {
    initialValues.to = value?.availability_days?.to_day ?? "";
  }
  if (value?.availability_days?.from_time) {
    minTime.value = convertTime12to24(value?.availability_days?.from_time);
  }
  if (value?.availability_days?.from_time) {
    maxTime.value = convertTime12to24(value?.availability_days?.to_time);
  }

  initialValues.availableAllDay = props.subCategory
    ? props.subCategory.availability_days.is_available_24h
      ? props.data?.availableAllDay
      : props.subCategory.availability_days.is_available_24h
    : props.data?.availableAllDay;

  let avDays = JSON.parse(value.availability_days.available_at);

  days.value = days.value.filter((el) => avDays.includes(el.id));
}

watch(
  () => props.subCategory,
  (value) => {
    if (value) {
      setAvailabiltyLimit(value);
    }
  },
  {
    deep: true,
    immediate: true,
  }
);
const sub_category = ref(null);
watch(
  () => sub_category.value,
  (value) => {
    if (value) {
      setAvailabiltyLimit(value);
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

function setAvailabiltyPrice(result) {
  for (const [key, value] of Object.entries(result)) {
    if (key == "RuleBasedValue") {
      const curAvs = setOptions(value);

      basedaVailabilities.value = basedaVailabilities.value.filter(
        (el) => !curAvs.includes(el)
      );
    }
    if (key == "Online") {
      const curAvs = setOptions(value);

      online.value = online.value.filter((el) => !curAvs.includes(el));
    }
    if (key == "DineIn") {
      const curAvs = setOptions(value);

      dineIn.value = dineIn.value.filter((el) => !curAvs.includes(el));
    }
    if (key == "Carhop") {
      const curAvs = setOptions(value);

      carhop.value = carhop.value.filter((el) => !curAvs.includes(el));
    }
    if (key == "Delivery") {
      const curAvs = setOptions(value);

      delivery.value = delivery.value.filter((el) => !curAvs.includes(el));
    }
    if (key == "TakeAway") {
      const curAvs = setOptions(value);
      takeAway.value = takeAway.value.filter((el) => !curAvs.includes(el));
    }
    if (key == "allAggregators") {
      value.map((agg) => {
        const curAvs = setOptions(agg.aggregator);
        aggregatorsOptions[agg.name] = aggregatorsOptions[agg.name].filter(
          (el) => !curAvs.includes(el)
        );
      });
    }
  }
}

function setOptions(sValue) {
  let avItems = [];
  availabilities.value.map((el) => {
    sValue.map((item) => {
      if (el.id == item.id && el.name == item.name) {
        avItems.push(el);
      }
    });
  });

  return avItems;

  // items.value = avItems;
}
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
