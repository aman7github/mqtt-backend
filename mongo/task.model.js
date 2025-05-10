
const mongoose = require('mongoose')

const schema =   new mongoose.Schema({
      
    task:String
})


const TaskModel = mongoose.model('assignment_aman', schema, 'assignment_aman');
//const TaskModel = mongoose.model('assignment_aman', schema)

module.exports={
    TaskModel
}