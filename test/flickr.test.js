const test = require('tape')
const flickr = require('../flickr.js')
const testLocationResults = require('../test/fixtures/arrayOfExifData');
const expectedExifLocationList = require('../test/fixtures/expectedEXIFLocationOnly');
const photoListWithGPSCamera = require('../test/fixtures/photoListWithGPSCamera');
const photoListWithGPSCameraTags = require('../test/fixtures/photoListWithGPSCameraTags');
const photoArrayFlickrSearch =
require('../test/fixtures/photoArrayFlickrSearch');
const photoArrayFlickrSearchGeo =
require('../test/fixtures/photoArrayFlickrSearchGeolocated');
const path = require('path');
const properGeojson = require('../test/fixtures/formattedGeojsonFromTwoArrays');

// test('an input long list of photos gives only photos that have GPS exif data', function (t) {
//   const result = flickr.filterArrayForExifOnly(testLocationResults)
//   const expected = expectedExifLocationList;
//   t.ok(result)
//   t.deepEqual(result, expected)
//   t.end()
// });
//
// test('an input list of photos with GPS and Camera data gets tags appended to it', function (t) {
//   const result = flickr.getTagsForEachGeoPhoto(photoListWithGPSCamera).then((result) => {
//     const expected = photoListWithGPSCameraTags;
//     t.ok(result);
//     t.deepEqual(result, expected);
//     t.end();
//   });
// });
//
// test('flickr search works for tag and date', function (t) {
//   let now = new Date();
//   let oneYearAgo = new Date().setMonth(now.getMonth()-1);
//   let perpage = 100;
//   const result = flickr.flickrSearch('xxyyzz', '1', '1', oneYearAgo, perpage).then((result) => {
//     let expected = '{"photos":{"page":1,"pages":1,"perpage":100,"total":"2","photo":[{"id":"11478015966","owner":"45726467@N02","secret":"97d7c154f2","server":"7411","farm":8,"title":"BURTONS P703LCF CAMBRIDGE XXYYZZ","ispublic":1,"isfriend":0,"isfamily":0},{"id":"5820755329","owner":"98019953@N00","secret":"36c6805c37","server":"2737","farm":3,"title":"Western Hills","ispublic":1,"isfriend":0,"isfamily":0}]},"stat":"ok"}';
//     t.deepEqual(result, expected);
//     t.ok(result);
//     t.end();
//   });
// });
//
//
// test('flickr gets geolocation given a photoID', function (t) {
//   const result = flickr.getGeoLocationOnly('30058652768').then((result) => {
//     let expected = '{"photo":{"id":"30058652768","location":{"latitude":"-28.107842","longitude":"32.066675","accuracy":"16","context":"0","locality":{"_content":"Mtubatuba","place_id":"oEUKAidQV7IEdNis","woeid":"1585540"},"county":{"_content":"Umkhanyakude","place_id":"zlkjiCxUVLtq_f6NQQ","woeid":"56189428"},"region":{"_content":"Kwazulu Natal","place_id":"Kua21qNTUb7lREza","woeid":"2346982"},"country":{"_content":"South Africa","place_id":"_0F0zO5TUb6ddnb9qQ","woeid":"23424942"},"place_id":"oEUKAidQV7IEdNis","woeid":"1585540"}},"stat":"ok"}'
//     t.deepEqual(result, expected);
//     t.ok(result);
//     t.end();
//   });
// });
//
// test('gets geolocation for an array of photos, returns an array', function (t) {
//   const result = flickr.getGeolocationForArray(photoArrayFlickrSearch[0]).then ((result) => {
//     let expected = photoArrayFlickrSearchGeo;
//     t.deepEqual(result, expected)
//     t.ok(result);
//     t.end();
//   });
// });
//
// test('fs read file actually reads file', function (t) {
//   const result =
//   flickr.fileRead(path.join(__dirname,'fixtures/photoArrayFlickrSearch.json'));
//     t.ok(result);
//     t.end();
// });


test('geojsonify JSON data', function (t) {
    let a = path.join(__dirname,'fixtures/photoArrayFlickrSearch.json')
    let b = path.join(__dirname,'fixtures/photoArrayFlickrSearchGeolocated.json')
    const result = flickr.toGeojson(a,b);
    const expected = properGeojson;
    console.log(result)
    t.deepEqual(result, expected);
    t.ok(result);
    t.end();
});
