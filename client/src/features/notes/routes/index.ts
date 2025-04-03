import { lazy } from "solid-js";
import { RouteDefinition } from "@solidjs/router";
import { isUUID } from "@utilify/core";

const notesRoutes: RouteDefinition[] = [
  {
    path: "",
    component: lazy(() => import("../pages")),
    children: [
      { path: "", component: lazy(() => import("../pages/main")) },
      {
        path: "/folder/:folderId",
        component: lazy(() => import("../pages/folder")),
        matchFilters: { folderId: isUUID },
      },
      {
        path: "/folder/:folderId/note/:noteId",
        component: lazy(() => import("../pages/folder")),
        matchFilters: {
          folderId: isUUID,
          noteId: isUUID,
        },
      },
      {
        path: "/favorites/:noteId?",
        component: lazy(() => import("../pages/favorites")),
        matchFilters: { noteId: isUUID },
      },
      {
        path: "/archived/:noteId?",
        component: lazy(() => import("../pages/archived")),
        matchFilters: { noteId: isUUID },
      },
      {
        path: "/trash/:noteId?",
        component: lazy(() => import("../pages/trash")),
        matchFilters: { noteId: isUUID },
      },
    ],
  },
];

export default notesRoutes;
