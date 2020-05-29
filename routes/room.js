const express = require("express");
const roomControllers = require("../controllers/room");

const router = express.Router();

router.post("/create-room", roomControllers.createRoom);

router.get("/rooms", roomControllers.fetchAllRooms);

module.exports = router;
