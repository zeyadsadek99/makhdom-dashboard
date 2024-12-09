import { defineStore } from "pinia";
import router from "../router";
import axios from "axios";

export const useAppAuth = defineStore("authStore", {
  state: () => ({
    user_type: "super_admin",
    token: localStorage.getItem("jwt_token_makhdum")!,
    roles: JSON.parse(localStorage.getItem("supplayers_user_roles")!),
    userData: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,

    getRoles: (state) => state.roles,
    getUserData: (state) => state.userData,
    getUserType: (state) => state.user_type,
  },
  actions: {
    getProfile() {
      if (!this.token) return;
      this.getPermissions();
      axios.get("profile").then((res) => {
        this.userData = res.data.data;
        this.user_type = res.data.data.user_type;
      });
    },

    getPermissions() {
      axios.get("get_my_permissions").then((res) => {
        this.setRolesSettings(res.data.data);
      });
    },
    setRolesSettings(roles: any) {
      const groups = Object.keys(roles).map((key) => key);
      const group_permissions = roles;
      this.roles = {
        groups,
        group_permissions,
      };
      localStorage.setItem("supplayers_user_roles", JSON.stringify(this.roles));
    },

    logout() {
      this.token = "";

      axios.defaults.headers.common["Authorization"] = null;
      localStorage.removeItem("makhdum_user_data");
      localStorage.removeItem("jwt_token_makhdum");
      localStorage.removeItem("supplayers_user_roles");

      router.push("/auth/login");
    },
  },
});
