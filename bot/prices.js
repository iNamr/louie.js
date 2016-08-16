//Get deps
const Discord = require("discord.js");
const fs = require('fs');
const ini = require('ini');
const path = require('path');

//Parse config
var config = ini.parse(fs.readFileSync('./config/settings.ini', 'utf-8'))

//Set config data

//P2P
var playerEnabled = config.Shop.playerEnabled
var pGold = config.Shop.pGold
var pSilver = config.Shop.pSilver
var pBronze = config.Shop.pBronze
var pSteel = config.Shop.pSteel

//S2P
var serverEnabled = config.Shop.serverEnabled
var sGold = config.Shop.sGold
var sSilver = config.Shop.sSilver
var sBronze = config.Shop.sBronze
var sSteel = config.Shop.sSteel

//Flux
var gMin = config.Shop.gMin
var gMax = config.Shop.gMax
var sMin = config.Shop.sMin
var sMax = config.Shop.sMax
var bMin = config.Shop.bMin
var bMax = config.Shop.bMax
var bMin = config.Shop.bMin
var tMin = config.Shop.tMin
var tMax = config.Shop.tMax

//Functions
function randNum(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function fluxPrices(){
  ej.writeJSON(__dirname + '/../economy/gData/prices.json', 'gold', randNum(gMin, gMax));
  setTimeout(function() {ej.writeJSON(__dirname + '/../economy/gData/prices.json', 'silver', randNum(sMin, sMax));}, 1000)
  setTimeout(function() {ej.writeJSON(__dirname + '/../economy/gData/prices.json', 'bronze', randNum(bMin,bMax));}, 2000)
  setTimeout(function() {ej.writeJSON(__dirname + '/../economy/gData/prices.json', 'steel', randNum(tMin,tMax));}, 3000)
}


module.exports.fluxPrices = fluxPrices;
