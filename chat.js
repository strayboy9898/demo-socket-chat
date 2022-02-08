const app = require("express")();
const express = require("express");
const http = require('http');
const { Server } = require("socket.io");

const httpServer = http.createServer(app);
const io = new Server(httpServer, { /* options */ });

app.use(express.static(__dirname + '/views'));

app.get('/chat', function(req, res){
     res.sendFile('views/chat.html', {root: __dirname })
});

users = [];
groups = [];
io.on('connection', function(socket) {
    console.log('A user connected');
    console.log('id: ', socket.id);
    socket.on('setUsername', function(data) {
        console.log(users);
        if(users.indexOf(data) == -1) {
            users.push(data);
            socket.emit('userSet', {username: data});
        } else {
            socket.emit('userExists', data + ' username is taken! Try some other username.');
        }
    })

    socket.on('msg', function(data) {
        //Send message to everyone
        io.sockets.emit('newmsg', data);
    })

    socket.on('msgGroup', function(data) {
        //Send message to group chat
        console.log('chat in group: ', data);
        io.in(data.groupName).emit('newmsgGroup', data);
    })

    socket.on('createGroup', function (data) {
        console.log('group name: ', data.groupName);
        if(groups.indexOf(data.groupName) == -1) {
            groups.push(data.groupName);
            socket.join(data.groupName);
            socket.emit("notificationCreateRoom", {msg: "Bạn đã tạo một phòng", groupName: data.groupName});
            // socket.emit('userSet', {username: data}); todo: create emit handler group name
        } else {
            socket.emit('groupNameExists', data.groupName + ' group name is taken! Try some other group name.');
        }
    })

    socket.on('joinGroup', function (data) {
        console.log('group name join: ', data.groupName);
        if(groups.indexOf(data.groupName) != -1) {
            socket.join(data.groupName);
            socket.to(data.groupName).emit("notificationJoinRoom", {msg: "Có người đã vào phòng", groupName: data.groupName});
            socket.emit("notificationJoinRoom", {msg: "Bạn đã vào phòng", groupName: data.groupName});
        } else {
            console.log('no exits');
            socket.emit('groupNameNoExists', data.groupName + ' no exist! Try some other group name.');
        }
    })
});

httpServer.listen(8000, function () {
    console.log("server running in port 8000");
});