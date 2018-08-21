const test = require('tape')
const flickr = require('../flickr.js')
const testLocationResults = require('../test/arrayOfExifData');
const expectedExifLocationList = require('../test/expectedEXIFLocationOnly');

test('an input long list of photos gives only photos that have GPS exif data', function (t) {
  const result = flickr.filterArrayForExifOnly(testLocationResults)
  const expected = expectedExifLocationList;
  t.ok(result)
  t.deepEqual(result, expected)
  t.end()
});
