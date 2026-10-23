"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicle = exports.updateVehicle = exports.createVehicle = exports.checkVehicleAvailability = exports.getVehicleById = exports.getVehicles = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Vehicle_1 = require("../models/Vehicle");
const availabilityService_1 = require("../services/availabilityService");
const memoryStore_1 = require("../store/memoryStore");
const getVehicles = async (req, res) => {
    try {
        const { search, category, transmission, fuelType, seats, maxPrice, pickupDate, returnDate, sortBy = 'createdAt', order = 'desc', page = '1', limit = '9' } = req.query;
        const query = {};
        // For public listings, default to showing only operational 'Available' vehicles
        query.operationalStatus = 'Available';
        // Text / keyword search
        if (search && typeof search === 'string' && search.trim() !== '') {
            const searchRegex = new RegExp(search.trim(), 'i');
            query.$or = [{ make: searchRegex }, { model: searchRegex }, { description: searchRegex }];
        }
        // Category filter
        if (category && category !== 'All') {
            query.category = category;
        }
        // Transmission filter
        if (transmission && transmission !== 'All') {
            query.transmission = transmission;
        }
        // Fuel Type filter
        if (fuelType && fuelType !== 'All') {
            query.fuelType = fuelType;
        }
        // Seating capacity
        if (seats && !isNaN(Number(seats))) {
            query.seatingCapacity = { $gte: Number(seats) };
        }
        // Max daily rate
        if (maxPrice && !isNaN(Number(maxPrice))) {
            query.dailyRate = { $lte: Number(maxPrice) };
        }
        // Availability filter by requested dates
        if (pickupDate && returnDate) {
            const pDate = new Date(pickupDate);
            const rDate = new Date(returnDate);
            if (!isNaN(pDate.getTime()) && !isNaN(rDate.getTime()) && rDate > pDate) {
                const unavailableIds = await availabilityService_1.AvailabilityService.getUnavailableVehicleIds(pDate, rDate);
                if (unavailableIds.length > 0) {
                    query._id = { $nin: unavailableIds };
                }
            }
        }
        // Sorting
        const sortField = sortBy || 'createdAt';
        const sortOrder = order === 'asc' ? 1 : -1;
        const sortOptions = {};
        sortOptions[sortField] = sortOrder;
        // Pagination
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.max(1, parseInt(limit, 10) || 9);
        const skip = (pageNum - 1) * limitNum;
        // If MongoDB is not connected, serve seamlessly from memoryStore
        if (mongoose_1.default.connection.readyState !== 1) {
            let filtered = [...memoryStore_1.memoryStore.vehicles];
            if (category && category !== 'All') {
                filtered = filtered.filter((v) => v.category === category);
            }
            if (transmission && transmission !== 'All') {
                filtered = filtered.filter((v) => v.transmission === transmission);
            }
            if (fuelType && fuelType !== 'All') {
                filtered = filtered.filter((v) => v.fuelType === fuelType);
            }
            if (search && typeof search === 'string') {
                const s = search.toLowerCase();
                filtered = filtered.filter((v) => v.make.toLowerCase().includes(s) || v.model.toLowerCase().includes(s));
            }
            res.status(200).json({
                success: true,
                data: filtered,
                pagination: { page: 1, limit: filtered.length, total: filtered.length, totalPages: 1 }
            });
            return;
        }
        const [vehicles, total] = await Promise.all([
            Vehicle_1.Vehicle.find(query).sort(sortOptions).skip(skip).limit(limitNum),
            Vehicle_1.Vehicle.countDocuments(query)
        ]);
        res.status(200).json({
            success: true,
            data: vehicles,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getVehicles = getVehicles;
const getVehicleById = async (req, res) => {
    try {
        const { id } = req.params;
        if (mongoose_1.default.connection.readyState !== 1) {
            const v = memoryStore_1.memoryStore.vehicles.find((veh) => veh._id === id);
            if (!v) {
                res.status(404).json({ success: false, message: 'Vehicle not found.' });
                return;
            }
            res.status(200).json({ success: true, data: v });
            return;
        }
        const vehicle = await Vehicle_1.Vehicle.findById(id);
        if (!vehicle) {
            res.status(404).json({ success: false, message: 'Vehicle not found.' });
            return;
        }
        res.status(200).json({
            success: true,
            data: vehicle
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getVehicleById = getVehicleById;
const checkVehicleAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { pickupDate, returnDate } = req.query;
        if (!pickupDate || !returnDate) {
            res.status(400).json({ success: false, message: 'Both pickupDate and returnDate are required.' });
            return;
        }
        const check = await availabilityService_1.AvailabilityService.isVehicleAvailable(id, new Date(pickupDate), new Date(returnDate));
        res.status(200).json({
            success: true,
            available: check.available,
            reason: check.reason
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.checkVehicleAvailability = checkVehicleAvailability;
// Admin vehicle controllers
const createVehicle = async (req, res) => {
    try {
        const newVehicle = await Vehicle_1.Vehicle.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Vehicle added to fleet.',
            data: newVehicle
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createVehicle = createVehicle;
const updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Vehicle_1.Vehicle.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updated) {
            res.status(404).json({ success: false, message: 'Vehicle not found.' });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Vehicle updated successfully.',
            data: updated
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateVehicle = updateVehicle;
const deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle_1.Vehicle.findByIdAndDelete(id);
        if (!vehicle) {
            res.status(404).json({ success: false, message: 'Vehicle not found.' });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Vehicle deleted successfully.'
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteVehicle = deleteVehicle;
