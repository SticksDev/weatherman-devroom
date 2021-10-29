let state;
const discord = require('discord.js')
const db = require('quick.db')
const axios = require('axios')
const logger = require("../util/logger.js");
module.exports = {
	name: 'ready',
	async execute(interaction, client) {
       console.log(`Ready to serve in ${client.channels.cache.size} channels on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users.`);
       let chan = client.channels.cache.get(client.config.feedchannel)
       let chan2 = client.channels.cache.get("903378442916069436")
       chan.bulkDelete(15)
       let weatherembed = new discord.MessageEmbed()
            .setTitle("Fetching Weather, please wait...")
            .setDescription("What is life, without the weather?")
            .setColor("YELLOW")
        db.set("vote_yes", 0)
        db.set("vote_no", 0)
        chan.send({embeds: [weatherembed]}).then(async (msg) => {
            db.set("msg_id", msg.id)
            axios.get("http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=c1f1a5019615f828cc336e6dd9062471&units=imperial").then(async (res) => {
                switch(res.data.weather[0].main) {
                    case "Clouds":
                        state = "CLOUDY"
                        break
                    case "Clear":
                        state = "SUNNY"
                        break
                    case "Rain":
                        state = "RAINING"
                        break
                    default:
                        state = `Could not determine weather state. \n State from API is: ${res.data.weather[0].main}`
                        break
                }
                db.set("last_state", state)
                let fullweather = new discord.MessageEmbed()
                    .setTitle("Weather in london, uk.")
                    .setDescription(`The current tempture is ${res.data.main.temp}°F, and it feels like ${res.data.main.feels_like}°F \n The current weather state is ${state} \n \n 👍 0 votes (0%) \n \n 👎 0 votes (0%) \n \n Phrase: A new one will be selected in the next update!`)
                    .setColor("GREEN")
                    .setTimestamp()
                    .setFooter("Updates every 2 minutes. | Votes also update every 2 minutes.")
                await msg.edit({embeds: [fullweather]})
                await msg.react("👍")
                await msg.react("👎")
            })
        })
        // create refesh loop 
        setInterval(async () => {
            let msg3 = await chan.messages.fetch(db.get("msg_id"))
            let yesvotes = await db.get("vote_yes")
            let novotes = await db.get("vote_no")
            let ttlvotes = yesvotes + novotes
            axios.get("http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=c1f1a5019615f828cc336e6dd9062471&units=imperial").then(async (res) => {
                 switch(res.data?.weather[0].main) {
                    case "Clouds":
                        state = "CLOUDY"
                        break
                    case "Clear":
                        state = "SUNNY"
                        break
                    case "Rain":
                        state = "RAINING"
                        break
                    default:
                        state = `Could not determine weather state. \n State from API is: ${res.data?.weather[0].main}`
                        break
                } 
                if(db.get("last_state") !== state) {
                    // new state, ping everyone
                    chan.send(`@everyone New weather state: ${state} (old = ${db.get("last_state")}) \n || this message will delete in 2 minutes. ||`).then(msg2 => {
                        setTimeout(() => {
                            msg2.delete()
                        }, 120000)
                    })
                    db.set("last_state", state)
                }
                let randomint = Math.floor(Math.random() * db.get("messages.funny").length)
                let tosend = db.get("messages.funny")[randomint]
                let fullweather = new discord.MessageEmbed()
                    .setTitle("Weather in london, uk.")
                    .setDescription(`The current tempture is ${res.data.main.temp}°F, and it feels like ${res.data.main.feels_like}°F \n The current weather state is ${state} \n \n 👍 ${yesvotes} votes (${yesvotes === 0 ? 0 : Math.floor(yesvotes/ttlvotes * 100)}%) \n \n 👎 ${novotes} votes (${novotes === 0 ? 0 : Math.floor(novotes/ttlvotes * 100)}%) \n \n Phrase: ${tosend}`)
                    .setColor("GREEN")
                    .setTimestamp()
                    .setFooter("Updates every 2 minutes | Votes also update every 2 minutes.")
                await msg3.edit({embeds: [fullweather]})
            })
     }, 120000)
    }
}