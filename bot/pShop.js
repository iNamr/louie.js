var Discord = require("discord.js");
var fs = require('fs');
var ini = require('ini');
var path = require('path');
var ej = require('./easy-json');

//Parse config
var config = ini.parse(fs.readFileSync('./config/settings.ini', 'utf-8'))

//Misc
var moneyNamePlural = config.Money.pluralName

//S2P
var serverEnabled = config.Shop.serverEnabled
var sGold = config.Shop.sGold
var sSilver = config.Shop.sSilver
var sBronze = config.Shop.sBronze
var sSteel = config.Shop.sSteel

//Functions
function getItems(name){
  var listings = fs.readdirSync('./economy/pData/shop')
  var numListings = listings.length
  listings.forEach(function(entry) {
    var contents = fs.readFileSync("__dirname + '/../economy/pData/shop/" + entry);
    var jsonContent = JSON.parse(contents);
    if(entry !== "shop.json" && jsonContent.item == name){
      
    };
  });
}

getItems("Gold")
