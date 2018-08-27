const FLICKR_TOKEN = process.env.FLICKR_TOKEN;
const request = require('request');
const stringify = require('json-stringify-pretty-compact');
const fs = require('fs');
//function to get all the photos
//exif
const locationResultsList = [];


const jsonFlickrApi = (jsonp) => {
  let b = eval(jsonp);
  //response of flickr api is in jsonp
  //need to run eval in order to make jsonp into json
  // let photoArrayRegex = /\[(.*?)\]/g;
  // c = photoArrayRegex.exec(b);
  let c = JSON.stringify(b);
  // console.log(c)
  return (c)
}

// https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=e0c7a0061d4d27fdcaa6bf5211b4359a&text=rhino&has_geo=1&page=&format=json&nojsoncallback=1&auth_token=72157697407099972-2e84e6652a37135a&api_sig=a7c931610055835ecc8703d0619e359d
//0 is no geo
//1 is has geo
let flickrSearch = (stringToSearch, page, hasGeo, maxDate) => {
  //maxDate parameter so that it's not all the photos, ever
  return new Promise ((resolve, reject) => {
    request('https://api.flickr.com/services/rest/?method='+'flickr.photos.search'+'&text='+ stringToSearch + '&page=' + page + '&max_taken_date=' + + maxDate + '&has_geo='+hasGeo+ '&per_page=500&format=json&nojsoncallback=1&api+key='+FLICKR_TOKEN, function (error, response, body) {
      if (error) reject (error);
      if (response.statusCode != 200) {
        reject('Invalid status code <' + response.statusCode + '>');
      }
      resolve(body);
    });
  });
}

//take the result of flickrSearch,
//look at number of pages
// make an array with 1/2 of that
// get photo object and put into one big array so taht it's
// [{infophoto2}, {infophoto2}]
let flickrPager = (firstPageData) => {
  //page is which page you are on
  //pages is total pages
  //total is total number of photographs
  //it's 500 per page
  let pageData = JSON.parse(firstPageData);
  let totalPages = pageData.photos.pages;
  let total = pageData.photos.total;


  let n = pageData.photos.pages;
  let arrayToIterate = Array.apply(null, {length: n}).map(Number.call, Number);
  let gatheredPhotoArray = [];
  let promiseArray = [];

  arrayToIterate.forEach((e) => {
    let promise = flickrSearch('rhino', e, 1, oneYearAgo).then((result) => {
      let response = JSON.parse(result);
      let photoArray = response.photos.photo;
      console.log('batch' + e)
      return photoArray;
    })
    .catch('broken');
    promiseArray.push(promise);
  })
  return Promise.all(promiseArray);
}


let idGenerator = (page) => {
  let photosList = page.photos.photo;
  let totalPhotos = page.photos.total;
  let totalOnOnePage = page.photos.perpage;
  //Total On One page should be equal to listOfIds.length
  let listOfIds = photosList.map(x => x.id);
  // console.log(listOfIds.length)
  // console.log(totalOnOnePage)
  // console.log(totalPhotos);
  // console.log(page)
  // console.log('how many photos' + photosList.length)
  return (listOfIds);
}


let getPhotosForLocation = (photoID) => {
  let empty = [];
  let z = photoID.map(id => getPhotoLocation(id))
  return Promise.all(z)
    .then(function(result) {
      let fg = eval(result);
      fg.forEach((e) => {
        let cc = JSON.parse(eval(e));
        empty.push(cc);
      })
      return (empty);
  });
}

let getPhotoLocation = (id) => {
  return new Promise ((resolve, reject) => {
    request('https://api.flickr.com/services/rest/?method='+'flickr.photos.getExif'+'&format=json&add nojsoncallback=?&photo_id='+id+'&api+key='+FLICKR_TOKEN, function (error, response, body) {
      if (error) reject (error);
      // console.log(response)
      if (response.statusCode != 200) {
        reject('Invalid status code <' + response.statusCode + '>');
      }
      resolve(body);
    });
  });
}

let getPhotoTags = (id) => {
  return new Promise ((resolve, reject) => {
    request('https://api.flickr.com/services/rest/?method='+'flickr.tags.getListPhoto'+'&format=json&addnojsoncallback=?&photo_id='+id+'&api+key='+FLICKR_TOKEN, function (error, response, body) {
      if (error) reject (error);
      if (response.statusCode != 200) {
        reject('Invalid status code <' + response.statusCode + '>');
      }
      resolve(body);
    });
  });
}


let getTagsForEachGeoPhoto = (photoExifObject) => {
  let z = Object.keys(photoExifObject).map(id => getPhotoTags(id))
  return Promise.all(z)
    .then(function(result) {
      let fg = eval(result);
      // console.log(result)

      fg.forEach((e) => {
        let cc = JSON.parse(eval(e));
        let tagObject = {
          'contentTag': cc.photo.tags.tag
        }
        photoExifObject[cc.photo.id].push(tagObject)
      })
      return (photoExifObject);
  });
}

let filterArrayForExifOnly = (photoLocationData) => {
  let photos = {};
  photoLocationData.forEach(({ photo }) => {
      if (photo && photo.exif) {
        let photoWithGeoTags = photo.exif.filter((tag) => tag.tagspace === "GPS");
        if (photoWithGeoTags.length > 0) {
          photos[photo.id] = photoWithGeoTags;
          var camera = { 'camera': photo.camera};
          photoWithGeoTags.push(camera);
        }
      }
  });
  return photos;
}

let recent = (numberOfPhotos) => {
  return new Promise ((resolve, reject) => {
        request('https://api.flickr.com/services/rest/?method='+'flickr.photos.getRecent'+'&format=json&addnojsoncallback=?&page='+numberOfPhotos+'&api+key='+FLICKR_TOKEN, function (error, response, body) {
        if (error) reject(error);
        if (response.statusCode != 200) {
          reject('Invalid status code <' + response.statusCode + '>');
        }
        resolve(body);
      });
  });
}


let fileWrite = (dataToWrite, filename) => {
  fs.writeFile(filename, JSON.stringify(dataToWrite), 'utf8', function (err) {
  if (err) {
      return console.log(err);
  }
  console.log("The file was saved!");
  });
}

let getThousandPhotos = (arrayOfPages) => {

}


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


//1. how many total photos as of august 20th for rhino
//2. how many of these are in known nature preserves
//3. get and plot on a map.
let now = new Date();
let oneYearAgo = new Date().setFullYear(now.getFullYear()-1);

flickrSearch('rhino', 1, 1, oneYearAgo).then((result) => {
  return flickrPager(result);
}).then((result) => {
  fileWrite(result, 'data/freetextSearchListFull.json')
})
.catch('broken');


  module.exports = {
  idGenerator,
  filterArrayForExifOnly,
  getTagsForEachGeoPhoto,
  flickrSearch
}
