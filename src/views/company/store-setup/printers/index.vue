<template>
  <div class="flex-1 flex flex-col">
    <modal
      :persist="true"
      :title="
        $t(`BUTTONS.${printerId ? 'Edit' : 'new'}`, {
          name: $t('LABELS.printer'),
        })
      "
      @close="
        openModal = false;
        resetPrinterForm();
      "
      class="!overflow-x-hidden"
      classes="!w-full"
      v-if="openModal"
    >
      <VeeForm
        @submit="handlePrinterSubmit"
        :validation-schema="printerSchema"
        v-slot="{ meta }"
        :initial-values="initialValues"
        v-if="!dataLoading"
      >
        <base-input
          id="name"
          name="name"
          :placeholder="$t('LABELS.Enter', { name: $t('LABELS.Printer Name') })"
          :label="$t('LABELS.Printer Name')"
          type="text"
          icon="printer"
        />
        <div class="flex items-start gap-2">
          <div class="flex-1">
            <base-input
              id="ip"
              name="ip"
              :placeholder="
                $t('LABELS.Enter', { name: $t('LABELS.shared_ip') })
              "
              :label="$t('LABELS.shared_ip')"
              type="text"
              icon="printer"
              class="flex-1"
              pattern="^([0-9]{1,3}\.){3}[0-9]{1,3}$"
            />
          </div>
          <div class="w-[150px] flex items-center">
            <span class="me-2">
              :
            </span>
            <base-input
              id="port"
              name="port"
              :placeholder="$t('LABELS.Enter', { name: $t('LABELS.port') })"
              :label="$t('LABELS.port')"
              type="text"
              icon=""
            />
          </div>
        </div>

        <div class="flex items-center justify-end mt-5">
          <button
            :meta="meta"
            type="submit"
            :diabled="btnLoading"
            name="save"
            class="bg-primary !text-white min-w-[140px] h-[50px] rounded-[10px]"
          >
            {{ $t("BUTTONS.save") }}
          </button>
        </div>
      </VeeForm>
    </modal>

    <div class="flex items-center gap-2 flex-wrap justify-between">
      <breadcrumbs
        :items="breads"
        :title="$t(`LABELS.printers`)"
        :back="`/store-setup/${$route.params.id}`"
        class="mb-7"
      />

      <base-filter name="printers" :keyword="false" :inputs="[]">
        <template v-slot:button>
          <router-link
            :to="`/store-setup/${route.params.id}/printers/all-trashes`"
            class="base-btn-white rounded-lg"
          >
            {{ $t("BUTTONS.allTrashes", { name: $t("LABELS.printer") }) }}
          </router-link>

          <button
            @click="openModal = true"
            type="button"
            class="base-btn rounded-lg"
          >
            {{ $t("BUTTONS.add", { name: $t("LABELS.printer") }) }}
          </button>
        </template>
      </base-filter>
    </div>

    <base-card1 class="flex-1">
      <Loader v-if="loading" />
      <template v-else>
        <template v-if="items.length">
          <div
            v-for="item in items"
            :key="item.id"
            class="mb-5 last-of-type:mb-0"
          >
            <printerCard
              @remove="remove"
              @reload="fetchData"
              @edit="
                openModal = true;
                printerId = item.id;
              "
              url="printer"
              :item="item"
            />
          </div>
        </template>

        <div v-else class="items-center flex h-full justify-center">
          <div class="space-y-6">
            <div class="text-center">
              <img
                class="mx-auto"
                src="@/assets/images/stats/printers.png"
                alt=""
              />
              <h3 class="mt-4 font-semibold text-text text-center">
                {{
                  $t("TITLES.No have been added yet", {
                    name: $t("LABELS.printers"),
                  })
                }}
              </h3>
            </div>
            <div class="flex items-center gap-2 justify-center">
              <router-link
                :to="`/store-setup/${$route.params.id}/printers/all-trashes`"
                class="archive-btn"
              >
                {{
                  $t("BUTTONS.allTrashes", {
                    name: $t("LABELS.printers"),
                  })
                }}
              </router-link>
              <button
                type="button"
                @click="openModal = true"
                class="base-btn rounded-xl self-end"
              >
                <i class="fas fa-plus"></i>
                {{ $t(`BUTTONS.add`, { name: $t("LABELS.printers") }) }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </base-card1>
    <base-pagination :item="paginator" v-if="paginator" />
  </div>
</template>

<script setup>
import { toast } from "vue3-toastify";
import { ref, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import printerCard from "@/components/cards/printers/printerCard.vue";
import axios from "axios";
import * as yup from "yup";

const { t } = useI18n();
defineProps({
  storeData: {
    required: false,
  },
});

const route = useRoute();

const breads = [
  {
    path: `/store-setup/${route.params.id}`,
    imgIcon: "storeSetup.svg",
    name: t("sidebar.storeSetup"),
  },
  {
    path: `/store-setup/${route.params.id}/printers`,
    imgIcon: "",
    name: t("LABELS.printers"),
  },
];

const openModal = ref(false);

const paginator = ref(null);
const items = ref([]);
const loading = ref(false);
function fetchData() {
  loading.value = true;
  axios
    .get("printer")
    .then((res) => {
      items.value = res.data.data;
      paginator.value = res.data.meta;
      loading.value = false;
    })
    .catch(() => (loading.value = false));
}
watch(
  () => route.query,
  () => {
    fetchData();
  }
);

function remove(id) {
  items.value = items.value.filter((el) => el.id != id);
  paginator.value.total--;
}

const dataLoading = ref(false);
const btnLoading = ref(false);

const printerSchema = yup.object().shape({
  name: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.Printer Name") })),
  port: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.port") })),
  ip: yup
    .string()
    .required(t("ERRORS.isRequired", { name: t("LABELS.shared_ip") }))
    .matches(/(^(\d{1,3}\.){3}(\d{1,3})$)/, {
      message: t("Invalid IP address"),
      excludeEmptyString: true,
    }),
});

const initialValues = ref({
  name: "",
  port: "",
  ip: "",
});

const handlePrinterSubmit = (values) => {
  btnLoading.value = true;
  const frmData = new FormData();

  let url = "printer";
  frmData.append("name", values.name);
  frmData.append("ip", values.ip);
  frmData.append("port", values.port);
  frmData.append("store_id", route.params.id);

  if (printerId.value) {
    url = "printer/" + printerId.value;
    frmData.append("_method", "PUT");
  }

  axios
    .post(url, frmData)
    .then((res) => {
      toast.success(res.data.message);
      btnLoading.value = false;
      openModal.value = false;
      printerId.value = false;
      fetchData();
      resetPrinterForm();
    })
    .catch((e) => {
      toast.error(e.response.data.message);
    })
    .finally(() => (btnLoading.value = false));
};

function resetPrinterForm() {
  printerId.value = false;
  initialValues.value = {
    name: "",
    ip: "",
    port: "",
  };
}

function getEditedData() {
  dataLoading.value = true;
  axios
    .get(`printer/${printerId.value}`)
    .then((res) => {
      initialValues.value = {
        name: res.data.data.name,
        ip: res.data.data.ip,
        port: res.data.data.port,
      };
      dataLoading.value = false;
    })
    .catch(() => {
      dataLoading.value = false;
    });
}

const printerId = ref(null);

watch(
  () => printerId.value,
  (id) => {
    if (id) {
      getEditedData();
    }
  },
  { deep: true }
);

onMounted(() => {
  fetchData();
});
</script>
