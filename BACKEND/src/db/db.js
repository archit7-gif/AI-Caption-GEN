

const mongoose = require('mongoose')

const connectDB = () =>{
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log("Connected to Database")
    }).catch((err) =>{
    console.log("failed to connect DB",err)
    })
}



module.exports = connectDB