const FLICKR_TOKEN = process.env.FLICKR_TOKEN;
const request = require('request');
const stringify = require('json-stringify-pretty-compact');
const fs = require('fs');
//function to get all the photos
//exif
const path = require('path');
const GeoJSON = require('geojson');

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
let flickrSearch = (stringToSearch, page, hasGeo, maxDate, perpage) => {
  //maxDate parameter so that it's not all the photos, ever
  return new Promise ((resolve, reject) => {
    request('https://api.flickr.com/services/rest/?method='+'flickr.photos.search'+'&text='+ stringToSearch + '&page=' + page + '&max_taken_date=' + + maxDate + '&has_geo='+hasGeo+ '&per_page='+perpage+'&format=json&nojsoncallback=1&api+key='+FLICKR_TOKEN, function (error, response, body) {
      if (error) reject (error);
      if (response.statusCode != 200) {
        reject('Invalid status code <' + response.statusCode + '>');
      }
      resolve(body);
    });
  });
}

let flickrPager = (firstPageData, stringToSearch, oneYearAgo) => {
  let pageData = JSON.parse(firstPageData);
  let totalPages = pageData.photos.pages;
  let total = pageData.photos.total;


  let n = pageData.photos.pages;
  let arrayToIterate = Array.apply(null, {length: n}).map(Number.call, Number);
  let gatheredPhotoArray = [];
  let promiseArray = [];

  arrayToIterate.forEach((e) => {
    let promise = flickrSearch(stringToSearch, e, 1, oneYearAgo).then((result) => {
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
  let listOfIds = photosList.map(x => x.id);
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


//https://api.flickr.com/services/rest/?method=flickr.photos.geo.getLocation&api_key=47d16e3380d4aa938672c6037576f933&photo_id=30058652768&format=json&nojsoncallback=1&auth_token=72157672759073858-6dae54003424ed0a&api_sig=a5d25c144db7f4060549df457c7438c2

let getGeoLocationOnly = (photoID) => {
  return new Promise ((resolve, reject) => {
        request('https://api.flickr.com/services/rest/?method='+'flickr.photos.geo.getLocation&photo_id=' + photoID + '&format=json&nojsoncallback=1'+'&api+key='+FLICKR_TOKEN, function (error, response, body) {
        if (error) reject(error);
        // console.log(response.statusCode)
        if (response.statusCode && response.statusCode != 200) {
          reject('Invalid status code <' + response.statusCode + '>');
        }
        resolve(body);
      });
  });
}

let getGeolocationForArray = (photoArray) => {
  let promiseArray = [];
  console.log(photoArray.length)
  photoArray.forEach((e) => {
    console.log(e[0])
    if (e[0] && e[0].id) {
      let promise = getGeoLocationOnly(e[0].id).then((result) => {
        console.log(result)
        return JSON.parse(result);
      })
      .catch('broken');
      promiseArray.push(promise)
    }
  });
  return Promise.all(promiseArray);
}


let fileWrite = (dataToWrite, filename) => {
  fs.writeFile(filename, JSON.stringify(dataToWrite), 'utf8', function (err) {
  if (err) {
      return console.log(err);
  }
  console.log("The file was saved!");
  });
}

let fileRead = (dataToRead) => {
  let data = fs.readFileSync(dataToRead,'utf8');
  return JSON.parse(data);
}


//read in a freeTextSearch array of geolocated results
//read in the original free text search array
//make a geojson file
//3. build a geojson file
//geojson parse uses:
// { name: 'Location A', category: 'Store', street: 'Market', lat: 39.984, lng: -75.343 },

let toGeojson = (searchResultsArray, searchResultsGeolocatedArray) => {
  let arrayWithTitle = fileRead(searchResultsArray);
  let arrayWithGeo = fileRead(searchResultsGeolocatedArray);
  let formattedGeoData = [];
  let arrayWithTitleFormatted = [];

  arrayWithTitle.forEach((e) => {
    if (e[0] && e[0].id) {
      //error handling above 
      arrayWithTitleFormatted.push(e[0])
    }
  });

  arrayWithGeo.forEach((e) => {
    let idToSearch = e.photo.id;
    let titleInfo = arrayWithTitleFormatted.find(photo => photo.id === idToSearch)
    console.log(titleInfo)

    let flickrURL = 'https://flickr.com/photos/'+titleInfo.owner.toString()+'/'+titleInfo.id.toString()
    let country = e.photo.location.country._content;
    let lat = e.photo.location.latitude;
    let lng = e.photo.location.longitude;
    let title = titleInfo.title;

    let dataObject = {
      'name': title,
      'url': flickrURL,
      'country': country,
      'lat': lat,
      'lng': lng
    }
    formattedGeoData.push(dataObject)
  });
  //formattedGeoData is now a long array that we can use geojson on.
  let geoJSONFile = GeoJSON.parse(formattedGeoData, {Point: ['lat', 'lng']});
  // console.log(JSON.stringify(geoJSONFile))
  return geoJSONFile;
}


//2. how many of these are in known nature preserves?
//3. get and plot on a map.
//convert file to geojson



module.exports = {
  fileRead,
  fileWrite,
  idGenerator,
  filterArrayForExifOnly,
  getTagsForEachGeoPhoto,
  flickrSearch,
  flickrPager,
  getGeoLocationOnly,
  getGeolocationForArray,
  toGeojson
}
