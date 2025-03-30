const cadastroForm = document.getElementById('cadastroForm')

cadastroForm.addEventListener('submit', async function (event) {
  event.preventDefault()

  const name = document.getElementById('name').value
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  try {
    const response = await axios.post('https://uniforgerenciadorbackend-bqmzywii.b4a.run/api/user/register', {
      name: name,
      email: email,
      password: password,
    }, { withCredentials: true })

    alert('Cadastro realizado com sucesso!')

    window.location.href = '/login.html'
  } catch (error) {
    alert('Erro ao cadastrar o usuário: ' + error)
  }
})
