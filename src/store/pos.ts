// Utilities
import { defineStore } from "pinia";
import axios from "axios";
import { useRoute } from "vue-router";
import createCart from "@/utils/createCart";
import { uuid } from "vue-uuid";
import router from "@/router";

export const usePosStore = defineStore("pos", {
  state: (): PosStore => ({
    pos_store: JSON.parse(sessionStorage.getItem("pos_store")!),
    cart: JSON.parse(localStorage.getItem("cart")!) ?? undefined,
    orderBill: JSON.parse(localStorage.getItem("order_bill")!) ?? null,
    drivers: [],
    driverModal: false,
    itemToUpdate: null,
    splitModal: false,
    tableToSpilt: null,
    tableInformationModal: false,
    addressModal: false,
    customerModal: false,
    driversLoading: false,
    customers: [],
    allCustomers: [],
    customersPaginator: null,
    customerPointsModal: false,
    customersLoading: false,
    creditCustomerDetails: false,
    surcharge: null,
    taxs: null,
    deliveryPrice: 0,
    areas: [],
    areasLoading: false,
    tables: [],
    tablesLoading: false,
    route: useRoute(),
    openAddCustomerModal: false,
    addAddressModal: false,
    products: [],
    categories: [],
    sub_categories: [],
    first_run: true,
    initLoading: false,
    pos_settings: null,

  }),
  getters: {
    getPosSettings: (state) => state.pos_settings,
    getPosStore: (state) => state.pos_store,
    getCart: (state) => state.cart,
    getOrderBill: (state) => state.orderBill,
    getTableToSpilt: (state) => state.tableToSpilt,
    getAddressModal: (state) => state.addressModal,
    getCustomerModal: (state) => state.customerModal,
    getDrivers: (state) => state.drivers,
    getDriverModal: (state) => state.driverModal,
    getDriversLoading: (state) => state.driversLoading,
    getCreditCustomerDetails: (state) => state.creditCustomerDetails,
    getCustomerPointsModal: (state) => state.customerPointsModal,
    getCustomers: (state) => state.customers,
    getAllCustomers: (state) => state.allCustomers,
    getCustomersPaginator: (state) => state.customersPaginator,
    getCustomersLoading: (state) => state.customersLoading,
    getSurcharge: (state) => state.surcharge,
    getAreas: (state) => state.areas,
    getTables: (state) => state.tables,
    getAreasLoading: (state) => state.areasLoading,
    getTablesLoading: (state) => state.tablesLoading,
    getCategories: (state) => state.categories,
    getSubCategories: (state) => state.sub_categories,
    getInitLoading: (state) => state.initLoading,
  },
  actions: {
    async fetchDrivers() {
      if (!this.pos_store) return;
      this.driversLoading = true;
      await axios.get(`pos/store/${this.pos_store.id}/drivers`).then((res) => {
        this.drivers = res.data.data.map((el: any) => ({
          ...el,
          name: el.full_name,
        }));
        this.driversLoading = false;
      });
    },

    async fetchCustomers() {
      this.customersLoading = true;
      await axios
        .get(`pos/customer`, {
          params: {
            page: this.route?.query?.page_num ?? 1,
            keyword: this.route?.query?.search ?? "",
          },
        })
        .then((res) => {
          this.customers = res.data.data;
          this.customersPaginator = res.data.meta;
        });
      await axios.get(`pos/all_customer`).then((res) => {
        this.allCustomers = res.data.data.map((customer: any) => ({
          ...customer,
          name: customer.full_name,
        }));
      });
      this.customersLoading = false;
    },


    async fetchAllData() {
      if (!this.pos_store || !this.first_run) return;
      this.initLoading = true
      await axios.get(`pos/all-data`, {
        params: {
          store_id: this.pos_store.id
        }
      }).then((res) => {
        this.categories = res.data.data.categories
        this.products = res.data.data.products
        this.sub_categories = res.data.data.sub_categories


        this.initLoading = false
        this.first_run = false

      }).catch(() => this.initLoading = false);
    },

    async fetchPosSettings() {
      if (!this.pos_store) return;
      this.areasLoading = true;
      this.tablesLoading = true;
      await axios.get(`pos/store/${this.pos_store.id}/pos_settings`).then((res) => {
        this.pos_settings = res.data.data
        this.taxs = res.data.data.tax_rate;
        this.surcharge = res.data.data.surcharge;
        this.tables = res.data.data.tables;
        this.areas = res.data.data.areas;
        if (this.cart && this.cart.order_type == "dine_in") {
          const orderTable: TableType | undefined = this.tables.find(
            (t) => t.id == this.cart?.table_id?.id
          );
          if (!orderTable) {
            this.clearCart()

            return;
          }
          this.cart.selected_table = orderTable!;
          this.cart.order_type = "dine_in";
          this.cart.table_id = orderTable!;
          this.cart.cart = orderTable?.current_order?.item.map((item: any) => ({
            ...item,
            uuid: uuid.v1(),
          })) ?? [];
          this.cart.order_id = orderTable?.current_order?.id ?? "";
          localStorage.setItem("cart", JSON.stringify(this.cart));
          setTimeout(() => this.cartCalc(), 500);
        }

        this.areasLoading = false;
        this.tablesLoading = false;
        this.cartCalc()
      });
    },
    async fetchSurchare() {
      if (!this.pos_store) return;
      await axios.get(`pos/store/${this.pos_store.id}/surchare`).then((res) => {
        this.surcharge = res.data.data;
        this.cartCalc()
      });
    },
    async fetchTaxs() {
      if (!this.pos_store) return;
      await axios.get(`pos/store/${this.pos_store.id}/tax_rate`).then((res) => {
        this.taxs = res.data.data;
        this.cartCalc()
      });
    },
    async fetchDeliveryPrice() {
      if (!this.pos_store) return;
      const dataToSend: any = {
        lat: this.cart?.address_id?.lat,
        lng: this.cart?.address_id?.lng,
        sub_total: this.orderBill?.order_summary.sub_total,
      };

      await axios
        .get(`pos/store/${this.pos_store.id}/delivery_area`, {
          params: dataToSend,
        })
        .then((res) => {
          if (res.data.data) {

            if (this.orderBill?.order_summary.sub_total > res.data.data.min_order_price) {
              this.deliveryPrice = res.data.data.delivery_price
              this.cartCalc()
            }
          }


          // this.taxs = res.data.data;
        });
    },
    async fetchTables() {
      if (!this.pos_store) return;
      this.tablesLoading = true;
      this.areasLoading = true;
      await axios.get(`pos/${this.pos_store.id}/tables`).then((res) => {
        this.tables = res.data.data.tables;
        this.areas = res.data.data.areas;
        if (this.cart && this.cart.order_type == "dine_in") {
          const orderTable: TableType | undefined = this.tables.find(
            (t) => t.id == this.cart?.table_id?.id
          );
          if (!orderTable) {
            this.clearCart()
            return;
          }
          this.cart.selected_table = orderTable!;
          this.cart.order_type = "dine_in";
          this.cart.table_id = orderTable!;
          this.cart.cart = orderTable?.current_order?.item.map((item: any) => ({
            ...item,
            uuid: uuid.v1(),
          })) ?? [];
          this.cart.order_id = orderTable?.current_order?.id ?? "";
          localStorage.setItem("cart", JSON.stringify(this.cart));
          setTimeout(() => this.cartCalc(), 500);
        }

        this.areasLoading = false;
        this.tablesLoading = false;
      });
    },
    async clearCart() {
      await createCart();
    },




    cartCalc(type?: string) {
      let open_items_price = 0
      let new_items_price = 0
      let total_items_price = 0;
      let new_items_price_after_discount = 0
      let discountValue = 0;
      let surchargeValue = 0;
      let taxValue = 0;
      let deliveryPrice = 0;
      let totalAmount = 0
      let taxPercentage = 0;
      if (this.orderBill) {


        let items = [];
        if (!type && this.cart) this.orderBill.cart = this.cart.cart;
        if (type) {


          this.orderBill.bill_splitted = true;
        } else {
          this.orderBill.bill_splitted = false;
        }
        items = this.orderBill.cart.filter((item) => item.status != "remove");
        const openItems = items.filter((item) => item.cart_type == 'open_item')
        const newItems = items.filter((item) => item.cart_type == 'product')

        open_items_price = openItems.reduce(
          (acc: any, next: any) => acc + next.total_price,
          0
        );
        new_items_price = newItems.reduce(
          (acc: any, next: any) => acc + next.total_price,
          0
        );

        // total_items_price = open_items_price + new_items_price

        const paymentType = this.orderBill.payment_type.reduce(
          (acc: any, pay: any) => acc + +pay.amount,
          0
        )
        const paid = this.orderBill.paid.reduce(
          (acc: any, pay: any) => acc + +pay.amount,
          0
        )




        const totalPaid = paymentType + paid;
        const discount = this.orderBill.order_discount;

        if (type == "pay_order" || this.orderBill.order_id) {
          discountValue = this.orderBill.order_summary.discount_value;
          surchargeValue = this.orderBill.order_summary.surcharge_value;
          taxValue = this.orderBill.order_summary.tax_value;
          taxPercentage = this.orderBill.order_summary.tax_precentage;

          if (this.orderBill.order_type == 'delivery') deliveryPrice = this.orderBill.order_summary.delivery_price;
        } else {

          if (discount) {
            if (discount.amount_type == "value") {
              if (discount.have_surcharge) {
                if (this.surcharge && (this.surcharge.order_type[this.orderBill.order_type] || this.surcharge.order_type_aggregators[this.orderBill.order_type])) {
                  if (this.surcharge.amount_type == "percentage") {
                    discountValue = discount.amount_value;
                    new_items_price_after_discount = new_items_price - discountValue
                    const new_items_surcharge = (new_items_price_after_discount / 100) * this.surcharge.amount_value;
                    const open_items_surcharge = (open_items_price / 100) * this.surcharge.amount_value;
                    surchargeValue = new_items_surcharge + open_items_surcharge

                  } else {
                    discountValue = discount.amount_value;
                    new_items_price_after_discount = new_items_price - discountValue
                  }
                } else {
                  discountValue = discount.amount_value;
                  new_items_price_after_discount = new_items_price - discountValue
                }
              } else {
                discountValue = discount.amount_value;
                new_items_price_after_discount = new_items_price - discountValue
                const totalItemsPrice = new_items_price + open_items_price
                if (this.surcharge && (this.surcharge.order_type[this.orderBill.order_type] || this.surcharge.order_type_aggregators[this.orderBill.order_type])) {
                  if (this.surcharge.amount_type == "percentage") {
                    surchargeValue = (totalItemsPrice / 100) * this.surcharge.amount_value;
                  } else {
                    surchargeValue = this.surcharge.amount_value
                  }
                }
              }
            } else {

              if (discount.have_surcharge) {
                if (this.surcharge && (this.surcharge.order_type[this.orderBill.order_type] || this.surcharge.order_type_aggregators[this.orderBill.order_type])) {
                  if (this.surcharge.amount_type == "percentage") {
                    const new_items_surcharge = (new_items_price / 100) * this.surcharge.amount_value;
                    const new_items_surcharge_discount = (new_items_surcharge / 100) * discount.amount_value
                    const newIitemsDiscountValue = (new_items_price / 100) * discount.amount_value;
                    new_items_price_after_discount = new_items_price - newIitemsDiscountValue
                    discountValue = newIitemsDiscountValue + new_items_surcharge_discount


                    const new_items_surcharge_after_discount = new_items_surcharge - new_items_surcharge_discount

                    const open_items_surcharge = (open_items_price / 100) * this.surcharge.amount_value;

                    surchargeValue = new_items_surcharge_after_discount + open_items_surcharge
                  } else {
                    surchargeValue = this.surcharge.amount_value
                  }
                } else {
                  discountValue = (new_items_price / 100) * discount.amount_value;
                  new_items_price_after_discount = new_items_price - discountValue
                }
              } else {
                discountValue = (new_items_price / 100) * discount.amount_value;

                new_items_price_after_discount = new_items_price - discountValue

                const totalItemsPrice = new_items_price + open_items_price

                if (this.surcharge && (this.surcharge.order_type[this.orderBill.order_type] || this.surcharge.order_type_aggregators[this.orderBill.order_type])) {
                  if (this.surcharge.amount_type == "percentage") {
                    surchargeValue = (totalItemsPrice / 100) * this.surcharge.amount_value;
                  } else {
                    surchargeValue = this.surcharge.amount_value
                  }
                }
              }
              if (discount.max_value && discountValue > discount.max_value) {
                discountValue = discount.max_value;
              }
            }
          } else {
            const totalItemsPrice = new_items_price + open_items_price
            if (this.surcharge && (this.surcharge.order_type[this.orderBill.order_type] || this.surcharge.order_type_aggregators[this.orderBill.order_type])) {
              if (this.surcharge.amount_type == "percentage") {
                surchargeValue = (totalItemsPrice / 100) * this.surcharge.amount_value;
              } else {
                surchargeValue = this.surcharge.amount_value
              }
            }
          }
          if (this.deliveryPrice) {
            if (this.orderBill.order_type == 'delivery') deliveryPrice = this.deliveryPrice;
          }



          if (this.taxs) {
            if (type == "pay_order" || this.orderBill.order_id) return
            let open_item_tax = 0;
            let new_item_tax = 0;
            if (this.taxs.is_applied_in_open_item) {
              open_item_tax =
                open_items_price *
                (this.taxs.percentage / 100);
            }
            if (this.taxs.is_applied_in_new_item) {
              new_item_tax =
                (new_items_price_after_discount ? new_items_price_after_discount : new_items_price) *
                (this.taxs.percentage / 100);
            }


            taxValue = +(open_item_tax + new_item_tax);
            taxPercentage = this.taxs.percentage
          }

        }
        total_items_price = new_items_price + open_items_price
        this.orderBill.order_summary.sub_total = +total_items_price.toFixed(2);
        this.orderBill.order_summary.discount_value = +discountValue.toFixed(2);
        this.orderBill.order_summary.delivery_price = +deliveryPrice.toFixed(2);
        this.orderBill.order_summary.surcharge_value = +surchargeValue.toFixed(2);
        this.orderBill.order_summary.tax_value = +taxValue.toFixed(2);
        totalAmount = total_items_price +
          this.orderBill.order_summary.tips +
          taxValue +
          surchargeValue +
          deliveryPrice -
          discountValue;

        this.orderBill.order_summary.total_price = +totalAmount.toFixed(2)
        this.orderBill.order_summary.tax_precentage = taxPercentage
        this.orderBill.order_summary.total_paid = paid

        this.orderBill.order_summary.remain_amount =
          +(this.orderBill.order_summary.total_price - totalPaid).toFixed(2)

        if (this.cart) localStorage.setItem("cart", JSON.stringify(this.cart));
        localStorage.setItem("order_bill", JSON.stringify(this.orderBill));
      }
    },

    async addItems(order: OrderType, reorder?: string) {
      this.clearCart();
      await createCart();
      const items = order.item.map((item: CartItem) => ({
        ...item,
        sub_price: item.total_price / item.qty,
        total_price: item.total_price,
        uuid: uuid.v1(),
        item_id: reorder ? null : item.item_id,
      }));
      const openItems = order.open_items.map((item: CartItem) => ({
        ...item,
        sub_price: item.price,
        total_price: item.price,
        item_id: reorder ? null : item.item_id,
        uuid: uuid.v1(),
      }));
      if (this.cart) {
        this.cart.cart = [...items, ...openItems] as [];
        this.cart.order_type = order.order_type;
        this.cart.table_id = order.table;
        this.cart.modify_status = order.modify_status;
        this.cart.user_id = order.user;
        this.cart.address_id = order.address;
        this.orderBill.order_type = order.order_type;
        this.cart.selected_table = order.table;
        if (!reorder) {
          this.cart.order_num = order.order_num;
          this.cart.order_id = order.id;
          this.cart.is_payment = order.is_payment;
          this.cart.modify_reason = order.modify_reason;
          this.cart.modify_status = order.modify_status;
          this.cart.waiter = order.waiter;
          this.orderBill.order_id = order.id;
          this.orderBill.is_payment = order.is_payment as boolean;
          if (order.price_detail) this.setPriceDetails(order.price_detail)
          if (order.pay_type) this.setPayTypes(order.pay_type)
        }
      }
      this.orderBill.user_id = order.user;
      this.cartCalc();
      router.push("/pos");
    },
    setBaseOrderData(order: OrderType) {
      this.cart.order_type = order.order_type;
      this.cart.user_id = order.user;
      this.cart.address_id = order.address;
      this.orderBill.order_type = order.order_type;
      this.cart.order_num = order.order_num;
      this.cart.order_id = order.id;
      this.cart.is_payment = order.is_payment;
      this.cart.modify_reason = order.modify_reason;
      this.cart.modify_status = order.modify_status;
      this.cart.waiter = order.waiter;
      this.orderBill.order_id = order.id;
      this.orderBill.is_payment = order.is_payment as boolean;
    },

    setPriceDetails(price_detail: orderSummaryType) {
      this.orderBill.order_summary.tips = price_detail.tips_amount as number;
      this.orderBill.order_summary.surcharge_value = price_detail.surcharge_value;
      this.orderBill.order_summary.delivery_price = price_detail.delivery_price;
      this.orderBill.order_summary.discount_value = price_detail.discount_value;
      this.orderBill.order_summary.tax_value = price_detail.tax_rate_value;

      this.orderBill.order_summary.tax_precentage =
        price_detail.tax_rate_percentage



    },
    setPayTypes(pay_type: PaymentType[]) {

      pay_type.map((pays: any) => {
        for (const key in pays) {
          const type = key;

          const amount = +pays[key];
          const index = this.orderBill.paid.findIndex(
            (element) => element.type === type
          );
          if (index !== -1) {
            this.orderBill.paid[index].amount = amount;
          }
        }
      });
    }
  },
});
