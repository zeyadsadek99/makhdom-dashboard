<template>
  <div class="flex gap-3 items-center w-full">
    <Image
      width="60"
      height="60"
      class="rounded-lg h-[60px] w-[60px] object-cover flex-shrink-0 border-line"
      image-class="rounded-lg h-[60px] w-[60px] object-cover border-line"
      :src="image"
      :alt="title || 'image'"
      v-if="image"
      image=""
      preview
    >
      <template #image>
        <img
          width="60"
          height="60"
          class="rounded-lg h-[60px] w-[60px] object-contain border-line"
          :src="image"
          :alt="title || 'image'"
          @error="imgError"
        />
      </template>
      <template #preview="slotProps">
        <img
          @error="imgError"
          :src="image"
          alt="preview"
          class="object-contain"
          :style="slotProps.style"
          @click="slotProps.onClick"
        />
      </template>
    </Image>

    <div class="h-full flex flex-col">
      <!-- Title section -->
      <h4
        v-tooltip.bottom="title.length ? title.replace(/<[^>]*>/g, '') : title"
        class="mb-1 font-semibold text-start truncate whitespace-nowrap min-w-[100px] capitalize text-text"
        :class="[ 
          $i18n.locale == 'ar' ? 'font-neo-sans' : 'font-switzer', 
          titleClass 
        ]"
        v-if="title || title == 0"
      >
        {{ title.length ? title.replace(/<[^>]*>/g, "") : title }}
        <span class="text-placeholder" v-if="sec_title">({{ sec_title }})</span>
      </h4>
      <h4
        class="mb-1 font-semibold text-start text-error min-w-[100px] capitalize"
        :class="$i18n.locale == 'ar' ? 'font-neo-sans' : 'font-switzer'"
        v-else-if="title === null"
      >
        {{ $t("Not Exist") }}
      </h4>

      <!-- Long paragraph with truncation -->
      <p
        :title="text.replace(/<[^>]*>/g, '')"
        class="text-[12px] text-start text-sub truncate whitespace-nowrap"
        v-if="text"
        :class="($i18n.locale == 'ar' ? 'font-neo-sans' : 'font-switzer', textClass)"
      >
        {{ text.replace(/<[^>]*>/g, "") }}
      </p>
    </div>

    <div
      :class="showBorder
        ? 'border border-primary rounded-md w-[48px] h-auto min-h-[48px] flex justify-center items-center'
        : ''
      "
      v-if="show"
    >
      <svg-icon name="eye2" class="" />
    </div>
  </div>
</template>

<script setup>
import Tooltip from "primevue/tooltip";
import Image from "primevue/image";
defineProps([
  "image",
  "title",
  "text",
  "textClass",
  "sec_title",
  "show",
  "showBorder",
  "titleClass",
]);
</script>

<style scoped>
/* No additional custom styles needed for truncation in Tailwind */
</style>
