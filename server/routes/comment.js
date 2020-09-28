const express = require('express');
const commentController = require('../controllers/comment');
const validateMiddleware = require('../middlewares/validate');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, title: 'Comment API Interface' });
});

router.post(
  '/:userId',
  commentController.getUserComments,
);

module.exports = router;
