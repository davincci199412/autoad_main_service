const express = require('express');

const passportService = require('../config/passport');
const authMiddlewares = require('../middlewares/auth');

const authRouter = require('./auth');
const userRouter = require('./user');
const commenetRouter = require('./comment');
const otherRouter = require('./other');

const router = express.Router();

const requireAuth = authMiddlewares.requireAuth;

const PopularUser = require('../models/popularuser');

router.get('/', async (req, res) => {
  const popularUsers = await PopularUser
            .find()
            .populate([
                {
                    path: 'added_users',
                    select: '_id username password userId auto_comment_text'
                },
                {
                    path: 'posts',
                    select: 'id shortcode'
                }
            ])
            .exec();
  res.json({ success: true, popularUsers: popularUsers });
});

router.use('/auth', authRouter);
router.use('/user', requireAuth, userRouter);
router.use('/comment', commenetRouter);
router.use('/other', otherRouter);

module.exports = router;
