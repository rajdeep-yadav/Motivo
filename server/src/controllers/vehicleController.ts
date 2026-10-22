import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Vehicle } from '../models/Vehicle';
import { AvailabilityService } from '../services/availabilityService';
import { memoryStore } from '../store/memoryStore';

export const getVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      category,
      transmission,
      fuelType,
      seats,
      maxPrice,
      pickupDate,
      returnDate,
      sortBy = 'createdAt',
      order = 'desc',
      page = '1',
      limit = '9'
    } = req.query;

    const query: any = {};

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
      const pDate = new Date(pickupDate as string);
      const rDate = new Date(returnDate as string);
      if (!isNaN(pDate.getTime()) && !isNaN(rDate.getTime()) && rDate > pDate) {
        const unavailableIds = await AvailabilityService.getUnavailableVehicleIds(pDate, rDate);
        if (unavailableIds.length > 0) {
          query._id = { $nin: unavailableIds };
        }
      }
    }

    // Sorting
    const sortField: string = (sortBy as string) || 'createdAt';
    const sortOrder: 1 | -1 = order === 'asc' ? 1 : -1;
    const sortOptions: any = {};
    sortOptions[sortField] = sortOrder;

    // Pagination
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 9);
    const skip = (pageNum - 1) * limitNum;

    // If MongoDB is not connected, serve seamlessly from memoryStore
    if (mongoose.connection.readyState !== 1) {
      let filtered = [...memoryStore.vehicles];
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
      Vehicle.find(query).sort(sortOptions).skip(skip).limit(limitNum),
      Vehicle.countDocuments(query)
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVehicleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      const v = memoryStore.vehicles.find((veh) => veh._id === id);
      if (!v) {
        res.status(404).json({ success: false, message: 'Vehicle not found.' });
        return;
      }
      res.status(200).json({ success: true, data: v });
      return;
    }

    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      res.status(404).json({ success: false, message: 'Vehicle not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkVehicleAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { pickupDate, returnDate } = req.query;

    if (!pickupDate || !returnDate) {
      res.status(400).json({ success: false, message: 'Both pickupDate and returnDate are required.' });
      return;
    }

    const check = await AvailabilityService.isVehicleAvailable(
      id as string,
      new Date(pickupDate as string),
      new Date(returnDate as string)
    );

    res.status(200).json({
      success: true,
      available: check.available,
      reason: check.reason
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin vehicle controllers
export const createVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const newVehicle = await Vehicle.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Vehicle added to fleet.',
      data: newVehicle
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await Vehicle.findByIdAndUpdate(id, req.body, {
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
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findByIdAndDelete(id);

    if (!vehicle) {
      res.status(404).json({ success: false, message: 'Vehicle not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully.'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
