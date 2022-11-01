const express = require('express');
const router = express.Router();
const auth = require('../middleware/authorization');
const admin = require('../middleware/admin');

const authRouter = require('./auth');
const userRouter = require('./users');
const postRouter = require('./posts');
const categoryRouter = require('./categories');
const commentRouter = require('./comments');

router.use('/auth', authRouter);
router.use('/users', auth, userRouter);
router.use('/posts', postRouter);
router.use('/categories', categoryRouter);
router.use('/comments', commentRouter);

module.exports = router
