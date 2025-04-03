import { lazy } from "solid-js";
import { RouteDefinition } from "@solidjs/router";

const authRoutes: RouteDefinition[] = [
  {
    path: "/auth",
    component: lazy(() => import("../pages")),
    children: [
      { path: "" },
      {
        path: "/login",
        component: lazy(() => import("../pages/login")),
      },
      {
        path: "/register",
        component: lazy(() => import("../pages/register")),
      },
      {
        path: "/forgot-password",
        component: lazy(() => import("../pages/forgotPassword")),
      },
      {
        path: "/reset-password",
        component: lazy(() => import("../pages/resetPassword")),
      },
      {
        path: "/activate-account",
        component: lazy(() => import("../pages/activateAccount")),
      },
    ],
  },
];

export default authRoutes;
