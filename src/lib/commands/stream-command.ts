import util = require('../util');

import { SubCommand } from '../classes/sub-command';

export class StreamCommand extends SubCommand {
  public constructor(logger, client) {
    super(logger, client, 'stream');
  }
  protected _run(args, context, resolve, reject): void {
    const defaultValue = args[0] ? undefined : 'unhost';
    const subCommand = util.queryFrom(
      args[0],
      this.config.commands,
      defaultValue
    );
    if (subCommand === 'host') {
      const channelsToHost =
        args.length > 1
          ? [args[1].trim()]
          : util.shuffle(util.data.users.hostables);

      let hasHosted = false;
      let isTryingToHost = false;
      while (channelsToHost.length > 0 && !hasHosted) {
        // TODO(keikakub): See if channel is online, if it is host it otherwise check next channel
        if (!isTryingToHost) {
          isTryingToHost = true;
          const c = channelsToHost.shift();
          // TODO this.requests.isOnline(c).then(do below logic).catch(try next channel)
          this.client
            .host(util.data.users.me, c)
            .then((data) => {
              // data returns [channel, target]
              resolve(`Hosting channel '${c}'`);
              hasHosted = true;
            })
            .catch((err) => {
              this.logger.error(err);
              reject('Error trying to host channel');
            })
            .finally(() => {
              isTryingToHost = false;
            });
        }
      }
      if (!hasHosted) {
        reject("I wasn't able to find any live to host");
      }
    } else if (subCommand === 'unhost') {
      this.client
        .unhost(util.data.users.me)
        .then((data) => {
          // data returns [channel]
          resolve('unhost');
        })
        .catch((err) => {
          //
        });
    } else {
      this.botError();
    }
  }
}
