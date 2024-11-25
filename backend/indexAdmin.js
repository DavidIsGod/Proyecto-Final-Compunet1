const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcryptjs');


const app = express();
app.use(bodyParser.json());
app.use(cors());

// Ruta principal
app.get('/', (req, res) => {
    res.send('API funcionando correctamente');
});

// Rutas de productos
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);


const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

// Cargar usuarios existentes desde un archivo JSON
const usersFilePath = './data/users.json';
let users = [];

// Cargar usuarios al iniciar el servidor
if (fs.existsSync(usersFilePath)) {
    users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
}

// Endpoint para registrar un usuario
app.post('/api/register', async (req, res) => {
    console.log(`Solicitud recibida: ${req.method} ${req.url}`);
    const { username, password, role } = req.body;

    // Validar datos
    if (!username || !password || !role || (role !== 'admin' && role !== 'client')) {
        return res.status(400).json({ message: 'Datos inválidos o incompletos' });
    }

    // Verificar si el usuario ya existe
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Registrar nuevo usuario
    const newUser = { id: users.length +1, username, password : hashedPassword, role };
    users.push(newUser);

    // Guardar en el archivo JSON
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    res.status(201).json({ message: 'Usuario registrado exitosamente', user: { username, role } });
});

const JWT_SECRET = '7#PqT$3xW9@L2';

const jwt = require('jsonwebtoken');

// Endpoint para iniciar sesión
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    // Validar datos
    if (!username || !password) {
        return res.status(400).json({ message: 'Datos inválidos o incompletos' });
    }

    // Buscar usuario
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({
        message: 'Inicio de sesión exitoso',
        token,
        user: {
            username: user.username,
            role: user.role
        }
    });
});

// Middleware para proteger rutas
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

// Ejemplo de ruta protegida
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Ruta protegida', user: req.user });
});



