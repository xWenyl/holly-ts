import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(__dirname, '..', '..', '.env')})

import{ REST, Routes, APIUser } from 'discord.js'
import commands from '../commands'
import keys from '../keys'
const rest = new REST({ version: '10'}).setToken(keys.clientToken)
const commandId = process.argv[2] ?? ""
if (!commandId) {
    console.error("No commandId included")
    process.exit()
}


// for guild-based commands
rest.delete(Routes.applicationGuildCommand('1045060026290667530', keys.testGuild, commandId))
	.then(() => console.log('Successfully deleted guild command'))
	.catch(console.error);

// for global commands
rest.delete(Routes.applicationCommand('1045060026290667530', commandId))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);