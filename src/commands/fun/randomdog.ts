import { SlashCommandBuilder } from 'discord.js'
import { command } from '../../utils'
import axios from 'axios';

const meta = new SlashCommandBuilder()
    .setName('randomdog')
    .setDescription('Get a random dog picture')

export default command(meta, async ( { interaction }) => {


    interface DogResponse {
        url: string;
    }
    const dogRes = await axios.get<DogResponse>(`https://random.dog/woof.json`);
    const dog = dogRes.data


    return interaction.reply({
        ephemeral: true,
        content: `Your random dog picture:`,
        files: [
            {
              attachment: `${dog.url}`,
            },
          ],
    })
})