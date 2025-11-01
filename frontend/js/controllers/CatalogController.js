class CatalogController {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000/api';
        this.currentCategory = null;
        this.currentResults = [];
        this.categories = [];
    }

    async init() {
        await this.loadCategories();
    }

    async loadCategories() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/catalog/categories`);
            const data = await response.json();
            
            if (data.success) {
                this.categories = data.data;
                console.log('Categorías cargadas:', this.categories);
            }
        } catch (error) {
            console.error('Error cargando categorías:', error);
        }
    }

    async searchItems(categoryId, searchTerm = '') {
        try {
            const url = `${this.apiBaseUrl}/catalog/search?category=${categoryId}&term=${encodeURIComponent(searchTerm)}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.success) {
                this.currentResults = data.data;
                return this.currentResults;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error en búsqueda:', error);
            throw error;
        }
    }

    getCurrentResults() {
        return this.currentResults;
    }

    setCurrentCategory(categoryId) {
        this.currentCategory = categoryId;
    }

    getCurrentCategory() {
        return this.currentCategory;
    }

    getCategoryName(categoryId) {
        const category = this.categories.find(cat => cat.id == categoryId);
        return category ? category.name : 'Desconocido';
    }
}