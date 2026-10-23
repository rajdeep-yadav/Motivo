"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All admin endpoints require authentication and admin role
router.use(auth_1.authenticate, (0, auth_1.authorize)('admin'));
router.get('/stats', adminController_1.getDashboardStats);
router.get('/customers', adminController_1.getCustomers);
router.get('/reports', adminController_1.getReports);
exports.default = router;
