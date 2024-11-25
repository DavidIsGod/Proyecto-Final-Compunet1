document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const messageElement = document.getElementById('response-message');

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Respuesta del servidor:', data);

        messageElement.innerHTML = `¡Inicio de sesión exitoso! Redirigiendo...`;
        messageElement.style.color = 'green';

        setTimeout(() => {
            if (data.user.role === 'admin') {
                window.location.href = 'indexAdmin.html';
            } else if (data.user.role === 'client') {
                window.location.href = 'indexClient.html';
            } else {
                messageElement.innerHTML = `Error: Rol desconocido`;
                messageElement.style.color = 'red';
            }
        }, 2000);
    } catch (error) {
        console.error('Error durante el inicio de sesión:', error);
        messageElement.innerHTML = `Error: ${error.message}`;
        messageElement.style.color = 'red';
    }
});
