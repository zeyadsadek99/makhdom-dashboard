<template>
  <VeeForm as="div" @submit="handleSubmit" :initial-values="initialValues">
    <!-- :validation-schema="schema" -->
    <form class="mt-7">
      <base-card1 class="p-7 mb-5">
        <div class="tree">
          <div class="main_title">
            <p>{{ $t("TITLES.Online") }}</p>
            <div>
              <v-switch
                color="success"
                :model-value:any="true"
                class="capitalize"
                v-model="initialValues.has_online"
              ></v-switch>
            </div>
          </div>
          <loader v-if="onlineLoader" />
          <template v-else>
            <div v-for="item in onlineTypes" :key="item.id">
              <div class="sub">
                <div class="main_checkbox">
                  <v-checkbox
                    :disabled="!initialValues.has_online"
                    v-model="item.status"
                    @change="setCheckValues(item)"
                  >
                    <template v-slot:label>
                      <div class="flex flex-wrap gap-2">
                        <span class="flex items-center font-medium text-text"
                          >{{ $t(`TITLES.${item.title}`) }}
                        </span>
                      </div>
                    </template>
                  </v-checkbox>
                  <div class="sub_sub">
                    <v-checkbox
                      :disabled="!initialValues.has_online"
                      v-model="type.status"
                      v-for="(type, index) in item.content"
                      :key="index"
                      class="checkbox"
                      @change="checkValues(item)"
                    >
                      <template v-slot:label>
                        <div class="flex flex-wrap gap-2">
                          <span class="flex items-center font-medium text-text">
                            {{ $t(`LABELS.${type.name}`) }}
                          </span>
                        </div>
                      </template>
                    </v-checkbox>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </base-card1>
      <base-card1 class="p-7 mb-5 tree">
        <div class="flex items-center justify-between font-bold rounded-xl">
          <p>{{ $t("LABELS.pos") }}</p>
          <div>
            <v-switch
              color="success"
              :model-value:any="true"
              class="capitalize"
              v-model="initialValues.has_pos"
            ></v-switch>
          </div>
        </div>
        <loader v-if="posTypesLoader" />
        <template v-else>
          <div class="sub">
            <div>
              <v-checkbox
                v-for="item in posTypes"
                :key="item.id"
                :disabled="!initialValues.has_pos"
                class="checkbox"
                v-model="item.status"
              >
                <template v-slot:label>
                  <div class="flex flex-wrap gap-2">
                    <span class="flex items-center font-medium text-text">{{
                      $t(item.name)
                    }}</span>
                  </div>
                </template>
              </v-checkbox>
            </div>
          </div>
        </template>
      </base-card1>

      <div class="flex items-center justify-end gap-7">
        <router-link
          to="/menu-setup/order-discounts"
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
import { ref, onMounted, reactive, onBeforeMount, watch } from "vue";
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
  has_pos: false,
  has_online: false,
});

const emit = defineEmits(["returned-data"]);

const isLoading = ref(false);
function handleSubmit(values) {
  values.has_pos = initialValues.has_pos;
  values.has_online = initialValues.has_online;

  const posOrderType = {};
  posTypes.value.map((el) => (posOrderType[el.name] = el.status));
  const onlineOrderType = {};
  onlineTypes.value.map((type) =>
    type.content.map((el) => (onlineOrderType[el.name] = el.status))
  );

  values["pos_order_type"] = JSON.stringify(posOrderType);

  values["online_order_type"] = JSON.stringify(onlineOrderType);

  emit("returned-data", values);
}

const onlineLoader = ref(false);
const onlineTypes = ref([]);
const posTypesLoader = ref(false);
const posTypes = ref([]);

function getPosTypes() {
  posTypesLoader.value = true;
  axios
    .get(`pos_order_type`, {
      params: {
        id: route.params.id || "",
        type: "order_discounts",
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

      posTypes.value = vis;

      posTypesLoader.value = false;
    })
    .catch(() => (posTypesLoader.value = false));
}
function getOnlineTypes() {
  onlineLoader.value = true;
  axios
    .get(`online_order_type`, {
      params: {
        id: route.params.id || "",
        type: "order_discounts",
      },
    })
    .then((res) => {
      let allTypes = [];
      let mobile_application = {
        title: "",
        status: false,
        content: [],
      };
      let website = {
        title: "",
        status: false,
        content: [],
      };

      for (const [key, value] of Object.entries(res.data.data)) {
        if (key.includes("web_")) {
          website.title = "website";

          website.content.push({
            name: key,
            status: value,
          });
        } else if (key.includes("app_")) {
          mobile_application.title = "Mobile Application";
          mobile_application.content.push({
            name: key,
            status: value,
          });
        }
      }

      website.status = website.content.every((status) => status.status == true);
      mobile_application.status = mobile_application.content.every(
        (status) => status.status == true
      );

      allTypes = [website, mobile_application];

      onlineTypes.value = allTypes;

      onlineLoader.value = false;
    })
    .catch(() => (onlineLoader.value = false));
}

function setCheckValues(item) {
  const value = item.content.every((el) => el.status == true);
  const statusValue = item.content.filter((el) => el.status == true);
  if (!value) {
    item.content.map((el) => (el.status = true));
    item.status = true;
  } else {
    item.content.map((el) => (el.status = false));
    item.status = false;
  }
  if (statusValue.length == item.content.length) {
    item.status = !value;
  }
}
function checkValues(item) {
  item.status = item.content.every((status) => status.status == true);
}

watch(
  () => props.data,
  () => {
    if (props.data) {
      initialValues.has_pos = props.data.has_pos;
      initialValues.has_online = props.data.has_online;
    }
  },
  { immediate: true, deep: true }
);

onBeforeMount(async () => {
  await getPosTypes();
  await getOnlineTypes();
});
</script>

<style lang="scss">
.tree {
  @apply relative;
  .main_title {
    @apply flex items-center justify-between font-bold rounded-xl;
  }
  .sub {
    @apply ms-5  relative flex;
    &::before {
      content: "";
      @apply w-[2px] bg-sub inline-block h-full;
    }
    .sub_sub {
      @apply ms-5  relative;
    }
  }
}
</style>
