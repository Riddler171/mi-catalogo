const catalogRepository = require('../repositories/catalogRepository');

class CatalogService {
    async searchItems(categoryId, searchTerm = '') {
        if (!categoryId) {
            throw new Error('La categoría es requerida');
        }

        const items = await catalogRepository.searchItems(categoryId, searchTerm);
        return items;
    }

    async getCategories() {
        return await catalogRepository.getCategories();
    }
}

module.exports = new CatalogService();