import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "MeasuresView",
    component: () => import("../views/MeasuresView"),
  },
  {
    path: "/subsidy_info/model/:modelId",
    name: "MeasureInfoView",
    component: () => import("../views/MeasureInfoView"),
  },
  {
    path: "/application_view/model/:modelId/app/:appId",
    name: "ApplicationView",
    component: () => import("../views/ApplicationView"),
  },
  {
    path: "/account_info",
    name: "AccountInfoView",
    component: () => import("../views/AccountInfoView"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
