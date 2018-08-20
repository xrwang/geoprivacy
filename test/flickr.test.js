const test = require('tape')
const flickr = require('../flickr.js')


test('page gives list of IDS', function (t) {
  const result = flickr.idGenerator('a')
  const expected = 'testing idGenerator'
  t.ok(result)
  t.deepEqual(result, expected)
  t.end()
});
