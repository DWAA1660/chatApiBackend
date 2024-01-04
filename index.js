const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('database.db');

db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, gender TEXT, age INTEGER)");

const server = http.createServer();
const wss = new WebSocket.Server({ noServer: true });

const app = express();
app.use(bodyParser.json());

app.post('/createUser', (req, res) => {
  const { name, gender, age } = req.body;

  const stmt = db.prepare("INSERT INTO users (name, gender, age) VALUES (?, ?, ?)");
  stmt.run(name, gender, age);
  stmt.finalize();

  db.each("SELECT * FROM users", (err, row) => {
    console.log(row);
  });

  console.log("User created");
  res.status(200).send("User created successfully");
});

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    
    var messageStr = message.toString();
    // Checks if it is a string and starts with "chat:"
    if (messageStr.startsWith("chat:")) {
      // ... handle chat logic
      console.log(1)
        // removes chat prefix 
        messageStr = messageStr.replace("chat:", "")
        var info = getInformation(messageStr)
        var sender = info.extractedContent.sender
        var reciever = info.extractedContent.reciever
        console.log(`From: ${sender} to ${reciever}: ${info.stringWithoutExtractedContent}`)
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(`From: ${sender} to ${reciever}: ${info.stringWithoutExtractedContent}`)
            }
        });
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

server.listen(27181, () => {
  console.log('WebSocket server is listening on port 27181');
});

app.listen(27025, () => {
  console.log('HTTP server is listening on port 27025');
});



