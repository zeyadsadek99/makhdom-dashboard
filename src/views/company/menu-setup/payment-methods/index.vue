<template>
  <div>
    <div>
      <breadcrumbs
        :items="breads"
        :title="$t('TITLES.paymentMethods')"
        back="/menu-setup"
        class="mb-7"
      />
    </div>

    <div class="w-full md:max-w-[1200px] mx-auto">
      <loader v-if="loading" />
      <VeeForm
        v-else
        :validation-schema="schema"
        @submit="handleSubmit"
        :initial-values="initialValues"
      >
        <base-card1 class="p-7">
          <div
            class="border-b border-line last:border-0 py-3"
            v-for="payment in paymentMethod"
            :key="payment.id"
          >
            <div class="flex flex-wrap items-center justify-between pb-3">
              <p class="font-semibold capitalize text-lg">
                {{ $t(`LABELS.${payment.type}`) }}
              </p>
              <div>
                <global-switcher
                  :id="payment.id"
                  model="payment_methods"
                  v-model:modalValue="payment.is_active"
                />
              </div>
            </div>
            <div
              class="mb-3 flex items-start gap-2 flex-wrap"
              v-if="payment.availability.length > 0"
            >
              <p class="text-sub">{{ $t("LABELS.Available in") }} :</p>
              <div
                class="label-selected !py-1"
                v-for="(item, indx) in payment.availability"
                :key="item.id"
              >
                {{ item.name }}

                <Deleter
                  url="delete_availability"
                  :id="item.availability_id"
                  modal-type="payment_availability"
                  icon="fas fa-times"
                  @remove="payment.availability.splice(indx, 1)"
                  v-if="item.availability_id"
                />

                <button
                  v-else
                  type="button"
                  @remove="payment.availability.splice(indx, 1)"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
            <button
              type="button"
              class="text-primary flex items-center gap-1"
              @click="showModalFun(payment.availability, payment.id)"
            >
              <i class="fas fa-plus"></i>
              {{ $t("LABELS.Available at") }}
            </button>
          </div>
        </base-card1>

        <base-card1 class="p-7 mt-7" :title="$t('TITLES.Aggregators')">
          <div
            class="border-b border-line last:border-0 py-3"
            v-for="agg in aggregators"
            :key="agg.id"
          >
            <div class="flex flex-wrap items-center justify-between pb-3">
              <p class="font-semibold capitalize text-lg">
                {{ $t(`LABELS.${agg.type}`) }}
              </p>
              <div>
                <global-switcher
                  :id="agg.id"
                  model="payment_methods"
                  v-model:modalValue="agg.is_active"
                />
              </div>
            </div>
            <div
              class="mb-3 flex items-start gap-2 flex-wrap"
              v-if="agg.availability.length > 0"
            >
              <p class="text-sub">{{ $t("LABELS.Available in") }} :</p>
              <div
                class="label-selected !py-1"
                v-for="(item, indx) in agg.availability"
                :key="item.id"
              >
                {{ item.name }}
                <Deleter
                  url="delete_availability"
                  :id="item.availability_id"
                  modal-type="payment_availability"
                  icon="fas fa-times"
                  @remove="agg.availability.splice(indx, 1)"
                  v-if="item.availability_id"
                />
                <button
                  v-else
                  type="button"
                  @click="agg.availability.splice(indx, 1)"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
            <button
              type="button"
              class="text-primary flex items-center gap-1"
              @click="showModalFun(agg.availability, agg.id)"
            >
              <i class="fas fa-plus"></i>
              {{ $t("LABELS.Available at") }}
            </button>
          </div>
        </base-card1>
        <modal
          :persist="true"
          v-if="showModal"
          :title="t('LABELS.Available at')"
          @close="closeModal"
          classes="!w-[600px]"
        >
          <VeeForm
            :validation-schema="schema"
            @submit="handleSubmit"
            :initial-values="initialValues"
          >
            <AvailabilitySelect
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
              modal-name="payment_availability"
              id="availabilities"
              v-model:itemValue="selectedAvailability"
            />
            <div
              class="flex items-center justify-end mt-3 gap-5 w-full mx-auto"
            >
              <button class="base-btn py-3 rounded-xl" type="submit">
                <!-- :disabled="btnLoading" -->
                {{ $t("BUTTONS.save") }}
              </button>
            </div>
          </VeeForm>
        </modal>
        <!-- <div class="flex items-center justify-end gap-7 mt-11">
          <router-link
            to="/menu-setup"
            class="capitalize font-semibold text-sub"
            :disabled="isLoading"
          >
            {{ $t("BUTTONS.cancel") }}
          </router-link>

          <button
            type="submit"
            class="base-btn rounded-md"
            :disabled="isLoading"
          >
            {{ $t("BUTTONS.save") }}
          </button>
        </div> -->
      </VeeForm>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, reactive, onBeforeMount, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { toast } from "vue3-toastify";
import { useRoute, useRouter } from "vue-router";
import * as yup from "yup";
const loading = ref(true);
const props = defineProps({
  data: {
    required: false,
    type: Object,
  },
});
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const showModal = ref(false);

const breads = [
  {
    path: "/menu-setup",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.menuSetup"),
  },
  {
    path: "/menu-setup/payment-methods",
    imgIcon: "",
    name: t("TITLES.paymentMethods"),
  },
];

const initialValues = reactive({
  id: "",
  availabilities: [],
  is_active: true,
});

const schema = yup.object().shape({
  availabilities: yup
    .array()
    .test(
      "availabilities",
      t("ERRORS.isRequired", { name: t("LABELS.Availability") }),
      (values) => {
        if (values && values.length) {
          return true;
        }
      }
    ),
});

const selectedAvailability = ref([]);
const selectedId = ref(null);
const availabilities = ref([]);
const availabilitiesLoader = ref(false);
const isLoading = ref(false);
const paymentMethod = ref([]);
const aggregators = ref([]);

function handleSubmit(values) {
  isLoading.value = true;
  const frmData = new FormData();

  frmData.append("_method", "PUT");
  frmData.append("is_active", +initialValues.is_active);

  selectedAvailability.value.map((el, i) => {
    frmData.append(`availability[${i}][availability_type]`, el.type);
    frmData.append(`availability[${i}][availability_id]`, el.id);
    if (el.availability_id) {
      frmData.append(`availability[${i}][id]`, el.availability_id);
    }
  });

  axios
    .post(`payment_method/${selectedId.value}`, frmData)
    .then((res) => {
      toast.success(res.data.message);
      setData(res.data.data);
      isLoading.value = false;
      showModal.value = false;
    })
    .catch((e) => {
      isLoading.value = false;
      toast.error(e.response.data.message);
    });
}

function setData(result) {
  paymentMethod.value.map((payment) => {
    if (payment.type == result.type) {
      payment.availability = result.availability.map((item) => ({
        id: item?.availability.id,
        type: item?.availability_type,
        name: item?.availability?.complete_name ?? el.availability?.name,
        availability_id: item?.id,
      }));
    }
  });
  aggregators.value.map((payment) => {
    if (payment.type == result.type) {
      payment.availability = result.availability.map((item) => ({
        id: item?.availability.id,
        type: item?.availability_type,
        name: item?.availability?.complete_name ?? el.availability?.name,
        availability_id: item?.id,
      }));
    }
  });
}

function showModalFun(item, id) {
  showModal.value = true;
  selectedId.value = id;
  selectedAvailability.value = item;
}

function closeModal() {
  showModal.value = false;
  selectedId.value = null;
  selectedAvailability.value = [];
}

function getPaymentMethods() {
  axios
    .get("payment_method")
    .then((res) => {
      paymentMethod.value = res.data.data.map((el) => ({
        id: el.id,
        is_active: el.is_active,
        type: el.type,
        availability: el.availability.map((item) => ({
          id: item?.availability.id,
          type: item?.availability_type,
          name: item?.availability?.complete_name ?? el.availability?.name,
          availability_id: item?.id,
        })),
      }));

      loading.value = false;
    })
    .catch(() => {});
}

function getAggregators() {
  axios
    .get("aggregator_payment_method")
    .then((res) => {
      aggregators.value = res.data.data.map((el) => ({
        id: el.id,
        is_active: el.is_active,
        type: el.type,
        availability: el.availability.map((item) => ({
          id: item?.availability.id,
          type: item?.availability_type,
          name: item?.availability?.complete_name ?? el.availability?.name,
          availability_id: item?.id,
        })),
      }));
    })
    .catch(() => {});
}

function getAvailabilities() {
  availabilitiesLoader.value = true;
  axios
    .get(`availabilities`)
    .then((res) => {
      if (props.data) {
        availabilities.value = res.data.data;
      } else {
        availabilities.value = res.data.data;
      }
      availabilitiesLoader.value = false;
    })
    .catch(() => (availabilitiesLoader.value = false));
}

onMounted(() => {
  getAvailabilities();
  getPaymentMethods();
  getAggregators();
});
</script>
