document.addEventListener('DOMContentLoaded', () => {
    // Nav logic
    document.getElementById('nav-classrooms').addEventListener('click', () => {
        document.getElementById('reservations-section').classList.add('hidden');
        document.getElementById('classrooms-section').classList.remove('hidden');
        loadClassrooms();
    });

    document.getElementById('nav-reservations').addEventListener('click', () => {
        document.getElementById('classrooms-section').classList.add('hidden');
        document.getElementById('reservations-section').classList.remove('hidden');
        loadReservations();
    });

    document.getElementById('logout-btn').addEventListener('click', async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/';
    });

    let currentClassroomId = null;

    async function loadClassrooms() {
        const res = await fetch('/api/classrooms');
        const classes = await res.json();
        const grid = document.getElementById('classrooms-grid');
        grid.innerHTML = '';
        classes.forEach(c => {
            const div = document.createElement('div');
            div.className = 'classroom-card';
            div.innerHTML = `
                ${c.image_path ? `<img src="${c.image_path}" alt="${c.name}">` : ''}
                <h3>${c.name}</h3>
                <p>${c.type} - ${c.location}</p>
                <button onclick="openReserveModal(${c.id}, '${c.name}', '${c.type} - ${c.location}')">Reservar</button>
            `;
            grid.appendChild(div);
        });
    }

    window.openReserveModal = async (id, name, desc) => {
        currentClassroomId = id;
        document.getElementById('modal-title').innerText = 'Reservar Sala';
        document.getElementById('modal-class-name').innerText = name;
        document.getElementById('modal-class-desc').innerText = desc;
        document.getElementById('reserve-id').value = '';
        document.getElementById('reserve-date').value = '';
        document.getElementById('reserve-error').innerText = '';
        document.getElementById('reserve-modal').classList.remove('hidden');
    };

    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('reserve-modal').classList.add('hidden');
    });

    document.getElementById('confirm-reserve').addEventListener('click', async () => {
        const date = document.getElementById('reserve-date').value;
        const resId = document.getElementById('reserve-id').value;
        if(!date) return;

        const method = resId ? 'PUT' : 'POST';
        const url = resId ? `/api/reservations/${resId}` : '/api/reservations';

        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ classroom_id: currentClassroomId, date })
        });
        const data = await res.json();
        if(data.success) {
            alert('Operação confirmada!');
            document.getElementById('reserve-modal').classList.add('hidden');
            if (resId) loadReservations();
        } else {
            document.getElementById('reserve-error').innerText = data.message;
        }
    });

    let reservationsData = [];
    async function loadReservations() {
        const res = await fetch('/api/reservations');
        reservationsData = await res.json();
        const list = document.getElementById('reservations-list');
        list.innerHTML = '';
        reservationsData.forEach(r => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>Sala: ${r.classroom_name} - Data: ${r.date} - Status: ${r.status}</span>
                ${r.status === 'active' ? `
                <div class="actions">
                    <button class="edit-btn" onclick="editReservation(${r.id})">Editar</button>
                    <button class="danger-btn" onclick="cancelReservation(${r.id})">Cancelar</button>
                </div>` : ''}
            `;
            list.appendChild(li);
        });
    }

    window.editReservation = (id) => {
        const r = reservationsData.find(x => x.id === id);
        if (r) {
            currentClassroomId = r.classroom_id;
            document.getElementById('modal-title').innerText = 'Alterar Data da Reserva';
            document.getElementById('modal-class-name').innerText = r.classroom_name;
            document.getElementById('modal-class-desc').innerText = '';
            document.getElementById('reserve-id').value = r.id;
            document.getElementById('reserve-date').value = r.date;
            document.getElementById('reserve-error').innerText = '';
            document.getElementById('reserve-modal').classList.remove('hidden');
        }
    }

    window.cancelReservation = async (id) => {
        const res = await fetch(`/api/reservations/${id}/cancel`, { method: 'PUT' });
        const data = await res.json();
        if(data.success) loadReservations();
    };

    loadClassrooms();
});
