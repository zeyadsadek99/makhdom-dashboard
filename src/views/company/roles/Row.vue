<script lang="ts" setup>
import { useField } from "vee-validate";
import { onMounted, ref } from "vue";

type Props = {
  permissions: number[];
  name: string;
  value: { [key: string]: number }[];
};

const fieldValue = useField("permissions");

const props = defineProps<Props>();

const selectedType = ref<string>("none");

function updateSelectedType() {
  const selectedIds = props.value.map((el) => el.id);
  if (selectedIds.every((id) => props.permissions.includes(id))) {
    selectedType.value = "all";
  } else if (selectedIds.some((id) => props.permissions.includes(id))) {
    selectedType.value = "some";
  } else {
    selectedType.value = "none";
  }
}

onMounted(() => updateSelectedType());
const emit = defineEmits(["update:permissions"]);

function handleCheckbox() {
  const selected = new Set(props.value.map((el) => el.id)); // Use a Set for faster lookups
  const permissionsSet = new Set(props.permissions); // Convert props.permissions to a Set

  // If all selected elements are in permissions
  if ([...selected].every((element) => permissionsSet.has(element))) {
    // Create a new array excluding selected elements
    const newValues = props.permissions.filter(
      (element) => !selected.has(element)
    );

    emit("update:permissions", newValues);
    fieldValue.setValue(newValues);
    selectedType.value = "none";
  }
  // If some selected elements are in permissions
  else if ([...selected].some((element) => permissionsSet.has(element))) {
    // Merge sets and convert back to an array
    const newValues = Array.from(new Set([...selected, ...props.permissions]));

    emit("update:permissions", newValues);
    fieldValue.setValue(newValues);
    selectedType.value = "all";
  }
  // If no selected elements are in permissions
  else {
    // Combine both selected and permissions without duplicates
    const newValues = [...selected, ...props.permissions];

    emit("update:permissions", newValues);
    fieldValue.setValue(newValues);
    selectedType.value = "all";
  }
}

async function handleCheckboxChange(id: number) {
  const newValues = new Set(props.permissions);

  // Toggle the checkbox state
  if (newValues.has(id)) {
    newValues.delete(id); // Uncheck if already selected
  } else {
    newValues.add(id); // Check if not selected
  }

  const updatedPermissions = Array.from(newValues);
  emit("update:permissions", updatedPermissions);
  await fieldValue.setValue(updatedPermissions);
  updateSelectedType();
}
</script>

<template>
  <tr class="border-b border-border">
    <td
      class="flex items-center gap-2 font-semibold whitespace-nowrap text-text"
    >
      <button type="button" @click="handleCheckbox">
        <i
          v-if="selectedType == 'all'"
          class="fa-solid fa-square-check text-xl size-6"
        ></i>
        <i
          v-else-if="selectedType == 'some'"
          class="mdi mdi-minus-box-outline text-xl size-6 opacity-60"
        ></i>
        <i
          v-else
          class="mdi mdi-checkbox-blank-outline size-6 text-sub text-2xl"
        ></i>
      </button>
      {{ name }}
    </td>
    <td>
      <ul class="flex items-center gap-3 flex-wrap">
        <li
          class="flex items-center gap-1"
          v-for="item in value"
          :key="item.id"
        >
          <VeeField
            name="permissions"
            type="checkbox"
            class="whitespace-nowrap w-4 h-4 cursor-pointer"
            :value="item.id"
            :id="`permission-${item.id}`"
            @change="handleCheckboxChange(item.id)"
          />
          <!-- @keypress="handleCheckboxChange(item.id)" -->
          <label
            class="whitespace-nowrap cursor-pointer font-semibold"
            :for="`permission-${item.id}`"
            >{{ item.title }}</label
          >
        </li>
      </ul>
    </td>
  </tr>
</template>

<style lang="scss" scoped></style>
