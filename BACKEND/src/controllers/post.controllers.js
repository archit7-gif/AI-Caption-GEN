
const PostModel = require("../models/post.model");
const generateCaption = require("../service/ai.service");
const uploadFile = require("../service/storage.service");
const { v4: uuidv4 } = require('uuid');


async function createPostController(req,res){
const file = req.file;
// console.log("file rexived",file)

const base64Image = Buffer.from(file.buffer).toString('base64')

// console.log("base64Image",base64Image)

const caption = await generateCaption(base64Image)

const results = await uploadFile(file.buffer,`${uuidv4()}`)

const post = await PostModel.create({
    caption: caption,
    image: results.url,
    user: req.user._id
})
res.status(201).json({
    message: "Post created successfully",
    post : post
    
})

}



module.exports={
    createPostController
}