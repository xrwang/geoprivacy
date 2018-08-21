const test = require('tape')
const flickr = require('../flickr.js')
const testLocationResults = require('../test/arrayOfExifData');
const expectedExifLocationList = require('../test/expectedEXIFLocationOnly');
const photoListWithGPSCamera = require('../test/photoListWithGPSCamera');
const photoListWithGPSCameraTags = require('../test/photoListWithGPSCameraTags');

test('an input long list of photos gives only photos that have GPS exif data', function (t) {
  const result = flickr.filterArrayForExifOnly(testLocationResults)
  const expected = expectedExifLocationList;
  t.ok(result)
  t.deepEqual(result, expected)
  t.end()
});

test('an input list of photos with GPS and Camera data gets tags appended to it', function (t) {
  const result = flickr.getTagsForEachGeoPhoto(photoListWithGPSCamera).then((result) => {
    const expected = photoListWithGPSCameraTags;
    t.ok(result);
    t.deepEqual(result, expected);
    t.end();
  });
});
