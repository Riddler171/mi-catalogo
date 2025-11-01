const database = require('../config/database');
const Item = require('../models/Item');

class CatalogRepository {
    constructor() {
        this.db = database.getConnection();
    }

    // CREATE
    async addItem(itemData) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO items (category_id, title, year, genre, format, author, artist) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            
            const params = [
                itemData.categoryId,
                itemData.title,
                itemData.year,
                itemData.genre,
                itemData.format,
                itemData.author,
                itemData.artist
            ];

            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    // READ
    async searchItems(categoryId, searchTerm) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM items WHERE category_id = ?`;
            let params = [categoryId];

            if (searchTerm) {
                sql += ` AND title LIKE ?`;
                params.push(`%${searchTerm}%`);
            }

            sql += ` ORDER BY title ASC`;

            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const items = rows.map(row => Item.fromDatabase(row));
                    resolve(items);
                }
            });
        });
    }

    async getItemById(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM items WHERE id = ?`;
            
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve(Item.fromDatabase(row));
                } else {
                    resolve(null);
                }
            });
        });
    }

    // UPDATE
    async updateItem(id, itemData) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE items 
                SET title = ?, year = ?, genre = ?, format = ?, author = ?, artist = ?
                WHERE id = ?
            `;
            
            const params = [
                itemData.title,
                itemData.year,
                itemData.genre,
                itemData.format,
                itemData.author,
                itemData.artist,
                id
            ];

            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0);
                }
            });
        });
    }

    // DELETE
    async deleteItem(id) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM items WHERE id = ?`;
            
            this.db.run(sql, [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0);
                }
            });
        });
    }

    async getCategories() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM categories ORDER BY name`;
            
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

module.exports = new CatalogRepository();