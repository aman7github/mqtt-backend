



const mqtt = require('mqtt');
const { redisClient } = require('../redis/redisClient');
const { TaskModel } = require('../mongo/task.model');
require('dotenv').config();

const Task_Key = 'FULLSTACK_TASK_AMAN';

function mqttHandler() {

//  const client = mqtt.connect('wss://test.mosquitto.org:8081');
  const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

  client.on('connect', () => {
    console.log('Connected to MQTT Broker');

    client.subscribe('/add', (err) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log('Subscribed to /add');
      }
    });

  });



   client.on('message', async (topic, message) => {
    let task = message.toString();
      
    if(task === ''){
        console.log('empty task ');
        return
    }
    // checking if data in json string so not valid
     try{
         if(JSON.parse(task)){
         console.log('task is in json invalid');
         return
         }
     }catch(err){
        console.log(err.message);  
     }


    try {
    // Getting the current task list from Redis
        let taskList = await redisClient.get(Task_Key);
        taskList = taskList ? JSON.parse(taskList) : [];
        taskList.push(task);


    // Convert the task array into an array of task objects for MongoDB
       let mongoTask = taskList.map((el) => ({ task: el }));
       console.log('mongotask',mongoTask);
       
    //If the task list exceeds 50 tasks, move them to MongoDB and clear Redis
      if (taskList.length > 50) {
          await TaskModel.insertMany(mongoTask);   
          await  redisClient.del(Task_Key)    
          console.log('Moved tasks to MongoDB and cleared Redis');
      }else{
          await redisClient.set(Task_Key, JSON.stringify(taskList));
      }
     
    

    } catch (err) {
      console.log(err.message);
    }

  });

  client.on('error', (err) => {
    console.error('MQTT connection error:', err.message);
  });
}

module.exports = mqttHandler;

