document.addEventListener('DOMContentLoaded', async () => {
    const invitedList = document.getElementById('invited-list');
    const invitedName = document.getElementById('invited-name');
    const invitedEmail = document.getElementById('invited-email');
    const addInvitedBtn = document.getElementById('add-invited-btn');
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get('eventId');

    if (!eventId) {
        alert("ID do evento não encontrado!");
        window.location.href = "/home.html";
    }

    let editingInvitedId = null;

    const loadInvitedList = async () => {
        try {
            const response = await axios.get(`https://uniforgerenciadorbackend-bqmzywii.b4a.run/api/inviteds/${eventId}`, { withCredentials: true });
            const invitedData = response.data;
            displayInvitedList(invitedData);
        } catch (error) {
            console.error('Erro ao carregar convidados:', error);
        }
    };

    const displayInvitedList = (invitedData) => {
        invitedList.innerHTML = '';
        invitedData.forEach((invited) => {
            const row = document.createElement('tr');
            row.innerHTML = `
          <td>${invited.name}</td>
          <td>${invited.email}</td>
          <td>
            <button data-id="${invited._id}" class="btn btn-warning btn-sm edit-btn">Editar</button>
            <button data-id="${invited._id}" class="btn btn-danger btn-sm delete-btn">Excluir</button>
          </td>
        `;
            invitedList.appendChild(row);
        });
    };

    addInvitedBtn.addEventListener('click', async () => {
        const name = invitedName.value;
        const email = invitedEmail.value;

        if (!name || !email) {
            alert('Preencha todos os campos!');
            return;
        }

        try {
            if (editingInvitedId) {
                await axios.put(`https://uniforgerenciadorbackend-bqmzywii.b4a.run/api/inviteds/${editingInvitedId}`, { name, email }, { withCredentials: true });
                editingInvitedId = null;
            } else {
                await axios.post(`https://uniforgerenciadorbackend-bqmzywii.b4a.run/api/inviteds/${eventId}`, { name, email }, { withCredentials: true });
            }

            invitedName.value = '';
            invitedEmail.value = '';
            loadInvitedList();
        } catch (error) {
            console.error('Erro ao salvar convidado:', error);
        }
    });


    invitedList.addEventListener('click', async (event) => {
        if (event.target.classList.contains('edit-btn')) {
            const id = event.target.getAttribute('data-id');
            const row = event.target.closest('tr');
            const name = row.cells[0].textContent;
            const email = row.cells[1].textContent;

            invitedName.value = name;
            invitedEmail.value = email;
            editingInvitedId = id;
        }
    });

    invitedList.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const id = event.target.getAttribute('data-id');
            try {
                await axios.delete(`https://uniforgerenciadorbackend-bqmzywii.b4a.run/api/inviteds/${id}`, { withCredentials: true });
                loadInvitedList();
            } catch (error) {
                console.error('Erro ao excluir convidado:', error);
            }
        }
    });

    loadInvitedList();
});
