<template>
  <div class="py-4 px-2">
    <div class="flex flex-wrap justify-end gap-3">
      <Deleter
        v-if="item.id"
        :url="`delete_blog_section/${item.id}`"
        :id="item.id"
        method="DELETE"
        :title="$t('BUTTONS.delete')"
        modal-type=""
        @remove="remove(item.uuid)"
      />

      <button
        v-else
        type="button"
        class="text-error flex items-center gap-1"
        @click="remove(item.uuid)"
      >
        <svg-icon name="trash" />

        {{ $t("BUTTONS.delete") }}
      </button>
      <button
        type="button"
        class="text-primary flex items-center gap-1"
        @click="emit('edit')"
      >
        <svg-icon name="edit" />

        {{ $t("BUTTONS.edit") }}
      </button>
    </div>
    <div class=" ">
      <img
        :src="item.blogPrivew"
        :alt="item.nameEn"
        @error="imgError"
        class="h-[250px] w-full rounded-lg object-contain transition duration-500 hover:scale-105"
      />
      <div class="flex items-center flex-wrap gap-6 mt-1">
        <div class="flex items-center font-bold text-sm text-text gap-2">
          <p class="text-sub font-normal">
            {{ $t("LABELS.Title") + $t("inEnglish") }}:
          </p>
          <span>
            {{ item.nameEn }}
          </span>
        </div>
        <div class="flex items-center font-bold text-sm text-text gap-2">
          <p class="text-sub font-normal">
            {{ $t("LABELS.Title") + $t("inArabic") }}:
          </p>
          <span>
            {{ item.nameAr }}
          </span>
        </div>
        <div class="flex items-center font-bold text-sm text-text gap-2">
          <p class="text-sub font-normal">
            {{ $t("LABELS.Title") + $t("inUrd") }}:
          </p>
          <span>
            {{ item.nameUr }}
          </span>
        </div>
      </div>
      <div class="flex flex-col gap-2 mt-1">
        <div class="text-sm text-text gap-2">
          <p class="text-sub">{{ $t("LABELS.content") + $t("inEnglish") }}:</p>
          <p>
            {{ item.descEn }}
          </p>
        </div>
        <div class="text-sm text-text gap-2">
          <p class="text-sub">{{ $t("LABELS.content") + $t("inArabic") }}:</p>
          <p>
            {{ item.descAr }}
          </p>
        </div>
        <div class="text-sm text-text gap-2">
          <p class="text-sub">{{ $t("LABELS.content") + $t("inUrd") }}:</p>
          <p>
            {{ item.descUr }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: { required: false, type: Object },
});

const emit = defineEmits(["remove", "edit"]);
function remove(id) {
  emit("remove", id);
}
</script>

<style lang="scss"></style>
