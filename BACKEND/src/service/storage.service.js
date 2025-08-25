

// service/storage.service.js
var ImageKit = require("imagekit");

var imagekit = new ImageKit({
  publicKey : process.env.IMAGEKIT_PUBLICK_KEY, // keeping your current env var name to avoid breaking
  privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadFile(file, filename){
  const response = await imagekit.upload({
    file : file,
    fileName : filename,
    folder : "Cohort-AI-SocialMedia"
  });
  return response;
}

// NEW: delete helper that finds the fileId by filename from the URL
async function deleteFileFromImageKit(fileUrl) {
  try {
    if (!fileUrl) return false;
    const url = new URL(fileUrl);
    const filename = url.pathname.split("/").pop().split("?")[0];

    // Restrict search to your folder; grab first match
    const files = await imagekit.listFiles({
      path: "Cohort-AI-SocialMedia",
      searchQuery: `name="${filename}"`,
      limit: 1
    });

    if (!files || files.length === 0) return false;

    await imagekit.deleteFile(files[0].fileId);
    return true;
  } catch (err) {
    console.error("ImageKit delete error:", err?.message || err);
    return false;
  }
}

// Keep existing default export for compatibility:
module.exports = uploadFile;
// Also expose named helpers for new code:
module.exports.uploadFile = uploadFile;
module.exports.deleteFileFromImageKit = deleteFileFromImageKit;
