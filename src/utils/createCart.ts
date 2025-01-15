import { uuid } from "vue-uuid";

import { usePosStore } from "@/store/pos";

import createBills from "./createBills";
function createCart() {
  const cart: CartType = {
    order_id: null,
    order_num: "",
    local_id: uuid.v1(),
    store_id: null,
    note: "",
    modify_reason: null,
    modify_status: "",
    internal_note: "",
    internal_note_to: "",
    is_schedule: false,
    is_payment: false,
    address_id: null,
    order_date: "",
    order_time: "",
    table_id: null,
    merged_table_ids: [],
    table_cover: "normal",
    split_table_id: null,
    selected_table: null,
    user_id: null,
    employee_id: null,
    aggregator_id: null,
    order_type: null,
    driver_id: null,
    assign_at: null,
    waiter: null,
    order_discount_id: null,
    order_discount: null,
    cart: [],
    payment_type: [
      {
        type: "cash",
        amount: 0,
        name: "LABELS.cash",
        tips: 0,
      },
      {
        type: "credit",
        amount: 0,
        name: "LABELS.Credit Card",
        tips: 0,
      },
      {
        type: "points",
        amount: 0,
        name: "LABELS.loyalty",
        tips: 0,
      },
      {
        type: "credit_customer",
        amount: 0,
        name: "LABELS.Customer Credit",
        tips: 0,
      },
    ],
    order_summary: {
      sub_total: 0,
      surcharge_value: 0,
      tax_value: 0,
      tax_precentage: 0,
      discount_value: 0,
      tips: 0,
      points: 0,
      cash: 0,
      credit: 0,
      customer_credit: 0,
      remain_amount: 0,
      delivery_price: 0,
      is_paid: false,
      total_price: 0,
    },
  };

  createBills();
  const posStore = usePosStore();
  localStorage.setItem("cart", JSON.stringify(cart));
  posStore.cart = cart;
}
export default createCart;
