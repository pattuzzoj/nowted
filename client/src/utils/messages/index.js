import { authMessages } from "./authMessages";
import { folderMessages } from "./folderMessages";
import { loadMessages } from "./loadMessages";
import { noteMessages } from "./noteMessages";
import { syncMessages } from "./syncMessages";

export const messages = {
  ...folderMessages,
  ...noteMessages,
  ...authMessages,
  ...syncMessages,
  ...loadMessages
}