from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app, namespace='/ws')  # Specify the namespace for your route

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect', namespace='/ws')
def handle_connect():
    print('Client connected')
    emit('message_from_server', {'data': 'Connection established'})

@socketio.on('message_from_client', namespace='/ws')
def handle_message(message):
    print('Received message:', message)
    emit('message_from_server', {'data': 'Message received from server'})

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=27181, debug=True)
