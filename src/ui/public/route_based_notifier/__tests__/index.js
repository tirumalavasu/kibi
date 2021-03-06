import { filter, find, remove } from 'lodash';
import expect from 'expect.js';
import ngMock from 'ngMock';
import Notifier from '../../notify/notifier';
import routeBasedNotifierProvider from '../index';

describe('ui/route_based_notifier', function () {
  let $rootScope;
  let routeBasedNotifier;

  beforeEach(ngMock.module('kibana'));
  beforeEach(ngMock.inject(($injector) => {
    remove(Notifier.prototype._notifs); // hack to reset the global notification array
    const Private = $injector.get('Private');
    routeBasedNotifier = Private(routeBasedNotifierProvider);
    $rootScope = $injector.get('$rootScope');
  }));

  describe('#warning()', () => {
    it('adds a warning notification', () => {
      routeBasedNotifier.warning('wat');
      const notification = find(Notifier.prototype._notifs, {
        type: 'warning',
        content: 'wat'
      });
      expect(notification).not.to.be(undefined);
    });

    it('can be used more than once for different notifications', () => {
      routeBasedNotifier.warning('wat');
      routeBasedNotifier.warning('nowai');

      const notification1 = find(Notifier.prototype._notifs, {
        type: 'warning',
        content: 'wat'
      });
      const notification2 = find(Notifier.prototype._notifs, {
        type: 'warning',
        content: 'nowai'
      });

      expect(notification1).not.to.be(undefined);
      expect(notification2).not.to.be(undefined);
    });

    it('only adds a notification if it was not previously added in the current route', () => {
      routeBasedNotifier.warning('wat');
      routeBasedNotifier.warning('wat');

      const notification = find(Notifier.prototype._notifs, {
        type: 'warning',
        content: 'wat'
      });

      expect(notification.count).to.equal(1);
    });

    it('can add a previously added notification so long as the route changes', () => {
      routeBasedNotifier.warning('wat');
      const notification1 = find(Notifier.prototype._notifs, {
        type: 'warning',
        content: 'wat'
      });
      expect(notification1.count).to.equal(1);

      $rootScope.$broadcast('$routeChangeSuccess');

      routeBasedNotifier.warning('wat');
      const notification2 = find(Notifier.prototype._notifs, {
        type: 'warning',
        content: 'wat'
      });
      expect(notification2.count).to.equal(2);
    });
  });
});
