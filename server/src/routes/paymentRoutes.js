"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/simulate', auth_1.authenticate, paymentController_1.createSimulatedPayment);
router.get('/receipt/:paymentId', auth_1.authenticate, paymentController_1.getPaymentReceipt);
exports.default = router;
