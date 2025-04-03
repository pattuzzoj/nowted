import { lazy } from "solid-js";
import { RouteDefinition } from "@solidjs/router";
import authRoutes from "@/features/auth/routes";
import notesRoutes from "@/features/notes/routes";

export const routes: RouteDefinition[] = [
  ...authRoutes,
  ...notesRoutes,
  {
    path: "*404",
    component: lazy(() => import("@/pages/404")),
  },
];
