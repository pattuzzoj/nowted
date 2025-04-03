import { authMessages } from "@/features/auth/utils/messages/authMessages";
import { folderMessages } from "@/features/notes/utils/messages/folderMessages";
import { loadMessages } from "@/features/notes/utils/messages/loadMessages";
import { noteMessages } from "@/features/notes/utils/messages/noteMessages";
import { syncMessages } from "@/features/notes/utils/messages/syncMessages";
import { profileMessages } from "@/features/profile/utils/messages/profileMessages";

export const messages = {
  ...folderMessages,
  ...noteMessages,
  ...authMessages,
  ...syncMessages,
  ...loadMessages,
  ...profileMessages
}
