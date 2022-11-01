const pool = require('../db');

class Comment {
    constructor(id, author, publish_date, content, post_id) {
        this.id = id;
        this.author = author;
        this.pubpublish_date = publish_date;
        this.content = content;
        this.post_id = post_id;
    }

    static async deleteById(id) {
        pool.query('DELETE FROM `like` WHERE `liked_entity_id` = ? AND `is_post` = FALSE', id);
        pool.query('DELETE FROM `comment` WHERE `id` = ?', id);
    }

    static async getCommentById(id) {
        const [[result]] = await pool.promise().query('SELECT * FROM `comment` WHERE `id` = ?', id);
        if (!result) {
            return null;
        }
        const { author, publish_date, content, post_id } = result;
        return new Comment(result.id, author, publish_date, content, post_id);
    }

    async getLikes() {
        const [result] = await pool.promise().query('SELECT * FROM `like` WHERE `liked_entity_id` = ? AND `is_post` = FALSE', this.id);
        return result;
    }

    async like(login, isLike) {
        try {
            await pool.promise().query('INSERT INTO `like` (`author`, `publish_date`, `is_post`, `liked_entity_id`, `is_like`)\
            VALUES (?, NOW(), FALSE, ?, ?)', [login, this.id, isLike]);
        } catch (err) {
            return false;
        }
        return true;
    }

    async unlike(login) {
        pool.query('DELETE FROM `like` WHERE `author` = ? AND `liked_entity_id` = ? AND `is_post` = FALSE', [login, this.id]);
    }

    async updateSelf() {
        pool.promise().query('UPDATE `comment` SET `content` = ? WHERE `id` = ?', [this.content, this.id]);
    }

}

module.exports = Comment;
