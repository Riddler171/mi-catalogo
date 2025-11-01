class UIHandler {
    constructor(controller) {
        this.controller = controller;
        this.elements = {};
        this.initializeElements();
    }

    initializeElements() {
        this.elements = {
            categoryButtons: document.querySelectorAll('.category-btn'),
            searchInput: document.getElementById('searchInput'),
            searchBtn: document.getElementById('searchBtn'),
            resultsContainer: document.getElementById('resultsContainer'),
            loadingIndicator: document.getElementById('loadingIndicator')
        };
    }

    setupEventListeners() {
        this.elements.categoryButtons.forEach(button => {
            button.addEventListener('click', () => this.handleCategoryChange(button));
        });

        this.elements.searchBtn.addEventListener('click', () => this.handleSearch());
        this.elements.searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        this.elements.searchInput.addEventListener('input', (e) => {
            if (e.target.value.length >= 2 || e.target.value.length === 0) {
                this.handleSearch();
            }
        });
    }

    async handleCategoryChange(button) {
        const categoryId = button.dataset.category;
        
        this.updateActiveCategory(button);
        this.controller.setCurrentCategory(categoryId);
        this.updateSearchPlaceholder(categoryId);
        
        this.elements.searchInput.value = '';
        await this.handleSearch();
    }

    updateActiveCategory(activeButton) {
        this.elements.categoryButtons.forEach(btn => {
            btn.classList.remove('active', 'btn-primary', 'btn-success', 'btn-warning');
            btn.classList.add('btn-outline-primary', 'btn-outline-success', 'btn-outline-warning');
        });
        
        activeButton.classList.remove('btn-outline-primary', 'btn-outline-success', 'btn-outline-warning');
        
        const categoryType = activeButton.dataset.category;
        if (categoryType === '1') {
            activeButton.classList.add('btn-primary');
        } else if (categoryType === '2') {
            activeButton.classList.add('btn-success');
        } else if (categoryType === '3') {
            activeButton.classList.add('btn-warning');
        }
        
        activeButton.classList.add('active');
    }

    updateSearchPlaceholder(categoryId) {
        const categoryName = this.controller.getCategoryName(categoryId);
        this.elements.searchInput.placeholder = `Buscar en ${categoryName}...`;
    }

    async handleSearch() {
        const categoryId = this.controller.getCurrentCategory();
        const searchTerm = this.elements.searchInput.value.trim();
        
        if (!categoryId) {
            this.showMessage('Por favor, selecciona una categoría primero.');
            return;
        }

        this.showLoading();

        try {
            const results = await this.controller.searchItems(categoryId, searchTerm);
            this.displayResults(results, searchTerm);
        } catch (error) {
            this.showMessage('Error al realizar la búsqueda. Intenta nuevamente.');
            console.error('Error en búsqueda:', error);
        } finally {
            this.hideLoading();
        }
    }

    displayResults(results, searchTerm) {
        if (results.length === 0) {
            if (searchTerm === '') {
                this.showEmptyState('Selecciona una categoría y busca en tu colección', 'search');
            } else {
                this.showEmptyState(`No se encontraron resultados para "${searchTerm}"`, 'times-circle');
            }
            return;
        }

        const categoryId = this.controller.getCurrentCategory();
        let resultsHTML = '<div class="row g-3">';
        
        results.forEach(item => {
            resultsHTML += this.createItemCard(item, categoryId);
        });
        
        resultsHTML += '</div>';
        this.elements.resultsContainer.innerHTML = resultsHTML;
    }

    createItemCard(item, categoryId) {
        let details = '';
        
        if (categoryId === '1') {
            details = `
                <small class="text-muted">Año: ${item.year || 'N/A'}</small><br>
                <small class="text-muted">Género: ${item.genre || 'N/A'}</small><br>
                <small class="text-muted">Formato: ${item.format || 'N/A'}</small>
            `;
        } else if (categoryId === '2') {
            details = `
                <small class="text-muted">Autor: ${item.author || 'N/A'}</small><br>
                <small class="text-muted">Año: ${item.year || 'N/A'}</small><br>
                <small class="text-muted">Formato: ${item.format || 'N/A'}</small>
            `;
        } else if (categoryId === '3') {
            details = `
                <small class="text-muted">Artista: ${item.artist || 'N/A'}</small><br>
                <small class="text-muted">Año: ${item.year || 'N/A'}</small><br>
                <small class="text-muted">Género: ${item.genre || 'N/A'}</small><br>
                <small class="text-muted">Formato: ${item.format || 'N/A'}</small>
            `;
        }

        return `
            <div class="col-12 col-sm-6 col-md-4">
                <div class="card item-card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">${details}</p>
                    </div>
                </div>
            </div>
        `;
    }

    showEmptyState(message, icon = 'search') {
        this.elements.resultsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-${icon} fa-3x mb-3"></i>
                <p>${message}</p>
            </div>
        `;
    }

    showMessage(message) {
        alert(message);
    }

    showLoading() {
        this.elements.loadingIndicator.style.display = 'block';
    }

    hideLoading() {
        this.elements.loadingIndicator.style.display = 'none';
    }
}