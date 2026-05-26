import multer from "multer";
import path from "path";
import AppError from "./AppError.js";

/**
 * Creates a Multer file filter.
 *
 * @param {string[]} allowedMimeTypes - Allowed MIME types.
 * @param {string[]} allowedExtensions - Allowed file extensions.
 */
const createFileFilter = (allowedMimeTypes, allowedExtensions) => {
  return (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    const isValidMimeType = allowedMimeTypes.includes(file.mimetype);
    const isValidExtension = allowedExtensions.includes(ext);

    if (!isValidMimeType || !isValidExtension) {
      return cb(new AppError("Unsupported file type!", 415), false);
    }

    cb(null, true);
  };
};

/**
 * Shared Multer factory.
 *
 * @param {object} options
 * @param {"memory"|"disk"} [options.storageType="memory"]
 * @param {string[]} options.allowedMimeTypes
 * @param {string[]} options.allowedExtensions
 * @param {number} [options.maxFileSize=5 * 1024 * 1024]
 */
const createUploader = ({
  storageType = "memory",
  allowedMimeTypes,
  allowedExtensions,
  maxFileSize = 5 * 1024 * 1024, // 5MB
}) => {
  const storage = storageType === "disk" ? multer.diskStorage({}) : multer.memoryStorage();

  return multer({
    storage,
    fileFilter: createFileFilter(allowedMimeTypes, allowedExtensions),
    limits: {
      fileSize: maxFileSize,
    },
  });
};

/* -------------------------------------------------------------------------- */
/* Common file type presets                                                   */
/* -------------------------------------------------------------------------- */

const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/svg+xml"];

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".svg"];

const DOCUMENT_MIME_TYPES = [...IMAGE_MIME_TYPES, "application/pdf"];

const DOCUMENT_EXTENSIONS = [...IMAGE_EXTENSIONS, ".pdf"];

/* -------------------------------------------------------------------------- */
/* Exported middlewares                                                       */
/* -------------------------------------------------------------------------- */

// Parse multipart/form-data with no files
const parseFormData = multer().none();

// Parse one file into req.file.buffer (memory storage)
const uploadBuffer = (fieldName) =>
  createUploader({
    storageType: "memory",
    allowedMimeTypes: DOCUMENT_MIME_TYPES,
    allowedExtensions: DOCUMENT_EXTENSIONS,
  }).single(fieldName);

// Parse one file and let Multer use disk storage
// (useful if you later provide destination/filename in a custom storage config)
const uploadDisk = (fieldName) =>
  createUploader({
    storageType: "disk",
    allowedMimeTypes: DOCUMENT_MIME_TYPES,
    allowedExtensions: DOCUMENT_EXTENSIONS,
  }).single(fieldName);

// Backward-compatible alias if you prefer this name
const uploadSingleFileBuffer = uploadBuffer;
const uploadSingleFileDisk = uploadDisk;

export { parseFormData, uploadSingleFileDisk, uploadSingleFileBuffer };
