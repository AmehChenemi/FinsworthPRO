const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");
require("dotenv").config();

const auth = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }

        const token = authorizationHeader.split(" ")[1]; 

        try {
            const decodedToken = jwt.verify(token, process.env.SECRET);
            const user = await userModel.findById(decodedToken._id);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json( error.message);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        const user = req.user;

        // Check if the role is explicitly set to "Admin" or if it's not set (defaults to "User")
        if (!user || user.role !== "Admin") {
            return res.status(403).json({ error: 'You are not authorized to perform this action' });
        }

        next();
    } catch (error) {
      return  res.status(500).json({ error: error.message });
    }
};
  module.exports={auth,isAdmin}
