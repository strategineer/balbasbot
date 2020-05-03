import assert from 'assert';
import { User } from './models/user';

export class Tracker {
  private logger;
  public constructor(logger) {
    this.logger = logger.child();
  }
  public track(context, eventName: string): void {
    this._track({ id: context['user-id'] }, context.username, eventName);
  }
  public trackByUsername(username: string, eventName: string): void {
    this._track({ username: username }, username, eventName);
  }
  private _track(
    query: Record<string, string>,
    username: string,
    eventName: string
  ): void {
    User.findOne(
      query,
      function (err, user): void {
        if (!user && query.id) {
          user = new User(query);
          user.username = username;
          user.events.set(eventName, 1);
          user.save(
            function (err): void {
              assert.equal(err, null);
              this.logger.info(
                `Tracked '${eventName}' event for user '${username}'`
              );
            }.bind(this)
          );
        } else if (user) {
          user.username = username;
          if (user.events.get(eventName) === undefined) {
            user.events.set(eventName, 1);
          } else {
            user.events.set(eventName, user.events.get(eventName) + 1);
          }
          user.save(
            function (err): void {
              assert.equal(err, null);
              this.logger.info(
                `Tracked '${eventName}' event for user '${username}'`
              );
            }.bind(this)
          );
        }
      }.bind(this)
    );
  }
}
