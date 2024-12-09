<template>
  <VeeForm
    as="div"
    :validation-schema="schema"
    @submit="handleSubmit"
    :initial-values="initialValues"
  >
    <form class="mt-7">
      <base-card1 :title="$t('LABELS.Availability')" class="p-7 mb-5">
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
          modal-name="discount_availability"
          id="availabilities"
          v-model:itemValue="selectedAvailability"
        />
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
const emit = defineEmits(["returned-data"]);

const isLoading = ref(false);
function handleSubmit(values) {
  emit("returned-data", values);
}

const visibilitiesLoader = ref(false);
const availabilitiesLoader = ref(false);
const aggregatorsLoader = ref(false);
const visibilities = ref([]);
const availabilities = ref([]);
const aggregators = ref([]);

function getAvailabilities() {
  availabilitiesLoader.value = true;
  axios
    .get(`availabilities`)
    .then((res) => {
      if (props.data) {
        selectedAvailability.value = props.data.availabilities;
        availabilities.value = res.data.data;
      } else {
        availabilities.value = res.data.data;
      }
      availabilitiesLoader.value = false;
    })
    .catch(() => (availabilitiesLoader.value = false));
}

// function setData() {
//   for (const [key, value] of Object.entries(props.data)) {
//     if (key == "availableDays") {
//       let sDays = [];
//       days.value.map((el) => {
//         value.map((item) => {
//           if (el.id == item) {
//             sDays.push(el);
//           }
//         });
//       });
//       selectedDay.value = sDays;
//       days.value = days.value.filter((el) => !selectedDay.value.includes(el));
//     }
//   }
// }
onBeforeMount(async () => {
  getAvailabilities();
  // if (props.data) {
  //   setData();
  // }
});
</script>
