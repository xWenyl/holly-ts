import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { command } from '../../utils'
import keys from '../../keys'
import axios, { AxiosError } from 'axios';

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

      interface WeatherApiResponse {
        weather: {
          description: string;
          icon: string;
        }[];
        main: {
          temp: number;
          humidity: number;
        };
        wind: {
          speed: number;
        };
      }


      try {
        const response = await axios.get<WeatherApiResponse>(apiUrl);
        const { weather, main, wind } = response.data;


        const embed = new EmbedBuilder()
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
          return interaction.reply({ embeds: [embed] })
    

        } catch (error) {
            if ((error as AxiosError).response && (error as AxiosError).response?.status === 404) {
              return interaction.reply('City not found');
            }
            return interaction.reply('An error occurred while fetching the weather data');
          }




})