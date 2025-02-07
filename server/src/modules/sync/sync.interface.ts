export interface Task {
  entity: "folder" | "note"
  type: "create" | "update" | "delete" | "restore"
  data: Record<string, any>
}