const express = require("express");
const authControllers = require("../controllers/auth");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Server is up and running!");
});

router.post("/login", authControllers.login);

router.post("/register", authControllers.register);

// router.post("/users", authControllers.getUsers);

module.exports = router;
