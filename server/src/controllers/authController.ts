import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User, IUser } from '../models/User';
import { AuthenticatedRequest } from '../middleware/auth';
import { memoryStore } from '../store/memoryStore';

const generateToken = (user: IUser): string => {
  const secret = process.env.JWT_SECRET || 'motivo_super_secure_academic_key_2026';
  return jwt.sign({ id: user._id, role: user.role }, secret, {
    expiresIn: '7d'
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, drivingLicense } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
      return;
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Explicitly enforce role as 'customer' to prevent mass-assignment privilege escalation
    const newUser = await User.create({
      name,
      email: normalizedEmail,
      passwordHash,
      role: 'customer',
      phone,
      drivingLicense
    });

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        drivingLicense: newUser.drivingLicense
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error during registration.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide both email and password.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if MongoDB is connected, else fallback to memory store
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid credentials.' });
        return;
      }
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid credentials.' });
        return;
      }
      const token = generateToken(user);
      res.status(200).json({
        success: true,
        message: 'Logged in successfully.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          drivingLicense: user.drivingLicense
        }
      });
      return;
    }

    // Memory store fallback
    const memUser = memoryStore.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!memUser) {
      res.status(401).json({ success: false, message: 'Invalid credentials.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, memUser.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials.' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'motivo_super_secure_academic_key_2026';
    const token = jwt.sign({ id: memUser.id, role: memUser.role }, secret, { expiresIn: '7d' });

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: memUser.id,
        name: memUser.name,
        email: memUser.email,
        role: memUser.role,
        phone: memUser.phone,
        drivingLicense: memUser.drivingLicense
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error during login.' });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: (req.user as any).id || req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone,
        drivingLicense: req.user.drivingLicense
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { name, phone, drivingLicense } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (drivingLicense !== undefined) user.drivingLicense = drivingLicense;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        drivingLicense: user.drivingLicense
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
