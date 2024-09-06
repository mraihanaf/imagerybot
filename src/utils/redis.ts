import { Redis } from "ioredis";
const redisClient: Redis = new Redis(process.env.REDIS_URI!);
redisClient.on("ready", () => {
    console.log("Connected to the redis database.")
})
export default redisClient