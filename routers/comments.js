const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const admin = require('../middleware/admin');
const auth = require('../middleware/authorization');
const User = require('../models/user');

// Global path will be /api/comments/

// GET /api/comments/{id}
router.get('/:id', async (req, res) => {
    const comment = await Comment.getCommentById(req.params.id);
    if (!comment) {
        return res.status(404).send("Comment does not exist");
    }
    res.send(comment);
});

// GET /api/comments/{id}/like
router.get('/:id/like', async (req, res) => {
    const comment = await Comment.getCommentById(req.params.id);
    if (!comment) {
        return res.status(404).send("Comment does not exist");
    }
    res.send(await comment.getLikes());
});

// POST /api/comments/{id}/like
router.post('/:id/like', auth, async (req, res) => {
    const comment = await Comment.getCommentById(req.params.id);
    if (!comment) {
        return res.status(404).send("Comment does not exist");
    }
    if (await comment.like(req.user.login, req.body.isLike)) {
        return res.send(201).send(req.body.isLike ? 'Liked' : 'Disliked');
    }
    res.status(409).send('Post is already rated by you');
});

// PATCH /api/comments/{id}
router.patch('/:id', auth, async (req, res) => {
    const comment = await Comment.getCommentById(req.params.id);
    if (!comment) {
        return res.status(404).send("Comment does not exist");
    }
    if (comment.author != req.user.login) {
        return res.status(403).send("You can't update this comment");
    }
    comment.content = req.body.content ? req.body.content : comment.content;
    comment.updateSelf();
    res.send(comment);
});

// DELETE /api/comments/{id}
router.delete('/:id', auth, async (req, res) => {
    const comment = await Comment.getCommentById(req.params.id);
    if (!comment) {
        return res.status(404).send("Comment does not exist");
    }
    const user = await User.getUserByLogin(req.user.login);
    if (comment.author != req.user.login && user.role != "ADMIN") {
        return res.status(403).send("You can't update this comment");
    }
    Comment.deleteById(comment.id);
    res.send("Deleted");
});

// DELETE /api/comments/{id}/like
router.delete('/:id/like', auth, async (req, res) => {
    const comment = await Comment.getCommentById(req.params.id);
    if (!comment) {
        return res.status(404).send("Comment does not exist");
    }
    comment.unlike(req.user.login);
    res.send("Deleted");
});

module.exports = router;
