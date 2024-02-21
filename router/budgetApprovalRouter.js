const express = require('express');
const router = express.Router();
const {approveBudget} = require('../controller/budgetApprovalCont');
const { isAdmin,authMiddleware,checkDirector } = require("../middleware/authorization");

// Route for approving a budget
router.put('/approve', authMiddleware,checkDirector, approveBudget);

module.exports = router;