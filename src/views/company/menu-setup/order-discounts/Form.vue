<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="
        t(`BUTTONS.${route.params.id ? 'Edit' : 'new'}`, {
          name: t('LABELS.orderDiscount'),
        })
      "
      back="/menu-setup/order-discounts"
      class="mb-7"
    />

    <div class="flex gap-4 flex-col md:flex-row flex-wrap">
      <div class="min-w-40 pe-4">
        <ul class="inline-nav">
          <li>
            <button
              type="button"
              @click="
                closeSteps();
                step1 = true;
              "
              :class="{ active: step1 }"
            >
              <svg-icon name="discount" />
              {{ t("TITLES.discountDetails") }}
            </button>
          </li>

          <li>
            <button
              type="button"
              @click="
                closeSteps();
                step2 = true;
              "
              :class="{ active: step2 }"
            >
              <svg-icon name="discountAvailability" />
              {{ t("LABELS.Availability") }}
            </button>
          </li>

          <li>
            <button
              type="button"
              @click="
                closeSteps();
                step3 = true;
              "
              :class="{ active: step3 }"
            >
              <svg-icon name="calendar" />

              {{ t("TITLES.Schedule Discount") }}
            </button>
          </li>

          <li>
            <button
              type="button"
              @click="
                closeSteps();
                step4 = true;
              "
              :class="{ active: step4 }"
            >
              <svg-icon name="orderTypes" />

              {{ t("TITLES.Order Types") }}
            </button>
          </li>
        </ul>
      </div>

      <div class="flex-1 w-full min-w-[250px] max-w-[800px]">
        <FormSkelton v-if="loading" />

        <template v-else>
          <keep-alive>
            <DiscountDetails
              v-if="step1"
              :data="categoriesDetails"
              :isLoading="btnLoading"
              @returned-data="setData($event, 'step1')"
            />
          </keep-alive>
          <keep-alive>
            <Availability
              :data="availabilities"
              @returned-data="setData($event, 'step2')"
              v-if="step2"
            />
          </keep-alive>
          <keep-alive>
            <ScheduleDiscount
              :data="scheduleDiscount"
              @returned-data="setData($event, 'step3')"
              v-if="step3"
            />
          </keep-alive>
          <keep-alive>
            <OrderTypes
              :data="orderTypes"
              @returned-data="setData($event, 'step4')"
              v-if="step4"
            />
          </keep-alive>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import DiscountDetails from "./steps/DiscountDetails.vue";
import Availability from "./steps/Availability.vue";
import ScheduleDiscount from "./steps/ScheduleDiscount.vue";
import OrderTypes from "./steps/OrderTypes.vue";
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { toast } from "vue3-toastify";

const { t } = useI18n();
const loading = ref(false);
const btnLoading = ref(false);
const route = useRoute();
const router = useRouter();
const step1 = ref(true);
const step2 = ref(false);
const step3 = ref(false);
const step4 = ref(false);

const categoriesDetails = ref(null);
const availabilities = ref(null);
const scheduleDiscount = ref(null);
const orderTypes = ref(null);

function setData(event, step) {
  if (step == "step1") {
    categoriesDetails.value = event;

    closeSteps();
    step2.value = true;
  } else if (step == "step2") {
    closeSteps();
    availabilities.value = event;

    if (!categoriesDetails.value) {
      step1.value = true;
      return;
    } else {
      step3.value = true;
    }
  } else if (step == "step3") {
    closeSteps();
    scheduleDiscount.value = event;

    if (!categoriesDetails.value) {
      step1.value = true;
      return;
    } else if (!availabilities.value.availabilities.length) {
      step2.value = true;
      return;
    } else {
      step4.value = true;
    }
  } else if (step == "step4") {
    closeSteps();
    orderTypes.value = event;

    if (!categoriesDetails.value) {
      step1.value = true;
      return;
    } else if (!availabilities.value.availabilities.length) {
      step2.value = true;
      return;
    } else if (!scheduleDiscount.value) {
      step3.value = true;
      return;
    } else {
      step4.value = true;
    }
    handleSubmit();
  }
}

function closeSteps() {
  step1.value = false;
  step2.value = false;
  step3.value = false;
  step4.value = false;
}

function handleSubmit() {
  btnLoading.value = true;

  let url = `order_discount`;
  const frmData = new FormData();
  if (route.params.id) {
    frmData.append("_method", "PUT");
    url = `order_discount/${route.params.id}`;
  }

  frmData.append("from_day", scheduleDiscount.value.from);
  frmData.append("from_time", scheduleDiscount.value.fromTime);
  frmData.append("to_day", scheduleDiscount.value.to);
  frmData.append("to_time", scheduleDiscount.value.toTime);
  frmData.append("ar[name]", categoriesDetails.value.nameAr);
  frmData.append("en[name]", categoriesDetails.value.nameEn);
  frmData.append("code", categoriesDetails.value.couponCode);
  frmData.append("limit_per_user", categoriesDetails.value.limitPerUser);
  frmData.append("max_number_of_used", categoriesDetails.value.maxNum);
  frmData.append("min_order_cost", categoriesDetails.value.minCost);
  frmData.append("user_type", categoriesDetails.value.usedBy);
  frmData.append("is_active", +categoriesDetails.value.is_active);
  frmData.append("have_surcharge", +categoriesDetails.value.have_surcharge);
  frmData.append(
    "auto_apply_discount",
    +categoriesDetails.value.auto_apply_discount
  );
  frmData.append("amount_type", categoriesDetails.value.type);
  if (categoriesDetails.value.type == "value") {
    frmData.append("amount_value", categoriesDetails.value.value);
  } else {
    frmData.append("amount_value", categoriesDetails.value.percentage);
    frmData.append("max_value", categoriesDetails.value.maxValue);
  }
  availabilities.value.availabilities.map((el, index) => {
    frmData.append(`availability[${index}][availability_type]`, el.type);
    frmData.append(`availability[${index}][availability_id]`, el.id);
    if (el.availability_id) {
      frmData.append(`availability[${index}][id]`, el.availability_id);
    }
  });

  frmData.append("has_pos", +orderTypes.value.has_pos);
  frmData.append("has_online", +orderTypes.value.has_online);
  frmData.append("pos_order_type", orderTypes.value.pos_order_type);
  frmData.append("online_order_type", orderTypes.value.online_order_type);

  axios
    .post(url, frmData)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 300);

      btnLoading.value = false;

      router.push("/menu-setup/order-discounts");
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
    path: "/menu-setup/order-discounts",
    imgIcon: "",
    name: t("TITLES.orderDiscounts"),
  },
  {
    name: t(`BUTTONS.${route.params.id ? "Edit" : "new"}`, {
      name: t("LABELS.orderDiscount"),
    }),
    path: `/menu-setup/order-discounts/form${
      route.params.id ? "/" + route.params.id : ""
    }`,
  },
];

function getData() {
  axios.get(`order_discount/${route.params.id}`).then((res) => {
    const result = res.data.data;

    categoriesDetails.value = {
      nameAr: result.ar.name,
      nameEn: result.en.name,
      couponCode: result.code,
      limitPerUser: result.limit_per_user,
      maxNum: result.max_number_of_used,
      minCost: result.min_order_cost,
      usedBy: result.user_type,
      is_active: result.is_active,
      maxValue: result.max_value,
      have_surcharge: result.have_surcharge,
      auto_apply_discount: result.auto_apply_discount,
      type: result.amount_type,
      value: result.amount_type == "value" ? result.amount_value : "",
      percentage: result.amount_type == "percentage" ? result.amount_value : "",
    };

    scheduleDiscount.value = {
      from: result.from_day || "",
      to: result.to_day || "",
      fromTime: result.from_time || "",
      toTime: result.to_time || "",
    };

    availabilities.value = {
      availabilities: result.availability.map((el) => ({
        id: el.availability.id,
        type: el.availability_type,
        name: el.availability?.complete_name ?? el.availability?.name,
        availability_id: el.id,
      })),
    };

    orderTypes.value = {
      has_pos: result.has_pos,
      has_online: result.has_online,
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
