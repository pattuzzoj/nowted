export interface Task {
    entity: "folder" | "note";
    type: "create" | "update" | "delete" | "restore";
    data: Record<string, any>;
}
//# sourceMappingURL=sync.interface.d.ts.map