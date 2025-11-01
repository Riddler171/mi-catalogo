const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
    constructor() {
        // Usar SQLite en desarrollo, PostgreSQL en producción
        if (process.env.NODE_ENV === 'production') {
            this.initPostgreSQL();
        } else {
            this.initSQLite();
        }
    }

    initSQLite() {
        this.dbPath = path.join(__dirname, '../database/catalog.db');
        console.log('📍 Usando SQLite en:', this.dbPath);
        
        const dbDir = path.dirname(this.dbPath);
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        this.db = new sqlite3.Database(this.dbPath, (err) => {
            if (err) {
                console.error('❌ Error con SQLite:', err.message);
            } else {
                console.log('✅ Conectado a SQLite.');
                this.createTables();
            }
        });
    }

    initPostgreSQL() {
        console.log('📍 Usando PostgreSQL en producción');
        // En producción usaremos PostgreSQL con Render
        // La conexión se configurará con variables de entorno
    }

    getConnection() {
        return this.db;
    }

    // El resto del código se mantiene igual...
    createTables() {
        console.log('🗃️ Creando tablas...');
        const initSQL = `
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                year INTEGER,
                genre TEXT,
                format TEXT,
                author TEXT,
                artist TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id),
                UNIQUE(category_id, title)
            );

            INSERT OR IGNORE INTO categories (id, name) VALUES 
            (1, 'movies'), 
            (2, 'books'), 
            (3, 'music');

            INSERT OR IGNORE INTO items (category_id, title, year, genre, format) VALUES 
            (1, 'El Padrino', 1972, 'Drama', 'Digital'),
            (1, 'Matrix', 1999, 'Ciencia Ficción', 'Blu-ray'),
            (2, 'Cien años de soledad', 1967, 'Realismo Mágico', 'Físico'),
            (2, '1984', 1949, 'Distopía', 'Digital'),
            (3, 'Thriller', 1982, 'Pop', 'Digital'),
            (3, 'The Dark Side of the Moon', 1973, 'Rock', 'Vinilo');
        `;

        this.db.exec(initSQL, (err) => {
            if (err) {
                console.error('❌ Error creando tablas:', err);
            } else {
                console.log('✅ Tablas inicializadas correctamente.');
            }
        });
    }
}

module.exports = new Database();