var Discord = require("discord.js");
var fs = require('fs');
var ini = require('ini');
var path = require('path');

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

//Function to call when stopping server
function stop(){
  bot.logout();
  process.exit(0);
}

//Logger
function log(userid, user, content) {
  console.log(userid + "(" + user + ")" + " - " + content);
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
          bot.reply(message, "You don't have an account right now, please join the economy by doing !join");
          log(message.author.id, message.author.username, message.content);
        }
      });
    }
    if(message.content == prefix + "help"){ //Get commands
      bot.reply(message, "``Commands:\n" + prefix + "ping" + " - Pings the bot to verify it's working\n" + prefix + "icon" + " - Shows the icon that was set int he bot's files.\n" + prefix + "join" + " - Join the server's economy\n" + prefix + moneyNamePlural + " - Check how many " + moneyNamePlural + " you have.``");
      log(message.author.id, message.author.username, message.content);
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

console.log("...Settings...\n");
console.log("..Money Settings..");
console.log("Prefix: " + prefix);
console.log("Automatic Money Interval: " + autoMoneyInterval);
console.log("Automatc Money Ammount: " + autoMoney + "\n");

console.log("^^^End of Settings^^^\n");
bot.loginWithToken(token);
