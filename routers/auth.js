const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user')
const auth = require('../middleware/authorization');
const token_key = "TOKEN_SECRET";
const router = express.Router();

router.get('/', auth, (req, res) => {
    res.send(req.user.login);
});

router.post('/register', async (req, res) => {
    let { login, password, email } = req.body;
    if (!(email && password && login)) {
        return res.status(400).send("Missing required parameters");
    }
    email = email.toLowerCase();
    password = await bcrypt.hash(password, 10);
    const old = await User.getUserByLogin(login);
    if (old) {
        return res.status(409).send("User already exists");
    }
    if (await User.isEmailUsed(email)) {
        return res.status(409).send("Email is already in use");
    }
    const user = new User();
    user.login = login;
    user.password = password;
    user.email = email;
    user.saveSelf();
    const token = jwt.sign(
        { login: login },
        token_key,
        { expiresIn: '2h' }
    );
    user.token = token;
    res.status(201).json(user);
});

router.post('/login', async (req, res) => {
    let { login, password } = req.body;
    const user = await User.getUserByLogin(login);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).send("Invalid credentials");
    }
    user.token = jwt.sign(
        { login: login },
        token_key,
        { expiresIn: '2h' }
    )
    res.status(200).json(user);
});

module.exports = router;
