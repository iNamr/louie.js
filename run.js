const Discord = require("discord.js");
const fs = require('fs');
const ini = require('ini');
const path = require('path');
const prices = require('./bot/prices');
const ej = require('./bot/easy-json');

//Parse config
var config = ini.parse(fs.readFileSync('./config/settings.ini', 'utf-8'))

// Declare bot
var bot = new Discord.Client({forceFetchMembers: true})

//Config files
var token = config.Bot.token
var prefix = config.Bot.prefix
var autoMoney = config.Money.autoMoney
var autoMoneyInterval = config.Money.autoMoneyInterval * 1000;
var moneyName = config.Money.name
var moneyNamePlural = config.Money.pluralName
var owner = config.Bot.owner
var rankEnable = config.Ranks.enabled
var maxRank = config.Ranks.maxRank
var rankInc = config.Ranks.rankInc
var rankBase = config.Ranks.rankBase

//Function to call when stopping server
function stop(){
  bot.logout();
  process.exit(0);
}

//Logger
function log(userid, user, content) {
  console.log(userid + "(" + user + ")" + " - " + content);
}

//Log purchases to a permanent log
function receipt(userid, user, item, cost) {
  console.log(userid + "(" + user + ")" + " $ " + item + " for " + cost + " " + moneyNamePlural);
}

//Log out a message when bot is ready
bot.on("ready", () => {
	console.log(`Connected! Serving in ${bot.channels.length} channels.`);
});

//Log out a message on bot crash
bot.on("disconnected", () => {

	console.log("Disconnected!");
	process.exit(1); //exit node.js with an error

});

//Declare commands
bot.on("message", function(message) {
    if(message.content === prefix + "ping") { //Ping the bot to verify it's working
        bot.reply(message, "Pong!");
        log(message.author.id, message.author.username, message.content);
    }
    if(message.content === prefix + "disconnect" && message.author.id == owner) { //Shutdown the bot and disconnect it from the server
        bot.reply(message, "Cya later");
        log(message.author.id, message.author.username, message.content);
        setTimeout(stop, 2500)
    } else{
      if(message.content === prefix + "disconnect"){
        bot.reply(message, "You can't do that!");
        log(message.author.id, message.author.username, message.content);
      }
    }
    if(message.content === prefix + "icon"){ //Fetch LouieK22's beutiful icon, or whatever icon.png is set to
      log(message.author.id, message.author.username, message.content);
      bot.sendFile(message, "./images/icon.png", "icon.png", (err, sentMessage) => {
        if(err)
          console.log("Couldn't send icon: ", err);
      });
    }
    if(message.content === prefix + "join"){ //Join the economy, creates json file for user
      fs.exists('./users/' + message.author.id + '.json', function(exists) {
        if (exists) {
          bot.reply(message, "You are already in the economy!");
          log(message.author.id, message.author.username, message.content);
        } else {
          fs.createReadStream('./users/temp.json').pipe(fs.createWriteStream('./users/' + message.author.id + '.json'));
          bot.reply(message, "Welcome to the economy of this server!");
          log(message.author.id, message.author.username, message.content);
        }
      });
    }
    if(message.content == prefix + moneyNamePlural){ //Check money
      fs.exists('./users/' + message.author.id + '.json', function(exists) {
        if (exists) {
          var contents = fs.readFileSync("./users/" + message.author.id + ".json");
          var jsonContent = JSON.parse(contents);
          bot.reply(message, "Your " + moneyNamePlural + ": " + jsonContent.money);
          log(message.author.id, message.author.username, message.content);
        } else {
          bot.reply(message, "You don't have an account right now, please join the economy by doing " + prefix + "join");
          log(message.author.id, message.author.username, message.content);
        }
      });
    }
    if(message.content == prefix + "help"){ //Get commands
      bot.reply(message, "``Commands:\n" + prefix + "ping" + " - Pings the bot to verify it's working\n" + prefix + "icon" + " - Shows the icon that was set in the bot's files.\n" + prefix + "join" + " - Join the server's economy\n" + prefix + moneyNamePlural + " - Check how many " + moneyNamePlural + " you have.\n" + prefix + "shop" + " - Shop for goodies, corrently not implemented\n" + prefix + "buy" + " - Buy an item directly by name\n" + prefix + "rank" + " - Check your current rank\n" + prefix + "rankup" + " - spend some of your " + moneyNamePlural + " to rank up on MoneyBot, this does NOT effect Mee6 Bot.``");
      log(message.author.id, message.author.username, message.content);
    }
    if(message.content.startsWith(prefix + "buy ")){
      var item = message.content.slice(5)
      bot.reply(message, "Buy is currently disabled, but thanks for trying! You tried to buy: " + item);
      log(message.author.id, message.author.username, message.content);
    }
    if(message.content.startsWith(prefix + "shop")){
      bot.reply(message, "Shop is currently disabled, but thanks for trying!");
      log(message.author.id, message.author.username, message.content);
    }
    if(message.content == prefix + "rankup" && rankEnable == true){
      fs.exists('./users/' + message.author.id + '.json', function(exists) {
        if (exists) {
          var contents = fs.readFileSync("./users/" + message.author.id + ".json");
          var jsonContent = JSON.parse(contents);

          if(jsonContent.rank == 0){
            if(jsonContent.money >= rankBase){
              var file = require("./users/" + message.author.id + ".json");

              file.rank += 1;
              file.money -= rankBase;

              fs.writeFile("./users/" + message.author.id + ".json", JSON.stringify(file, null, 2), function (err) {
              if (err) return console.log(err);
              });

              receipt(message.author.id, message.author.username, "Rankup-Level: " + file.rank, 10)
              bot.reply(message, "You have ranked up to rank: " + file.rank);
            } else {
              bot.reply(message, "You do not have enough money to rank up(Your Money: " + jsonContent.money + "; Rankup cost: 10)");
              log(message.author.id, message.author.username, message.content);
            }
          } else {
            var nextRank = jsonContent.rank + 1;
            var nextRankCost = nextRank * rankBase * rankInc
            if(jsonContent.money >= nextRankCost){
              var file = require("./users/" + message.author.id + ".json");

              file.rank += 1;
              file.money -= nextRankCost;

              fs.writeFile("./users/" + message.author.id + ".json", JSON.stringify(file, null, 2), function (err) {
              if (err) return console.log(err);
              });

              receipt(message.author.id, message.author.username, "Rankup-Level: " + file.rank, nextRankCost)
              bot.reply(message, "You have ranked up to rank: " + file.rank);
            } else {
              bot.reply(message, "You do not have enough money to rank up(Your Money: " + jsonContent.money + "; Rankup cost: " + nextRankCost + ")");
              log(message.author.id, message.author.username, message.content);
            }
          }
        } else {
          if(rankEnable == true) {
            bot.reply(message, "You don't have an account right now, please join the economy by doing " + prefix + "join");
            log(message.author.id, message.author.username, message.content);
          }
        }
      });
    }
    if(message.content == prefix + "rank"){ //Check money
      fs.exists('./users/' + message.author.id + '.json', function(exists) {
        if (exists) {
          var contents = fs.readFileSync("./users/" + message.author.id + ".json");
          var jsonContent = JSON.parse(contents);
          var nextRank = jsonContent.rank + 1;
          if(jsonContent.rank == 0){
            bot.reply(message, "Your rank: " + jsonContent.rank + "\n" + "The cost to rank up is: 10");
            log(message.author.id, message.author.username, message.content);
          } else {
            var nextRankCost = nextRank * rankBase * rankInc
            bot.reply(message, "Your rank: " + jsonContent.rank + "\n" + "The cost to rank up is: " + nextRankCost);
            log(message.author.id, message.author.username, message.content);
          }
        } else {
          bot.reply(message, "You don't have an account right now, please join the economy by doing " + prefix + "join");
          log(message.author.id, message.author.username, message.content);
        }
      });
    }
});

setInterval(function() {
  var users = fs.readdirSync('./users')
  var numUsers = users.length
  console.log('Paying money');
  users.forEach(function(entry) {
    var userid = entry.slice(0, -5)
    if(entry !== "temp.json" && bot.users.get(userid).status !== "offline"){
      var fileName = './users/' + entry;
      var file = require(fileName);

      file.money += Number(autoMoney);

      fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
      if (err) return console.log(err);
      });
    };
  });
}, autoMoneyInterval)

setInterval(function() {
  console.log("Price change!");
  prices.fluxPrices();
}, 600000)

console.log("...Settings...\n");
console.log("..Money Settings..");
console.log("Prefix: " + prefix);
console.log("Automatic Money Interval: " + autoMoneyInterval);
console.log("Automatc Money Ammount: " + autoMoney + "\n");

console.log("^^^End of Settings^^^\n");

//bot.loginWithToken(token);
