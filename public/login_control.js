const noteDom = document.querySelector('.note')
const emailDom = document.querySelector('.email')
const passwordDom = document.querySelector('.password')
const formDom = document.querySelector('form')

formDom.addEventListener('submit', async (e) => {
  e.preventDefault()
  if (emailDom.value.length > 0 && passwordDom.value.length > 0) {
    try {
      const { data } = await axios.post(
        'https://mbbsprogrammer-todolist.onrender.com/api/v1/auth/login',
        {
          email: emailDom.value,
          password: passwordDom.value,
        }
      )
      const { user, token } = data
      localStorage.setItem('token', token)
      noteDom.innerHTML = `<span class='text-success'>Successfully Login ${user.name}</span>`
      emailDom.value = ''
      passwordDom.value = ''
      setTimeout(() => {
        noteDom.innerHTML = ''
      }, 2000)
    } catch (error) {
      const note = error.response.data.message
      noteDom.innerHTML = `<span class='text-danger'>${note}</span>`
      emailDom.value = ''
      passwordDom.value = ''
      setTimeout(() => {
        noteDom.innerHTML = ''
      }, 2000)
    }
  }
})
