<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="
        t(`BUTTONS.${route.params.id ? 'Edit' : 'new'}`, {
          name: t('TITLES.ItemModifier'),
        })
      "
      back="/menu-setup/item-modifiers"
      class="mb-7"
    />

    <div class="flex gap-4 flex-col md:flex-row flex-wrap justify-center">
      <div class="flex-1 w-full max-w-[800px]">
        <FormSkelton v-if="loading" />

        <template v-else>
          <Form
            :data="modifierDetails"
            :isLoading="btnLoading"
            @returned-data="setData"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import Form from "./steps/Form.vue";
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { toast } from "vue3-toastify";

const loading = ref(false);
const btnLoading = ref(false);
const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const modifierDetails = ref(null);

function setData(event) {
  modifierDetails.value = event;
  handleSubmit();
}

function handleSubmit() {
  btnLoading.value = true;

  let url = `item_modifier`;
  const frmData = new FormData();

  const allVisiabilities = {};
  modifierDetails.value.visibility.map(
    (el) => (allVisiabilities[el.name] = el.status)
  );
  const allAggVisiabilities = {};
  modifierDetails.value.aggregators_visibility.map(
    (el) => (allAggVisiabilities[el.name] = el.status)
  );

  if (route.params.id) {
    frmData.append("_method", "PUT");
    url = `item_modifier/${route.params.id}`;
  }

  frmData.append(
    "is_mandatory_price",
    +modifierDetails.value.is_mandatory_price
  );
  frmData.append("is_active", +modifierDetails.value.is_active);
  frmData.append("ar[name]", modifierDetails.value.nameAr);
  frmData.append("en[name]", modifierDetails.value.nameEn);
  frmData.append("ar[desc]", modifierDetails.value.descAr);
  frmData.append("en[desc]", modifierDetails.value.descEn);

  frmData.append("visibility", JSON.stringify(allVisiabilities));

  frmData.append("aggregators_visibility", JSON.stringify(allAggVisiabilities));

  frmData.append(`modifier_id`, modifierDetails.value.modifier);
  frmData.append(`sub_modifier_id`, modifierDetails.value.sub_modifier);
  modifierDetails.value.prices.map((el, index) => {
    frmData.append(`prices[${index}][type]`, el.price_type);
    frmData.append(`prices[${index}][availability_type]`, el.type);
    frmData.append(`prices[${index}][availability_id]`, el.id);
    if (el.availability_id) {
      frmData.append(`prices[${index}][id]`, el.availability_id);
    }
    if (el.price || el.price == 0) {
      frmData.append(`prices[${index}][price]`, el.price);
    }
  });

  modifierDetails.value.allAggregators.map((el, index) => {
    frmData.append(`aggregators_prices[${index}][type]`, el.aggregator_type);
    frmData.append(`aggregators_prices[${index}][availability_type]`, el.type);
    frmData.append(`aggregators_prices[${index}][availability_id]`, el.id);
    if (el.availability_id) {
      frmData.append(`aggregators_prices[${index}][id]`, el.availability_id);
    }
    if (el.price || el.price == 0) {
      frmData.append(`aggregators_prices[${index}][price]`, el.price);
    }
  });

  axios
    .post(url, frmData)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 400);

      btnLoading.value = false;
      router.push("/menu-setup/item-modifiers");
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
    path: "/menu-setup/item-modifiers",
    imgIcon: "",
    name: t("TITLES.itemModifiers"),
  },
  {
    name: t(`BUTTONS.${route.params.id ? "Edit" : "new"}`, {
      name: t("TITLES.ItemModifier"),
    }),
    path: `/menu-setup/item-modifiers/form${
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
function getData() {
  axios.get(`item_modifier/${route.params.id}`).then((res) => {
    const result = res.data.data;

    let aggArr = [];
    if (result.aggregators_prices.length) {
      result.aggregators_prices.map((el) => {
        const found = aggArr.find((found) => found.name == el.type);

        if (found) {
          found.aggregator.push({
            id: el.availability?.id,
            name: el.availability?.complete_name || el.availability?.name,
            type: el.availability_type,
            price: el.price,
            availability_id: el.id,
          });
        } else {
          aggArr.push({
            name: el.type,
            aggregator: [
              {
                id: el.availability?.id,
                name: el.availability?.complete_name || el.availability?.name,
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
    result.prices.map((el) => {
      const found = Object.keys(prices).find(
        (key) => prices[key] === getComponentName(el.type)
      );
      if (found) {
        found.push({
          id: el.availability?.id,
          name: el.availability?.complete_name || el.availability?.name,
          price: el.price,
          price_type: el.type,
          type: el.availability_type,
          availability_id: el.id,
        });
      } else {
        prices[getComponentName(el.type)] = [
          {
            id: el.availability?.id,
            name: el.availability?.complete_name || el.availability?.name,
            price: el.price,
            price_type: el.type,
            type: el.availability_type,
            availability_id: el.id,
          },
        ];
        // aggArr.push({
        //   name: el.type,
        //   aggregator: [
        //     {
        //       id: el.availability.id,
        //       name: el.availability.name,
        //       type: el.availability_type,
        //       price: el.price,
        //       availability_id: el.id,
        //     },
        //   ],
        //   options: [],
        // });
      }
    });

    modifierDetails.value = {
      nameAr: result.ar.name,
      nameEn: result.en.name,
      modifier: result.modifier?.id,
      sub_modifier: result.sub_modifier?.id,

      descAr: result.ar.desc,
      descEn: result.en.desc,
      is_active: result.is_active,
      is_mandatory_price: result.is_mandatory_price,
      allAggregators: aggArr,
      ...prices,
    };

    loading.value = false;
  });
}

onMounted(() => {
  if (route.params.id) {
    loading.value = true;
    getData();
  }
});
</script>
