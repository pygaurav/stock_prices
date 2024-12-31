import { createClient } from "redis";

const redisClient = await createClient({
  url: "redis://195.35.9.203:6379",
})
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

export default redisClient;
