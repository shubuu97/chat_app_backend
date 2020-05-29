const Room = require("../models/room");

exports.createRoom = (req, res, next) => {
    const { users } = req.body;
    if (!Array.isArray(users) || users.length !== 2) {
        return res.status(400).send({ message: "There should be minimum 2 users!" });
    }
    const room = new Room({
        users,
    });
    room.save()
        .then((result) => {
            let updatedResult = {
                users: result.users,
                id: result._id,
            };
            res.status(201).send({
                message: "Room Created Successfully!",
                ...updatedResult,
            });
        })
        .catch((error) => {
            res.status(304).send({ message: "Something Went Wrong!" });
        });
};

exports.fetchAllRooms = (req, res, next) => {
    Room.find()
        .then((rooms) => {
            res.status(200).send({ message: "Rooms Fetched Successfully!", rooms });
        })
        .catch((error) => {
            res.status(403).send("Something Went Wrong!");
        });
};
