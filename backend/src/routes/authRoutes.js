const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = Router();

router.post('/login', authController.login);
// Only an already-authenticated user can create another account.
router.post('/register', authenticate, authController.register);
router.get('/me', authenticate, authController.me);

module.exports = router;
