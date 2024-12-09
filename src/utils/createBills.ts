
import { usePosStore } from "@/store/pos";



function createBills() {
  const orderBills = {
    order_discount_id: null,
    order_discount: null,
    bill_splitted: false,
    is_payment: false,
    cart: [],
    user_id: null,
    order_type: null,
    payment_type: [
      {
        type: 'cash',
        amount: 0,
        name: "LABELS.cash",
        tips: 0
      },
      {
        type: 'credit',
        amount: 0,
        name: "LABELS.Credit Card",
        tips: 0
      },
      {
        type: 'points',
        amount: 0,
        name: "LABELS.loyalty",
        tips: 0
      },
      {
        type: 'credit_customer',
        amount: 0,
        name: "LABELS.Customer Card",
        tips: 0
      },
    ],
    paid: [
      {
        type: 'cash',
        amount: 0,
        name: "LABELS.cash",
        tips: 0
      },
      {
        type: 'credit',
        amount: 0,
        name: "LABELS.Credit Card",
        tips: 0
      },
      {
        type: 'points',
        amount: 0,
        name: "LABELS.loyalty",
        tips: 0
      },
      {
        type: 'credit_customer',
        amount: 0,
        name: "LABELS.Customer Card",
        tips: 0
      },
    ],
    order_summary: {
      sub_total: 0,
      sub_after_discound_total: 0,
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
      total_paid: 0
    }
  }

  localStorage.setItem('order_bill', JSON.stringify(orderBills))
  const posStore = usePosStore()
  posStore.orderBill = orderBills
}
export default createBills
