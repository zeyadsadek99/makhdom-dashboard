<template>
  <base-card1
    :class="item.is_readed ? '' : ' !bg-primary/15'"
    class="bg-white border flex items-center gap-1 border-border"
  >
    <button type="button" class="flex-1" @click="moveToNotification()">
      <h5 class="font-semibold text-lg text-start">{{ item.title }}</h5>
      <p class="text-sub text-start">
        {{ item.body }}
      </p>
    </button>

    <div
      @click.stop
      v-if="item.id"
      class="flex md:flex-col justify-between md:items-end items-center gap-1"
    >
      <Deleter
        :url="`notifications/${item.id}`"
        :id="item.id"
        icon-class="*:fill-error"
        method="delete"
        button-name="BUTTONS.Yes Delete"
        @remove="emit('delete', item.id)"
      />
      <p class="text-text text-end text-sm">{{ item.created_time }}</p>
    </div>
  </base-card1>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, toRef } from "vue";
import axios from "axios";
import { useAppStore } from "@/store/app";

const router = useRouter();
const isLoading = ref(false);

const props = defineProps({
  item: {
    required: true,
    type: Object,
  },
  path: {
    required: false,
  },
});
const item = toRef(props.item);
const emit = defineEmits(["delete", "close"]);
const appStore = useAppStore();
function moveToNotification() {
  if (!item.value.is_readed) {
    axios.get(`/notifications/${item.value.id}`).then((res) => {
      item.value = res.data.data;

      appStore.unreadNotification -= 1;
    });
  }

  if (item.value.key === "deal") {
    router.push(`/deals/${item.value.key_id}`);
    emit("close");
  } else if (item.value.key === "order") {
    router.push(`/orders/show/${item.value.key_id}`);
    emit("close");
  } else if (item.value.key === "contact" || item.value.key === "ticket") {
    router.push(`/support-tickets/show/${item.value.key_id}`);
    emit("close");
  } else if (item.value.key === "user") {
    router.push(`/retailers/show/${item.value.key_id}`);
    emit("close");
  } else if (item.value.key === "product") {
    router.push(`/products/show/${item.value.key_id}`);
    emit("close");
  } else if (item.value.key === "provider") {
    router.push(`/wholesalers/show/${item.value.key_id}`);
    emit("close");
  }

  // if (link) {
  //   router.push(link);
  //   emit("close");
  // }
}
</script>

<style></style>
