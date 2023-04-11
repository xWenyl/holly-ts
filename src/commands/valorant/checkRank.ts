import { SlashCommandBuilder } from "discord.js";
import { command } from "../../utils";
import axios from 'axios'

const meta = new SlashCommandBuilder()
  .setName("checkrank")
  .setDescription("Check Valorant rank")
  .addStringOption((option) =>
    option
      .setName("name")
      .setDescription("Provide the bot with a riot name")
      .setMinLength(1)
      .setMaxLength(2000)
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("tag")
      .setDescription("Provide the bot with a riot tag")
      .setMinLength(1)
      .setMaxLength(2000)
      .setRequired(true)
  );

export default command(meta, async ({ interaction }) => {
  const name = interaction.options.getString("name");
  const tag = interaction.options.getString("tag");



    const userInfo = await axios.get(`https://api.henrikdev.xyz/valorant/v1/mmr/eu/${name}/${tag}`);

    return interaction.reply({
        ephemeral: false,
        content: `${name}#${tag} - ${userInfo.data.data.currenttierpatched} ${userInfo.data.data.ranking_in_tier}RR`,
    });
});
