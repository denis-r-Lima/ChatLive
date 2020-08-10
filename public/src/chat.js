const socket = io()

const screen = document.querySelector("#screen")

const form = document.querySelector("form")

const { name, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
})

document.getElementById("room-id").innerHTML = `<div class="text">${room}</div>`

const writeMessage = (data, origin) => {
  const div = document.createElement("div")

  div.classList.add("message")

  div.innerHTML = `<div class="${origin}"><strong>${data.name}</strong>: ${data.message}</div>`

  screen.appendChild(div)
  screen.scrollTop = screen.scrollHeight
}

socket.emit("join", { name, room })

form.onsubmit = (event) => {
  event.preventDefault()
  socket.emit("message", event.target.elements.mensagem.value)
  writeMessage({ name, message: event.target.elements.mensagem.value }, "self")
  event.target.elements.mensagem.value = ""
  event.target.elements.mensagem.focus()
}

socket.on("write", (message) => {
  writeMessage(message, "server")
})

socket.on("usersList", (list) => {
  let aux = ""

  list.map((user) => {
    aux += `<div class="text">${user}</div>`
  })

  document.getElementById("users-list").innerHTML = aux
})
