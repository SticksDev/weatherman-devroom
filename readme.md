# Setup
1. Rename config.example.json to config.json
2. Add your bot token, clientid, and guild id to config.json
 - **note**: please **ensure** the guildid is the **testing** sever, as slash commands will reload **only** on that server.json. All orther severs the bot is in will have to wait 1 hour for slash commands to push.
3. Copy the ID of the channel you'd like weatherbot to send messages in. Put that in the feedchannel of config.json
4. After you have finished with config.json, run npm run installdeps to install the dependencies of this project.
5. Finally, you can start the bot with node .

Enjoy weatherbot :)

Created for devroom trial, sticks#6436

Credits: 

Maiky#0001 - helping me fix the `setTimeout()` error.