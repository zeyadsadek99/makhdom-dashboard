<template>
  <div
    class="float_date bg-white relative w-full h-[45px] rounded-[10px] border !border-primary p-1 flex items-center float-input"
  >
    <div dir="lrt">
      <!-- <Calendar
        :id="id"
        dateFormat="yy-mm-dd"
        v-model="date"
        @clear="
          date = '';
          updateValue(date);
        "
        :maxDate="new Date()"
        clearable
        :placeholder="placeholder"
        showButtonBar
      >
        <template #footer=""></template>
      </Calendar> -->
      <VueDatePicker
        v-model="date"
        :enable-time-picker="false"
        :max-date="maxDate"
        no-today
        model-type="yyyy-MM-dd"
        :id="id"
        :placeholder="placeholder"
        auto-apply
        @clear="
          date = '';
          updateValue();
        "
      />
    </div>

    <img
      src="@/assets/images/icons/calendar.png"
      alt="calendar"
      width="20"
      height="20"
      class="absolute top-1/2 -translate-y-1/2 insest-xe-4"
    />
  </div>
</template>

<script setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { ref, watch, onMounted } from "vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
    default: null,
  },
  placeholder: {
    type: String,
    required: true,
    default: null,
  },
  icon: {
    type: Boolean,
    required: false,
    default: false,
  },
  defaultDate: {
    required: false,
  },
  itemValue: {
    requred: true,
  },
  maxDate: {
    required: false,
    default: new Date(),
  },
});

const date = ref("");
onMounted(() => {
  if (props.itemValue) {
    date.value = props.itemValue;
  }
});

const emit = defineEmits(["update:itemValue", "change"]);

const updateValue = (event) => {
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
</script>

<style lang="scss">
.float_date {
  .p-calendar.p-component.p-inputwrapper {
    width: 100%;
    input {
      border: none !important;
      box-shadow: none !important;
      background-color: transparent !important;
      padding-inline-start: 0.95rem !important;
      padding-inline-end: 1.6rem !important;
      z-index: 10;
    }
  }
  .dp__icon.dp__input_icon {
    display: none;
  }
  .dp__input {
    border: 0 !important;

    @apply py-0 ps-0 pe-7;
  }
  .dp__clear_icon {
    inset-inline-end: 1rem;
  }
}
</style>
