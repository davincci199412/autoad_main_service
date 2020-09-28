const express = require('express');
const userControllers = require('../controllers/user');

const permissionMiddleware = require('../middlewares/permission');
const permissions = require('../helpers/permissions');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({ success: true, title: 'User API Interface' });
});

router.get(
  '/all',
  permissionMiddleware(permissions.ADMIN),
  userControllers.getAllUsers
);

router.get(
  '/:id',
  permissionMiddleware(permissions.ADMIN),
  userControllers.getUser,
);

module.exports = router;
