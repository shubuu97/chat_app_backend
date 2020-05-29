const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Room = require("../models/room");

exports.login = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return res.send(400).send("Enter email and password!");
    User.findOne({ email })
        .then((user) => {
            if (!user) return res.status(400).send({ message: "Invalid Email!" });
            bcrypt
                .compare(password, user.password)
                .then((isMatching) => {
                    if (isMatching) {
                        User.find()
                            .then((users) => {
                                Room.find()
                                    .then((rooms) => {
                                        let updatedUsers = users.filter((data) => {
                                            return data._id.toString() != user._id.toString();
                                        });
                                        updatedUsers = updatedUsers.map((userData) => {
                                            return {
                                                id: userData._id,
                                                name: userData.name,
                                            };
                                        });
                                        rooms = rooms.map((room) => {
                                            return {
                                                users: [...room.users],
                                                id: room._id,
                                            };
                                        });
                                        let userRes = {
                                            userId: user._id,
                                            userName: user.name,
                                            users: updatedUsers,
                                            rooms,
                                            message: "Logged In Successfully!",
                                        };
                                        return res.status(200).json(userRes);
                                    })
                                    .catch((error) => {});
                            })
                            .catch((error) => {
                                return res
                                    .status(403)
                                    .json({ userId: user._id, message: "Unable to fetch users!" });
                            });
                    } else if (!isMatching) {
                        res.status(400).send({ message: "Invalid Password!" });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.register = (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        return res.status(400).send({ message: "All fields are required!" });
    User.findOne({ email })
        .then((user) => {
            if (user) {
                return res.status(400).send({ message: "This email is already taken." });
            }
            bcrypt
                .hash(password, 12)
                .then((password) => {
                    const user = new User({
                        name,
                        email,
                        password,
                    });
                    user.save()
                        .then((result) => {
                            res.status(201).send({ message: "Registration Successful!" });
                        })
                        .catch((error) => {
                            res.status(304).send({ message: "Something Went Wrong!" });
                        });
                })
                .catch((error) => {
                    res.send({ message: "Unable to Encrypt Password!" });
                });
        })
        .catch((error) => {
            console.log(error);
        });
};

// exports.getUsers = (req, res, next) => {
//     User.find()
//         .then((users) => {
//             let updatedUsers = users.filter((data) => {
//                 return data._id.toString() != user._id.toString();
//             });
//             updatedUsers = updatedUsers.map((userData) => {
//                 return {
//                     id: userData._id,
//                     name: userData.name,
//                 };
//             });
//             res.send({ message: "User Fetched Successfully!", users:  });
//         })
//         .catch((error) => {
//             console.log(error);
//         });
// };
