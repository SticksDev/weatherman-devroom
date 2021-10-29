require('dotenv').config()
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const config = require('./config.json');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const logger = require("./util/logger.js");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });


const commands = [];
client.commands = new Collection();
client.config = config;
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
	commands.push(command.data.toJSON());
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		 client.on(event.name, (...args) => event.execute(...args, client));
	}
}

const rest = new REST({ version: '9' }).setToken(config.token);

(async () => {
	try {
		logger.log('Started refreshing application (/) on dev server.');

		await rest.put(
			Routes.applicationGuildCommands(config.clientid, config.guildid),
			{ body: commands },
		);

		logger.log('Successfully reloaded application (/) commands on dev server.');
	} catch (error) {
		logger.log(error, "error");
	}
})();

(async () => {
	try {
		logger.log('Started refreshing application (/) globaly.');

		await rest.put(
			Routes.applicationCommands(config.clientid),
			{ body: commands },
		);

		logger.log('Successfully reloaded application (/) commands globally. This will take an hour to push to all servers.');
	} catch (error) {
		logger.log(error, "warn");
	}
})();

client.login(config.token);