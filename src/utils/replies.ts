import { InteractionReplyOptions} from 'discord.js'

export const Colors = {
    error: 0xf54242
}

export const Reply = {
    error(msg: string): InteractionReplyOptions {
        return {
            ephemeral: true,
            embeds: [{
                color: Colors.error,
                description: msg
            }]
        }
    }
}

export const EditReply = {
  error(msg: string): InteractionReplyOptions {
    return {
      embeds: [
        {
          color: Colors.error,
          description: msg,
        },
      ],
    };
  },
};