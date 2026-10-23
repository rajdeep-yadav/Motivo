"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vehicleController_1 = require("../controllers/vehicleController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.get('/', vehicleController_1.getVehicles);
router.get('/:id', vehicleController_1.getVehicleById);
router.get('/:id/availability', vehicleController_1.checkVehicleAvailability);
// Admin-protected routes
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('admin'), vehicleController_1.createVehicle);
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)('admin'), vehicleController_1.updateVehicle);
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)('admin'), vehicleController_1.deleteVehicle);
exports.default = router;
