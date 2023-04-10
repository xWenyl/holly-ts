import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '..', '..', '.env')})

import{ REST, Routes, APIUser } from 'discord.js'
import commands from '../commands'
import keys from '../keys'
import { CommandMeta } from '../types'

const body = commands
  .map(({ commands }) => commands.map(({ meta }: {meta: CommandMeta}) => meta))
  .flat();

const rest = new REST({ version: '10'}).setToken(keys.clientToken)

async function main() {
    const currentUser = await rest.get(Routes.user()) as APIUser

    const endpoint = process.env.NODE_ENV === 'production'
    ? Routes.applicationCommands(currentUser.id)
    : Routes.applicationGuildCommands(currentUser.id, keys.testGuild)

    await rest.put(endpoint, {body})

    return currentUser
}

main()
    .then((user) => {
        const tag = `${user.username}#${user.discriminator}`
        const response = process.env.NODE_ENV === 'production'
            ? `Successfully released commands in production as ${tag}`
            : `Successfully released commands for development as ${tag}`

        console.log(response)
    })
    .catch()