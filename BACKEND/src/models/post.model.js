

const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  image: String,
  caption: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"   // ✅ fixed
  },
  likes: [
    { type: mongoose.Schema.Types.ObjectId, ref: "user" }  // ✅ fixed
  ],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },  // ✅ fixed
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true })

const PostModel = mongoose.model("post", postSchema)

module.exports = PostModel




