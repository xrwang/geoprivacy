const a = require('./data/page1.json');
const b = require('./data/page2.json');
const c = require('./data/page3.json');
const d = require('./data/page4.json');
const e = require('./data/page5.json');
const f = require('./data/page6.json');
const g = require('./data/page7.json');
const h = require('./data/page8.json');
const i = require('./data/page9.json');
const j = require('./data/page10.json');
const fs = require('fs');
const total = require('./data/allPhotosGeo');
const allPhotos = Object.assign(a,b,c,d,e,f,g,h,i,j)
const util = require('./util.js');
const stringify = require("json-stringify-pretty-compact");


let concatObj = (photoSet) => {
  fs.writeFile('data/allPhotosGeo.json', JSON.stringify(allPhotos), 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }
    console.log("The file was saved!");
  });
}




console.log('number of photos out of 1000 that have geolocated tags'+ Object.keys(total).length);


let findTags = (geoTaggedPhotoList) => {
  let allTagsArray = [];
  let tagInfoJSON = {};

  for (let [k,v] of Object.entries(geoTaggedPhotoList)) {

    let contentTagJumble = v.filter((el) => {
      return Object.keys(el)[0] === "contentTag"
    });
    let contentTagJumbleValues = Object.values(contentTagJumble[0])[0];
    let contentTagNoKey = contentTagJumbleValues.filter((el) => {
      if (el.raw.length > 0) {
        allTagsArray.push(el.raw);
      }
      return el.raw.length > 0;
    })

    tagInfoJSON[k] = contentTagNoKey
  }
  tagInfoJSON['allTags'] = allTagsArray;
  util.fileWrite(tagInfoJSON,'data/tagInfoMostRecentGeo.json')
}

findTags(total)
