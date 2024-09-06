import { Client, AttachmentBuilder, TextChannel } from "discord.js"
import { getImageryChannel, addGuildMedia, getGuildMedia } from "../utils/imagery";
import { v2 as cloudinary } from "cloudinary"
import { generateId } from "../utils/genRandomId";
import { inspect } from "util";

export const enable: boolean = true;
export default {
    enable,
    load: async (client: Client) => {
        cloudinary.config(process.env.CLOUDINARY_URL!)
        client.on("messageCreate", async msg => {
            if(!msg.guildId || msg.author.bot || msg.attachments.size == 0) return
            const imageryChannelId = await getImageryChannel(msg.guildId);
            if(!imageryChannelId) return
            
            const imageryChannel = client.channels.cache.get(imageryChannelId) as TextChannel;
            if (!imageryChannel) {
                console.error(`Imagery channel with ID ${imageryChannelId} not found.`);
                return;
            }

            const promises = msg.attachments.map(async attachment => {
                const id: string = generateId() 
                try {
                    const uploadResult = await cloudinary.uploader.upload(attachment.url, {
                        public_id: id
                    });
                    console.log(inspect(uploadResult))
                    
                    const attachmentBuilder = new AttachmentBuilder(attachment.url, { name: attachment.name });
                    await addGuildMedia(msg.guildId!, {
                        type: 'image',
                        url: uploadResult.secure_url,
                        id: id
                    })
                    console.log(inspect(await getGuildMedia(msg.guildId!)))
                    await imageryChannel.send({
                        content: `Uploaded by ${msg.author}\nID: ${id}`,
                        files: [attachmentBuilder]
                    });
                } catch (err) {
                    console.error(`Error processing attachment: ${attachment.name}`, err);
                    await imageryChannel.send(`Error uploading attachment: ${attachment.name}`);
                }
            });
            
            try {
                await Promise.all(promises);
                await msg.delete();
            } catch (err) {
                console.error("Error processing attachments or deleting message:", err);
            }
        })
    }
}