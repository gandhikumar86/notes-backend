const redis = require("redis");
const dotenv = require("dotenv");

dotenv.config();

const redisClient = () => {
  return redis.createClient({
    url: process.env.redis_URL,
  });
};

const client = redisClient();

(async () => {
  // Connect to redis server
  await client.connect();
})();

client.on("error", (err) => {
  console.log(err);
});

client.on("connect", () => {
  console.log("Connected to redis!");
});

client.on("end", () => {
  console.log("Connection to redis ended!");
});

client.on("SIGQUIT", async () => {
  await client.quit();
  console.log("Connection to redis quit!");
});

module.exports = client;
