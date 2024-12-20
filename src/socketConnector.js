import { io } from "socket.io-client";

export class SocketConnector {
    constructor(server) {
        this.socket = io(server);

        this.socket.io.on("reconnect_attempt", () => {
            // ...
        });

        this.socket.io.on("reconnect", () => {
            // ...
        });

        this.socket.on("connect_error", (error) => {
            if (this.socket.active) {
                // temporary failure, the socket will automatically try to reconnect
            } else {
                // the connection was denied by the server
                // in that case, `socket.connect()` must be manually called in order to reconnect
                console.log(error.message);
            }
        });
    }

    connectSocket() {
        this.socket.on("connect", () => {
            console.log(this.socket.id); // x8WIv7-mJelg7on_ALbx
        });
    }

    disconnect() {
        this.socket.on("disconnect", (reason, details) => {
            console.log(this.socket.id, reason, details); // undefined
        });
    }

    joinRoom(username,room) {
        this.socket.emit("room_join",JSON.stringify({username, room}));
    }

    sendMessage(message) {
        this.socket.emit("message", message);
    }

    onMessage(eventName, callback) {
        this.socket.on(eventName, callback);
    }
}