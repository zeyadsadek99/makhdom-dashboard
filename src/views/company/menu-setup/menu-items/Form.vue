<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="
        t(`BUTTONS.${route.params.id ? 'Edit' : 'add'}`, {
          name: t('LABELS.menuItem'),
        })
      "
      back="/menu-setup/menu-items"
      class="mb-7"
    />

    <div class="w-full md:max-w-[1200px] mx-auto">
      <FormSkelton v-if="loading" />

      <template v-else>
        <Form
          :data="values"
          @returned-data="setData"
          :sub-category="subCategory"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import Form from "./steps/Form.vue";

import { reactive, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { toast } from "vue3-toastify";

const loading = ref(true);
const btnLoading = ref(false);
const route = useRoute();
const router = useRouter();
const subCategory = ref(null);
const { t } = useI18n();

const values = ref(null);

function setData(event) {
  values.value = event;

  handleSubmit();
}

function handleSubmit() {
  btnLoading.value = true;

  let url = `product`;
  const frmData = new FormData();

  const allVisiabilities = {};
  values.value.visibility.map((el) => (allVisiabilities[el.name] = el.status));

  const allAggVisiabilities = {};
  values.value.aggregators_visibility.map(
    (el) => (allAggVisiabilities[el.name] = el.status)
  );

  if (route.params.id) {
    frmData.append("_method", "PUT");
    url = `product/${route.params.id}`;
  }

  frmData.append("is_active", +values.value.is_active);
  frmData.append("type", values.value.type);

  if (values.value.type == "scale") {
    frmData.append("unit_num", values.value.unitNum);
    frmData.append("unit_id", values.value.measured);
  }
  if (values.value.type == "regular") {
    values.value.upsellingProducts.map((el, index) => {
      frmData.append(`upselling_items[${index}]`, el);
    });
  }
  frmData.append("barcode", values.value.barcode);
  frmData.append("ar[name]", values.value.nameAr);
  frmData.append("en[name]", values.value.nameEn);
  frmData.append("ar[desc]", values.value.descAr);
  frmData.append("en[desc]", values.value.descEn);
  frmData.append("ar[slug]", values.value.slugAr);
  frmData.append("en[slug]", values.value.slugEn);
  frmData.append("ar[seo_url]", values.value.urlAr);
  frmData.append("en[seo_url]", values.value.urlEn);
  frmData.append("ar[meta_keywords]", values.value.keywordsAr);
  frmData.append("en[meta_keywords]", values.value.keywordsEn);
  frmData.append("ar[meta_desc]", values.value.metaDescAr);
  frmData.append("en[meta_desc]", values.value.metaDescEn);

  frmData.append("category_id", values.value.category);
  frmData.append("sub_category_id", values.value.subCategory);
  // frmData.append("tax_rate_id", values.value.taxRate);
  if (values.value.images) {
    values.value.images.map((el, index) => {
      frmData.append(`images[${index}]`, el);
    });
  }

  values.value.foodIcon.map((el, index) => {
    frmData.append(`food_icon[${index}]`, el.id);
  });

  frmData.append(
    "availability_days[available_at]",
    JSON.stringify(values.value.availableDays.map((el) => el.id))
  );
  frmData.append(
    "availability_days[is_available_24h]",
    +values.value.availableAllDay
  );
  if (!values.value.availableAllDay) {
    frmData.append("availability_days[from_time]", values.value.fromTime);
    frmData.append("availability_days[to_time]", values.value.toTime);
  }

  frmData.append("availability_days[from_day]", values.value.from);
  frmData.append("availability_days[to_day]", values.value.to);
  frmData.append("visibility", JSON.stringify(allVisiabilities));

  frmData.append("aggregators_visibility", JSON.stringify(allAggVisiabilities));

  values.value.combos.map((el, index) => {
    if (el.id) {
      frmData.append(`combo_items[${index}][id]`, el.id);
    }
    frmData.append(`combo_items[${index}][ar][name]`, el.nameAr);
    frmData.append(`combo_items[${index}][en][name]`, el.nameEn);

    frmData.append(`combo_items[${index}][selection_num]`, el.selection);
    el.products.map((product, indx) => {
      frmData.append(`combo_items[${index}][productIDs][${indx}]`, product);
    });
    el.ruleBased.map((role, idx) => {
      frmData.append(
        `combo_items[${index}][prices][${idx}][availability_type]`,
        role.type
      );
      frmData.append(
        `combo_items[${index}][prices][${idx}][availability_id]`,
        role.id
      );
      frmData.append(
        `combo_items[${index}][prices][${idx}][price]`,
        role.price
      );

      if (role.availability_id) {
        frmData.append(
          `combo_items[${index}][prices][${idx}][id]`,
          role.availability_id
        );
      }
    });
  });
  values.value.prices.map((el, index) => {
    frmData.append(`prices[${index}][type]`, el.price_type);
    frmData.append(`prices[${index}][availability_type]`, el.type);
    frmData.append(`prices[${index}][availability_id]`, el.id);
    if (el.price) {
      frmData.append(`prices[${index}][price]`, el.price);
    }
    if (el.availability_id) {
      frmData.append(`prices[${index}][id]`, el.availability_id);
    }
  });

  values.value.allAggregators.map((el, index) => {
    frmData.append(`aggregators_prices[${index}][type]`, el.aggregator_type);
    frmData.append(`aggregators_prices[${index}][availability_type]`, el.type);
    frmData.append(`aggregators_prices[${index}][availability_id]`, el.id);
    if (el.availability_id) {
      frmData.append(`aggregators_prices[${index}][id]`, el.availability_id);
    }
    if (el.price) {
      frmData.append(`aggregators_prices[${index}][price]`, el.price);
    }
  });

  axios
    .post(url, frmData)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 400);

      btnLoading.value = false;

      router.push("/menu-setup/menu-items");
    })
    .catch((e) => {
      btnLoading.value = false;
      toast.error(e.response.data.message);
    });
}

const breads = [
  {
    path: "/menu-setup",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.menuSetup"),
  },
  {
    path: "/menu-setup/menu-items",
    imgIcon: "",
    name: t("TITLES.menuItems"),
  },
  {
    name: t(`BUTTONS.${route.params.id ? "Edit" : "add"}`, {
      name: t("LABELS.menuItem"),
    }),
    path: `/menu-setup/menu-items/form${
      route.params.id ? "/" + route.params.id : ""
    }`,
  },
];
function getComponentName(name) {
  const splited = name.split("_").join(" ");
  return splited
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word) {
      return word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

function IsJsonString(str) {
  try {
    let json = JSON.parse(str);

    return typeof json === "object";
  } catch (e) {
    return false;
  }
}

function getData() {
  axios.get(`product/${route.params.id}`).then((res) => {
    const result = res.data.data;

    let aggArr = [];
    if (result.aggregators_prices.length) {
      result.aggregators_prices.map((el) => {
        const found = aggArr.find((found) => found.name == el.type);

        if (found) {
          found.aggregator.push({
            id: el.availability.id,
            name: el.availability.complete_name || el.availability.name,
            type: el.availability_type,
            price: el.price,
            availability_id: el.id,
          });
        } else {
          aggArr.push({
            name: el.type,
            aggregator: [
              {
                id: el.availability?.id ?? "",
                name:
                  el.availability?.complete_name || el.availability?.name || "",
                type: el.availability_type,
                price: el.price,
                availability_id: el.id,
              },
            ],
            options: [],
          });
        }
      });
    }

    let prices = {};
    if (result.prices.length) {
      result.prices.map((el) => {
        // const found = prices.find((found) => found.name == el.type);
        let found;
        Object.keys(prices).find((key) => {
          if (key === getComponentName(el.type)) {
            found = prices[key];
          }
        });

        if (found) {
          found.push({
            id: el.availability.id,
            name: el.availability.complete_name || el.availability.name,
            price: el.price,
            price_type: el.type,
            type: el.availability_type,
            availability_id: el.id,
          });
        } else {
          prices[getComponentName(el.type)] = [
            {
              id: el.availability?.id ?? "",
              name:
                el.availability?.complete_name || el.availability?.name || "",
              price: el.price,
              price_type: el.type,
              type: el.availability_type,
              availability_id: el.id,
            },
          ];
        }
      });
    }

    let comboArr = [];
    if (result.combo.length) {
      comboArr = result.combo.map((el) => ({
        nameEn: el.en.name,
        nameAr: el.ar.name,
        selectedProducts: el.products,
        products: el.products.map((el) => el.id),
        ruleBased: el.prices.map((price) => ({
          id: price.availability.id,
          name: price.availability.name,
          type: price.availability_type,
          price: price.price,
          availability_id: price.id,
        })),
        id: el.id,
        selection: el.selection_num,
      }));
    }
    subCategory.value = result.sub_category;

    values.value = {
      is_active: result.is_active,
      nameAr: result.ar.name,
      nameEn: result.en.name,
      descAr: result.ar.desc,
      descEn: result.en.desc,
      type: result.type,
      unitNum: result.unit_num,
      measured: result.unit?.id ?? "",
      taxRate: result.tax_rate?.id ?? null,
      barcode: result.barcode,
      subCategory: result.sub_category?.id ?? null,
      category: result.category?.id ?? null,
      foodIcon: result.food_icons,
      combos: comboArr,

      availableAllDay: result.availability_days?.is_available_24h ?? false,
      from: result.availability_days?.from_day ?? null,
      to: result.availability_days?.to_day ?? null,
      fromTime: result.availability_days?.from_time ?? "",
      toTime: result.availability_days?.to_time ?? "",
      slugAr: result.ar.slug,
      slugEn: result.en.slug,
      urlAr: result.ar.seo_url,
      urlEn: result.en.seo_url,
      metaDescEn: result.en.meta_desc,
      metaDescAr: result.ar.meta_desc,
      keywordsEn: result.en.meta_keywords,
      keywordsAr: result.ar.meta_keywords,
      preview: result.images.map((el) => ({ image: el.image, id: el.id })),
      upsellingProducts: result.upselling_products.map((el) => el.id),
      selectedProducts: result.upselling_products,
      allAggregators: aggArr,
      ...prices,

      availableDays: result.availability_days
        ? IsJsonString(result.availability_days.available_at)
          ? JSON.parse(result.availability_days.available_at)
          : []
        : [],
    };

    loading.value = false;
  });
}

onMounted(() => {
  if (route.params.id) {
    getData();
  } else {
    loading.value = false;
  }
});
</script>
