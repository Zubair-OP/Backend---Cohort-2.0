require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/database');

connectDB();

app.listen(process.env.PORT, ()=>{
    console.log("server is running on port " + process.env.PORT)
})
