import assert from 'assert';
import { User } from './models/user';

function _track(
  query: Record<string, string>,
  username: string,
  eventName: string
): void {
  User.findOne(query, function (err, user) {
    if (!user && query.id) {
      user = new User(query);
      user.username = username;
      user.events.set(eventName, 1);
      user.save(function (err) {
        assert.equal(err, null);
        console.log(`Tracked '${eventName}' event for user '${username}'`);
      });
    } else if (user) {
      user.username = username;
      if (user.events.get(eventName) === undefined) {
        user.events.set(eventName, 1);
      } else {
        user.events.set(eventName, user.events.get(eventName) + 1);
      }
      user.save(function (err) {
        assert.equal(err, null);
        console.log(`Tracked '${eventName}' event for user '${username}'`);
      });
    }
  });
}

export function track(context, eventName: string): void {
  _track({ id: context['user-id'] }, context.username, eventName);
}
export function trackByUsername(username: string, eventName: string): void {
  _track({ username: username }, username, eventName);
}
