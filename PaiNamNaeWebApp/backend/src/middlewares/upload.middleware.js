const multer = require('multer');
const ApiError = require('../utils/ApiError');


// กำหนดค่า Multer ให้เก็บไฟล์ใน memoryชั่วคราวเพื่อรอส่งต่อไปยัง Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // จำกัดขนาดไฟล์ไม่เกิน 5 MB
    fileFilter: (req, file, cb) => {
        // อนุญาตเฉพาะไฟล์รูปภาพ (jpeg, jpg, png)
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new ApiError(400, 'Only image files are allowed!'), false);
        }
    },
});

upload.errorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'ไฟล์มีขนาดใหญ่เกินไป (ต้องไม่เกิน 5 MB)',
                error: err.message
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                message: 'จำนวนไฟล์มากเกินไป',
                error: err.message
            });
        }
    }
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            message: err.message
        });
    }
    next(err);
};

module.exports = upload;
