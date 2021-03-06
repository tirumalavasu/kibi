define(function (require) {
  let sinon = require('auto-release-sinon');
  let searchResponse = require('fixtures/search_response');

  return function stubSearchSource(Private, $q, Promise) {
    let deferedResult = $q.defer();
    let indexPattern = Private(require('fixtures/stubbed_logstash_index_pattern'));

    return {
      sort: sinon.spy(),
      size: sinon.spy(),
      fetch: sinon.spy(),
      destroy: sinon.spy(),
      get: function (param) {
        switch (param) {
          case 'index':
            return indexPattern;
          default:
            throw new Error('Param "' + param + '" is not implemented in the stubbed search source');
        }
      },
      crankResults: function (mySearchResponse) {
        // kibi: added mySearchResponse to be able to test our own results
        if (mySearchResponse) {
          deferedResult.resolve(mySearchResponse);
        } else {
          deferedResult.resolve(searchResponse);
        }
        // kibi: end
        deferedResult = $q.defer();
      },
      onResults: function () {
        // Up to the test to resolve this manually
        // For example:
        // someHandler.resolve(require('fixtures/search_response'))
        return deferedResult.promise;
      },
      onError: function () { return $q.defer().promise; },
      _flatten: function () {
        return Promise.resolve({ index: indexPattern, body: {} });
      }
    };

  };
});
