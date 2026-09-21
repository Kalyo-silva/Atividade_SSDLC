document.addEventListener('DOMContentLoaded', () => {
    // Nav logic
    document.getElementById('nav-users').addEventListener('click', () => {
        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('users-section').classList.remove('hidden');
        document.getElementById('classrooms-section').classList.add('hidden');
        loadUsers();
    });

    document.getElementById('nav-classrooms').addEventListener('click', () => {
        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('users-section').classList.add('hidden');
        document.getElementById('classrooms-section').classList.remove('hidden');
        loadClassrooms();
    });

    document.getElementById('logout-btn').addEventListener('click', async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/';
    });

    // Dashboard
    function updateIndicator(elementId, value) {
        const valueEl = document.getElementById(elementId);
        if (valueEl) {
            valueEl.innerText = value;
        }
    }

    async function loadDashboard() {
        const [cRes, rRes] = await Promise.all([
            fetch('/api/classrooms'),
            fetch('/api/reservations')
        ]);
        if(cRes.ok && rRes.ok) {
            const classes = await cRes.json();
            const res = await rRes.json();
            
            const today = new Date().toISOString().split('T')[0];
            const todayResCount = res.filter(r => r.date === today && r.status === 'active').length;
            
            updateIndicator('dash-classrooms', classes.length);
            updateIndicator('dash-reservations', res.length);
            updateIndicator('dash-today', todayResCount);
        }
    }
    loadDashboard();

    // Users
    let usersData = [];
    async function loadUsers() {
        const res = await fetch('/api/users');
        usersData = await res.json();
        const list = document.getElementById('users-list');
        list.innerHTML = '';
        usersData.forEach(u => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${u.username} - ${u.type === 1 ? 'Admin' : 'Professor'}</span>
                <div class="actions">
                    <button class="edit-btn" onclick="editUser(${u.id})">Editar</button>
                </div>
            `;
            list.appendChild(li);
        });
    }

    window.editUser = (id) => {
        const user = usersData.find(u => u.id === id);
        if(user) {
            document.getElementById('user-id').value = user.id;
            document.getElementById('user-name').value = user.username;
            document.getElementById('user-type').value = user.type;
            document.getElementById('user-pass').required = false;
            document.getElementById('user-submit-btn').innerText = 'Atualizar Usuário';
            document.getElementById('user-cancel-btn').classList.remove('hidden');
        }
    };

    document.getElementById('user-cancel-btn').addEventListener('click', () => {
        document.getElementById('user-form').reset();
        document.getElementById('user-id').value = '';
        document.getElementById('user-pass').required = true;
        document.getElementById('user-submit-btn').innerText = 'Salvar Usuário';
        document.getElementById('user-cancel-btn').classList.add('hidden');
    });

    document.getElementById('user-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('user-id').value;
        const username = document.getElementById('user-name').value;
        const password = document.getElementById('user-pass').value;
        const type = document.getElementById('user-type').value;

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/users/${id}` : '/api/users';

        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, type })
        });
        
        document.getElementById('user-cancel-btn').click();
        loadUsers();
    });

    // Classrooms
    let classroomsData = [];
    async function loadClassrooms() {
        const res = await fetch('/api/classrooms');
        classroomsData = await res.json();
        const list = document.getElementById('classrooms-list');
        list.innerHTML = '';
        classroomsData.forEach(c => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${c.name} (${c.type}) - ${c.location}</span>
                <div class="actions">
                    <button class="edit-btn" onclick="editClassroom(${c.id})">Editar</button>
                    <button class="danger-btn" onclick="deleteClassroom(${c.id})">Excluir</button>
                </div>
            `;
            list.appendChild(li);
        });
    }

    window.editClassroom = (id) => {
        const c = classroomsData.find(c => c.id === id);
        if(c) {
            document.getElementById('class-id').value = c.id;
            document.getElementById('class-name').value = c.name;
            document.getElementById('class-location').value = c.location;
            document.getElementById('class-type').value = c.type;
            document.getElementById('class-submit-btn').innerText = 'Atualizar Sala';
            document.getElementById('class-cancel-btn').classList.remove('hidden');
        }
    };

    document.getElementById('class-cancel-btn').addEventListener('click', () => {
        document.getElementById('classroom-form').reset();
        document.getElementById('class-id').value = '';
        document.getElementById('class-submit-btn').innerText = 'Salvar Sala';
        document.getElementById('class-cancel-btn').classList.add('hidden');
    });

    window.deleteClassroom = async (id) => {
        const res = await fetch(`/api/classrooms/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if(!data.success) alert(data.message);
        else loadClassrooms();
    };

    document.getElementById('classroom-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('class-id').value;
        const formData = new FormData();
        formData.append('name', document.getElementById('class-name').value);
        formData.append('location', document.getElementById('class-location').value);
        formData.append('type', document.getElementById('class-type').value);
        const image = document.getElementById('class-image').files[0];
        if (image) formData.append('image', image);

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/classrooms/${id}` : '/api/classrooms';

        await fetch(url, {
            method: method,
            body: formData
        });

        document.getElementById('class-cancel-btn').click();
        loadClassrooms();
    });
});
