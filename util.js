const fs = require('fs');


let fileWrite = (dataToWrite, filename) => {
  fs.writeFile(filename, JSON.stringify(dataToWrite), 'utf8', function (err) {
  if (err) {
      return console.log(err);
  }
  console.log("The file was saved!");
  });
}


module.exports = {
  fileWrite
}
