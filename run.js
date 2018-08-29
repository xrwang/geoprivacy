const path = require('path');
const flickr = require('./flickr');

//call functions

// recent(2).then((body) => {
//     let page = JSON.parse(JSON.parse(jsonFlickrApi(body)));
//     let listToSniff = idGenerator(page);
//     return listToSniff;
//   })
//   .then((list) => {
//     return getPhotosForLocation(list)
//   })
//   .then((photoLocationData) => {
//     console.log(Object.keys(photoLocationData).length)
//     return filterArrayForExifOnly(photoLocationData)
//     // console.log(JSON.stringify(photoLocationData));
//   })
//   .then((photoArrayWithLocationData) => {
//     return getTagsForEachGeoPhoto(photoArrayWithLocationData)
//   })
//   .then((photoLocationTags) => {
//   })
//   .catch('broken');


//1. gather up the total photos for past year with the word rhino

let now = new Date();
let oneYearAgo = new Date().setMonth(now.getMonth()-6);

// flickr.flickrSearch('elephant', 1, 1, oneYearAgo, 500).then((result) => {
//   return flickr.flickrPager(result, 'elephant', oneYearAgo);
// }).then((result) => {
//   flickr.fileWrite(result, 'data/freetextSearchListFullElephant2.json')
// })
// .catch(function(error) {
//   console.log(error);
// });

//2. read in, get the ID of the photo, build geolocation file
// let photoArrayFromSearchResults = flickr.fileRead(path.join(__dirname,'data/freetextSearchListFullElephant.json'));
// flickr.getGeolocationForArray(photoArrayFromSearchResults).then((result) => {
//   flickr.fileWrite(result, 'data/freetextSearchListFullGeolocatedElephant.json')
// })
// .catch(function(error) {
//   console.log(error);
// });

let a = path.join(__dirname,'data/freetextSearchListFullElephant.json')
let b = path.join(__dirname,'data/freetextSearchListFullGeolocatedElephant.json')

let c = flickr.toGeojson(a, b);
flickr.fileWrite(c, 'data/geojson-of-elephants.json')
