<template>
  <div>
    <base-card1
      class="flex items-center gap-4 mb-5"
      v-if="item.subscription_type != 'active'"
    >
      <img
        width="71"
        height="56"
        src="@/assets/images/icons/comment.png"
        alt="icon"
      />
      <div class="flex flex-1 flex-wrap gap-2 items-center justify-between">
        <div>
          <h3 class="text-text font-bold mb-1" v-if="item.subscription">
            {{ $t("TITLES.expiredMessage", { name: item[$i18n.locale].name }) }}
          </h3>
          <h3 class="text-text font-bold mb-1" v-else>
            {{ $t("TITLES.noSubscription", { name: item[$i18n.locale].name }) }}
          </h3>
          <p
            class="flex justify-between items-center text-sub font-medium !text-sm"
          >
            {{
              $t(
                "TITLES.To continue using MEA Telcome, please activate your account"
              )
            }}
          </p>
        </div>
        <button
          v-if="item.subscription_type == 'active'"
          type="button"
          @click="cancelSubscription(item.subscription.id)"
          :disabled="btnLoading"
          class="base-btn-red-bg !rounded-md"
        >
          {{ $t("BUTTONS.Cancel Subscription") }}
        </button>
        <router-link
          :to="`/store-setup/${item.id}/subscription`"
          v-else
          type="button"
          class="base-btn !rounded-md"
        >
          <span v-if="item.subscription">
            {{ $t("BUTTONS.Renew Subscription") }}
          </span>
          <span v-else>
            {{ $t("BUTTONS.New Subscription") }}
          </span>
        </router-link>

        <!-- <router-link
          :to="`/store-setup/${item.id}/subscription`"
          class="base-btn !rounded-md"
        >
          {{
            $t(
              `BUTTONS.${
                item.subscription_type == "no_subscription"
                  ? "New Subscription"
                  : "Renew Subscription"
              }`
            )
          }}
        </router-link> -->
      </div>
    </base-card1>
    <base-card1>
      <div class="py-4 flex justify-between items-center border-b border-line">
        <h3 class="text-text flex gap-2 items-center font-semibold text-xl">
          <svg-icon name="build" />
          {{ $t("LABELS.Store’s Data") }}
        </h3>

        <router-link
          class="text-sm flex items-center gap-2"
          :to="`/store-setup/form/${item.id}`"
        >
          <svg-icon name="edit" />
          {{ $t("BUTTONS.edit") }}
        </router-link>
      </div>
      <div class="py-4">
        <ul class="item-details">
          <li>
            <div class="name">
              <svg-icon name="company_name" />
              {{ $t("LABELS.Store name") }}:
            </div>
            <div class="text">{{ item[$i18n.locale].name }}</div>
          </li>
          <li>
            <div class="name">
              <svg-icon name="flag" />
              {{ $t("LABELS.country") }}:
            </div>
            <div class="text">{{ item.brand_country.name }}</div>
          </li>
          <li>
            <div class="name">
              <svg-icon name="city" />
              {{ $t("LABELS.city") }}:
            </div>
            <div class="text">{{ item.brand_city.name }}</div>
          </li>
          <li>
            <div class="name">
              <svg-icon name="hour" />
              {{ $t("LABELS.timeZone") }}:
            </div>
            <div class="text">{{ item.time_zone }}</div>
          </li>
          <li>
            <div class="name">
              <svg-icon name="phone" />
              {{ $t("TITLES.phoneNumber") }}:
            </div>
            <div class="text flex !items-center gap-2">
              <img
                width="24"
                height="24"
                :src="item.phone_code_data?.image"
                :alt="item.phone_code_data?.name"
              />
              <span>+{{ item.phone_code_data?.phone_code }}</span>
              {{ item.phone }}
            </div>
          </li>
          <li>
            <div class="name">
              <svg-icon name="envelope" />

              {{ $t("LABELS.Store Address") }}:
            </div>

            <div class="text flex items-start gap-2 flex-wrap">
              <a
                target="_blank"
                :href="`http://maps.google.co.uk/maps?q=${item.lat},${item.lng}`"
              >
                <img
                  width="70"
                  height="70"
                  src="@/assets/images/icons/location_map.png"
                  alt="icon"
                />
              </a>
              {{ item.location_description }}
            </div>
          </li>
        </ul>
      </div>
    </base-card1>
  </div>
  <!-- <DetailsCard :item="item" @action="openModal = true" /> -->
</template>

<script setup>
import { ref } from "vue";
defineProps({
  item: {
    required: true,
  },
});

const btnLoading = ref(false);
const emit = defineEmits(["reload"]);
function cancelSubscription(id) {
  btnLoading.value = true;
  axios.post(`cancel_subscription/${id}`).then((res) => {
    emit("reload", res.data.data);
    btnLoading.value = false;
  });
}
</script>

<style lang="scss"></style>
