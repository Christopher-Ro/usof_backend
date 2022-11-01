const User = require('../models/user');

const admin = async (req, res, next) => {
    const user = await User.getUserByLogin(req.user.login);
    if (!user || user.role != 'ADMIN') {
        return res.status(403).send('Only admins allowed here');
    }
    return next();
}

module.exports = admin;
