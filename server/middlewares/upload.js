import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dir, error } from "console";
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "../config/cloudinary.js";



 const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "projects";
    if (req.params.projectId) {
      folder = `projects/${req.params.projectId}`;
    }

    return {
      folder,
      resource_type: "auto", // Keeps it 'raw' for PDFs
      access_mode: "public",  // <--- ADD THIS: Ensures the URL is accessible
      type: "upload",         // <--- ADD THIS: Ensures it's a standard upload
      public_id: `${Date.now()}-${path.parse(file.originalname).name}`,
    };
  },
});


const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/zip",
        "application/x-zip-compressed",
        "application/x-rar-compressed",
        "application/x-rar",
        "application/vnd.rar",
        "application/octet-stream",
        "image/jpeg",
        "image/png",
        "image/gif",
        "text/plain",
        "application/javascript",
        "text/css",
        "text/html",
        "application/json",
    ];

    const allowedExtensions = [
        ".pdf",
        ".doc",
        ".docx",
        ".ppt",
        ".pptx",
        ".zip",
        ".rar",
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".txt",
        ".js",
        ".css",
        ".html",
        ".json",
    ];

    const fileExt = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExt)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Invalid file type "
            ), false
        )
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 10,
    }
})

const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                error: "File too large.Maximum size is 10MB"
            })
        }
        if (err.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({
                success: false,
                error: "Too many files.Maximum 10 files allowed"
            })
        }
        if (err.message && err.message.includes("Invalid file type")) {
            return res.status(400).json({
                success: false,
                error: err.message
            })
        }
        next(err);
    }
}



export { upload, handleUploadError };