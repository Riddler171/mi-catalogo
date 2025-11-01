const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const catalogController = require('./controllers/catalogController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/catalog', catalogController);

// Servir archivos estáticos del frontend
app.use(express.static('../frontend'));

app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});