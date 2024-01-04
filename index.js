const WebSocket = require('ws');
const http = require('http');
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('database.db');


db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, gender TEXT, age INTEGER)");


const server = http.createServer();
const wss = new WebSocket.Server({ noServer: true });

function getInformation(inputString) {
    const match = inputString.match(/%([^%]*)%.*?%([^%]*)%/);
    if (match) {
        const extractedContent = { sender: match[1], reciever: match[2] };
        const stringWithoutExtractedContent = inputString.replace(/%([^%]*)%.*?%([^%]*)%/, '');
        return { extractedContent, stringWithoutExtractedContent };
    } else {
        return null;
    }
}

wss.on('connection', (ws) => {
  console.log('Client connected');
  console.log(wss.clients)
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    
    // Checks if it is a string and starts with "chat:"
    if (typeof message === 'string' && message.startsWith("chat:")) {
        // removes chat prefix 
        message = message.replace("chat:", "")
        var info = getInformation(message)
        var sender = info.extractedContent.sender
        var reciever = info.extractedContent.reciever
        wss.clients.forEach(client => {
            client.send(`From: ${sender} to ${reciever}: ${info.stringWithoutExtractedContent}`)
        })
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
