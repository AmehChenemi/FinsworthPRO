require("./model/userModel")
require('dotenv').config();

const gentoken = (user) => {
    try {
        const token = jwt.sign({ id:user.id, isAdmin:user.isAdmin }, process.env.SECRET, { expiresIn: "5d" });
        return token;
    } catch (error) {
        throw error;
    }
};

module.exports = { gentoken };