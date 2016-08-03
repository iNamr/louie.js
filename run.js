var Discord = require("discord.js");
var fs = require('fs')
  , ini = require('ini')

var config = ini.parse(fs.readFileSync('./config/settings.ini', 'utf-8'))

var bot = new Discord.Client();

//Config files
var token = config.Bot.tokens

bot.on("ready", () => {
	console.log(`Ready to begin! Serving in ${bot.channels.length} channels`);
});

bot.on("disconnected", () => {

	console.log("Disconnected!");
	process.exit(1); //exit node.js with an error

});
