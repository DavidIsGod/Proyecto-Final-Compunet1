document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar recargar la página

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    const messageElement = document.getElementById('response-message');

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role })
        });

        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Mostrar mensaje de éxito
        messageElement.innerHTML = `
            <span style="color: green;">¡Registro exitoso! Redirigiendo a la página de inicio de sesión...</span>
        `;
        messageElement.style.display = 'block';

        // Redirigir a login.html después de 2 segundos
        setTimeout(() => {
            window.location.href = 'login.html'; // Redirección
        }, 2000); // 2000 ms = 2 segundos

    } catch (error) {
        console.error('Error durante el registro:', error);

        // Mostrar mensaje de error
        messageElement.innerHTML = `
            <span style="color: red;">Error: ${error.message}</span>
        `;
        messageElement.style.display = 'block';
    }
});
