const jwt = require('jsonwebtoken');
const userModel = require("./models/company");
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
