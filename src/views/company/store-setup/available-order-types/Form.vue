<template>
  <div>
    <breadcrumbs
      :items="breads"
      :title="t('BUTTONS.available orders types')"
      :back="`/store-setup/${$route.params.id}`"
      class="mb-7"
    />

    <div class="flex gap-4 flex-col md:flex-row flex-wrap">
      <div class="flex-1 w-full min-w-[250px] max-w-[800px] m-auto">
        <FormSkelton v-if="loading" />
        <template v-else>
          <VeeForm @submit="handleSubmit" :initial-values="initialValues">
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
                              <span
                                class="flex items-center font-medium text-text"
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
                                <span
                                  class="flex items-center font-medium text-text"
                                >
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
              <div
                class="flex items-center justify-between font-bold rounded-xl"
              >
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
                          <span
                            class="flex items-center font-medium text-text"
                            >{{ $t(item.name) }}</span
                          >
                        </div>
                      </template>
                    </v-checkbox>
                  </div>
                </div>
              </template>
            </base-card1>

            <div class="flex items-center justify-end gap-7">
              <router-link
                :to="`/store-setup/${route.params.id}`"
                class="capitalize font-semibold text-sub"
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
            </div>
          </VeeForm>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, reactive, onBeforeMount, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { toast } from "vue3-toastify";
const { t, locale } = useI18n();
const route = useRoute();
const breads = ref([]);
const onlineLoader = ref(false);
const onlineTypes = ref([]);
const posTypesLoader = ref(false);
const posTypes = ref([]);
const isLoading = ref(false);
const loading = ref(false);

const props = defineProps({
  data: {
    required: false,
    type: Object,
  },
  storeData: {
    required: false,
  },
});

const initialValues = reactive({
  has_pos: false,
  has_online: false,
});

function handleSubmit(values) {
  values.has_pos = initialValues.has_pos;
  values.has_online = initialValues.has_online;

  const posOrderType = {};
  posTypes.value.map((el) => (posOrderType[el.name] = el.status));
  const onlineOrderType = {};
  onlineTypes.value.map((type) =>
    type.content.map((el) => (onlineOrderType[el.name] = el.status))
  );

  let url = `available_order_type`;
  const frmData = new FormData();
  frmData.append("has_pos", +values.has_pos);
  frmData.append("has_online", +values.has_online);
  frmData.append("pos_order_type", JSON.stringify(posOrderType));
  frmData.append("online_order_type", JSON.stringify(onlineOrderType));
  frmData.append(`store_id`, route.params.id);

  axios
    .post(url, frmData)
    .then((res) => {
      setTimeout(() => toast.success(res.data.message), 300);
    })
    .catch((e) => {
      toast.error(e.response.data.message);
    });
}

function getPosTypes(id) {
  posTypesLoader.value = true;
  axios
    .get(`pos_order_type`, {
      params: {
        id: id,
        type: "store_settings",
      },
    })
    .then((res) => {
      let types = [];

      for (const [name, status] of Object.entries(res.data.data)) {
        types.push({
          name,
          status,
        });
      }

      posTypes.value = types;

      posTypesLoader.value = false;
    })
    .catch(() => (posTypesLoader.value = false));
}
function getOnlineTypes(id) {
  onlineLoader.value = true;
  axios
    .get(`online_order_type`, {
      params: {
        id: id,
        type: "store_settings",
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

      allTypes = [website, mobile_application];
      website.status = website.content.every((status) => status.status == true);
      mobile_application.status = mobile_application.content.every(
        (status) => status.status == true
      );
      onlineTypes.value = allTypes;

      console.log(allTypes);

      onlineLoader.value = false;
    })
    .catch(() => (onlineLoader.value = false));
}

function checkValues(item) {
  item.status = item.content.every((status) => status.status == true);
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

function getData() {
  loading.value = true;
  axios
    .get(`available_order_type/${route.params.id}`)
    .then((res) => {
      const result = res.data.data;

      setData(result);
      getPosTypes(result.id);
      getOnlineTypes(result.id);

      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
}

function setData(result) {
  initialValues.has_pos = result.has_pos;
  initialValues.has_online = result.has_online;
  loading.value = false;
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

watch(
  () => initialValues.has_online,
  (newVal) => {
    if (!newVal) {
      onlineTypes.value.forEach((item) => {
        item.status = false;
        item.content.forEach((type) => {
          type.status = false;
        });
      });
    }
  }
);

watch(
  () => initialValues.has_pos,
  (newVal) => {
    if (!newVal) {
      posTypes.value.forEach((item) => {
        item.status = false;
      });
    }
  }
);

watch(
  () => props.storeData,
  (value) => {
    breads.value = [
      {
        path: "/",
        imgIcon: "storeSetup.svg",
        name: t("sidebar.dashboard"),
      },
      {
        path: "/store-setup",
        imgIcon: "",
        name: t("sidebar.storeSetup"),
      },
      {
        path: `/store-setup/${value ? value.id : ""}`,
        imgIcon: "",
        name: value ? value[locale.value].name : "",
      },
      {
        path: `/store-setup/${route.params.id}/available-order-types`,
        imgIcon: "",
        name: t("TITLES.available orders types"),
      },
    ];
  },
  {
    immediate: true,
  }
);

onBeforeMount(() => {
  getData();
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
