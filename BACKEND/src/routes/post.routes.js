




// routes/post.routes.js
const express = require('express');
const router = express.Router();
const authmiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');
const { createPostController } = require('../controllers/post.controllers');
const PostModel = require('../models/post.model');

// NEW: import delete helper
const { deleteFileFromImageKit } = require('../service/storage.service');

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", authmiddleware, upload.single("image"), createPostController);

;
// ✅ Get only logged-in user's posts
router.get("/getPosts", authmiddleware, async (req, res) => {
  try {
    const posts = await PostModel.find({ user: req.user.id }) // 👈 filter
      .populate("user", "username profileImage")
      .populate("comments.user", "username profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({ posts });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});


// Like/unlike post
router.post("/:postId/like", authmiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ message: "Failed to like post" });
  }
});

// Add comment
router.post("/:postId/comments", authmiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = { text, user: userId };
    post.comments.push(comment);
    await post.save();

    res.json({ comment });
  } catch (err) {
    res.status(500).json({ message: "Failed to add comment" });
  }
});

// ✅ FIXED: DELETE a post by id
// Was: router.delete("/api/posts/:id", ...)  ← WRONG inside a router mounted at /api/posts
// ✅ Delete only if the logged-in user owns the post
router.delete("/:id", authmiddleware, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check ownership
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Failed to delete post" });
  }
});




// ✅ Update only if the logged-in user owns the post
router.put("/:id", authmiddleware, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this post" });
    }

    const updated = await PostModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({ message: "Post updated successfully", post: updated });
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ message: "Failed to update post" });
  }
});





// Delete a comment
router.delete("/:postId/comments/:commentId", authmiddleware, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;

    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only comment owner OR post owner can delete
    if (comment.user.toString() !== userId && post.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    comment.deleteOne();
    await post.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Failed to delete comment" });
  }
});


// Get comments of a post
router.get("/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await PostModel.findById(postId)
      .populate("comments.user", "username profilePicture"); // optional: populate user details

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(post.comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});



module.exports = router;
