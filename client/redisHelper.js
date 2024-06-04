const redis = require('redis')

const client = redis.createClient({
  url: "redis://10.65.3.45:6379"
});
await client.connect();
client.on('error', () => {
  console.log("Error ")
  client.disconnect()
});

export default client;