const redis = require("redis");
const dotenv = require("dotenv");

dotenv.config();

const redisClient = () => {
  return redis.createClient({
    url: process.env.redis_URL,
  });
};

const client = redisClient();

client.on("error", (err) => {
  console.log(err);
});

client.on("connect", () => {
  console.log("Connection to redis started!");
});

client.on("end", () => {
  console.log("Connection to redis ended!");
});

client.on("SIGQUIT", async () => {
  await client.quit();
});

module.exports = client;
