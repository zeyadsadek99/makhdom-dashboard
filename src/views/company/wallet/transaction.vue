<template>
  <div>
    <breadcrumbs back="/wallet" :title="$t('LABELS.wallet')" :items="breads" />
    <div class="flex gap-4 flex-wrap">
      <div class="flex-1 w-full min-w-[250px]">
        <FormSkelton v-if="loading" />
        <template v-else>
          <p class="text-2xl text-left font-bold p-4 text-green-500">
            {{ $t('LABELS.Hello', { name: initialValues.full_name }) }}
          </p>
          <div class="flex flex-col items-center p-5 font-sans">

            <!-- Displaying the Balance -->
            <div class="mb-6 text-center">
              <h2 class="text-xl text-gray-800">{{ $t('LABELS.balance') }}</h2>
              <p class="text-2xl font-bold text-green-500">
                ${{ initialValues.balance.toFixed(2) }}
              </p>
            </div>

            <!-- Buttons for Actions -->
            <div class="flex gap-6 mt-6">
              <router-link :to="`transaction/${initialValues.id}`"> 
                <button  class="px-6 py-2 text-white bg-[#4CAF50] rounded-lg hover:bg-green-600 transition-colors">
                  {{ $t('BUTTONS.Make Transaction') }}
                </button>
              </router-link>
              <router-link :to="`withdraw/${initialValues.id}`"> 
                <button  class="px-6 py-2 text-white bg-[#FF5722] rounded-lg hover:bg-red-600 transition-colors">
                  {{ $t('BUTTONS.Withdraw Request') }}
                </button>
              </router-link>
            </div>

            <!-- Transactions Section -->
            <div class="space-y-4 mt-6">
              <h2 class="text-xl text-text text-center">{{ $t('LABELS.transaction') }}</h2>
              <div
                v-for="(transaction, i) in initialValues.transactions"
                :key="i"
                class="flex justify-between items-center p-4 rounded-lg shadow-md transition-transform hover:transform hover:translate-y-1"
                :class="{
                  'bg-gray-100': i % 2 === 0,  // Light background for alternating rows
                  'bg-gray-50': i % 2 !== 0,    // Slightly darker for odd rows
                }"
              >
                <!-- Transaction Type -->
                <div class="flex items-center space-x-2">
                  <span
                    :class="{
                      'text-blue-500': transaction.type === 'deposit',  // Blue for deposit
                      'text-red-500': transaction.type === 'withdraw'   // Red for withdraw
                    }"
                    class="font-semibold text-lg"
                  >
                    {{ $t(`LABELS.${transaction.type}`) }}
                  </span>
                </div>

                <!-- Transaction Amount -->
                <div>
                  <span
                    :class="{
                      'text-blue-500': transaction.type === 'deposit',  // Blue for deposit
                      'text-red-500': transaction.type === 'withdraw'   // Red for withdraw
                    }"
                    class="font-bold text-xl"
                  >
                    ${{ transaction.amount.toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>
            
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as yup from "yup";
import { toast } from "vue3-toastify";
import axios from "axios";
import { reactive, ref, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";

import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const { t } = useI18n();

const initialValues = reactive({
  balance: "",
  transactions: [],
  full_name: "",
  
});
  
  


const btnLoading = ref(false);

// function handleSubmit(values, actions) {
//   btnLoading.value = true;
//   const frmData = new FormData();

//   let url = "wallet";

//   if (route.params.id) {
//     frmData.append("_method", "PUT");
//     url = `wallet/${values.id}`;
//   }

//   // if (initialValues.image) {
//   //   frmData.append("image", initialValues.image);
//   // }
//   console.log(values);
//   frmData.append("type", values.type);
//   frmData.append("amount", values.amount);
  
//   // frmData.append("full_name", values.name);
//   // frmData.append("phone", values.phoneNumber);
//   // frmData.append("phone_code", values.phoneCode.phone_code);
//   // frmData.append("email", values.email);
//   // frmData.append("role_id", values.role);
//   // if (values.password) frmData.append("password", values.password);

//   axios
//     .post(url, frmData)
//     .then((res) => {
//       setTimeout(() => toast.success(res.data.message), 300);
//       router.push("/wallet");
//       btnLoading.value = false;
//       actions.resetForm();
//     })
//     .catch((e) => {
//       toast.error(e.response.data.message);
//     })
//     .finally(() => (btnLoading.value = false));
// }

const loading = ref(false);

const breads = [
  {
    path: "/",
    imgIcon: "menu-setup.svg",
    name: t("TITLES.home"),
  },
  {
    name: t("LABELS.wallet"),
    path: "/wallet",
    imgIcon: "",
  },
  {
    name: t(`BUTTONS.${route.params.id ? "Show" : "add"}`, {
      name: t("LABELS.wallet"),
    }),
    path: `/wallet${route.params.id ? "/" + route.params.id : ""}`,
  },
];

function getData() {
  axios.get(`wallet/${route.params.id}`).then((res) => {
    const result = res.data.data;

    initialValues.transactions = result.transactions;
    initialValues.balance = result.balance;
    initialValues.full_name = result.full_name;
    

    initialValues.id = result.id;

    loading.value = false;
  });
}
const types = ref([
  { id: 'deposit', name: 'Deposit' },
  { id: 'withdraw', name: 'Withdraw' },
  { id: 'discount', name: 'Discount' }
]);

// function getCategories() {
//   axios.get("index-without-pagination").then((res) => {
//     categories.value = res.data.data.map((el) => {
//       return {
//         id: el.id,
//         name: el.title,
//       };
//     });
//   });
// }
// getCategories();

onBeforeMount(() => {
  if (route.params.id) {
    loading.value = true;
    getData();
  }
});
</script>

<style lang="scss">

.v-table {
  @apply flex h-full w-full max-w-[100%] flex-col rounded-lg leading-[1.5];
  --v-table-header-height: 45px;

  .table-wrapper {
    @apply flex-auto overflow-auto;
    table {
      @apply w-full border-spacing-0;
      thead {
        @apply rounded-2xl bg-[#F8FBFD];
      }

      th {
        @apply px-4 text-start;
        height: calc(var(--v-table-header-height) + 15px);
      }

      td {
        @apply p-4 text-start;
      }
      tr.error {
        label,
        input {
          @apply text-error;
        }
      }
    }
  }
}
.profile_page {
  .upload {
    padding: 0;
    width: 180px;
    height: 180px;
    border-radius: 50% !important;
    overflow: hidden;
    label {
      padding: 0;
      margin: 0;
      width: 180px;
      height: 180px;
    }
    img {
      // width: 100% !important;
      // height: 100% !important;
      object-fit: cover !important;
      border-radius: 50% !important;
    }
  }
}
</style>
