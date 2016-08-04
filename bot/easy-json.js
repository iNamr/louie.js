//Get deps
var Discord = require("discord.js");
var fs = require('fs');
var ini = require('ini');
var path = require('path');

//One function

function writeJSON(path, key, value){
  var contents = fs.readFileSync(path);
  var jsonContent = JSON.parse(contents);

  var fileName = path;
  var file = require(fileName);

  file[key] = value;

  fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
  if (err) return console.log(err);
  });
}

module.exports.writeJSON = writeJSON;
