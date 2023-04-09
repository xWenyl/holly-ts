import { SlashCommandBuilder, StringSelectMenuBuilder } from "discord.js";
import { EmbedBuilder } from "discord.js";

import { command } from "../../utils";
import axios from "axios";

const meta = new SlashCommandBuilder()
  .setName("getskin")
  .setDescription("Get valorant skin")
  .addStringOption((option) =>
    option
      .setName("skin")
      .setDescription("Selected skin")
      .setRequired(true)
  )
  .addStringOption((option) =>
  option
    .setName("variant")
    .setDescription("Selected variant")
    .setRequired(false)
);

interface Weapon {
  displayName: string;
  chromas: Chroma[];
}

interface Chroma {
  displayName: string;
  fullRender: string;
}




export default command(meta, async ({ interaction }) => {

  const weaponsRes = await axios.get(
    `https://valorant-api.com/v1/weapons/skins`
  );
  
    
  const weapons: Weapon[] = weaponsRes.data.data;
  const selectedSkin = interaction.options.getString("skin");
  const selectedVariant = interaction.options.getString("variant");
  const skin: Weapon | undefined= weapons.find((obj) => obj.displayName === selectedSkin)
  let variant: Chroma = { displayName: "", fullRender: "" };

  if (skin) {
    const variants: Chroma[] = skin.chromas;
    variant = selectedVariant
      ? variants.filter((variant) => variant.displayName.toLowerCase().includes(selectedVariant.toLowerCase()))[0]
      : variants[0];
  } else {
    return await interaction.reply({ ephemeral: true, content: "Cannot find the skin" });
  }
  
  return await interaction.reply({
    content: `${variant.displayName}`,
    files: [
      {
        attachment: `${variant.fullRender}`,
      },
    ],
    fetchReply: true,
  });
});
