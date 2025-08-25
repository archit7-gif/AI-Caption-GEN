
// app file , dotenv , database 3 file yaha jarur ati hai

require('dotenv').config()
const app = require('./src/app')
const connectDB = require('./src/db/db')
connectDB()





app.listen(5000, () => {
  console.log("server is running on port 5000")
})
