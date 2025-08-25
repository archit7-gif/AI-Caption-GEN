

const mongoose = require('mongoose');

const userSChema = new mongoose.Schema({
username: { type: String, unique: true, required: true },
password: { type: String },
profileImage: { type: String }   // 👈 add this
})


const UserModel = mongoose.model("user",userSChema)




module.exports = UserModel

