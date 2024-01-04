const WebSocket = require('ws');
const http = require('http');
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('database.db');


db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, gender TEXT, age INTEGER)");


const server = http.createServer();
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  console.log('Client connected');
  console.log(wss.clients)

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    // Send the received message back to the client
    console.log(message + "h")
    
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(`Server: ${message}`);
        }
      });
    

  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.on('upgrade', (request, socket, head) => {
    console.log("h")
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

server.listen(27181, () => {
  console.log('WebSocket server is listening on port 27181');
});
