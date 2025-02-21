import { lazy } from "solid-js";
import { RouteDefinition } from "@solidjs/router";
import { isUUID } from '@utilify/core';

export const routes: RouteDefinition[] = [
  {
    path: "/auth", component: lazy(() => import("@pages/auth")),
    children: [
      { path: "" },
      { path: "/login", component: lazy(() => import("@/pages/auth/login"))},
      { path: "/register", component: lazy(() => import("@/pages/auth/register"))},
      { path: "/forgot-password", component: lazy(() => import("@pages/auth/forgotPassword"))},
      { path: "/reset-password", component: lazy(() => import("@pages/auth/resetPassword"))},
      { path: "/activate-account", component: lazy(() => import("@pages/auth/activateAccount"))},
    ]
  },
  {
    path: "", component: lazy(() => import("@pages/app")),
    children: [
      { path: "", component: lazy(() => import("@pages/app/main"))},
      {
        path: "/folder/:folderId", component: lazy(() => import("@pages/app/main/folder")),
        matchFilters: { folderId: isUUID },
      },
      {
        path: "/folder/:folderId/note/:noteId", component: lazy(() => import("@pages/app/main/folder")),
        matchFilters: {
          folderId: isUUID,
          noteId: isUUID
        },
      },
      {
        path: "/favorites/:noteId?", component: lazy(() => import("@pages/app/main/favorites")),
        matchFilters: { noteId: isUUID }
      },
      {
        path: "/archived/:noteId?", component: lazy(() => import("@pages/app/main/archived")),
        matchFilters: { noteId: isUUID }
      },
      {
        path: "/trash/:noteId?", component: lazy(() => import("@pages/app/main/trash")),
        matchFilters: { noteId: isUUID }
      }
    ]
  },
  {
    path: "*404",
    component: lazy(() => import("@pages/404"))
  }
]