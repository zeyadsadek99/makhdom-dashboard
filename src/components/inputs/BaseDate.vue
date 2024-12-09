<template>
  <VeeField :name="name" v-slot="{ field, meta }">
    <div
      class="input_wrapper"
      :class="{
        error: !meta.valid && meta.touched,
      }"
    >
      <label :for="id" class="label" v-if="label">{{ label }}</label>

      <div :class="icon ? 'with_icon' : ''">
        <VueDatePicker
          :disabled="disabled"
          v-model="date"
          :enable-time-picker="false"
          :max-date="maxDates"
          :min-date="minDates"
          :max-time="maxTime"
          :min-time="minTime"
          no-today
          :time-picker="timePicker"
          :model-type="
            timePicker ? (is24 ? 'hh:mm' : 'hh:mm aa') : 'yyyy-MM-dd'
          "
          :date-select="dateSelect"
          :id="id"
          :placeholder="placeholder"
          auto-apply
          :month-picker="monthPicker"
          v-bind="field"
          :teleport="true"
          @clear="
            date = '';
            updateValue();
          "
          :is-24="is24"
        >
          <template #input-icon>
            <svg-icon
              classes="z-30 icon !relative !translate-y-0 icon text-sub"
              v-if="icon"
              :name="icon"
            />
          </template>
        </VueDatePicker>
      </div>

      <VeeErrorMessage
        v-if="!meta.valid && meta.touched"
        :name="name"
        as="div"
        class="text-error"
      />
    </div>
  </VeeField>
</template>

<script setup>
import { useField } from "vee-validate";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { ref, onMounted, watch, computed } from "vue";

const props = defineProps({
  id: {
    required: true,
  },
  name: {
    required: true,
  },
  dateSelect: {
    required: false,
  },
  disabled: {
    required: false,
    default: false,
  },

  label: {
    required: false,
  },
  placeholder: {
    required: true,
  },
  is24: {
    required: false,
  },
  itemValue: {
    required: true,
  },
  icon: {
    required: false,
  },
  timePicker: {
    required: false,
    default: false,
  },
  maxDate: {
    required: false,
  },
  minDate: {
    required: false,
  },
  maxTime: {
    required: false,
  },
  minTime: {
    required: false,
  },
  monthPicker: {
    required: false,
  },
});

const fieldValue = useField(props.name);

const date = ref("");
onMounted(() => {
  if (props.itemValue) {
    date.value = props.itemValue;
  }
});

const minDates = ref(null);
const maxDates = ref(null);

const emit = defineEmits(["update:itemValue", "change"]);

const updateValue = (event) => {
  fieldValue.setValue(date.value);
  emit("update:itemValue", date.value ?? "");

  emit("change", date.value ?? "");
};

watch(
  () => date.value,
  (value) => {
    let formattedDate = "";

    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    formattedDate = `${year}-${month}-${day}`;

    updateValue(formattedDate);
  }
);

watch(
  () => props.minDate,
  (value) => {
    if (value) {
      minDates.value = value;
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
watch(
  () => props.maxDate,
  (value) => {
    if (value) {
      maxDates.value = value;
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>
