const Discord = require('discord.js')
const config = require('./config.js')
const client = new Discord.Client()

client.login(config.token)

client.on('ready', () => {console.log(`${client.user.tag} online`)})

client.ws.on('INTERACTION_CREATE', async inter => {
  
  async function send(content, flag) {
    const apiMessage = await Discord.APIMessage.create(client.channels.resolve(inter.channel_id), content)
      .resolveData()
      .resolveFiles();

    client.api.interactions(inter.id,inter.token).callback.post({
      data: {
        type: 4,
        data: {
          ...apiMessage.data,
          files: apiMessage.files,
          flags: flag ? 1 << 6:undefined
        }
      }
    })
  }
  
  const guild = client.guilds.cache.find(gu => gu.id == inter.guild_id)
  const command = inter.data.name.toLowerCase()
  const args = inter.data.options;
  
  try {
    let commandFile = require(`./commands/${command}.js`).run(client, inter, args, guild, send)
  }catch(err){
    console.log(err)
  }
  
})