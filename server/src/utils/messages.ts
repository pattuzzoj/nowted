import { AuthMessages } from "@modules/auth/authMessages";
import { MailMessages } from "@modules/mail/mailMessages";
import { SyncMessages } from "@modules/sync/syncMessages";
import { UsersMessages } from "@modules/users/usersMessages";

export const messages = {
  ...AuthMessages,
  ...MailMessages,
  ...SyncMessages,
  ...UsersMessages
}