import { lazy } from "solid-js";
import { Navigate, RouteDefinition } from "@solidjs/router";
import { isUUID } from '@utilify/core';

export const routes: RouteDefinition[] = [
  {
    path: "/auth", component: lazy(() => import("pages/auth")),
    children: [
      { path: "" },
      { path: "/sign-in", component: lazy(() => import("pages/auth/signIn"))},
      { path: "/sign-up", component: lazy(() => import("pages/auth/signUp"))},
      { path: "/recover-account", component: lazy(() => import("pages/auth/recoverAccount"))},
      { path: "/reset-password", component: lazy(() => import("pages/auth/resetPassword"))}
    ]
  },
  {
    path: "", component: lazy(() => import("pages/app")),
    children: [
      { path: "", component: lazy(() => import("pages/app/main"))},
      {
        path: "/folder/:folderId", component: lazy(() => import("pages/app/folder")),
        matchFilters: { folderId: isUUID },
      },
      {
        path: "/folder/:folderId/note/:noteId", component: lazy(() => import("pages/app/folder")),
        matchFilters: {
          folderId: isUUID,
          noteId: isUUID
        },
      },
      {
        path: "/favorites/:noteId?", component: lazy(() => import("pages/app/favorites")),
        matchFilters: { noteId: isUUID }
      },
      {
        path: "/archived/:noteId?", component: lazy(() => import("pages/app/archived")),
        matchFilters: { noteId: isUUID }
      },
      {
        path: "/trash/:noteId?", component: lazy(() => import("pages/app/trash")),
        matchFilters: { noteId: isUUID }
      }
    ]
  },
  {
    path: "*404",
    component: lazy(() => import("pages/app"))
  }
]