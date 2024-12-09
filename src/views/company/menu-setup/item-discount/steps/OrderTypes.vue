<template>
  <VeeForm as="div" @submit="handleSubmit" :initial-values="initialValues">
    <!-- :validation-schema="schema" -->
    <form class="mt-7">
      <base-card1 :title="$t('LABELS.orderTypes')" class="p-7 mb-5">
        <div
          class="flex items-center justify-between font-bold border border-line rounded-xl px-5 py-2 mb-3"
          v-for="item in orderTypes"
          :key="item.id"
        >
          <p>{{ $t(item.name) }}</p>
          <div>
            <v-switch
              color="success"
              :model-value:any="true"
              class="capitalize"
              v-model="item.status"
            ></v-switch>
          </div>
        </div>
      </base-card1>
      <base-card1
        :title="$t('TITLES.Order Types Aggregators')"
        class="p-7 mb-5"
      >
        <loader v-if="aggregatorsLoader" />
        <div class="orderTypes" v-else>
          <div
            class="flex items-center justify-between font-bold border border-line rounded-xl px-5 py-2 mb-3"
            v-for="item in aggregators"
            :key="item.id"
          >
            <p>{{ $t(item.name) }}</p>
            <div>
              <v-switch
                color="success"
                :model-value:any="true"
                class="capitalize"
                v-model="item.status"
              ></v-switch>
            </div>
          </div>
        </div>
      </base-card1>

      <div class="flex items-center justify-end gap-7">
        <router-link
          to="/menu-setup/item-discount"
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
import axios from "axios";
import { useField } from "vee-validate";
import { ref, onMounted, reactive, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import * as yup from "yup";

const route = useRoute();
const props = defineProps({
  data: {
    required: false,
    type: Object,
  },
});
const { t } = useI18n();
const initialValues = reactive({
  availabilities: [],
});

const emit = defineEmits(["returned-data"]);

const isLoading = ref(false);
function handleSubmit(values) {
  values.orderTypes = orderTypes.value;
  values.orderTypesAggregators = aggregators.value;
  emit("returned-data", values);
}

const aggregatorsLoader = ref(false);

const aggregators = ref([]);
const orderTypesLoader = ref(false);
const orderTypes = ref([]);

function getOrderTypes() {
  orderTypesLoader.value = true;
  axios
    .get(`order_types`, {
      params: {
        id: route.params.id || "",
        type: "item_discounts",
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

      orderTypes.value = vis;

      orderTypesLoader.value = false;
    })
    .catch(() => (orderTypesLoader.value = false));
}
function getOrderTypesAggregators() {
  aggregatorsLoader.value = true;
  axios
    .get(`order_type_aggregators`, {
      params: {
        id: route.params.id || "",
        type: "item_discounts",
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
    })
    .catch(() => (aggregatorsLoader.value = false));
}

onBeforeMount(async () => {
  getOrderTypesAggregators();
  getOrderTypes();
});
</script>

<style lang="scss">
.orderTypes {
  label {
    color: var(--titles_color);
  }
}
</style>
