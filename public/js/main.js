document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if(loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            
            if (data.success) {
                if (data.user.must_change_password) {
                    document.getElementById('login-section').classList.add('hidden');
                    document.getElementById('change-password-section').classList.remove('hidden');
                } else {
                    redirect(data.user.type);
                }
            } else {
                document.getElementById('login-error').innerText = data.message;
            }
        });
    }

    const cpForm = document.getElementById('change-password-form');
    if (cpForm) {
        cpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newPassword = document.getElementById('new-password').value;
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPassword })
            });
            const data = await res.json();
            if (data.success) {
                // Must fetch user again or just redirect to admin, assuming first user is admin
                window.location.href = '/admin.html';
            }
        });
    }

    function redirect(type) {
        if (type === 1) window.location.href = '/admin.html';
        else if (type === 2) window.location.href = '/professor.html';
    }
});
