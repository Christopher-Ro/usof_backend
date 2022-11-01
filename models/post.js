const pool = require('../db');

class Post {
    constructor(author, title, publishDate, status, content, id) {
        this.author = author;
        this.title = title;
        this.publishDate = publishDate;
        this.status = status;
        this.content = content;
        this.id = id;
    }

    static async getAllPosts() {
        const [result] = await pool.promise().query('SELECT * FROM `post` WHERE `status` = TRUE');
        return result;
    }

    static async getPostById(id) {
        const [[result]] = await pool.promise().query('SELECT * FROM `post` WHERE `id` = ?', id);
        if (!result) {
            return null;
        }
        const { author, title, status, publish_date, content } = result;
        return new Post(author, title, publish_date, status, content, id);
    }

    static async deleteById(id) {
        pool.query('DELETE FROM `post_category` WHERE `post_id` = ?', id);
        pool.query('DELETE FROM `comment` WHERE `post_id` = ?', id);
        pool.query('DELETE FROM `like` WHERE `liked_entity_id` = ? AND `is_post` = TRUE', id);
        pool.query('DELETE FROM `post` WHERE `id` = ?', id);
    }

    static async getCommentsById(id) {
        const [result] = await pool.promise().query('SELECT * FROM `comment` WHERE `post_id` = ?', id);
        return result;
    }

    async addComment(login, content) {
        pool.query('INSERT INTO `comment` (`author`, `publish_date`, `content`, `post_id`)\
        VALUES (?, NOW(), ?, ?)', [login, content, this.id]);
    }

    async getOwnCategories() {
        const [result] = await pool.promise().query('SELECT * FROM `category` WHERE `id` IN (SELECT `category_id` FROM `post_category` WHERE `post_id` = ?)', this.id);
        return result;
    }

    async getOwnLikes() {
        const [result] = await pool.promise().query('SELECT * FROM `like` WHERE `is_post` = TRUE AND `liked_entity_id` = ?', this.id);
        return result;
    }

    async saveSelf() {
        const [result] = await pool.promise().query('INSERT INTO `post` (`author`, `title`, `status`, `publish_date`, `content`)\
        VALUES (?, ?, ?, ?, ?)', [this.author, this.title, this.status, this.publishDate, this.content]);
        this.id = result.insertId;
        return result;
    }

    async setCategories(categories) {
        for (let i = 0; i < categories.length; i++) {
            const el = categories[i];
            try {
                await pool.promise().query('INSERT INTO `post_category` (`post_id`, `category_id`)\
                VALUES (?, ?)', [this.id, el]);
            } catch (ignore) {

            }
        }
    }

    async like(login, isLike) {
        try {
            await pool.promise().query('INSERT INTO `like` (`author`, `publish_date`, `is_post`, `liked_entity_id`, `is_like`)\
            VALUES (?, NOW(), TRUE, ?, ?)', [login, this.id, isLike]);
        } catch (err) {
            return false;
        }
        return true;
    }

    async unlike(login) {
        pool.query('DELETE FROM `like` WHERE `author` = ? AND `liked_entity_id` = ? AND `is_post` = TRUE', [login, this.id]);
    }

    async updateSelf() {
        pool.query('UPDATE `post` SET `title` = ?, `content` = ?, `status` = ? WHERE `id` = ?', [this.title, this.content, this.status, this.id]);
    }
}

module.exports = Post;
