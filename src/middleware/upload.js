import multer from "multer";

const storage = multer.memoryStorage(); // store files in buffer

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB → good for 3 min video
  }
});

export default upload;
