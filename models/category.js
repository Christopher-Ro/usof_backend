const pool = require('../db');

class Category {
    constructor(title, description, id) {
        this.title = title;
        this.description = description;
        this.id = id;
    }

    static async getAllCategories() {
        const [result] = await pool.promise().query('SELECT * FROM `category`');
        return result;
    }

    static async getCategoryById(id) {
        const [[result]] = await pool.promise().query('SELECT * FROM `category` WHERE `id` = ?', id);
        if (!result) {
            return null;
        }
        const { title, description } = result;
        return new Category(title, description, result.id);
    }

    static async deleteById(id) {
        pool.query('DELETE FROM `post_category` WHERE `category_id` = ?', id);
        pool.query('DELETE FROM `category` WHERE `id` = ?', id);
    }

    async saveSelf() {
        const [result] = await pool.promise().query('INSERT INTO `category` (`title`, `description`)\
        VALUES (?, ?)', [this.title, this.description]);
        this.id = result.insertId;
        return this;
    }

    async updateSelf() {
        pool.query('UPDATE `category` SET `title` = ?, `description` = ? WHERE `id` = ?', [this.title, this.description, this.id]);
    }
}

module.exports = Category;
