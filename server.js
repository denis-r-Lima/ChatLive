const express = require("express")
const socketIO = require("socket.io")
const Http = require("http")
const { addUser, removeUser, getUsers } = require("./public/src/utils/users")

const app = express()

const server = Http.createServer(app)

app.use(express.static("./public"))

server.listen(3000, () => {
  console.log("Sever running")
})

const io = socketIO.listen(server)

io.on("connection", (socket) => {
  console.log(`New connection detected: ${socket.id}`)
  let user = {}
  socket.on("join", (msg) => {
    socket.join(msg.room)

    user = addUser(socket.id, msg.name, msg.room)

    socket.emit("write", { name: "ChatBot", message: `Welcome ${user.name}!` })
    socket.broadcast
      .to(user.room)
      .emit("write", { name: "ChatBot", message: `${user.name} joined the room!` })

    io.to(user.room).emit("usersList", getUsers(user.room))
  })

  socket.on("message", (m) => {
    const message = { name: user.name, message: m }
    socket.broadcast.to(user.room).emit("write", message)
  })

  socket.on("disconnect", () => {
    const user = removeUser(socket.id)

    io.to(user.room).emit("usersList", getUsers(user.room))

    socket.broadcast
      .to(user.room)
      .emit("write", { name: "ChatBot", message: `${user.name} leaved the room!` })
  })
})
