import { ButtonBuilder, ButtonStyle, EmbedBuilder, InteractionReplyOptions, StringSelectMenuOptionBuilder, StringSelectMenuBuilder } from "discord.js"
import CategoryRoot from '../commands'
import { chunk, createId, readId } from "../utils"
import { ActionRowBuilder } from "discord.js"
import { APIEmbedField } from "discord.js"
export const Namespaces = {
    root: 'help_category_root',
    select: 'help_category_select',
    action: 'help_category_action'
}


export const Actions = {
    next: '+',
    back: '-'
}

// Generate root embed
export function getCategoryRoot(ephemeral?: boolean): InteractionReplyOptions {
    // Map categories
    const mappedCategories = CategoryRoot.map(({ name, description, emoji }) => 
    new StringSelectMenuOptionBuilder({
        label: name,
        description,
        value: name,
    })
    )

    // Create embed
    const embed = new EmbedBuilder()
    .setTitle('Help Menu')
    .setDescription("Browse through all commands.")

    // Create select menu
    const selectId = createId(Namespaces.select)
    const select =  new StringSelectMenuBuilder()
    .setCustomId(selectId)
    .setPlaceholder('Command Category')
    .setMaxValues(1)
    .setOptions(mappedCategories)

    const component = new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(select)

    return {
        embeds: [embed],
        components: [component],
        ephemeral,
    }
}

// Generate embed for current category

export function getCategoryPage(interactionId: string): InteractionReplyOptions {
    const [_namespace, categoryName, action, currentOffset] = readId(interactionId)

    const categoryChunks = CategoryRoot.map((c) => {
        // Map all commands as fields
        const commands: APIEmbedField[] = c.commands.map((c) => ({
            name: c.meta.name,
            value: c.meta.description
        }))

        return {
            ...c,
            commands: chunk(commands, 10)
        }
    })

    const category = categoryChunks.find(({ name }) => name === categoryName)
    if (!category) {
        throw new Error('Invalid interactionId; Failed to find corresponding category page!')
    }

    // Get current offset
    let offset = parseInt(currentOffset)
    // if is NaN set offset to 0
    if (isNaN(offset)) offset = 0

    if (action === Actions.next) offset++
    else if (action === Actions.back) offset--

    const emoji = category.emoji ? `${category.emoji} ` : ''
    const defaultDescription = `Brwose through ${category.commands.flat().length} commands in ${emoji}${category.name}`

    const embed = new EmbedBuilder()
    .setTitle(`${emoji}${category.name}`)
    .setDescription(category.description ?? defaultDescription)
    .setFields(category.commands[offset])
    .setFooter({ text: `${offset + 1} / ${category.commands.length}` })
    
    const backId = createId(Namespaces.action, category.name, Actions.back, offset)
    const backButton = new ButtonBuilder()
      .setCustomId(backId)
      .setLabel('Back')
      .setStyle(ButtonStyle.Danger)
      .setDisabled(offset <= 0)
  
    // Return to root
    const rootId = createId(Namespaces.root)
    const rootButton = new ButtonBuilder()
      .setCustomId(rootId)
      .setLabel('Categories')
      .setStyle(ButtonStyle.Secondary)
  
    // Next button
    const nextId = createId(Namespaces.action, category.name, Actions.next, offset)
    const nextButton = new ButtonBuilder()
      .setCustomId(nextId)
      .setLabel('Next')
      .setStyle(ButtonStyle.Success)
      .setDisabled(offset >= 0)
  
    const component = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(backButton, rootButton, nextButton)
  
    return {
      embeds: [embed],
      components: [component]
}
}