import type { StoreSchema } from '@/context/indexedDB';

const stores: StoreSchema[] = [
  {
    "name": "folder",
    "options": {
      "keyPath": "id"
    }
  },
  {
    "name": "note",
    "options": {
      "keyPath": "id"
    },
    "index": [
      {
        "name": "parent_folder",
        "keyPath": "folder_id"
      }
    ]
  },
  {
    "name": "action-record",
    "options": {
      "keyPath": "id"
    }
  }
]

export const config = {
  name: "nowted",
  version: 1,
  stores
}
