const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('quick.db')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('addphrase')
		.setDescription('Adds a phrase to the weather emebed')
		.addStringOption( option => {
			option.setName("phrase")
				.setDescription("The phrase you'd like to add.")
				.setRequired(true)
			return option;
		}),
	async execute(interaction, client) {
		await interaction.deferReply();
		let phrase = interaction.options.get("phrase").value
		db.push("messages.funny", phrase + ` - ${interaction.member.user.tag}`)
		interaction.editReply(`:white_check_mark: phrase ${phrase} was added!`)
	},
};