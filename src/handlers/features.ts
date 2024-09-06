import { readdirSync } from "fs"
import { join } from "path"
import { Client } from "discord.js"
import { IFeatures } from "../types"

const featPath = join(__dirname, "../features")
const featFiles = readdirSync(featPath).filter(file => file.endsWith(".js") || file.endsWith(".ts"))

export async function loadFeatures(client:Client): Promise<void> {
    for(const file of featFiles){
        const filePath: string = join(featPath, file)
        const loadFeat: IFeatures = (await import(filePath)).default
        if(loadFeat.enable === false){
            console.log(`Feature ${file} disabled.`)
            continue
        }
        await loadFeat.load(client)
    }
}