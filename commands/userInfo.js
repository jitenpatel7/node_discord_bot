module.exports = {
	name: 'user-info',
	description: 'Display User Information',
	execute(message, args) {
		message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
	},
};
