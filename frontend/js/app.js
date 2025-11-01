document.addEventListener('DOMContentLoaded', async function() {
    try {
        const catalogController = new CatalogController();
        const uiHandler = new UIHandler(catalogController);
        
        uiHandler.setupEventListeners();
        await catalogController.init();
        
        console.log('✅ Aplicación inicializada correctamente');
    } catch (error) {
        console.error('❌ Error inicializando la aplicación:', error);
    }
});