from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('message_from_client')
def handle_message(message):
    print('Received message:', message)
    emit('message_from_server', {'data': 'Message received from server'})

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", debug=True)
