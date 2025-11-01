const express = require('express');
const catalogService = require('../services/catalogService');

const router = express.Router();

// GET /api/catalog/search?category=1&term=matrix
router.get('/search', async (req, res) => {
    try {
        const { category, term } = req.query;
        
        if (!category) {
            return res.status(400).json({ 
                success: false, 
                message: 'El parámetro category es requerido' 
            });
        }

        const items = await catalogService.searchItems(parseInt(category), term);
        
        res.json({
            success: true,
            data: items,
            count: items.length
        });
    } catch (error) {
        console.error('Error en búsqueda:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
});

// GET /api/catalog/categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await catalogService.getCategories();
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error obteniendo categorías:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' 
        });
    }
});

module.exports = router;