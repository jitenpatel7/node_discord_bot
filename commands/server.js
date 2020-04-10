module.exports = {
	name: 'server',
	description: 'Display Server Information',
	execute(message, args) {
		message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
	},
};