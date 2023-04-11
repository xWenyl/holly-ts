import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { command } from '../../utils'
import keys from '../../keys'
import axios from 'axios';

const meta = new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Check the weather')
    .addStringOption((option) =>
    option
    .setName('city')
    .setDescription('Select a city')
    .setMinLength(1)
    .setMaxLength(2000)
    .setRequired(true)
)


export default command(meta, async ( { interaction }) => {
    const city = interaction.options.getString('city')!

      const API_KEY = keys.weatherKey
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;;


      try {
        const response = await axios.get(apiUrl);
        const { weather, main, wind, cod, dt, clouds} = await response.data;
        console.log(weather, main, wind, cod, dt, clouds)

        const exampleEmbed = new EmbedBuilder()
        .setThumbnail(`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`)
        .setTitle(`Weather in ${city}`)
        .setColor(0x0099FF)
        .addFields(
            { name: 'Temperature', value: `${main.temp}°C`},
            { name: 'Weather', value: `${weather[0].description}`},
            { name: 'Wind speed', value: `${(wind.speed * 3.6).toFixed(2)}km/h`},
            { name: 'Humidity', value: `${main.humidity}%`},
        )
        .setTimestamp()
          return interaction.reply({ embeds: [exampleEmbed] })
    

      } catch (error) {
        console.log(error)
        return interaction.reply("City not found")
      }




})