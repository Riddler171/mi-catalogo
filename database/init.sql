-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ítems
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

-- Insertar categorías por defecto
INSERT OR IGNORE INTO categories (id, name) VALUES 
(1, 'movies'), 
(2, 'books'), 
(3, 'music');

-- Insertar datos de ejemplo
INSERT OR IGNORE INTO items (category_id, title, year, genre, format) VALUES 
(1, 'El Padrino', 1972, 'Drama', 'Digital'),
(1, 'Matrix', 1999, 'Ciencia Ficción', 'Blu-ray'),
(2, 'Cien años de soledad', 1967, 'Realismo Mágico', 'Físico'),
(2, '1984', 1949, 'Distopía', 'Digital'),
(3, 'Thriller', 1982, 'Pop', 'Digital'),
(3, 'The Dark Side of the Moon', 1973, 'Rock', 'Vinilo');