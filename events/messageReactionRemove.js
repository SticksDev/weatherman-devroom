const db = require('quick.db')
module.exports = {
	name: 'messageReactionRemove',
    async execute(reaction, user) {
        // stupid fetch loop, why discord.js
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                return;
            }
        }
        if(user.bot) return; 
        if(reaction.emoji.name === '👍' && reaction.message.id === db.get("msg_id")) {
            db.subtract("vote_yes", 1)
        } else if (reaction.emoji.name === '👎' && reaction.message.id === db.get("msg_id")) {
            db.subtract("vote_no", 1)
        }
    }
}