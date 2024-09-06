export type GuildId = string
export type ChannelId = string

export interface IImageryMedia {
    id: string,
    type: "image"|"youtube",
    url: string
}