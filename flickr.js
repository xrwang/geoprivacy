const FLICKR_TOKEN = process.env.FLICKR_TOKEN;
const request = require('request');
const stringify = require('json-stringify-pretty-compact');
const fs = require('fs');
//function to get all the photos
//exif

let recent = new Promise ((resolve, reject) => {
      request('https://api.flickr.com/services/rest/?method='+'flickr.photos.getRecent'+'&format=json&add nojsoncallback=?&page=10&api+key='+FLICKR_TOKEN, function (error, response, body) {
      if (error) reject(error);
      if (response.statusCode != 200) {
        reject('Invalid status code <' + response.statusCode + '>');
      }
      resolve(body);
    });
});

recent.then((body) => {
  let page = JSON.parse(JSON.parse(jsonFlickrApi(body)));
  let listToSniff = idGenerator(page);
  return(listToSniff)
}).then((list) => {
  getPhotosForLocation(list)
});


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
  let totalPages = page.total;
  let listOfIds = photosList.map(x => x.id);
  return (listOfIds);
}


let getPhotosForLocation = (photoID) => {
  let z = photoID.map(id => getPhotoLocation(id))
  Promise.all(z).then(function(results) {
    console.log(results)
  })
}

let getPhotoLocation = (id) => {
  return new Promise ((resolve, reject) => {
    request('https://api.flickr.com/services/rest/?method='+'flickr.photos.getExif'+'&format=json&add nojsoncallback=?&photo_id='+id+'page=10&api+key='+FLICKR_TOKEN, function (error, response, body) {
      // console.log('error:', error); // Print the error if one occurred
      // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      // console.log(body)
      if (error) reject (error);
      if (response.statusCode != 200) {
        reject('Invalid status code <' + response.statusCode + '>');
      }
      resolve(body);
    });
  });
}
