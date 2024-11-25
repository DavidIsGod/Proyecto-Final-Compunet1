const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Rutas
const productRoutes = require('/routes/products');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');


// Ruta principal
app.get('/', (req, res) => res.send('API funcionando correctamente'));

// Usar las rutas separadas
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/products', productRoutes);



// Arrancar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
