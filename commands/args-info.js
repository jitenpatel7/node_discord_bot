module.exports = {
	name: 'args-info',
	description: 'Displays Information about Arguments provided',
	execute(message, args) {
		if (!args.length) {
			return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
		}
		else if (args[0] === 'foo') {
			return message.channel.send('bar');
		}

		message.channel.send(`First argument: ${args[0]}`);

		message.channel.send(`Command Name: ${command}\nArguments: ${args}`);
	},
};