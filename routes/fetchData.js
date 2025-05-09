const express = require('express')
const {TaskModel} = require('../mongo/task.model')
const {redisClient} = require('../redis/redisClient')
require('dotenv').config()

const router = express.Router()

const Task_Key = 'FULLSTACK_TASK_AMAN';

router.get('/fetchAllTasks',async(req,res)=>{

try{
  let mongoTask = await TaskModel.find()
  
//convert mongoData key-value in arr
  let mongoData = mongoTask.map(el=> el.task)
  let redisTask = await redisClient.get(Task_Key) 
  redisTask = redisTask? JSON.parse(redisTask):[]
 
   let allTask = [...redisTask, ...mongoData]
    
   res.status(200).send({"allTask":allTask})

}catch(err){
    console.log(err);
    res.status(400).send({"err":err.message})
    
}


})



module.exports = router;