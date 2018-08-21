const FLICKR_TOKEN = process.env.FLICKR_TOKEN;
const request = require('request');
const stringify = require('json-stringify-pretty-compact');
const fs = require('fs');
//function to get all the photos
//exif
let locationResultsList = [];


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



recent(10).then((body) => {
    let page = JSON.parse(JSON.parse(jsonFlickrApi(body)));
    let listToSniff = idGenerator(page);
    return listToSniff;
  })
  .then((list) => {
    return getPhotosForLocation(list)
  })
  .then((photoLocationData) => {
    return filterArrayForExifOnly(photoLocationData)
    // console.log(JSON.stringify(photoLocationData));
  })
  .then((photoArrayWithLocationData) => {
    return getTagsForEachGeoPhoto(photoArrayWithLocationData)
  })
  .then((photoLocationTags) => {
    fileWrite(photoLocationTags, 'page10.json')
  })
  .catch('broken');

  module.exports = {
  idGenerator,
  filterArrayForExifOnly,
  getTagsForEachGeoPhoto
}
