const mqtt = require('mqtt');
const { redisClient } = require('../redis/redisClient');
const { TaskModel } = require('../mongo/task.model');
require('dotenv').config()
const client = mqtt.connect('mqtt://broker.hivemq.com')


 const Task_Key = 'FULLSTACK_TASK_AMAN';


module.exports = ()=>{

    client.on('connect',()=>{

        console.log('Connected to MQTT Broker');

        client.subscribe('/add',(err)=>{
             if(err){
                console.log(err.message);
             }else{
                console.log('subscribe to /add');
                
             }
        })
    })


}




client.on('message',async(topic,message)=>{
   
     const task = message.toString()
     if (!task) return console.warn('Empty task received.');
     console.log(task);
   

    try{
     // getting tasklist from redis and pushing new task 
        let taskList = await redisClient.get(Task_Key)
        taskList = taskList? JSON.parse(taskList):[]
        taskList.push(task)
        console.log('checking redis', taskList);
       
     // for mongoDB convert task arry into arr of task obj by mapping
         let mongoTask = taskList.map((el)=>({task:el}))

    //checking task list number 
        if(taskList.length>50){
            await TaskModel.insertMany(mongoTask)
            await redisClient.del(Task_Key)
            console.log('moved task in mongoDB and delete from redis');
        }
       
        await redisClient.set(Task_Key, JSON.stringify(taskList))
   

    }catch(err){
      console.log(err.message);
      
    }
 
   
})



client.on('error', (err) => {
    console.error('MQTT connection error:', err.message);
  });