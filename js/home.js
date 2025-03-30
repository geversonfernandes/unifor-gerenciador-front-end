document.addEventListener('DOMContentLoaded', async () => {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  const token = getCookie('token');

  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  const apiUrl = 'https://uniforgerenciadorbackend-bqmzywii.b4a.run/api/events';

  const eventList = document.getElementById('event-list');
  const eventName = document.getElementById('event-name');
  const eventDate = document.getElementById('event-date');
  const addEventBtn = document.getElementById('add-event-btn');
  let editingEventId = null;

  const loadEventList = async () => {
    try {
      const response = await axios.get(apiUrl, { withCredentials: true });
      const eventListData = response.data;
      displayEventList(eventListData);
    } catch (error) {
      console.error('Erro ao carregar a lista de eventos:', error);
    }
  };

  const displayEventList = (eventListData) => {
    eventList.innerHTML = '';

    eventListData.forEach((event) => {
      const formattedDate = new Date(event.date).toISOString().split('T')[0];

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${event.name}</td>
        <td>${formattedDate}</td>  <!-- Exibir data formatada -->
        <td>
          <button data-id="${event._id}" class="btn btn-info btn-sm mt-1 mb-1 inviteds-btn"><i class="bi bi-person-plus"></i> Convidados</button>
          <button data-id="${event._id}" class="btn btn-warning btn-sm mt-1 mb-1 edit-btn"><i class="bi bi-pencil"></i> Editar</button>
          <button data-id="${event._id}" class="btn btn-danger btn-sm mt-1 mb-1 delete-btn"><i class="bi bi-trash"></i> Excluir</button>
        </td>
      `;
      eventList.appendChild(row);
    });
  };

  addEventBtn.addEventListener('click', async () => {
    const name = eventName.value;
    const date = eventDate.value;

    if (!name || !date) {
      alert('Preencha todos os campos!');
      return;
    }

    try {
      if (editingEventId) {
        await axios.put(`${apiUrl}/${editingEventId}`, { name, date }, { withCredentials: true });
      } else {
        await axios.post(apiUrl, { name, date }, { withCredentials: true });
      }

      eventName.value = '';
      eventDate.value = '';
      editingEventId = null;
      loadEventList();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
    }
  });

  eventList.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-btn')) {
      const id = event.target.getAttribute('data-id');
      try {
        await axios.delete(`${apiUrl}/${id}`, { withCredentials: true });
        loadEventList();
      } catch (error) {
        console.error('Erro ao excluir evento:', error);
      }
    }
  });

  eventList.addEventListener('click', (event) => {
    if (event.target.classList.contains('edit-btn')) {
      const id = event.target.getAttribute('data-id');
      const row = event.target.closest('tr');
      const name = row.cells[0].textContent;
      const date = row.cells[1].textContent;

      eventName.value = name;
      eventDate.value = date;
      editingEventId = id;
    }
  });

  eventList.addEventListener('click', (event) => {
    if (event.target.classList.contains('inviteds-btn')) {
      const eventId = event.target.getAttribute('data-id');

      window.location.href = `/inviteds.html?eventId=${eventId}`;
    }
  });

  document
    .getElementById('logout-btn')
    .addEventListener('click', async function () {
      try {
        const response = await axios.post(
          'https://uniforgerenciadorbackend-bqmzywii.b4a.run/api/user/logout',
          {},
          { withCredentials: true }
        );

        if (response.status === 200) {
          window.location.href = '/login.html';
        }
      } catch (error) {
        console.error('Erro ao fazer logout: ', error);
      }
    });

  loadEventList();
});

