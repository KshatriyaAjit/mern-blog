import multer from "multer";

// Store file in memory, not disk
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const allowedFiles = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
  if (!allowedFiles.includes(file.mimetype)) {
    cb(new Error("Only .png, .jpg, .jpeg and .webp images are allowed!"), false);
  } else {
    cb(null, true);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 5 MB
});

export default upload;
