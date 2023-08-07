from flask import Flask,render_template

from flask_socketio import SocketIO,emit,join_room,leave_room

import json

#Flask
app = Flask(__name__)
app.config["SECRET_KEY"] = "f4Pjp3UgJa51"

#Flask-SocketIO
socketio = SocketIO(app)

#チャットページを表示
@app.route('/', methods=['GET', 'POST'])
def room_html():
    return render_template('room.html')

#クライアントからのコネクション確立
@socketio.on('connect')
def handle_connect():
    emit('client_echo',{'msg': 'server connected!'})

#クライアントからのコネクション切断
@socketio.on('disconnect')
def handle_connect():
    print('server disconnected!')

@socketio.on('server_echo')
def handle_server_echo(msg):
    print('echo: ' + str(msg))
    emit('client_echo',msg)

#ルーム作成
# @socketio.event
@socketio.on('join')
def join(msg):
    join_room(str(msg["room"]))

# @socketio.event
@socketio.on('leave')
def leave(msg):
    leave_room(str(msg["room"]))

# @socketio.event
@socketio.on('send_room')
def send_room(data):
    print(data)
    emit("from_room",{"msg":data["chat_info"]["user_name"] + ":" + data["chat_info"]["msg"]},to=str(data["to"]))

if __name__ == "__main__":
    socketio.run(app,host="0.0.0.0", port="8088")
