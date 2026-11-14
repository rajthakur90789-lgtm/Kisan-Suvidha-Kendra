
const express = require("express");
const multer = require("multer");

const router = express.Router();

const {
    detectCropDisease
} = require("../controllers/cropDiseaseController");

// Store uploaded image in memory
const storage = multer.memoryStorage();

// Allow only image files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed."));
    }
};

// Multer configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

// POST: Detect Crop Disease
router.post(
    "/detect",
    upload.single("image"),
    detectCropDisease
);

module.exports = router;
