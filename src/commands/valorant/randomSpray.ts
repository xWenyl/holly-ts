import { SlashCommandBuilder } from "discord.js";
import { EmbedBuilder } from "discord.js";

import { command } from "../../utils";
import axios from "axios";

const meta = new SlashCommandBuilder()
  .setName("randomspray")
  .setDescription("Generate random Valorant spray")


interface Spray {
  displayName: string;
  fullTransparentIcon: string | null;
  animationGif?: string | null;

}

export default command(meta, async ({ interaction }) => {


  const spraysRes = await axios.get(`https://valorant-api.com/v1/sprays`);
  const sprays: Spray[] = spraysRes.data.data
  const randomSpray: Spray = sprays[Math.floor(Math.random() * sprays.length)];

    const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(randomSpray.displayName)
    .setImage(randomSpray.animationGif ?? randomSpray.fullTransparentIcon);


  return interaction.reply({
    ephemeral: false,
    embeds: [ embed ]
  });
});
