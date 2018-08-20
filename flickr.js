const FLICKR_TOKEN = process.env.FLICKR_TOKEN;
const request = require('request');
const stringify = require('json-stringify-pretty-compact');
const fs = require('fs');
//function to get all the photos
//exif
//https://api.flickr.com/services/rest/?method=flickr.photos.geo.getLocation&api_key=cc486d5a638ecbda69e566971f130c71&photo_id=29221680617&format=rest&auth_token=72157670371811857-1ad0f1228e9812e4&api_sig=17e25475777e72bc6c9e8e4a97d139f4
// https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=4b270e1244b2c696d09fc90b54cc23bb&per_page=10&format=json

let pastWeek = new Promise ((resolve, reject) => {
      request('https://api.flickr.com/services/rest/?method='+'flickr.photos.getRecent'+'&format=json&add nojsoncallback=?&page=10&api+key='+FLICKR_TOKEN, function (error, response, body) {
      // console.log('error:', error); // Print the error if one occurred
      // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      // console.log(body)
      if (error) reject(error);
      if (response.statusCode != 200) {
        reject('Invalid status code <' + response.statusCode + '>');
      }
      resolve(body);
    });
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

pastWeek.then((body) => {
  let page = JSON.parse(JSON.parse(jsonFlickrApi(body)));
  idGenerator(page);

});

let idGenerator = (page) => {
  let photosList = page.photos.photo;
  let totalPages = page.total;
  // console.log(typeof(d));
  console.log(photosList)
}
