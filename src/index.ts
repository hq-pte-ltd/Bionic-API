import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

let app = express();
app.use(cors());
const port = 8080;
const server = http.createServer(app);

// eslint-disable-next-line no-use-before-define
app.route("/get").get((req, res) => {
	const re = req.query.params;
	console.log(re);
	res.send("hello");
});

// const io = new Server(server, { cors: { origin: "*", credentials: true } });
const io = new Server(server, {
	cors: {
		origin: "*"
		// methods: ["GET", "POST"]
	}
});

io.sockets.on("error", (e) => console.log(e));
io.sockets.on("connection", (socket) => {
	console.log("server connection", socket.id);
	socket.on("broadcaster", (roomid) => {
		console.log("server broadcast", socket.id);
		socket.broadcast.emit("broadcaster", socket.id, roomid);
	});
	socket.on("watcher", (broadcaster) => {
		console.log("server watcher", socket.id);
		socket.to(broadcaster).emit("watcher", socket.id);
	});
	socket.on("offer", (id, message) => {
		console.log("server offer", socket.id);
		socket.to(id).emit("offer", socket.id, message);
	});
	socket.on("answer", (id, message) => {
		console.log("server answer", socket.id);
		socket.to(id).emit("answer", socket.id, message);
	});
	socket.on("candidate", (id, message) => {
		console.log("server candidate", socket.id);
		socket.to(id).emit("candidate", socket.id, message);
	});
	socket.on("disconnect", () => {
		console.log("server disconnect", socket.id);
		io.emit("disconnectPeer", socket.id);
	});
});
server.listen(port, () => console.log(`Server is running on port ${port}`));
