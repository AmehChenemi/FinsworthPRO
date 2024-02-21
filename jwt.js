const jwt = require('jsonwebtoken');
const userModel = require("./models/userModel");
require('dotenv').config();

const gentoken = (user) => {
    try {
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET, { expiresIn: "5d" });
        return token;
    } catch (error) {
        throw error;
    }
};

module.exports = { gentoken };
