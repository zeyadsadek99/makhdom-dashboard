<template>
  <div>
    <teleport to="body">
      <modal
        :persist="true"
        :hideHeader="true"
        :title="$t('LABELS.ticketTypes')"
        classes="!w-full !max-w-[768px] "
        class="!z-[9900]"
        @close="emit('close')"
      >
        <base-filter
          name="ticketTypes"
          :inputs="[]"
          :keyword="false"
          :btn-name="t('LABELS.ticketType')"
          icon=""
          @action="showModalForm = true"
        />
        <h2 class="font-bold text-2xl my-4">
          {{ t("LABELS.ticketTypes") }}
        </h2>
        <v-data-table-virtual
          :headers="headers"
          :items="items"
          :loading="loading"
          item-value="id"
          class="project-table"
          item-key="id"
        >
          <template v-slot:loading>
            <loader class="py-7" />
          </template>
          <template v-slot:no-data>
            <div class="text-center">
              <h3 class="mt-4 font-semibold text-text text-center">
                {{
                  $t("TITLES.No have been added yet", {
                    name: $t("LABELS.ticketTypes"),
                  })
                }}
              </h3>
            </div>
          </template>

          <template v-slot:[`item.send_type`]="{ item }">
            <small-details-card :title="$t(item.send_type)" />
          </template>

          <template v-slot:[`item.actions`]="{ item, index }">
            <action-menu
              :edit="true"
              :remove="true"
              :show="false"
              :item="item"
              name="ticket-types"
              @edit="openEdit(item)"
              @reload="fetchData"
              @remove="items.splice(index, 1)"
            />
          </template>
        </v-data-table-virtual>
        <base-pagination :item="paginator" v-if="paginator" :page_num="true" />
      </modal>
    </teleport>

    <teleport to="body">
      <modal
        :persist="true"
        v-if="showModalForm"
        :title="t('LABELS.ticketType')"
        @close="
          values = null;
          showModalForm = false;
        "
        classes="!w-full !max-w-[600px] "
      >
        <Form :data="values" :isLoading="btnLoading" @returned-data="setData" />
      </modal>
    </teleport>
  </div>
</template>

<script setup>
const emit = defineEmits(["close", "edit"]);
import axios from "axios";
import { ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import Form from "./Form.vue";
import { toast } from "vue3-toastify";

const { t, locale } = useI18n();

const route = useRoute();
const items = ref([]);
const loading = ref(false);
const showModalForm = ref(false);
const paginator = ref(null);
const values = ref(null);
const btnLoading = ref(false);

function remove(id) {
  items.value = items.value.filter((el) => el.id != id);
  paginator.value.total--;
}

const headers = [
  {
    title: t("LABELS.Title"),
    align: "start",
    sortable: false,
    key: "title",
  },

  {
    title: "",
    align: "start",
    sortable: false,
    key: "actions",
  },
];

function fetchData() {
  if (route.query.keyword || route.query.order_type || route.query.status) {
    dataFilterd.value = true;
  }

  const params = new URLSearchParams();

  params.append("page", +route.query.page_num || 1);
  loading.value = true;
  axios
    .get("ticket-types", {
      params: params,
    })
    .then((res) => {
      items.value = res.data.data;

      paginator.value = res.data.meta;
      loading.value = false;
    })
    .catch(() => (loading.value = false));
}

function handleSubmit() {
  btnLoading.value = true;

  let url = `ticket-types`;
  const frmData = new FormData();
  if (values.value.id) {
    frmData.append("_method", "PUT");
    url = `ticket-types/${values.value.id}`;
  }

  frmData.append("type", "about");

  frmData.append("ar[title]", values.value.nameAr);
  frmData.append("en[title]", values.value.nameEn);
  frmData.append("urd[title]", values.value.nameEn);

  axios
    .post(url, frmData)
    .then((res) => {
      toast.success(res.data.message);
      fetchData();
      values.value = null;
      showModalForm.value = false;
      btnLoading.value = false;
    })
    .catch((e) => {
      btnLoading.value = false;
      toast.error(e.response.data.message);
    });
}

function setData(event) {
  values.value = event;
  handleSubmit();
}
function openEdit(item) {
  values.value = {
    id: item.id,
    nameEn: item.en.title,
    nameAr: item.ar.title,
    nameUr: item.urd.title,
  };

  showModalForm.value = true;
}

onMounted(() => {
  fetchData();
});

watch(
  () => route.query.page_num,
  () => {
    fetchData();
  }
);
</script>
