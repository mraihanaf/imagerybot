import { SlashCommandBuilder, ChatInputCommandInteraction, ChannelType, PermissionFlagsBits } from "discord.js"
import { setImageryChannel } from "../utils/imagery"
import { enable } from "../features/imagery"

export default {
    enable: enable,
    data: new SlashCommandBuilder()
              .setName("setimagerychannel")
              .setDescription("Set Imagery Channel.")
              .addChannelOption(option => option
                .setName("channel")
                .setDescription("text channel")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)    
            )
            
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    execute: async (interaction: ChatInputCommandInteraction) => {
        const imageryChannel = await setImageryChannel(interaction.guildId!, interaction.options.getChannel("channel")?.id!)
        interaction.reply(`Berhasil mengatur channel imagery ke <#${interaction.options.getChannel('channel')?.id}>`)
    }   
}