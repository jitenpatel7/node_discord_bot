/* eslint-disable no-console */
/* eslint-disable consistent-return */
const Discord = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const { prefix } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

client.once('ready', () => {
	console.log('Hello World!');
});

commandFiles.forEach((file) => {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
});


client.on('message', (message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) {
		return message.channel.send(`Hey ${message.author}, ${commandName} is not a valid command. Maybe **!help** may, umm help?`);
	}

	const command = client.commands.get(commandName);

	if (command.args && !args.length) {
		return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
	}

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.channel.send('There was an error trying to execute that command!');
	}
});

client.login(process.env.NAGBOT_TOKEN);
