const redis = require('redis');
require('dotenv').config();


const redisClient = redis.createClient({
    socket: {
      host: 'redis-12675.c212.ap-south-1-1.ec2.cloud.redislabs.com',
      port: 12675
    },
    username: "default",
    password: process.env.REDIS_PASSWORD
  });
  

redisClient.connect().then(()=>{
    console.log('redis connected');
}).catch(err=>console.log(err))


module.exports = { redisClient }