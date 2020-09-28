const express = require('express');
const authControllers = require('../controllers/auth');
const authMiddlewares = require('../middlewares/auth');
const validateMiddleware = require('../middlewares/validate');
const validateLogin = require('../validations/auth/login');

const permissionMiddleware = require('../middlewares/permission');
const permissions = require('../helpers/permissions');

const router = express.Router();

// passport middlewares
const requireAuth = authMiddlewares.requireAuth;
const requireLogin = authMiddlewares.requireLogin;

router.get('/', (req, res, next) => {
  res.json({ success: true, title: 'Auth API Interface' });
});

router.post(
  '/signin',
  [validateMiddleware(validateLogin)],
  authControllers.signIn,
);

router.post(
  '/web/signin',
  [validateMiddleware(validateLogin), requireLogin],
  authControllers.signInFromWeb,
);

router.post(
  '/profile/:id',
  authControllers.viewProfile
);

router.post(
  '/web/profile',
  requireAuth,
  authControllers.viewProfileFromWeb
);

router.post(
  '/profile',
  authControllers.updateProfile,
);

module.exports = router;
