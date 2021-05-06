from flask import Flask, render_template, request, redirect, url_for, session
from flask_socketio import SocketIO, join_room, leave_room, emit
from flask_session import Session
import os,datetime

app = Flask(__name__)
app.debug = True
app.config["SECRET_KEY"] = 'secret'
app.config['SESSION_TYPE'] = 'filesystem'

Session(app)

channels = {}
message = {}

message ["general"] = [{"username": "banban", "message":"hola","hora":"12:00"}]

socketio = SocketIO(app, cors_allowed_origin="*")


@app.route("/", methods=['GET', 'POST'])
def index():
    if "username" not in session.keys():
        return render_template("index.html")
    else:
        return render_template("chat.html",username=session["username"])
        
@app.route("/register", methods=["POST"])
def register():
    username = request.form.get("username")
    session["username"] = username
    return render_template("chat.html",channels=channels.keys(),username=session["username"]) 

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

@app.route("/createchannel", methods=["POST"])
def createchannel():
    channelname = request.form.get('channelname')
    if channelname not in channels.keys():
        channels.append(channelname)
        print(len(channels))
        return jsonify({"success":True})                       
    else:
        return jsonify({"success":False})

@socketio.on("submit message")
def newmessage(data):
    channelname = data["channelname"]
    if len(channels[channelname][1]) >= 100:
        channels[channelname][1].pop(0)
        emit("new message")

    
@app.route("/chat", methods=['GET', 'POST'])
def chat():
    if(request.method=='POST'):
        username = request.form['username']
        session['username'] = username
        return render_template('chat.html', session = session)
    else:
        if(session.get('username') is not None):
            return render_template('chat.html', session = session)
        else:
            return redirect(url_for('index'))


if __name__ == '__main__':
    socketio.run(app)