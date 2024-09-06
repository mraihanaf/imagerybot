import redis from "./redis"
import { GuildId, ChannelId, IImageryMedia } from "../types";

export async function getImageryChannel(guildId: GuildId): Promise<null|ChannelId|undefined> {
    const isGuildExist = await redis?.hexists("imagery_channel", guildId)
    if(!isGuildExist) return null
    return await redis?.hget("imagery_channel",guildId);
}

export async function setImageryChannel(guildId: GuildId, channelId: ChannelId): Promise<number|undefined> {
    return await redis?.hset("imagery_channel", guildId, channelId);
}

export async function getGuildMedia(guildId: GuildId, rangeStart: number = 0, rangeEnd: number = -1): Promise<IImageryMedia[]> {
    const isExist = await getImageryChannel(guildId)
    if(!isExist) return []
    const gallery = await redis?.lrange(`imagery_gallery_${guildId}`, rangeStart, rangeEnd);
    if(!gallery) return []
    return gallery.map(media => JSON.parse(media))
}

export async function addGuildMedia(guildId: GuildId, imageryMedia: IImageryMedia): Promise<number|undefined>{
    return await redis?.lpush(`imagery_gallery_${guildId}`, JSON.stringify(imageryMedia))
}

export async function removeGuildMedia(guildId: GuildId, imageryMedia: IImageryMedia): Promise<number|undefined> {
    return await redis?.lrem(`imagery_gallery_${guildId}`, 1, JSON.stringify(imageryMedia))
}