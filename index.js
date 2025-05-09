const express = require('express')

const { connection } = require('./mongo/connection');
const mqttHandler = require('./mqtt/mqttHandler');
const fetchDataRouter = require('./routes/fetchData')
const cors = require('cors')


require('dotenv').config();
const app = express()
app.use(cors())
app.use(express.json());

app.use('/', fetchDataRouter);
mqttHandler()


app.listen(process.env.PORT,()=>{
    connection()
    console.log('HTTP server listening on port 5000');
})






