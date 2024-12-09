<template>
  <div class="flex items-start flex-wrap gap-5 py-4 px-2">
    <img
      width="45"
      height="40"
      src="@/assets/images/stats/combo.png"
      alt="package name"
    />
    <div class="flex-1">
      <div class="flex gap-2 justify-between mb-4">
        <h3 class="text-lg font-bold font-inter text-text">
          {{ $i18n.locale == "ar" ? item.nameAr : item.nameEn }}
        </h3>
        <div class="flex items-center gap-2">
          <action-menu
            class="ms-2"
            :edit="true"
            :remove="true"
            :item="item"
            name="product/combo"
            @edit="emit('edit')"
            @remove="remove(item.id)"
          />
        </div>
      </div>
      <ul class="package_details space-y-4">
        <li>
          <p class="name">
            {{ $t("LABELS.No of selection") + " :" }}
          </p>
          <p class="value">{{ item.selection }}</p>
        </li>

        <li>
          <div v-for="product in item.selectedProducts" :key="product.id">
            <small-details-card :image="product.image" :title="product.name" />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  item: { required: false, type: Object },
});
const switchValue = ref(true);
const showArchive = ref(false);

const emit = defineEmits(["remove", "edit"]);
function remove(id) {
  emit("remove", id);
}
</script>

<style lang="scss"></style>
