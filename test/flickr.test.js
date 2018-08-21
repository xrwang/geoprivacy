const test = require('tape')
const flickr = require('../flickr.js')
const testLocationResults = require('../test/arrayOfExifData');

test('page gives list of IDS', function (t) {
  const result = flickr.filterArrayForExifOnly(testLocationResults)
  const expected = 'testing idGenerator'
  // t.ok(result)
  console.log(JSON.stringify(result))
  // t.deepEqual(result, expected)
  t.end()
});
