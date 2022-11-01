const pool = require('../db');

class User {
    constructor(login, password, fullName, email, profilePicture, rating, role) {
        this.login = login;
        this.password = password;
        this.fullName = fullName;
        this.email = email;
        this.profilePicture = profilePicture;
        this.rating = rating;
        this.role = role;
    }

    static async getUsers() {
        const [result] = await pool.promise().query('SELECT * FROM `user`');
        return result;
    }

    static async deleteByLogin(login) {
        try {
            await pool.promise().query('DELETE FROM `user` WHERE `login` = ?', login);
        } catch (err) {
            console.log(err);
        }
    }

    static async getUserByLogin(login) {
        let user = new User();
        user = await user.findByLogin(login);
        if (!user.login) {
            return null;
        }
        return user;
    }

    static async isEmailUsed(email) {
        const [[result]] = await pool.promise().query('SELECT * FROM `user` WHERE `email` = ?', email);
        return result;
    }

    async findByLogin(login) {
        const [[result]] = await pool.promise().query('SELECT * FROM `user` WHERE `login` = ?', login);
        if (!result) {
            return this;
        }
        this.login = result.login ? result.login : '';
        this.password = result.password ? result.password : '';
        this.fullName = result.fullName ? result.fullName : '';
        this.email = result.email ? result.email : '';
        this.profilePicture = result.profile_picture ? result.profile_picture : '';
        this.rating = result.rating ? result.rating : 0;
        this.role = result.role ? result.role : 'USER';
        return this;
    }

    async saveSelf() {
        this.fullName = this.fullName ? this.fullName : "";
        this.profilePicture = this.profilePicture ? this.profilePicture : "";
        this.role = this.role ? this.role : "USER";
        this.rating = this.rating ? this.rating : 0;

        try {
            await pool.promise().query("\
                INSERT INTO `user` (`login`, `password`, `full_name`, `email`, `profile_pictrue`, `rating`, `role`)\
                VALUES (?, ?, ?, ?, ?, ?, ?);\
            ", [this.login, this.password, this.fullName, this.email, this.profilePicture, this.rating, this.role]);
            return this;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async updateSelf() {
        try {
            await pool.promise().query("\
                UPDATE `user`\
                SET `password` = ?, `full_name` = ?, `email` = ?, `profile_pictrue` = ?, `rating` = ?, `role` = ?\
                WHERE `login` = ?;\
            ", [this.password, this.fullName, this.email, this.profilePicture, this.rating, this.role, this.login]);
            return this;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async setAvatar() {
        pool.query("UPDATE `user` SET `profile_pictrue` = ? WHERE `login` = ?", [this.profilePicture, this.login]);
    }
}

module.exports = User;
