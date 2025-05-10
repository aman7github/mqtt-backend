const express = require('express')
const {TaskModel} = require('../mongo/task.model')
const {redisClient} = require('../redis/redisClient')
require('dotenv').config()

const router = express.Router()

const Task_Key = 'FULLSTACK_TASK_AMAN';
const Error_Key = 'MQTT_ERROR_LOG';

router.get('/fetchAllTasks',async(req,res)=>{

try{
  let mongoTask = await TaskModel.find()
  
//convert mongoData key-value in arr
  let mongoData = mongoTask.map(el=> el.task)
  let redisTask = await redisClient.get(Task_Key) 
  redisTask = redisTask? JSON.parse(redisTask):[]
 
   let allTask = [...redisTask, ...mongoData]

    let mqttError = await redisClient.get(Error_Key);
    
   res.status(200).send({"allTask":allTask, error: mqttError || null })

}catch(err){
    console.log(err);
    res.status(400).send({"err":err.message})
    
}


})





// if you want to delete something happened undexpected

router.delete('/del',(req,res)=>{
 redisClient.del(Task_Key)
  res.send('clear')
})


router.delete('/delm',async(req,res)=>{
 
  try{
    await TaskModel.deleteMany()
    res.send('deleted')
  }catch(err){
    res.send(err.message)
  }
  



})


module.exports = router;