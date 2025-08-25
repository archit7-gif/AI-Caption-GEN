// routes/user.routes.js
const express = require('express');
const multer = require('multer');
const authmiddleware = require('../middlewares/auth.middleware');
const UserModel = require('../models/user.model');

// IMPORTANT: pull in delete helper (keep upload import working as-is)
const storage = require('../service/storage.service');
const uploadFile = storage; // default export stays your upload function
const { deleteFileFromImageKit } = require('../service/storage.service');

const router = express.Router();
const storageMem = multer.memoryStorage();
const upload = multer({ storage: storageMem });



// ✅ Profile Image Upload
router.post("/profile-image", authmiddleware, upload.single("profileImage"), async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Upload to ImageKit
    const imageKitResponse = await uploadFile(req.file.buffer, `profile-${Date.now()}-${req.file.originalname}`);

    // Save URL in DB
    user.profileImage = imageKitResponse.url;
    await user.save();

    res.json({ message: "Profile image uploaded!", profileImage: user.profileImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload profile image" });
  }
});



router.get("/me", authmiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});




// DELETE profile image
router.delete("/profile-image", authmiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user || !user.profileImage) {
      return res.status(404).json({ message: "No profile image found" });
    }
    
    // Best effort delete from ImageKit; don't crash if it can't find it
    await deleteFileFromImageKit(user.profileImage);
    
    user.profileImage = "";
    await user.save();
    
    res.json({ message: "Profile image deleted successfully!" });
  } catch (err) {
    console.error("Error deleting profile image:", err);
    res.status(500).json({ message: "Failed to delete profile image" });
  }
});





module.exports = router;


