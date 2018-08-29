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
let oneYearAgo = new Date().setFullYear(now.getFullYear()-1);

// flickr.flickrSearch('tiger', 1, 1, oneYearAgo, 500).then((result) => {
//   return flickr.flickrPager(result, 'tiger', oneYearAgo);
// }).then((result) => {
//   flickr.fileWrite(result, 'data/freetextSearchListFulltigers.json')
// })
// .catch('broken');


//2. read in, get the ID of the photo, build geolocation file
// let photoArrayFromSearchResults = flickr.fileRead(path.join(__dirname,'data/freetextSearchListFulltigers.json'));
// flickr.getGeolocationForArray(photoArrayFromSearchResults).then((result) => {
//   flickr.fileWrite(result, 'data/freetextSearchListFullGeolocatedTigers.json')
// })
// .catch('broken');

let a = path.join(__dirname,'data/freetextSearchListFulltigers.json')
let b = path.join(__dirname,'data/freetextSearchListFullGeolocatedTigers.json')

let c = flickr.toGeojson(a, b);
flickr.fileWrite(c, 'data/geojson-of-tigers.json')
