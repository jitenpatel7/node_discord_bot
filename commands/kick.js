module.exports = {
	name: 'kick',
	description: 'Kick a user, destroy a friendship!',
	execute(message, args) {
		if (!message.mentions.users.size) {
			return message.reply('You need to tag a user in order to kick them!');
		}
		const taggedUser = message.mentions.users.first();

		return message.channel.send(`We're a friendly bunch ${message.author.username}, but don't expect any Christmas cards from ${taggedUser.username} this year`);
	},
};
