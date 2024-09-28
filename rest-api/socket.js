let io;
const socketIo = require('socket.io');

module.exports = {
    init: httpServer=>{
        io = socketIo(httpServer, {
            cors: {
                origin: 'http://localhost:5173', // Allow requests from this origin
                methods: ['GET', 'POST'], // Specify allowed HTTP methods
                allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
                credentials: true // Allow credentials
            }
        });
       return io;
    },
    getIO: () => {
        if(!io){
            throw new Error('Socket.io not initialized!');
        }
        return io;
    }
};