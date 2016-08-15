//Get deps
var Discord = require("discord.js");
var fs = require('fs');
var ini = require('ini');
var path = require('path');

//One function

function writeJSON(path, key, value){
  var contents = JSON.parse(fs.readFileSync(path));

  contents[key] = value;

  fs.writeFile(path, JSON.stringify(contents, null, 2), function (err) {
      if (err) return console.log(err);
  });
}

module.exports.writeJSON = writeJSON;
