import { SlashCommandBuilder } from 'discord.js'
import { command } from '../../utils'
import axios from 'axios';

const meta = new SlashCommandBuilder()
    .setName('stoicquote')
    .setDescription('Get a random stoic quote')

export default command(meta, async ( { interaction }) => {


    interface QuoteResponse {
        author: string;
        quote: string;
    }
    const quoteRes = await axios.get<QuoteResponse>(`https://api.themotivate365.com/stoic-quote`);
    const quote = quoteRes.data


    return interaction.reply({
        ephemeral: true,
        content: `**${quote.author} said:** ${quote.quote}` ?? 'Sorry! no quotes'
    })
})