<template>
  <v-pagination
    v-if="item && item.last_page > 1"
    v-model="page"
    :length="item.last_page"
    :total-visible="6"
    variant="text"
    @update:modelValue="pushQuery"
    class="mt-auto"
  >
    <template #next="nextPageButton">
      <button
        :disabled="nextPageButton.disabled"
        type="button"
        @click="changePage((page += 1))"
        class="flex items-center"
      >
        {{ $t("next") }}
      </button>
    </template>
    <template #prev="previousPageButton">
      <button
        :disabled="previousPageButton.disabled"
        type="button"
        @click="changePage((page -= 1))"
        class="flex items-center"
      >
        {{ $t("prev") }}
      </button>
    </template>
  </v-pagination>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, watch } from "vue";
const props = defineProps({
  item: {
    required: true,
  },
});

const route = useRoute();
const router = useRouter();

function changePage(e) {
  router.push({
    query: Object.assign({}, route.query, {
      page: page,
    }),
  });
}

const page = ref(1);
function pushQuery(page) {
  router.push({
    query: Object.assign({}, route.query, {
      page: page,
    }),
  });
}

watch(
  () => route.query.page,
  (value) => {
    if (value) {
      page.value = +route.query.page || 1;
    }
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss">
.v-pagination__next,
.v-pagination__prev {
  @apply flex items-center;
}
.v-pagination__next {
  margin-inline-start: auto !important;
  button {
    @apply text-primary;

    &:disabled {
      @apply text-sub;
    }
  }
}
.v-pagination__prev {
  margin-inline-end: auto !important;
  button {
    @apply text-primary;
    &:disabled {
      @apply text-sub;
    }
  }
}
.v-pagination__item {
  border: 1px solid var(--shadow_color);
  border-radius: 8px;
  width: 2.5rem;
  height: 2.5rem;
  font-weight: 500;
  @media (max-width: 576px) {
    width: 2.2rem !important;
    height: 2.2rem !important;
    margin: 2px !important;
  }

  @apply flex items-center text-subTitle justify-center;
  .v-btn__overlay,
  .v-btn__underlay {
    display: none !important;
  }
  .v-ripple__container {
    display: none !important;
  }
  button[aria-current="true"] {
    @apply bg-primary text-[#f1f1ff];
  }
}

.v-btn--icon.v-btn--density-default {
  width: 2.5rem !important;
  height: 2.5rem !important;
  @media (max-width: 576px) {
    width: 2.2rem !important;
    height: 2.2rem !important;
    margin: 2px !important;
  }
}
</style>
