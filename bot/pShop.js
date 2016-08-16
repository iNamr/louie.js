const Discord = require("discord.js");
const fs = require('fs-extra');
const ini = require('ini');
const path = require('path');
const uuid = require('uuid');

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
      console.log(name + "x" + jsonContent.amount + " found for " + jsonContent.price + " " + moneyNamePlural + ". " + "UUID: " + entry.slice(0, -5));
    };
  });
}

//getItems("Gold")

function createListing(item, userid, price, amount){
  var name = uuid.v4();

  fs.createReadStream(__dirname + '/../economy/pData/shop/shop.json').pipe(fs.createWriteStream(__dirname + '/../economy/pData/shop/newShop.json'));
}

createListing()
