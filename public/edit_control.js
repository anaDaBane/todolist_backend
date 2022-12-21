const greetingDom = document.querySelector('.greeting')
const noteDom = document.querySelector('.note')
const titleDom = document.querySelector('.title')
const contextDom = document.querySelector('.context')
const stateDom = document.querySelector('.state')
const isCompleteDom = document.querySelector('.isComplete')
const editDom = document.querySelector('.edit')
const targetDom = document.querySelector('.target')
const params = window.location.search
const id = new URLSearchParams(params).get('id')
const loadingDom = document.querySelector('.loading')
const fetchData = async () => {
  loadingDom.style.visibility = 'visible'
  targetDom.style.visibility = 'hidden'
  const token = localStorage.getItem('token')
  try {
    const {
      data: {
        list,
        user: { userName },
      },
    } = await axios.get(
      `https://mbbsprogrammer-todolist.onrender.com/api/v1/list/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    greetingDom.innerText = userName
    const { title, context, isComplete, state } = list
    titleDom.value = title
    contextDom.value = context
    isCompleteDom.checked = isComplete ? 'checked' : ''
    stateDom.value = state
    loadingDom.style.visibility = 'hidden'
    targetDom.style.visibility = 'visible'
  } catch (error) {
    const note = error.response.data.message
    noteDom.innerHTML = `<span class='text-danger'>${note}</span>`
    loadingDom.style.visibility = 'hidden'
    targetDom.style.visibility = 'visible'
    setTimeout(() => {
      noteDom.innerHTML = ''
    }, 2000)
  }
}

fetchData()

// update
targetDom.addEventListener('change', () => {
  editDom.addEventListener('click', async (e) => {
    if (titleDom.value.length > 0) {
      const token = localStorage.getItem('token')
      try {
        const { data } = await axios.patch(
          `https://mbbsprogrammer-todolist.onrender.com/api/v1/list/${id}`,
          {
            title: titleDom.value,
            context: contextDom.value,
            state: stateDom.value,
            isComplete: isCompleteDom.checked ? 'true' : 'false',
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const { list } = data

        noteDom.innerHTML = `<span class='text-success'>Successfully updated ${list.title}</span>`
        titleDom.value = ''
        contextDom.value = ''
        stateDom.value = ''
        isCompleteDom.checked = false
        setTimeout(() => {
          noteDom.innerHTML = ''
        }, 2000)
      } catch (error) {
        const note = error.response.data.message
        noteDom.innerHTML = `<span class='text-danger'>${note}</span>`
        titleDom.value = ''
        contextDom.value = ''
        stateDom.value = ''
        isCompleteDom.checked = false
        setTimeout(() => {
          noteDom.innerHTML = ''
        }, 2000)
      }
    }
  })
})
