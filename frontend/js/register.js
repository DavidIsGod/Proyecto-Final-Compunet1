document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar recargar la página

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    try {
        const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role })
        });
    
        if (!response.ok) {
            console.error('Respuesta del servidor no OK:', response);
            throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }
    
        const data = await response.json(); // Ahora "data" estará definido
        console.log('Usuario creado:', data);

        const messageElement = document.getElementById('response-message');
        
        messageElement.innerHTML = `
            <span style="color: green;">¡Registro exitoso! Bienvenido, ${data.user.username}.</span>
        `;
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    
        if (response.ok) {
            messageElement.className = 'message-box success-box';
                messageElement.innerHTML = `
                    <span class="message-icon">✅</span>
                    ¡Registro exitoso! Bienvenido, ${data.user.username}.
                `;
                document.getElementById('register-form').reset();
                setTimeout(() => {
                    messageElement.style.opacity = '0';
                    setTimeout(() => {
                        messageElement.style.display = 'none';
                        messageElement.style.opacity = '1';
                        window.location.href = 'login.html';
                    }, 300);
                }, 3000);
            
        } else {
            document.getElementById('response-message').innerText = `Error: ${data.message}`;
        }
    } catch (error) {
        console.error('Error durante el registro:', error);
        messageElement.innerHTML = `
        <span style="color: red;">Error: ${error.message}</span>
    `;
    messageElement.style.display = 'block';

    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);

    }
    
});

