const mongoose = require('mongoose');

const connectDb = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODBURI);

        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.bold);
    }catch(err){
        console.log("Error: ",err);
        process.exit();
    }
}

module.exports = connectDb