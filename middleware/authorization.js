const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const budgetModel = require("../models/budgetModel");
require("dotenv").config();


const authMiddleware = async (req, res, next) => {
    try {
        // Extract the JWT token from the Authorization header
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }
        const token = authorizationHeader.split(' ')[1];

        // Verify the JWT token
        const decodedToken = jwt.verify(token, process.env.SECRET);
        if (!decodedToken) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Fetch user from database based on the decoded token
        const user = await userModel.findById(decodedToken.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Populate req.user with the authenticated user's information
        req.user = user;

        // Call next middleware
        next();
    } catch (error) {
        console.error('Authentication error:', error.message);
        return res.status(500).json(error.message);
    }
};


const isAdmin = async (req, res, next) => {
    try {
        const user = req.user;

        // Check if the role is explicitly set to "Admin" or if it's not set (defaults to "User")
        if (!user || user.role !== "Director") {
            return res.status(403).json({ error: 'You are not authorized to perform this action' });
        }

        next();
    } catch (error) {
      return  res.status(500).json({ error: error.message });
    }
};


const checkDirector = (req, res, next) => {
    const { role } = req.user; // Assuming req.user contains the user's role
    
    // Check if the user is the director
    if (role === 'Director') {
      // User is the director, proceed to the next middleware
      next();
    } else {
      // User is not the director, send forbidden error
      res.status(403).json({ error: 'Forbidden. Only the director can perform this action.' });
    }
  };
  
 

  
  const requireDirectorApproval = async (req, res, next) => {
    try {
        // Get the user ID from the request
        const { userId } = req.body;

        // Find the user in the database
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the user is an account manager
        if (user.role === 'Account Manager') {
            // Account managers need approval from the director
            const director = await userModel.findOne({ role: 'Director' });
            if (!director) {
                return res.status(404).json({ error: 'Director not found' });
            }

            // Check if the director has approved budgets for the account manager
            const directorApproved = await budgetModel.exists({ user: director._id, approvedByDirector: true });
            if (!directorApproved) {
                req.directorApprovalRequired = true; // Set a flag indicating director approval is required
            }
        }

        // Proceed to the next middleware
        next();
    } catch (error) {
        console.error('Error checking director approval:', error);
        return res.status(500).json(error.message);
    }
};


  module.exports={authMiddleware,isAdmin,checkDirector, requireDirectorApproval}


  