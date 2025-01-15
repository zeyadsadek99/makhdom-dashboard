<template>
  <div class="h-full flex flex-col">
    <breadcrumbs :items="breadItems" :title="$t('LABELS.sliders')" />
    <div
      class="bg-white rounded-3xl h-full shadow-[0_7px_6px_0px,rgba(#B1B1B11A)] md:p-7 flex-1 flex flex-col"
    >
      <!-- <base-filter
        name="sliders"
        :inputs="[]"
        :btn-name="t(`BUTTONS.add`, { name: t('LABELS.slider') })"
        icon="fas fa-plus"
        :keyword="true"
        @action="$router.push('/sliders/form')"
      /> -->
      <v-data-table-virtual
        :headers="headers"
        :items="[items]"
        :loading="loading"
        item-value="id"
        class="project-table"
        item-key="id"
        :no-data-text="$t('TEXTS.noData')"
      >
        <template v-slot:loading>
          <loader class="py-7" />
        </template>

        <template v-slot:no-data>
          <div
            class="text-center"
            v-if="!$route.query.keyword && !$route.query.status"
          >
            <h3 class="mt-4 font-semibold text-text text-center">
              {{
                $t("TITLES.No have been added yet", {
                  name: $t("LABELS.profile"),
                })
              }}
            </h3>
            <div class="flex items-center justify-center mt-7 gap-2 flex-wrap">
              <router-link
                to="/sliders/form"
                class="base-btn rounded-xl self-end"
              >
                <i class="fas fa-plus"></i>
                {{ $t(`BUTTONS.add`, { name: $t("LABELS.admin") }) }}
              </router-link>
            </div>
          </div>
          <h3 v-else class="mt-4 font-semibold text-text text-center">
            {{ $t("TITLES.No Search result") }}
          </h3>
        </template>
        <!-- {{ item.full_name }} 
                      :title="`${item['en']['description']}`"
                :text="item.en.description"

        -->
        <template v-slot:[`item.name`]="{ item }">
  <div class="flex gap-2 items-center flex-wrap ">
    <small-details-card 
      :text="`${item.en?.description}`"
      :image="item.image"
      class="max-w-[100px] sm:max-w-[250px] md:max-w-[350px] lg:max-w-[450px] xl:max-w-[520px] xs:max-w-[200px]  overflow-hidden whitespace-nowrap"
    />
  </div>
</template>




        <template v-slot:[`item.actions`]="{ item, index }">
          <div class="flex items-center gap-4">
            <router-link :to="`/sliders/form/${item.id}`">
              <svg-icon class="text-primary" name="edit" filled />
            </router-link>
            
          </div>
        </template>
        <!-- <template v-slot:[`item.email`]="{ item }">
          <div class="flex gap-2 items-center flex-wrap">
            <small-details-card :title="`${item.country?.name}`" :image="item.country?.flag.media"
            />
          </div>
        </template> -->

      </v-data-table-virtual>
      
    </div>
    <base-pagination :item="paginator" v-if="paginator" />
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const route = useRoute();
const { t } = useI18n();

const breadItems = [
  {
    name: t("TITLES.home"),
    path: "/",
    imgIcon: "settings.svg",
  },
  {
    name: t("LABELS.sliders"),
    path: "/sliders",
    imgIcon: "",
  },
];

const items = ref([]);
const loading = ref(false);
const paginator = ref(null);

  const headers = [
  {
    title: t("LABELS.slider"),
    align: "start",
    sortable: false,
    key: "name",
  },
  // {
  //   title: t("LABELS.email"),
  //   align: "start",
  //   sortable: false,
  //   key: "email",
  // },

    {
      title: t("LABELS.Actions"),
      align: "starat",
      sortable: false,
      key: "actions",
    },
  ];

function fetchData() {
  loading.value = true;
  axios
    .get("sliders", {
      params: {
        keyword: route.query.keyword || "",
      },
    })
    .then((res) => {
      items.value = res.data.data;
      console.log(items.value.en.title)
      paginator.value = res.data.meta;
      loading.value = false;
    })
    .catch(() => (loading.value = false));
}

watch(
  () => route.query,
  () => fetchData()
);

onMounted(() => {
  fetchData();
});
</script>
