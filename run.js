var Discord = require("discord.js");
var fs = require('fs');
var ini = require('ini');
var path = require('path');

var config = ini.parse(fs.readFileSync('./config/settings.ini', 'utf-8'))

var bot = new Discord.Client({forceFetchMembers: true})

//Config files
var token = config.Bot.token
var prefix = config.Bot.prefix
var autoMoney = config.Money.autoMoney
var autoMoneyInterval = config.Money.autoMoneyInterval * 1000;

function stop(){
  bot.logout();
  process.exit(0);
}

bot.on("ready", () => {
	console.log(`Connected! Serving in ${bot.channels.length} channels.`);
});

bot.on("disconnected", () => {

	console.log("Disconnected!");
	process.exit(1); //exit node.js with an error

});

bot.on("message", function(message) {
    if(message.content === prefix + "ping") {
        bot.reply(message, "Pong!");
        console.log("Ping from: " + message.author.username);
    }
    if(message.content === prefix + "disconnect") {
        bot.reply(message, "Cya later");
        console.log("Bot shutdown by: " + message.author.username);
        setTimeout(stop, 2500)
    }
    if(message.content === prefix + "icon"){
      console.log("Icon request by: " + message.author.username);
      bot.sendFile(message, "./images/icon.png", "icon.png", (err, sentMessage) => {
        if(err)
          console.log("Couldn't send icon: ", err);
      });
    }
    if(message.content === prefix + "join"){
      fs.exists('./users/' + message.author.id + '.json', function(exists) {
        if (exists) {
          console.log(message.author.username + " tried to join the economy, but it already in it.");
          bot.reply(message, "You are already in the economy!");
        } else {
          console.log(message.author.username + " has joined the economy!");
          fs.createReadStream('./users/temp.json').pipe(fs.createWriteStream('./users/' + message.author.id + '.json'));
          bot.reply(message, "Welcome to the economy of this server!");
        }
      });
    }
    if(message.content == prefix + "money"){
      fs.exists('./users/' + message.author.id + '.json', function(exists) {
        if (exists) {
          var contents = fs.readFileSync("./users/" + message.author.id + ".json");
          var jsonContent = JSON.parse(contents);
          bot.reply(message, "Your money: " + jsonContent.money);
        } else {
          bot.reply(message, "You don't have an account right now, please join the economy by doing !join");
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

console.log("...Settings...\n");
console.log("..Money Settings..");
console.log("Prefix: " + prefix);
console.log("Automatic Money Interval: " + autoMoneyInterval);
console.log("Automatc Money Ammount: " + autoMoney);

console.log("Logging into bot with token");
bot.loginWithToken(token);
