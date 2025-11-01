class Item {
    constructor(id, categoryId, title, year, genre, format, author, artist, createdAt) {
        this.id = id;
        this.categoryId = categoryId;
        this.title = title;
        this.year = year;
        this.genre = genre;
        this.format = format;
        this.author = author;
        this.artist = artist;
        this.createdAt = createdAt;
    }

    static fromDatabase(row) {
        return new Item(
            row.id,
            row.category_id,
            row.title,
            row.year,
            row.genre,
            row.format,
            row.author,
            row.artist,
            row.created_at
        );
    }

    toJSON() {
        return {
            id: this.id,
            categoryId: this.categoryId,
            title: this.title,
            year: this.year,
            genre: this.genre,
            format: this.format,
            author: this.author,
            artist: this.artist,
            createdAt: this.createdAt
        };
    }
}

module.exports = Item;