import { data } from './util';
import { BotError } from './error';

export function getPermissionLevel(username: string): 0 | 1 | 2 {
  if (!username) {
    throw new BotError();
  }
  if (username === data.users.me) {
    return 0;
  } else if (data.users.mods.includes(username)) {
    return 1;
  }
  return 2;
}
