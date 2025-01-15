// Composables

import { createRouter, createWebHistory } from "vue-router";
import { computed, ref, watch } from "vue";

import { useAppAuth } from "@/store/auth";
import * as allRoles from "@/utils/permissions";

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("@/layouts/default/Default.vue"),
      meta: {
        auth: true,
      },
      children: [
        {
          path: "",
          name: "dashboard",
          component: () => import("@/views/Home.vue"),
          meta: {
            auth: true,
          },
        },
        //  Start Comapny

        // {
        //   path: "facility",
        //   meta: {
        //     auth: true,
        //   },
        //   component: () => import("@/views/company/facility/Home.vue"),
        //   children: [
        //     {
        //       path: "",
        //       name: "facility",
        //       meta: {
        //         auth: true,
        //         permission: ["facility-types", "index"],
        //       },
        //       component: () => import("@/views/company/facility/index.vue"),
        //     },

        //     {
        //       path: "form/:id",
        //       props: true,
        //       name: "edit-facility",
        //       meta: {
        //         auth: true,
        //         permission: ["facility-types", "update"],
        //       },
        //       component: () => import("@/views/company/facility/Form.vue"),
        //     },
        //     {
        //       path: "form",
        //       props: true,
        //       name: "add-facility",
        //       meta: {
        //         auth: true,
        //         permission: ["facility-types", "store"],
        //       },
        //       component: () => import("@/views/company/facility/Form.vue"),
        //     },
        //   ],
        // },
        
        // {
        //   path: "rating-questions",
        //   meta: {
        //     auth: true,
        //   },
        //   component: () => import("@/views/company/rating-questions/Home.vue"),
        //   children: [
        //     {
        //       path: "",
        //       name: "rating-questions",
        //       meta: {
        //         auth: true,
        //         permission: ["review_questions", "index"],
        //       },
        //       component: () =>
        //         import("@/views/company/rating-questions/index.vue"),
        //     },

        //     {
        //       path: "form/:id",
        //       props: true,
        //       name: "update-rating-question",
        //       meta: {
        //         auth: true,
        //         permission: ["review_questions", "update"],
        //       },
        //       component: () =>
        //         import("@/views/company/rating-questions/Form.vue"),
        //     },
        //     {
        //       path: "form",
        //       props: true,
        //       name: "add-rating-question",
        //       meta: {
        //         auth: true,
        //         permission: ["review_questions", "store"],
        //       },
        //       component: () =>
        //         import("@/views/company/rating-questions/Form.vue"),
        //     },
        //   ],
        // },

        // {
        //   path: "features",
        //   meta: {
        //     auth: true,
        //   },
        //   component: () => import("@/views/company/features/Home.vue"),
        //   children: [
        //     {
        //       path: "",
        //       name: "features",
        //       meta: {
        //         auth: true,
        //         permission: ["features", "index"],
        //       },
        //       component: () => import("@/views/company/features/index.vue"),
        //     },

        //     {
        //       path: "form/:id",
        //       props: true,
        //       name: "edit-features",
        //       meta: {
        //         auth: true,
        //         permission: ["features", "update"],
        //       },
        //       component: () => import("@/views/company/features/Form.vue"),
        //     },
        //     {
        //       path: "form",
        //       props: true,
        //       name: "add-features",
        //       meta: {
        //         auth: true,
        //         permission: ["features", "store"],
        //       },
        //       component: () => import("@/views/company/features/Form.vue"),
        //     },
        //   ],
        // },
        // {
        //   path: "sizes",
        //   meta: {
        //     auth: true,
        //   },
        //   component: () => import("@/views/company/sizes/Home.vue"),
        //   children: [
        //     {
        //       path: "",
        //       name: "sizes",
        //       meta: {
        //         auth: true,
        //         permission: ["sizes", "index"],
        //       },
        //       component: () => import("@/views/company/sizes/index.vue"),
        //     },

        //     {
        //       path: "form/:id",
        //       props: true,
        //       name: "edit-size",
        //       meta: {
        //         auth: true,
        //         permission: ["sizes", "update"],
        //       },
        //       component: () => import("@/views/company/sizes/Form.vue"),
        //     },

        //     {
        //       path: "form",
        //       props: true,
        //       name: "add-size",
        //       meta: {
        //         auth: true,
        //         permission: ["sizes", "store"],
        //       },
        //       component: () => import("@/views/company/sizes/Form.vue"),
        //     },
        //   ],
        // },
        // {
        //   path: "banks",
        //   meta: {
        //     auth: true,
        //   },
        //   component: () => import("@/views/company/banks/Home.vue"),
        //   children: [
        //     {
        //       path: "",
        //       name: "banks",
        //       meta: {
        //         auth: true,
        //         permission: ["banks", "index"],
        //       },
        //       component: () => import("@/views/company/banks/index.vue"),
        //     },

        //     {
        //       path: "form/:id",
        //       props: true,
        //       name: "edit-bank",
        //       meta: {
        //         auth: true,
        //         permission: ["banks", "update"],
        //       },
        //       component: () => import("@/views/company/banks/Form.vue"),
        //     },
        //     {
        //       path: "form",
        //       props: true,
        //       name: "add-bank",
        //       meta: {
        //         auth: true,
        //         permission: ["banks", "store"],
        //       },
        //       component: () => import("@/views/company/banks/Form.vue"),
        //     },
        //   ],
        // },
        // {
        //   path: "roles",
        //   meta: {
        //     auth: true,
        //   },
        //   component: () => import("@/views/company/roles/Home.vue"),
        //   children: [
        //     {
        //       path: "",
        //       name: "roles",
        //       meta: {
        //         auth: true,
        //         permission: ["role", "index"],
        //       },
        //       component: () => import("@/views/company/roles/index.vue"),
        //     },

        //     {
        //       path: "form/:id",
        //       props: true,
        //       name: "edit-role",
        //       meta: {
        //         auth: true,
        //         permission: ["role", "update"],
        //       },
        //       component: () => import("@/views/company/roles/Form.vue"),
        //     },
        //     {
        //       path: "form",
        //       props: true,
        //       name: "add-role",
        //       meta: {
        //         auth: true,
        //         permission: ["role", "store"],
        //       },
        //       component: () => import("@/views/company/roles/Form.vue"),
        //     },
        //   ],
        // },
        {
          path: "admins",
          meta: {
            auth: true,
          },
          component: () => import("@/views/company/admins/Home.vue"),
          children: [
            {
              path: "",
              name: "admins",
              meta: {
                auth: true,
                permission: ["admins", "index"],
              },
              component: () => import("@/views/company/admins/index.vue"),
            },

            {
              path: "form/:id",
              props: true,
              name: "edit-admin",
              meta: {
                auth: true,
                permission: ["admins", "update"],
              },
              component: () => import("@/views/company/admins/Form.vue"),
            },
            {
              path: "form",
              props: true,
              name: "add-admin",
              meta: {
                auth: true,
                permission: ["admins", "store"],
              },
              component: () => import("@/views/company/admins/Form.vue"),
            },
          ],
        },
        {
          path: "vendors",
          meta: {
            auth: true,
          },
          component: () => import("@/views/company/vendors/Home.vue"),
          children: [
            {
              path: "",
              name: "vendors",
              meta: {
                auth: true,
                permission: ["vendors", "index"],
              },
              component: () => import("@/views/company/vendors/index.vue"),
            },

            {
              path: "form/:id",
              props: true,
              name: "edit-vendors",
              meta: {
                auth: true,
                permission: ["vendors", "update"],
              },
              component: () => import("@/views/company/vendors/Form.vue"),
            },
            {
              path: "form",
              props: true,
              name: "add-vendors",
              meta: {
                auth: true,
                permission: ["vendors", "store"],
              },
              component: () => import("@/views/company/vendors/Form.vue"),
            },
          ],
        },
        {
          path: "clients",
          meta: {
            auth: true,
          },
          component: () => import("@/views/company/clients/Home.vue"),
          children: [
            {
              path: "",
              name: "clients",
              meta: {
                auth: true,
                permission: ["clients", "index"],
              },
              component: () => import("@/views/company/clients/index.vue"),
            },

            {
              path: "form/:id",
              props: true,
              name: "edit-clients",
              meta: {
                auth: true,
                permission: ["clients", "update"],
              },
              component: () => import("@/views/company/clients/Form.vue"),
            },
            {
              path: "form",
              props: true,
              name: "add-clients",
              meta: {
                auth: true,
                permission: ["clients", "store"],
              },
              component: () => import("@/views/company/clients/Form.vue"),
            },
          ],
        },
        {
          path: "faqs",
          meta: {
            auth: true,
          },
          component: () => import("@/views/company/faqs/Home.vue"),
          children: [
            {
              path: "",
              name: "faqs",
              meta: {
                auth: true,
                permission: ["faqs", "index"],
              },
              component: () => import("@/views/company/faqs/index.vue"),
            },

            {
              path: "form/:id",
              props: true,
              name: "edit-faqs",
              meta: {
                auth: true,
                permission: ["faqs", "update"],
              },
              component: () => import("@/views/company/faqs/Form.vue"),
            },
            {
              path: "form",
              props: true,
              name: "add-faqs",
              meta: {
                auth: true,
                permission: ["faqs", "store"],
              },
              component: () => import("@/views/company/faqs/Form.vue"),
            },
          ],
        },
        {
          path: "wallet",
          meta: {
            auth: true,
          },
          component: () => import("@/views/company/wallet/Home.vue"),
          children: [
            {
              path: "",
              name: "wallet",
              meta: {
                auth: true,
                permission: ["wallet", "index"],
              },
              component: () => import("@/views/company/wallet/index.vue"),
            },

            {
              path: ":id",
              props: true,
              name: "show-wallet",
              meta: {
                auth: true,
                permission: ["wallet", "show"],
              },
              component: () => import("@/views/company/wallet/transaction.vue"),
            },
            {
              path: "withdraw",
              props: true,
              name: "show-withdraw",
              meta: {
                auth: true,
                permission: ["wallet", "show"],
              },
              component: () => import("@/views/company/wallet/withdraw.vue"),
            },
            {
              path: "withdraw/:id",
              props: true,
              name: "update-withdraw",
              meta: {
                auth: true,
                permission: ["wallet", "show"],
              },
              component: () => import("@/views/company/wallet/form.vue"),
            },
            // {
            //   path: "withdraw/:id",
            //   props: true,
            //   name: "show-withdraw",
            //   meta: {
            //     auth: true,
            //     permission: ["wallet", "show"],
            //   },
            //   component: () => import("@/views/company/wallet/show.vue"),
            // },
            
            {
              path: "transaction/:id",
              props: true,
              name: "add-transaction",
              meta: {
                auth: true,
                permission: ["wallet", "store"],
              },
              component: () => import("@/views/company/wallet/makeTransaction.vue"),
            },
          ],
        },
        {
          path: "services",
          meta: {
            auth: true,
          },
          component: () => import("@/views/company/services/Home.vue"),
          children: [
            {
              path: "",
              name: "services",
              meta: {
                auth: true,
                permission: ["services", "index"],
              },
              component: () => import("@/views/company/services/index.vue"),
            },

            {
              path: "form/:id",
              props: true,
              name: "edit-services",
              meta: {
                auth: true,
                permission: ["services", "update"],
              },
              component: () => import("@/views/company/services/Form.vue"),
            },
            {
              path: "form",
              props: true,
              name: "add-services",
              meta: {
                auth: true,
                permission: ["services", "store"],
              },
              component: () => import("@/views/company/services/Form.vue"),
            },
          ],
        },
        
        {
          path: "settings",
          meta: {
            auth: true,
          },
          component: () => import("@/views/company/settings/Home.vue"),
          children: [
            {
              path: "",
              name: "settings",
              meta: {
                auth: true,
                permission: ["settings", "index"],
              },
              component: () => import("@/views/company/settings/index.vue"),
            },

            {
              path: "form/:id",
              props: true,
              name: "edit-settings",
              meta: {
                auth: true,
                permission: ["settings", "update"],
              },
              component: () => import("@/views/company/settings/Form.vue"),
            },
            {
              path: "form",
              props: true,
              name: "add-settings",
              meta: {
                auth: true,
                permission: ["settings", "store"],
              },
              component: () => import("@/views/company/settings/Form.vue"),
            },
          ],
        },
        
        {
          path: "rate",
          meta: {
            auth: true,
          },
          component: () => import("@/views/company/rate/Home.vue"),
          children: [
            {
              path: "",
              name: "rate",
              meta: {
                auth: true,
                permission: ["rate", "index"],
              },
              component: () => import("@/views/company/rate/index.vue"),
            },

            {
              path: "form/:id",
              props: true,
              name: "edit-rate",
              meta: {
                auth: true,
                permission: ["rate", "update"],
              },
              component: () => import("@/views/company/rate/Form.vue"),
            },
            {
              path: "form",
              props: true,
              name: "add-rate",
              meta: {
                auth: true,
                permission: ["rate", "store"],
              },
              component: () => import("@/views/company/rate/Form.vue"),
            },
          ],
        },
        {
          path: "statistics",
          meta: {
            auth: true,
          },
          component: () => import("@/views/company/statistics/Home.vue"),
          children: [
            {
              path: "",
              name: "statistics",
              meta: {
                auth: true,
                permission: ["statistics", "index"],
              },
              component: () => import("@/views/company/statistics/index.vue"),
            },
          ],
        },
        {
          path: "page",
          meta: {
            auth: true,
          },
          component: () => import("@/views/company/page/Home.vue"),
          children: [
            {
              path: "",
              name: "page",
              meta: {
                auth: true,
                permission: ["page", "index"],
              },
              component: () => import("@/views/company/page/index.vue"),
            },

            {
              path: "form/:id",
              props: true,
              name: "edit-page",
              meta: {
                auth: true,
                permission: ["page", "update"],
              },
              component: () => import("@/views/company/page/Form.vue"),
            },
            {
              path: "form",
              props: true,
              name: "add-page",
              meta: {
                auth: true,
                permission: ["page", "store"],
              },
              component: () => import("@/views/company/page/Form.vue"),
            },
          ],
        },
        {
          path: "countries",
          meta: {
            auth: true,
          },
          component: () => import("@/views/company/countries/Home.vue"),
          children: [
            {
              path: "",
              name: "countries",
              meta: {
                auth: true,
                permission: ["countries", "index"],
              },
              component: () => import("@/views/company/countries/index.vue"),
            },

            {
              path: "form/:id",
              props: true,
              name: "edit-countries",
              meta: {
                auth: true,
                permission: ["countries", "update"],
              },
              component: () => import("@/views/company/countries/Form.vue"),
            },
            {
              path: "form",
              props: true,
              name: "add-countries",
              meta: {
                auth: true,
                permission: ["countries", "store"],
              },
              component: () => import("@/views/company/countries/Form.vue"),
            },
          ],
        },
        {
          path: "profile",
          meta: {
            auth: true,
          },
          component: () => import("@/views/company/profile/Home.vue"),
          children: [
            {
              path: "",
              name: "profile",
              meta: {
                auth: true,
                permission: ["profile", "index"],
              },
              component: () => import("@/views/company/profile/index.vue"),
            },

            {
              path: "form",
              props: true,
              name: "edit-profile",
              meta: {
                auth: true,
                // permission: ["profile", "update"],
              },
              component: () => import("@/views/company/profile/Form.vue"),
            },
            // {
            //   path: "form",
            //   props: true,
            //   name: "add-profile",
            //   meta: {
            //     auth: true,
            //     permission: ["profile", "store"],
            //   },
            //   component: () => import("@/views/company/profile/Form.vue"),
            // },
          ],
        },
        {
          path: "cities",
          meta: {
            auth: true,
          },
          component: () => import("@/views/company/cities/Home.vue"),
          children: [
            {
              path: "",
              name: "cities",
              meta: {
                auth: true,
                permission: ["cities", "index"],
              },
              component: () => import("@/views/company/cities/index.vue"),
            },

            {
              path: "form/:id",
              props: true,
              name: "edit-cities",
              meta: {
                auth: true,
                permission: ["cities", "update"],
              },
              component: () => import("@/views/company/cities/Form.vue"),
            },
            {
              path: "form",
              props: true,
              name: "add-cities",
              meta: {
                auth: true,
                permission: ["cities", "store"],
              },
              component: () => import("@/views/company/cities/Form.vue"),
            },
          ],
        },
        {
          path: "cancel-order",
          meta: {
            auth: true,
          },
          component: () => import("@/views/company/cancel-order/Home.vue"),
          children: [
            {
              path: "",
              name: "cancel-order",
              meta: {
                auth: true,
                permission: ["cancel-order", "index"],
              },
              component: () => import("@/views/company/cancel-order/index.vue"),
            },

            {
              path: "form/:id",
              props: true,
              name: "edit-cancel-order",
              meta: {
                auth: true,
                permission: ["cancel-order", "update"],
              },
              component: () => import("@/views/company/cancel-order/Form.vue"),
            },
            // {
            //   path: ":id",
            //   props: true,
            //   name: "show-cancel-order",
            //   meta: {
            //     auth: true,
            //     permission: ["cancel-order", "show"],
            //   },
            //   component: () => import("@/views/company/cancel-order/Show.vue"),
            // },
            
          ],
        },
        {
          path: "links",
          meta: {
            auth: true,
          },
          component: () => import("@/views/company/links/Home.vue"),
          children: [
            {
              path: "",
              name: "links",
              meta: {
                auth: true,
                permission: ["links", "index"],
              },
              component: () => import("@/views/company/links/index.vue"),
            },

            {
              path: "form/:id",
              props: true,
              name: "edit-links",
              meta: {
                auth: true,
                permission: ["links", "update"],
              },
              component: () => import("@/views/company/links/Form.vue"),
            },
            {
              path: "form",
              props: true,
              name: "add-links",
              meta: {
                auth: true,
                permission: ["links", "store"],
              },
              component: () => import("@/views/company/links/Form.vue"),
            },
          ],
        },
        {
          path: "themes",
          meta: {
            auth: true,
          },
          component: () => import("@/views/company/themes/Home.vue"),
          children: [
            {
              path: "",
              name: "themes",
              meta: {
                auth: true,
                permission: ["story_themes", "index"],
              },
              component: () => import("@/views/company/themes/index.vue"),
            },

            {
              path: "form/:id",
              props: true,
              name: "edit-themes",
              meta: {
                auth: true,
                permission: ["story_themes", "update"],
              },
              component: () => import("@/views/company/themes/Form.vue"),
            },
            {
              path: "form",
              props: true,
              name: "add-themes",
              meta: {
                auth: true,
                permission: ["story_themes", "store"],
              },
              component: () => import("@/views/company/themes/Form.vue"),
            },
          ],
        },
        {
          path: "shipping-companies",
          meta: {
            auth: true,
          },
          component: () => import("@/views/company/shipping/Home.vue"),
          children: [
            {
              path: "",
              name: "shipping-companies",
              meta: {
                auth: true,
                permission: ["shipping_companies", "index"],
              },
              component: () => import("@/views/company/shipping/index.vue"),
            },

            {
              path: "form/:id",
              props: true,
              name: "edit-shipping-company",
              meta: {
                auth: true,
                permission: ["shipping_companies", "update"],
              },
              component: () => import("@/views/company/shipping/Form.vue"),
            },
            {
              path: "form",
              props: true,
              name: "add-shipping-company",
              meta: {
                auth: true,
                permission: ["shipping_companies", "store"],
              },
              component: () => import("@/views/company/shipping/Form.vue"),
            },
          ],
        },
        {
          path: "sliders",
          meta: {
            auth: true,
          },
          component: () => import("@/views/company/sliders/Home.vue"),
          children: [
            {
              path: "",
              name: "sliders",
              meta: {
                auth: true,
                permission: ["sliders", "index"],
              },
              component: () => import("@/views/company/sliders/index.vue"),
            },

            {
              path: "form/:id",
              props: true,
              name: "edit-sliders",
              meta: {
                auth: true,
                permission: ["sliders", "update"],
              },
              component: () => import("@/views/company/sliders/Form.vue"),
            },
            // {
            //   path: "form",
            //   props: true,
            //   name: "add-sliders",
            //   meta: {
            //     auth: true,
            //     permission: ["sliders", "store"],
            //   },
            //   component: () => import("@/views/company/sliders/Form.vue"),
            // },
          ],
        },

        {
          path: "categories",
          meta: {
            auth: true,
          },
          component: () => import("@/views/company/categories/Home.vue"),
          children: [
            {
              path: "",
              name: "categories",
              meta: {
                auth: true,
                permission: ["categories", "index"],
              },
              component: () => import("@/views/company/categories/index.vue"),
            },

            {
              path: "form/:id",
              props: true,
              name: "edit-category",
              meta: {
                auth: true,
                permission: ["categories", "update"],
              },
              component: () => import("@/views/company/categories/Form.vue"),
            },
            {
              path: "form",
              props: true,
              name: "add-category",
              meta: {
                auth: true,
                permission: ["categories", "store"],
              },
              component: () => import("@/views/company/categories/Form.vue"),
            },
            // {
            //   path: ":id/sub-categories",
            //   meta: {
            //     auth: true,
            //   },

            //   component: () =>
            //     import("@/views/company/sub-categories/Home.vue"),
            //   children: [
            //     {
            //       path: "",
            //       name: "sub-categories",
            //       meta: {
            //         auth: true,
            //         permission: ["categories", "index"],
            //       },
            //       component: () =>
            //         import("@/views/company/sub-categories/index.vue"),
            //     },

            //     {
            //       path: "form",
            //       name: "add-sub-category",
            //       meta: {
            //         auth: true,
            //         permission: ["categories", "store"],
            //       },
            //       component: () =>
            //         import("@/views/company/sub-categories/Form.vue"),
            //     },
            //     {
            //       path: "form/:sub_id",
            //       name: "edit-sub-category",
            //       meta: {
            //         auth: true,
            //         permission: ["categories", "update"],
            //       },
            //       component: () =>
            //         import("@/views/company/sub-categories/Form.vue"),
            //     },
            //   ],
            // },
          ],
        },
        // {
        //   path: "brands",
        //   meta: {
        //     auth: true,
        //   },
        //   component: () => import("@/views/company/brands/Home.vue"),
        //   children: [
        //     {
        //       path: "",
        //       name: "brands",
        //       meta: {
        //         auth: true,
        //         permission: ["brands", "index"],
        //       },
        //       component: () => import("@/views/company/brands/index.vue"),
        //     },

        //     {
        //       path: "form/:id",
        //       props: true,
        //       name: "edit-brand",
        //       meta: {
        //         auth: true,
        //         permission: ["brands", "update"],
        //       },
        //       component: () => import("@/views/company/brands/Form.vue"),
        //     },

        //     {
        //       path: "form",
        //       props: true,
        //       name: "add-brand",
        //       meta: {
        //         auth: true,
        //         permission: ["brands", "store"],
        //       },
        //       component: () => import("@/views/company/brands/Form.vue"),
        //     },
        //   ],
        // },
        // {
        //   path: "zones",
        //   component: () => import("@/views/company/zones/Home.vue"),
        //   meta: {
        //     auth: true,
        //   },
        //   children: [
        //     {
        //       path: "",
        //       component: () => import("@/views/company/zones/index.vue"),
        //       name: "zones-page",
        //       meta: {
        //         permission: ["zones", "index"],
        //         auth: true,
        //       },
        //     },

        //     {
        //       path: "form/:id",
        //       component: () => import("@/views/company/zones/Form.vue"),
        //       name: "zones-edit",
        //       meta: {
        //         auth: true,
        //         permission: ["zones", "update"],
        //       },
        //     },
        //     {
        //       path: "form",
        //       component: () => import("@/views/company/zones/Form.vue"),
        //       name: "zones-form",
        //       meta: {
        //         auth: true,
        //         permission: ["zones", "store"],
        //       },
        //     },
        //   ],
        // },

        // {
        //   path: "products",
        //   component: () => import("@/views/company/products/home.vue"),

        //   children: [
        //     {
        //       path: "",
        //       name: "products",
        //       component: () => import("@/views/company/products/index.vue"),
        //       meta: {
        //         auth: true,

        //         permission: ["products", "index"],
        //       },
        //     },
        //     {
        //       path: "show/:id",
        //       props: true,
        //       name: "show-product",
        //       meta: {
        //         auth: true,
        //         permission: ["products", "show"],
        //       },
        //       component: () => import("@/views/company/products/Show.vue"),
        //     },
        //   ],
        // },
        // {
        //   path: "stories",
        //   component: () => import("@/views/company/stories/home.vue"),

        //   children: [
        //     {
        //       path: "",
        //       name: "stories",
        //       component: () => import("@/views/company/stories/index.vue"),
        //       meta: {
        //         auth: true,
        //         permission: ["stories", "index"],
        //       },
        //     },
        //     {
        //       path: "show/:id",
        //       props: true,
        //       name: "show-story",
        //       meta: {
        //         auth: true,
        //         permission: ["stories", "show"],
        //       },
        //       component: () => import("@/views/company/stories/Show.vue"),
        //     },
        //   ],
        // },
        // {
        //   path: "wholesalers",
        //   component: () => import("@/views/company/wholesalers/home.vue"),

        //   children: [
        //     {
        //       path: "",
        //       name: "wholesalers",
        //       component: () => import("@/views/company/wholesalers/index.vue"),
        //       meta: {
        //         auth: true,
        //         permission: ["providers", "index"],
        //       },
        //     },
        //     {
        //       path: "requests",
        //       name: "wholesalers-requests",
        //       component: () =>
        //         import("@/views/company/wholesalers/requests.vue"),
        //       meta: {
        //         auth: true,
        //         permission: ["providers", "index"],
        //       },
        //     },
        //     {
        //       path: "show/:id",
        //       props: true,
        //       name: "show-wholesaler",
        //       meta: {
        //         auth: true,
        //         permission: ["providers", "show"],
        //       },
        //       component: () => import("@/views/company/wholesalers/Show.vue"),
        //     },
        //     {
        //       path: "form/:id",
        //       props: true,
        //       name: "edit-wholesaler",
        //       meta: {
        //         auth: true,
        //         permission: ["providers", "update"],
        //       },
        //       component: () => import("@/views/company/wholesalers/Form.vue"),
        //     },
        //     {
        //       path: "form",
        //       props: true,
        //       name: "add-wholesaler",
        //       meta: {
        //         auth: true,
        //         permission: ["providers", "store"],
        //       },
        //       component: () => import("@/views/company/wholesalers/Form.vue"),
        //     },
        //   ],
        // },
        // {
        //   path: "retailers",
        //   component: () => import("@/views/company/retailers/home.vue"),

        //   children: [
        //     {
        //       path: "",
        //       name: "retailers",
        //       component: () => import("@/views/company/retailers/index.vue"),
        //       meta: {
        //         auth: true,
        //         permission: ["users", "index"],
        //       },
        //     },
        //     {
        //       path: "show/:id",
        //       props: true,
        //       name: "show-retailer",
        //       meta: {
        //         auth: true,
        //         permission: ["users", "show"],
        //       },
        //       component: () => import("@/views/company/retailers/Show.vue"),
        //     },
        //     {
        //       path: "form/:id",
        //       props: true,
        //       name: "edit-retailer",
        //       meta: {
        //         auth: true,
        //         permission: ["users", "update"],
        //       },
        //       component: () => import("@/views/company/retailers/form.vue"),
        //     },
        //     {
        //       path: "form",
        //       props: true,
        //       name: "add-retailer",
        //       meta: {
        //         auth: true,
        //         permission: ["users", "store"],
        //       },
        //       component: () => import("@/views/company/retailers/form.vue"),
        //     },
        //   ],
        // },
        {
          path: "orders",
          meta: {
            auth: true,
          },
          component: () => import("@/views/company/orders/Home.vue"),
          children: [
            {
              path: "",
              name: "orders",
              meta: {
                auth: true,
                permission: ["order", "index"],
              },
              component: () => import("@/views/company/orders/index.vue"),
            },
            {
              path: "show/:id",

              meta: {
                auth: true,
                permission: ["order", "show"],
              },
              // children: [],
              name: "show-order",
              component: () => import("@/views/company/orders/Show.vue"),
            },
          ],
        },
        // {
        //   path: "reports",
        //   meta: {
        //     auth: true,
        //   },
        //   component: () => import("@/views/company/reports/Home.vue"),
        //   children: [
        //     {
        //       path: "",
        //       name: "reports",
        //       meta: {
        //         auth: true,
        //       },
        //       component: () => import("@/views/company/reports/index.vue"),
        //     },
        //   ],
        // },
        // {
        //   path: "deals",
        //   meta: {
        //     auth: true,
        //   },
        //   component: () => import("@/views/company/deals/Home.vue"),
        //   children: [
        //     {
        //       path: "",
        //       name: "deals",
        //       meta: {
        //         auth: true,
        //         permission: ["deals", "index"],
        //       },
        //       component: () => import("@/views/company/deals/index.vue"),
        //     },
        //     {
        //       path: ":id",

        //       meta: {
        //         auth: true,
        //       },
        //       component: () => import("@/views/company/deals/Show.vue"),
        //       children: [
        //         {
        //           path: "",
        //           name: "show-deal",
        //           meta: {
        //             auth: true,
        //             permission: ["deals", "show"],
        //           },
        //           component: () =>
        //             import("@/views/company/deals/show/index.vue"),
        //         },
        //         {
        //           path: "products",
        //           name: "show-deal-products",
        //           meta: {
        //             auth: true,
        //             permission: ["deals", "show"],
        //           },
        //           component: () =>
        //             import("@/views/company/deals/show/Products.vue"),
        //         },
        //         {
        //           path: "offers",
        //           name: "show-deal-offers",
        //           meta: {
        //             auth: true,
        //             permission: ["deals", "show"],
        //           },
        //           component: () =>
        //             import("@/views/company/deals/show/offers/index.vue"),
        //         },
        //       ],
        //     },
        //   ],
        // },
        // {
        //   path: "support-tickets",
        //   meta: {
        //     auth: true,
        //   },
        //   component: () => import("@/views/company/tickets/Home.vue"),
        //   children: [
        //     {
        //       path: "",
        //       name: "tickets",
        //       meta: {
        //         auth: true,
        //         permission: ["tickets", "index"],
        //       },
        //       component: () => import("@/views/company/tickets/index.vue"),
        //     },
        //     {
        //       path: "show/:id",

        //       meta: {
        //         auth: true,
        //         permission: ["tickets", "show"],
        //       },
        //       // children: [],
        //       name: "show-ticket",
        //       component: () => import("@/views/company/tickets/Show.vue"),
        //     },
        //   ],
        // },
        // {
        //   path: "scope-settings",
        //   component: () => import("@/views/settings/index.vue"),
        //   meta: {
        //     auth: true,
        //     permissions: allRoles.settings,
        //   },
        //   children: [
        //     {
        //       path: "countries",
        //       redirect: "/scope-settings/countries/all",
        //       component: () => import("@/views/settings/countries/Home.vue"),
        //       meta: {
        //         auth: true,
        //       },
        //       children: [
        //         {
        //           path: "all",
        //           name: "countries",
        //           component: () =>
        //             import("@/views/settings/countries/index.vue"),
        //           meta: {
        //             auth: true,
        //             permission: ["countries", "index"],
        //           },
        //         },

        //         {
        //           path: "form/:id",
        //           component: () =>
        //             import("@/views/settings/countries/Form.vue"),
        //           name: "countries-edit",
        //           meta: {
        //             auth: true,
        //             permission: ["countries", "update"],
        //           },
        //         },

        //         {
        //           path: "form",
        //           component: () =>
        //             import("@/views/settings/countries/Form.vue"),
        //           name: "countries-form",
        //           meta: {
        //             auth: true,
        //             permission: ["countries", "store"],
        //           },
        //         },
        //       ],
        //     },
        //     {
        //       path: "cities",
        //       redirect: "/scope-settings/cities/all",
        //       component: () => import("@/views/settings/cities/Home.vue"),
        //       meta: {
        //         auth: true,
        //       },
        //       children: [
        //         {
        //           path: "all",
        //           name: "cities",
        //           component: () => import("@/views/settings/cities/index.vue"),
        //           meta: {
        //             auth: true,
        //             permission: ["cities", "index"],
        //           },
        //         },

        //         {
        //           path: "form/:id",
        //           component: () => import("@/views/settings/cities/Form.vue"),
        //           name: "cities-edit",
        //           meta: {
        //             auth: true,
        //             permission: ["cities", "update"],
        //           },
        //         },
        //         {
        //           path: "form",
        //           component: () => import("@/views/settings/cities/Form.vue"),
        //           name: "cities-form",
        //           meta: {
        //             auth: true,
        //             permission: ["cities", "store"],
        //           },
        //         },
        //       ],
        //     },
        //     {
        //       path: "districts",
        //       redirect: "/scope-settings/districts/all",
        //       component: () => import("@/views/settings/districts/Home.vue"),
        //       meta: {
        //         auth: true,
        //       },
        //       children: [
        //         {
        //           path: "all",
        //           name: "districts",
        //           component: () =>
        //             import("@/views/settings/districts/index.vue"),
        //           meta: {
        //             auth: true,
        //             permission: ["districts", "index"],
        //           },
        //         },

        //         {
        //           path: "form/:id",
        //           component: () =>
        //             import("@/views/settings/districts/Form.vue"),
        //           name: "districts-edit",
        //           meta: {
        //             auth: true,
        //             permission: ["districts", "update"],
        //           },
        //         },
        //         {
        //           path: "form",
        //           component: () =>
        //             import("@/views/settings/districts/Form.vue"),
        //           name: "districts-form",
        //           meta: {
        //             auth: true,
        //             permission: ["districts", "store"],
        //           },
        //         },
        //       ],
        //     },
        //     {
        //       path: "terms",

        //       component: () => import("@/views/settings/terms/Home.vue"),
        //       meta: {
        //         auth: true,
        //       },
        //       children: [
        //         {
        //           path: "",
        //           name: "terms",
        //           component: () => import("@/views/settings/terms/index.vue"),
        //           meta: {
        //             auth: true,
        //             permission: ["pages", "index"],
        //           },
        //         },

        //         {
        //           path: "form/:id",
        //           component: () => import("@/views/settings/terms/Form.vue"),
        //           name: "terms-edit",
        //           meta: {
        //             auth: true,
        //             permission: ["pages", "update"],
        //           },
        //         },
        //         {
        //           path: "form",
        //           component: () => import("@/views/settings/terms/Form.vue"),
        //           name: "terms-form",
        //           meta: {
        //             auth: true,
        //             permission: ["pages", "store"],
        //           },
        //         },
        //       ],
        //     },
        //     {
        //       path: "about",

        //       component: () => import("@/views/settings/about/Home.vue"),
        //       meta: {
        //         auth: true,
        //       },
        //       children: [
        //         {
        //           path: "",
        //           name: "about",
        //           component: () => import("@/views/settings/about/index.vue"),
        //           meta: {
        //             auth: true,
        //             permission: ["pages", "index"],
        //           },
        //         },

        //         {
        //           path: "form/:id",
        //           component: () => import("@/views/settings/about/Form.vue"),
        //           name: "about-edit",
        //           meta: {
        //             auth: true,
        //             permission: ["pages", "update"],
        //           },
        //         },
        //         {
        //           path: "form",
        //           component: () => import("@/views/settings/about/Form.vue"),
        //           name: "about-form",
        //           meta: {
        //             auth: true,
        //             permission: ["pages", "store"],
        //           },
        //         },
        //       ],
        //     },
        //     {
        //       path: "privacy",

        //       component: () => import("@/views/settings/privacy/Home.vue"),
        //       meta: {
        //         auth: true,
        //       },
        //       children: [
        //         {
        //           path: "",
        //           name: "privacy",
        //           component: () => import("@/views/settings/privacy/index.vue"),
        //           meta: {
        //             auth: true,
        //             permission: ["pages", "index"],
        //           },
        //         },

        //         {
        //           path: "form/:id",
        //           component: () => import("@/views/settings/privacy/Form.vue"),
        //           name: "privacy-edit",
        //           meta: {
        //             auth: true,
        //             permission: ["pages", "update"],
        //           },
        //         },

        //         {
        //           path: "form",
        //           component: () => import("@/views/settings/privacy/Form.vue"),
        //           name: "privacy-form",
        //           meta: {
        //             auth: true,
        //             permission: ["pages", "store"],
        //           },
        //         },
        //       ],
        //     },
        //     {
        //       path: "blogs",

        //       component: () => import("@/views/settings/blogs/Home.vue"),
        //       meta: {
        //         auth: true,
        //       },
        //       children: [
        //         {
        //           path: "",
        //           name: "blogs",
        //           component: () => import("@/views/settings/blogs/index.vue"),
        //           meta: {
        //             auth: true,
        //             permission: ["blogs", "index"],
        //           },
        //         },

        //         {
        //           path: "form/:id",
        //           component: () => import("@/views/settings/blogs/Form.vue"),
        //           name: "blogs-edit",
        //           meta: {
        //             auth: true,
        //             permission: ["blogs", "update"],
        //           },
        //         },
        //         {
        //           path: "form",
        //           component: () => import("@/views/settings/blogs/Form.vue"),
        //           name: "blogs-form",
        //           meta: {
        //             auth: true,
        //             permission: ["blogs", "store"],
        //           },
        //         },
        //       ],
        //     },
        //     {
        //       path: "settings",
        //       name: "web-settings",
        //       component: () =>
        //         import("@/views/settings/web-settings/index.vue"),
        //       meta: {
        //         auth: true,
        //         permission: ["settings", "index"],
        //       },
        //     },
        //   ],
        // },

        {
          path: "/:pathMatch(.*)*",
          name: "not-found",
          component: () => import("@/views/NotFound.vue"),
        },
        // {
        //   path: "/profile",
        //   component: () => import("@/views/profile/index.vue"),
        //   children: [
        //     {
        //       path: "",
        //       name: "profile",
        //       meta: {
        //         auth: true,
        //       },
        //       component: () => import("@/views/profile/Account.vue"),
        //     },
        //     {
        //       path: "reset-password",
        //       name: "resetProfilePassword",
        //       meta: {
        //         auth: true,
        //       },
        //       component: () => import("@/views/profile/Password.vue"),
        //     },
        //   ],
        // },

        {
          path: "/403",
          name: "not-authorized",
          component: () => import("@/views/403.vue"),
        },
        {
          path: "/402",
          name: "too-many-requests",
          component: () => import("@/views/402.vue"),
        },
      ],
    },

    {
      path: "/auth",
      component: () => import("@/layouts/auth/Auth.vue"),
      children: [
        {
          path: "login",
          name: "login",
          meta: {
            guest: true,
          },
          component: () => import("@/views/auth/Login.vue"),
        },
        {
          path: "forget-password",
          name: "forget-password",
          meta: {
            guest: true,
          },
          component: () => import("@/views/auth/ForgetPassword.vue"),
        },
        {
          path: "reset-password",
          name: "changePassword",
          meta: {
            guest: true,
          },
          component: () => import("@/views/auth/ResetPassword.vue"),
        },

        {
          path: "verify",
          name: "verify",
          meta: {
            guest: true,
          },
          component: () => import("@/views/auth/Verify.vue"),
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const appAuth = useAppAuth();
  const isLoggedIn = computed(() => localStorage.getItem("jwt_token_makhdum"));

  // if (appAuth.getRoles) {
  //   if (to.meta.permissions) {
  //     const found = allRoles.includesSome(
  //       appAuth.getRoles.groups,
  //       to.meta.permissions
  //     );

  //     if (found) next();
  //     if (!found) next("/402");
  //     return;
  //   }

  //   const permission = to.meta.permission as string[];

  //   if (permission && permission.length) {
  //     if (allRoles.checkPermission(permission[0], permission[1])) {
  //       next();
  //       return;
  //     } else {
  //       next("/402");
  //       return;
  //     }
  //   }
  // }

  if (to.meta.auth && !isLoggedIn.value) {
    next("/auth/login");
    return;
  } else if (to.meta.guest && isLoggedIn.value) {
    next("/");
    return;
  }

  next();
});

export default router;
