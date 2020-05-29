const express = require("express");
const json = require("body-parser").json;
const urlencoded = require("body-parser").urlencoded;
const socketio = require("socket.io");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { mongoConnectionString } = require("./constants");

const PORT = process.env.PORT || 3001;

//initializing app
const app = express();

//routes
const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/room");

const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(json({ limit: "1gb", strict: true }));
app.use(urlencoded({ limit: "1gb", extended: true }));
app.use(authRoutes);
app.use(roomRoutes);

mongoose
    .connect(mongoConnectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("mongodb connected");
        server.listen(PORT, () => {
            console.log(`server has started on port: ${PORT}`);
        });
        io.on("connect", (socket) => {
            socket.on("join", ({ roomId, userId }) => {
                socket.join(roomId);
                io.in(roomId).emit("onlineStatus", { userId, isOnline: true });
            });

            socket.on("sendMessage", ({ roomId, message, time, userId }, callback) => {
                io.to(roomId).emit("message", { message, time, userId });
                callback();
            });

            socket.on("typing", (isTyping, roomId, userId) => {
                io.to(roomId).emit("typingStatus", { isTyping, userId });
            });

            socket.on("disconnect", () => {});
        });
    })
    .catch((error) => {
        console.log(error);
    });
