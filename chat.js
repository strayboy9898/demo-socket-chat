const app = require("express")();
const http = require('http');
const { Server } = require("socket.io");

const httpServer = http.createServer(app);
const io = new Server(httpServer, { /* options */ });

app.get('/chat', function(req, res){
     res.sendFile('views/chat.html', {root: __dirname })
});

// let countUser = 0;
// io.on("connection", (socket) => {
//     console.log('A user connected');
//     countUser++;
//
//     //Whenever someone disconnects this piece of code executed
//     socket.on('disconnect', function () {
//         console.log('A user disconnected');
//         countUser--;
//         socket.broadcast.emit("broadcast", { description: countUser + ' clients connected!'});
//     });
//
// });

// io.on('connection', function(socket){
//     socket.on('chat message', function(msg){
//         io.emit('chat message', msg);
//     });
// });

httpServer.listen(8000, function () {
    console.log("server running in port 8000");
});