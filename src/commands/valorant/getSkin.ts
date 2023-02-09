import { SlashCommandBuilder } from "discord.js";
import { EmbedBuilder } from "discord.js";

import { command } from "../../utils";
import axios from "axios";

const meta = new SlashCommandBuilder()
  .setName("getskin")
  .setDescription("Get random Valorant spray")
  .addStringOption((option) =>
    option
      .setName("skin")
      .setDescription("Selected skin")
      .setRequired(true)
  );

interface Spray {
  displayName: string;
}


export default command(meta, async ({ interaction }) => {

  const weaponsRes = await axios.get(
    `https://valorant-api.com/v1/weapons/skins`
  );

  const weapons: Spray[] = weaponsRes.data.data;
  const selectedSkin = interaction.options.getString("skin");
  const skin: any = weapons.find((obj) => obj.displayName === selectedSkin)

  return await interaction.reply({
    ephemeral: false,
    content: `${skin.displayName}`,
    files: [
      {
        attachment: `${skin.levels[skin.levels.length - 1].streamedVideo}`,
      },
    ],
    fetchReply: true,
  });

});
