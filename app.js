const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Definir un espacio de memoria para almacenar los mensajes
const messages = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chat message', (data) => {
    messages.push({ username: data.username, message: data.message });
    io.emit('chat message', messages);
  });
  
  socket.on('typing', (username) => {
    io.emit('user typing', username);
  });

  socket.on('stopped typing', (username) => {
    io.emit('user stopped typing', username);
  });
});



server.listen(3000, () => {
  console.log('listening on *:3000');
});