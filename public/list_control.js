const greetingDom = document.querySelector('.greeting')
const noteDom = document.querySelector('.note')
const titleDom = document.querySelector('.title')
const contextDom = document.querySelector('.context')
const stateDom = document.querySelector('.state')
const isCompleteDom = document.querySelector('.isComplete')
const formDom = document.querySelector('form')
const contentDom = document.querySelector('.signature')
const messageDom = document.querySelector('.message')
const loadingDom = document.querySelector('.loading')

const fetchData = async () => {
  contentDom.style.visibility = 'hidden'
  loadingDom.style.visibility = 'visible'
  const token = localStorage.getItem('token')
  try {
    const {
      data: {
        lists,
        count,
        user: { userName },
      },
    } = await axios.get(
      'https://mbbsprogrammer-todolist.onrender.com/api/v1/list/',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    greetingDom.innerText = userName
    if (count === 0) {
      const data = `No item exists`
      contentDom.innerHTML = `<div class='row justify-content-center'><span class='text-center'>${data}</span></div>`
      contentDom.style.visibility = 'visible'
  loadingDom.style.visibility = 'hidden'
      return
    }
    const data = lists
      .map((l) => {
        const { title, state, isComplete, context, _id: listId } = l
        let put = ''
        if (state === 'vital') {
          put =
            '<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>'
        }
        if (state === 'important') {
          put = '<i class="fa-solid fa-star"></i>'
        }
        return `<div class="row justify-content-center mb-2">
        <div class="col col-md-3 col-lg-4">
          <div class="header d-flex">
          <div class='me-2 align-self-center text-success'>${
            isComplete ? '<i class="fa-regular fa-face-smile fa-xl"></i>' : ''
          }
          </div>
          
            <h3 class='${
              isComplete
                ? 'text-decoration-line-through text-muted'
                : 'text-muted'
            }'>${title}</h3>
            <div>${put}</div>
            <div class="ms-auto">
              <a href='./edit.html?id=${listId}' class="btn btn-info text-dark btn-sm edit" data-id=${listId}>
                <i class="fa-solid fa-pen-to-square edit" data-id=${listId}></i>
              </a>
              <button class="btn btn-danger btn-sm delete" data-id=${listId}>
                <i class="fa-solid fa-trash delete" data-id=${listId}></i>
              </button>
            </div>
          </div>
          <div class="context"><p>${context}</p></div>
        </div>
      </div>`
      })
      .join('')
    contentDom.innerHTML = data
    contentDom.style.visibility = 'visible'
    loadingDom.style.visibility = 'hidden'
  } catch (error) {
    const note = error.response.data.message
    messageDom.innerHTML = `<span class='text-danger'>${note}</span>`

    setTimeout(() => {
      messageDom.innerHTML = ''
    }, 2000)
    contentDom.style.visibility = 'visible'
    loadingDom.style.visibility = 'hidden'
  }
}

fetchData()

formDom.addEventListener('submit', async (e) => {
  e.preventDefault()
  if (titleDom.value.length > 0) {
    const token = localStorage.getItem('token')
    try {
      const { data } = await axios.post(
        'https://mbbsprogrammer-todolist.onrender.com/api/v1/list/',
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

      noteDom.innerHTML = `<span class='text-success'>Successfully created ${list.title}</span>`
      titleDom.value = ''
      contextDom.value = ''
      stateDom.value = ''
      isCompleteDom.checked = false
      fetchData()
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

contentDom.addEventListener('click', async (e) => {
  if (e.target.classList.contains('delete')) {
    const { id } = e.target.dataset
    const token = localStorage.getItem('token')
    try {
      await axios.delete(
        `https://mbbsprogrammer-todolist.onrender.com/api/v1/list/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      fetchData()
      messageDom.innerHTML = `<span class='text-success'>Deleted successfully</span>`
      setTimeout(() => {
        messageDom.innerHTML = ''
      }, 2000)
    } catch (error) {
      messageDom.innerHTML = `<span class='text-danger'>${err.response.data.message}</span>`
      setTimeout(() => {
        messageDom.innerHTML = ''
      }, 2000)
    }
  }
})
