<template>
  <base-card1>
    <div class="space-y-2">
      <div class="flex items-center gap-2 justify-between">
        <div class="flex gap-3 items-center">
          <label class="capitalize text-sub mb-2"
            >{{ $t("LABELS.status") }}:</label
          >
          <global-switcher
            :id="item.id"
            :url="activate"
            v-model:modalValue="item.is_active"
          />
        </div>
        <action-menu
          :edit="true"
          :remove="true"
          :item="item"
          :name="url"
          @reload="fetchData"
          @edit="emit('edit')"
          @remove="remove(item.id)"
        />
      </div>

      <div class="w-full">
        <img
          v-if="item.image"
          @error="imgError"
          :src="item.image"
          class="w-full h-[250px] object-contain rounded-lg"
          :alt="item.name"
        />
      </div>
      <div class="flex gap-4 py-2 text-primary text-sm">
        <p class="flex items-center gap-1">
          <svg-icon name="user1" /> {{ item.author }}
        </p>
        <p class="flex items-center gap-1">
          <svg-icon name="calendar" /> {{ item.date }}
        </p>
        <p class="flex items-center gap-1">
          <svg-icon name="eye2" /> {{ item.views }}
        </p>
      </div>
      <div>
        <h3 class="text-text font-semibold">
          {{ item.title }}
        </h3>
        <p class="text-sub text-sm line-clamp-3">
          {{ item.short_desc }}
        </p>
      </div>

      <div class="flex items-center flex-wrap gap-2" v-if="item.date">
        <p class="capitalize text-sub text-sm">
          {{ $t("LABELS.publishDate") }} :
        </p>
        {{ item.date }}
      </div>
    </div>
  </base-card1>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  item: { required: false, type: Object },
  trashed: { required: false, type: Boolean },
  url: { required: false },
  activate: { required: false },
  sub: {
    required: false,
  },
});
const switchValue = ref(true);
const showArchive = ref(false);

const emit = defineEmits(["remove", "reload", "edit"]);
function remove(id) {
  emit("remove", id);
}
function fetchData() {
  emit("reload");
}
</script>
