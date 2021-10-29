const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction, client) {
		await interaction.deferReply();
		const reply = await interaction.editReply("Pinging...");
		await interaction.editReply(`:white_check_mark: It's sunny, I'm here, pong! \n API Latency is ${Math.round(client.ws.ping)}ms \n SlashCommand Latency is ${reply.createdTimestamp - interaction.createdTimestamp} ms.`);
	},
};