const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`Node server is running on port ${port}!`);
});

var users = {};

io.on('connection', (socket) => {
  socket.on('join', (id) => {
    users[id] = socket;
    console.log('Connected', id, socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected', socket.id);
  });
  
  socket.on('send', (id, data) => {
    if (users[id]) {
        users[id].emit('receive', data);
    }
  });

  socket.on('delivered', (id, data) => {
    if (users[id]) {
        users[id].emit('delivered', data);
    }
  });

  socket.on('read', (id, data) => {
    if (users[id]) {
        users[id].emit('read', data);
    }
  });

  socket.on('typing', (id, data) => {
    if (users[id]) {
        users[id].emit('typing', data);
    }
  });
  
  socket.on('delete', (id, data) => {
    if (users[id]) {
        users[id].emit('delete', data);
    }
  });

  socket.on('error', (err) => {
    console.log(err);
  });
});

server.listen(port);
