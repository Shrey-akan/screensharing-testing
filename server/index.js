import app from "./app.js";
import connectDB from "./db/database.js";
import dotenv from 'dotenv'
import { Server } from "socket.io";
import { createServer } from "http";

dotenv.config()

const port = process.env.PORT || 5000

const server = new createServer(app);

const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      
    },
  });


  io.on('connection', (socket) => {
    console.log('A user connected',socket.id);
  
    socket.on('startStream', (streamId) => { // Receive stream ID
      socket.stream = true;
      socket.broadcast.emit('stream', streamId); // Broadcast stream ID
      // Handle stream with the provided ID on the server
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

server.listen(port,()=>{
    console.log(`connected to http://localhost:${port}`)
    connectDB()
})