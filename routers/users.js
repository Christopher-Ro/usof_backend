const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const path = require('path');
const admin = require('../middleware/admin');

// Global path will be /api/users

// GET /api/users
router.get('/', admin, async (req, res) => {
    res.send(await User.getUsers());
});

// GET /api/users/{login}
router.get('/:login', admin, async (req, res) => {
    const result = await User.getUserByLogin(req.params.login);
    if (result) {
        res.send(result);
    }
    else {
        res.status(404).send(`User with login ${req.params.login} not found`);
    }
});

// POST /api/users
router.post('/', admin, async (req, res) => {
    let { login, password, email, profilePicture, fullName, rating, role } = req.body;
    const user = new User(login, password, fullName, email, profilePicture, rating, role);
    if (!(login && password && email)) {
        return res.status(400).send('Login, password and email are required');
    }
    user.fullName = user.fullName ? user.fullName : '';
    user.profilePicture = user.profilePicture ? user.profilePicture : '';
    user.role = user.role ? user.role : 'USER';
    user.rating = user.rating ? user.rating : 0;
    user.password = await bcrypt.hash(password, 10);
    if (await user.saveSelf()) {
        return res.status(201).send(user);
    }
    return res.status(409).send('Constraints failed');
});

// PATCH /api/users/avatar
router.patch('/avatar', async (req, res) => {
    if (!(req.files && req.files.avatar)) {
        return res.status(400).send('aRE yoU sTUpiD?');
    }
    if (req.files.avatar.mimetype.includes('image')) {
        const user = await User.getUserByLogin(req.user.login);
        user.profilePicture = `${req.user.login}.jpg`
        user.setAvatar();
        req.files.avatar.mv(path.join(__dirname, `../public/${user.profilePicture}`));
        return res.status(201).send(`Picture saved as ${user.profilePicture}`);
    }
    res.status(415).send('Only pictures are accepted');
});

// PATCH /api/users/{login}
router.patch('/:login', admin, async (req, res) => {
    let { password, email, profile_picture, fullName, rating, role } = req.body;
    const user = await User.getUserByLogin(req.params.login);
    if (!user) {
        return res.status(404).send('No user to update');
    }
    user.email = email ? email : user.email;
    user.fullName = fullName ? fullName : user.fullName;
    user.profilePicture = profile_picture ? profile_picture : user.profilePicture;
    user.role = role ? role : user.role;
    user.rating = rating ? rating : user.rating;
    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }
    if (!(await user.updateSelf())) {
        return res.status(409).send("Constraints violated");
    }
    res.send("Updated");
});

// DELETE /api/users/{login}
router.delete('/:login', admin, async (req, res) => {
    if (!(await User.getUserByLogin(req.params.login))) {
        return res.status(404).send(`User ${req.params.login} not found and can not be deleted`);
    }
    User.deleteByLogin(req.params.login);
    res.send(`Deleted ${req.params.login}`);
});

module.exports = router;
