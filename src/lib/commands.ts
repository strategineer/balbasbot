import { data } from './util';
import { getPermissionLevel } from './permissions';
import { BotError } from './error';

export function getCommandsForUser(username: string): string[] {
  if (!username) {
    throw new BotError();
  }
  const permissionLevel = getPermissionLevel(username);
  return data.commands
    .filter((c) => c.permissions >= permissionLevel)
    .map((c) => c.name);
}
