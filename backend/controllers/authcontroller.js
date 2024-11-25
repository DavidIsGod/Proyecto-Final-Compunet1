const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usersFilePath = './data/users.json';
const JWT_SECRET = '7#PqT$3xW9@L2';

// Cargar usuarios
let users = fs.existsSync(usersFilePath) ? JSON.parse(fs.readFileSync(usersFilePath, 'utf8')) : [];

// Registrar usuario
exports.registerUser = async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role || (role !== 'admin' && role !== 'client')) {
        return res.status(400).json({ message: 'Datos inválidos o incompletos' });
    }

    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: users.length + 1, username, password: hashedPassword, role };
    users.push(newUser);

    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    res.status(201).json({ message: 'Usuario registrado exitosamente', user: { username, role } });
};

// Iniciar sesión
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Datos inválidos o incompletos' });
    }

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({
        message: 'Inicio de sesión exitoso',
        token,
        user: { username: user.username, role: user.role }
    });
};
