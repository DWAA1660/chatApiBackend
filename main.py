from flask import Flask, render_template
from flask_sock import Sock  # Import the Sock class

app = Flask(__name__)
sock = Sock(app)

@app.route('/')
def index():
    return render_template('index.html')

@sock.route('/ai-chat')
def echo(ws):
    data = ws.receive()
    print(data, type(ws))

app.run(host="0.0.0.0", port=27181)