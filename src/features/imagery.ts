import { Client } from "discord.js"
import { getImageryChannel } from "../utils/imagery";

export const enable: boolean = true;
export default {
    enable,
    load: async (client: Client) => {
        client.on("messageCreate", async msg => {
            if(!msg.guildId || msg.author.bot || msg.attachments.size == 0) return
            const imageryChannel  = await getImageryChannel(msg.guildId);
            if(!imageryChannel) return
            msg.attachments.each(attachment => {
                console.log(attachment)
            })
            msg.delete()
        })
        
    }
}

