const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const admin = require('../middleware/admin');
const auth = require('../middleware/authorization');

// Global path will be /api/posts/

// GET /api/posts
router.get('/', async (req, res) => {
    res.send(await Post.getAllPosts());
});

// GET /api/posts/{id}
router.get('/:id', async (req, res) => {
    const post = await Post.getPostById(req.params.id);
    if (!post) {
        return res.status(404).send('Post does not exist');
    }
    res.send(post);
});

// GET /api/posts/{id}/comments
router.get('/:id/comments', async (req, res) => {
    const post = await Post.getPostById(req.params.id);
    if (!post) {
        return res.status(404).send('Post does not exist');
    }
    res.send(await Post.getCommentsById(req.params.id));
});

// POST /api/posts/{id}/comments
router.post('/:id/comments', auth, async (req, res) => {
    if (!req.body.content) {
        return res.status(400).send('Missing parameter "content"');
    }
    const post = await Post.getPostById(req.params.id);
    if (!post) {
        return res.status(404).send('Post does not exist');
    }
    post.addComment(req.user.login, req.body.content);
    res.status(201).send('Comment added');
});

// GET /api/posts/{id}/categories
router.get('/:id/categories', async (req, res) => {
    const post = await Post.getPostById(req.params.id);
    if (!post) {
        return res.status(404).send('Post does not exist');
    }
    res.send(await post.getOwnCategories());
});

// GET /api/posts/{id}/likes
router.get('/:id/likes', async (req, res) => {
    const post = await Post.getPostById(req.params.id);
    if (!post) {
        return res.status(404).send('Post does not exist');
    }
    res.send(await post.getOwnLikes());
});

// POST /api/posts/
router.post('/', auth, async (req, res) => {
    const { title, content, categories } = req.body;
    if (!(title && content && categories)) {
        return res.status(400).send("Missing required parameters");
    }
    const post = new Post(req.user.login, title, new Date().toISOString().slice(0, 19).replace('T', ' '), true, content, -1);
    await post.saveSelf();
    post.setCategories(categories);
    res.status(201).send(post);
});

// POST /api/posts/{id}/like
router.post('/:id/like', auth, async (req, res) => {
    const post = await Post.getPostById(req.params.id);
    if (!post) {
        return res.status(404).send('Post does not exist');
    }
    if (await post.like(req.user.login, req.body.isLike)) {
        return res.status(201).send(`Post ${req.body.isLike ? 'liked' : 'disliked'}`);
    }
    res.status(409).send('Post is already rated by you');
});

router.patch('/:id', auth, async (req, res) => {
    const post = await Post.getPostById(req.params.id);
    const { status, title, content } = req.body;
    if (!post) {
        return res.status(404).send('Post does not exist');
    }
    if (post.author != req.user.login) {
        return res.status(403).send("You can't update this post");
    }
    post.status = status == undefined ? post.status : status;
    post.title = title ? title : post.title;
    post.content = content ? content : post.content;
    post.updateSelf();
    return res.send('Updated');
});

// DELETE /api/posts/{id}
router.delete('/:id', auth, admin, async (req, res) => {
    const post = await Post.getPostById(req.params.id);
    if (!post) {
        return res.status(404).send('Post does not exist');
    }
    Post.deleteById(req.params.id);
    res.send('Deleted');
});

// DELETE /api/posts/{id}/like
router.delete('/:id/like', auth, async (req, res) => {
    const post = await Post.getPostById(req.params.id);
    if (!post) {
        return res.status(404).send('Post does not exist');
    }
    post.unlike(req.user.login);
    res.send('Deleted');
});

module.exports = router;
