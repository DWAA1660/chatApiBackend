from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from werkzeug.http import parse_options_header
from flask_socketio import SocketIO, join_room, leave_room

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    # Get the WebSocket key from the request headers
    # ws_key = request.headers.get('Sec-WebSocket-Key')

    # Generate the WebSocket accept value


    # Form the response headers
    headers = [
        ('Upgrade', 'websocket'),
        ('Connection', 'Upgrade'),
    ]

    # Create a Flask response with status code 101 and the headers
    response = app.response_class(status=101, headers=headers)

    # Send the response to the client
    return response

@socketio.on('message_from_client')
def handle_message(message):
    print('Received message:', message)
    emit('message_from_server', {'data': 'Message received from server'})

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=27181, debug=True)
