
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

// let now = new Date();
// let oneYearAgo = new Date().setFullYear(now.getFullYear()-1);
//
// flickrSearch('rhino', 1, 1, oneYearAgo, 500).then((result) => {
//   return flickrPager(result);
// }).then((result) => {
//   fileWrite(result, 'data/freetextSearchListFull.json')
// })
// .catch('broken');


//2. read in, get the ID of the photo, build geolocation file
// let photoArrayFromSearchResults = fileRead(path.join(__dirname,'data/freetextSearchList.json'));
// getGeolocationForArray(photoArrayFromSearchResults[0]).then((result) => {
//   fileWrite(result, 'data/freetextSearchListFullGeolocated.json')
// })
// .catch('broken');
