var Discord = require("discord.js");
var fs = require('fs');
var ini = require('ini');
var path = require('path');

var config = ini.parse(fs.readFileSync('./config/settings.ini', 'utf-8'))

var bot = new Discord.Client();

//Config files
var token = config.Bot.token
var prefix = config.Bot.prefix

function stop(){
  bot.logout();
  process.exit(0);
}

bot.on("ready", () => {
	console.log(`Ready to begin! Serving in ${bot.channels.length} channels`);
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
});

setInterval(function() {
  var users = fs.readdirSync('./users')
  var numUsers = users.length
  console.log('Paying money');
  users.forEach(function(entry) {
    console.log(entry);
    var fileName = './users/'entry;
    var file = require(fileName);

    file.money += 5;

    fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
    if (err) return console.log(err);
      console.log(JSON.stringify(file));
      console.log('writing to ' + fileName);
    });
  });
}, 5000)

bot.loginWithToken(token);
