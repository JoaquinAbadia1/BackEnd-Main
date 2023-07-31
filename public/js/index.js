const socket = io();

socket.emit("connection", "nuevo cliente conectado");
