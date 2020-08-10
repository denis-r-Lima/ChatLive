const users = {}

const addUser = (id, name, room) => {
  users[id] = { name, room }
  return users[id]
}

const removeUser = (id) => {
  let aux = users[id]
  delete users[id]
  return aux
}

const getUsers = (room) => {
  let aux = []
  const keys = Object.keys(users)
  for (key of keys) {
    if (users[key].room === room) {
      aux.push(users[key].name)
    }
  }
  return aux
}

module.exports = {
  addUser,
  removeUser,
  getUsers,
}
