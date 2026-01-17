import multer from "multer";
import path from "path";
import fs from "fs";

/* ================= CREATE UPLOADS FOLDER ================= */
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/* ================= STORAGE ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

/* ================= FILE FILTERS ================= */

// Documents filter (PDF, DOC, DOCX)
const documentFilter = (req, file, cb) => {
  const allowedDocs = /pdf|doc|docx/;
  const ext = allowedDocs.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mime = allowedDocs.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, DOCX files are allowed"));
  }
};

// Images filter (JPG, PNG, JPEG, WEBP)
const imageFilter = (req, file, cb) => {
  const allowedImages = /jpeg|jpg|png|webp/;
  const ext = allowedImages.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mime = allowedImages.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

/* ================= MULTER EXPORTS ================= */

// For DOCUMENTS (resume, marksheets, etc.)
export const uploadDocs = multer({
  storage,
  fileFilter: documentFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// For PROFILE PHOTO / IMAGES
export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
