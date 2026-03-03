const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const { loginSchema, changePasswordSchema } = require('../validations/auth.validation');
const { protect } = require('../middlewares/auth');
const blockBlacklisted = require('../middlewares/blockBlacklisted');

const router = express.Router();

// POST /api/auth/login
router.post(
    '/login',
    validate({ body: loginSchema }),
    authController.login
);

router.get(
  '/me',
  protect,
  blockBlacklisted,
  async (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Authorized',
      data: { ok: true }
    });
  }
);

// PUT /api/auth/change-password
router.put(
    '/change-password',
    protect,
    validate({ body: changePasswordSchema }),
    authController.changePassword
);

module.exports = router;