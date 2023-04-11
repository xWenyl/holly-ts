import { SlashCommandBuilder } from 'discord.js'
import { command } from '../../utils'
import keys from '../../keys'
import axios from 'axios';

const meta = new SlashCommandBuilder()
    .setName('shorten')
    .setDescription('Shorten provided URL')
    .addStringOption((option) =>
    option
    .setName('url')
    .setDescription('URL to shorten')
    .setMinLength(1)
    .setMaxLength(2000)
    .setRequired(true))
    .addStringOption((option) =>
    option
    .setName('alias')
    .setDescription('URL alias')
    .setMinLength(1)
    .setMaxLength(2000)
    .setRequired(true)
    )


export default command(meta, async ( { interaction }) => {
    const userURL = interaction.options.getString('url')!
    const userAlias = interaction.options.getString('alias')!

      async function shortenUrl(url: string, alias?: string) {
      
        const response = await axios.post('https://gotiny.cc/api', {
          long: url,
          custom: alias
        }, {
            headers: {
              'Content-Type': 'application/json'
            }
        })

        if (response.data.error) return interaction.reply(`You provided a wrong link`)

        return response.data[0].code

      }

      const shortenedUrl: string = await shortenUrl(userURL, userAlias)

      return interaction.reply(`Your shortened URL: https://gotiny.cc/${shortenedUrl}`)



})