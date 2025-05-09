
const mongoose = require('mongoose')

 const connection=async()=>{

    try{
        await mongoose.connect('mongodb+srv://aman:aman@cluster0.i0nhfqn.mongodb.net/assignment?retryWrites=true&w=majority&appName=Cluster0')              
         console.log('connected to mongoDB');
         
    }catch(err){
        console.log(err.message);
        
    }
}

module.exports={
   connection
}

