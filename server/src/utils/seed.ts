import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config(); // fallback

import { User } from '../models/User';
import { Vehicle } from '../models/Vehicle';
import { Booking } from '../models/Booking';
import { Payment } from '../models/Payment';
import { Notification } from '../models/Notification';
import { PricingService } from '../services/pricingService';

const SEED_VEHICLES = [
  {
    make: 'Audi',
    model: 'A6 Sedan',
    year: 2024,
    category: 'Sedan',
    description: 'Executive luxury sedan with mild-hybrid engine, Virtual Cockpit Plus, and opulent leather upholstery.',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80'
    ],
    registrationNumber: 'MH02-EK-8821',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seatingCapacity: 5,
    dailyRate: 6500,
    operationalStatus: 'Available',
    features: ['Panoramic Sunroof', 'Matrix LED Headlights', 'Bang & Olufsen 3D Sound', 'Lane Assist', 'Adaptive Cruise'],
    mileageLimitPerDay: 350
  },
  {
    make: 'Range Rover',
    model: 'Velar Dynamic',
    year: 2024,
    category: 'SUV',
    description: 'Avant-garde SUV balancing refined poise with extraordinary all-terrain capability and Meridian Audio.',
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80'
    ],
    registrationNumber: 'DL01-CA-9902',
    transmission: 'Automatic',
    fuelType: 'Diesel',
    seatingCapacity: 5,
    dailyRate: 9500,
    operationalStatus: 'Available',
    features: ['All-Wheel Drive', 'Air Suspension', 'Head-Up Display', 'Heated & Cooled Seats', '360 Camera'],
    mileageLimitPerDay: 300
  },
  {
    make: 'Porsche',
    model: 'Taycan 4S',
    year: 2023,
    category: 'Electric',
    description: 'Pure performance electric sports sedan with instantaneous torque, 800V charging, and whisper-quiet cabin.',
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    registrationNumber: 'KA04-EL-4004',
    transmission: 'Automatic',
    fuelType: 'Electric',
    seatingCapacity: 4,
    dailyRate: 14000,
    operationalStatus: 'Available',
    features: ['Launch Control', 'Porsche Active Suspension', 'Curved Display', 'Fast DC Charging Support'],
    mileageLimitPerDay: 400
  },
  {
    make: 'BMW',
    model: 'M340i xDrive',
    year: 2024,
    category: 'Sports',
    description: 'Precision engineered 3.0L twin-turbo inline-6 sports sedan tuned for thrilling acceleration and dynamic control.',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'
    ],
    registrationNumber: 'KA05-MM-3401',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seatingCapacity: 5,
    dailyRate: 8500,
    operationalStatus: 'Available',
    features: ['M Sport Differential', 'Harman Kardon Sound', 'Wireless CarPlay', 'Sport Exhaust Valve'],
    mileageLimitPerDay: 350
  },
  {
    make: 'Mercedes-Benz',
    model: 'E-Class Exclusive',
    year: 2023,
    category: 'Luxury',
    description: 'Long-wheelbase luxury sedan with executive rear reclining seating, ambient illumination, and airmatic suspension.',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'
    ],
    registrationNumber: 'MH01-LU-2244',
    transmission: 'Automatic',
    fuelType: 'Diesel',
    seatingCapacity: 5,
    dailyRate: 9000,
    operationalStatus: 'Available',
    features: ['Chauffeur Package', 'Burmester High-End Audio', 'Rear Reclining Seats', 'Wireless Phone Charger'],
    mileageLimitPerDay: 300
  },
  {
    make: 'Toyota',
    model: 'Innova HyCross ZX',
    year: 2024,
    category: 'SUV',
    description: 'Premium family tourer with self-charging strong hybrid electric powertrain and Ottoman lounge chairs.',
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'
    ],
    registrationNumber: 'KA03-HY-7007',
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    seatingCapacity: 7,
    dailyRate: 4800,
    operationalStatus: 'Available',
    features: ['Ottoman Lounge Seats', 'Dual Sunroof', 'Toyota Safety Sense', 'Wireless Connectivity', 'Spacious 7-seater'],
    mileageLimitPerDay: 400
  },
  {
    make: 'Mini',
    model: 'Cooper S JCW',
    year: 2023,
    category: 'Hatchback',
    description: 'Iconic British hot-hatch delivering go-kart handling, distinct twin-tailpipes, and expressive retro charm.',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80'
    ],
    registrationNumber: 'TN07-MC-1959',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seatingCapacity: 4,
    dailyRate: 5200,
    operationalStatus: 'Available',
    features: ['JCW Aerodynamic Kit', 'Harmon Kardon Audio', 'Heads Up Display', 'Sport Mode Throttle'],
    mileageLimitPerDay: 300
  },
  {
    make: 'Volvo',
    model: 'XC90 Recharge',
    year: 2023,
    category: 'SUV',
    description: 'Scandinavian flagship plug-in hybrid SUV with class-leading radar safety, Google Built-in, and crystal gearshift.',
    images: [
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
    ],
    registrationNumber: 'MH12-VR-9090',
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    seatingCapacity: 7,
    dailyRate: 11000,
    operationalStatus: 'Maintenance',
    features: ['Orrefors Crystal Shifter', 'Bowers & Wilkins Audio', 'Pilot Assist II', 'Air Purifier'],
    mileageLimitPerDay: 300
  },
  {
    make: 'Mahindra',
    model: 'Thar 4x4 Hardtop',
    year: 2024,
    category: 'SUV',
    description: 'Iconic Indian off-roader with mStallion Turbo-Petrol engine, 4x4 low-range gearbox, and convertible rugged aesthetics.',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1200&q=80'
    ],
    registrationNumber: 'MH04-TR-4444',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seatingCapacity: 4,
    dailyRate: 4200,
    operationalStatus: 'Available',
    features: ['Mechanical Locking Differential', 'Roll Cage', 'Water-Resistant Infotainment', 'All-Terrain 18" Wheels'],
    mileageLimitPerDay: 350
  },
  {
    make: 'Tata',
    model: 'Safari Dark Edition',
    year: 2024,
    category: 'SUV',
    description: 'Flagship Indian luxury 7-seater SUV with ADAS Level 2, ventilated seats, gesture tailgate, and Harman JBL sound.',
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80'
    ],
    registrationNumber: 'MH02-SF-7788',
    transmission: 'Automatic',
    fuelType: 'Diesel',
    seatingCapacity: 7,
    dailyRate: 4600,
    operationalStatus: 'Available',
    features: ['Level 2 ADAS', 'Ventilated 1st & 2nd Row', 'Parametric Jewel Grille', '360 3D Surround Camera'],
    mileageLimitPerDay: 350
  },
  {
    make: 'Royal Enfield',
    model: 'Himalayan 450',
    year: 2024,
    category: 'Bike',
    description: 'High-performance adventure motorcycle with all-new liquid-cooled Sherpa 450 engine and Google Maps Tripper navigation.',
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
    ],
    registrationNumber: 'MH04-RE-4501',
    transmission: 'Manual',
    fuelType: 'Petrol',
    seatingCapacity: 2,
    dailyRate: 1800,
    operationalStatus: 'Available',
    features: ['Sherpa 452cc DOHC Engine', 'Switchable Rear ABS', 'Full TFT Display', 'Long-Travel Showa Suspension'],
    mileageLimitPerDay: 300
  },
  {
    make: 'KTM',
    model: '390 Duke ABS',
    year: 2024,
    category: 'Bike',
    description: 'The Corner Rocket: track-bred naked street motorcycle with launch control, cornering MTC, and Quickshifter+.',
    images: [
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1200&q=80'
    ],
    registrationNumber: 'MH03-DK-3900',
    transmission: 'Manual',
    fuelType: 'Petrol',
    seatingCapacity: 2,
    dailyRate: 2200,
    operationalStatus: 'Available',
    features: ['Quickshifter+ (Bi-directional)', 'Cornering ABS & MTC', 'Launch Control Mode', 'WP APEX Adjustable Suspension'],
    mileageLimitPerDay: 300
  }
];

export const seedDatabase = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error('❌ MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB Atlas for seeding.');

    // Clear existing collections safely
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Booking.deleteMany({});
    await Payment.deleteMany({});
    await Notification.deleteMany({});
    console.log('🧹 Cleaned existing database collections.');

    // 1. Create Demo Users
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('Admin@Motivo2026', salt);
    const customerPasswordHash = await bcrypt.hash('Customer@Motivo2026', salt);

    const admin = await User.create({
      name: 'Aditya Sharma (Fleet Director)',
      email: 'admin@motivo.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
      phone: '+91 98200 11223'
    });

    const customer = await User.create({
      name: 'Rajdeep Yadav',
      email: 'rajdeep@motivo.com',
      passwordHash: customerPasswordHash,
      role: 'customer',
      phone: '+91 98765 43210',
      drivingLicense: 'DL-0420190012345'
    });

    console.log('👤 Created demo accounts:');
    console.log('   - Admin:    admin@motivo.com / Admin@Motivo2026');
    console.log('   - Customer: rajdeep@motivo.com / Customer@Motivo2026');

    // 2. Insert Vehicles
    const createdVehicles = await Vehicle.insertMany(SEED_VEHICLES);
    console.log(`🚗 Seeded ${createdVehicles.length} vehicles into the fleet.`);

    // 3. Create Sample Bookings across distinct lifecycle states
    const audi = createdVehicles.find((v) => v.make === 'Audi')!;
    const rangeRover = createdVehicles.find((v) => v.make === 'Range Rover')!;
    const porsche = createdVehicles.find((v) => v.make === 'Porsche')!;
    const bmw = createdVehicles.find((v) => v.make === 'BMW')!;

    // Booking 1: Confirmed & Paid (Upcoming)
    const pickup1 = new Date();
    pickup1.setDate(pickup1.getDate() + 3);
    const return1 = new Date();
    return1.setDate(return1.getDate() + 6);
    const price1 = PricingService.calculatePrice({
      dailyRate: audi.dailyRate,
      pickupDateTime: pickup1,
      returnDateTime: return1,
      includeInsurance: true
    });

    const booking1 = await Booking.create({
      bookingReference: 'MOT-20261025-A6UP',
      customer: customer._id,
      vehicle: audi._id,
      pickupDateTime: pickup1,
      returnDateTime: return1,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      priceBreakdown: price1,
      specialRequests: 'Child seat requested for rear row.'
    });

    const payment1 = await Payment.create({
      booking: booking1._id,
      customer: customer._id,
      amount: price1.totalAmount,
      currency: 'INR',
      paymentMethod: 'Card (Simulated)',
      status: 'Successful',
      transactionReference: 'SIM-TX-8839210-AUDI',
      gatewayResponseSimulated: 'Simulated payment completed successfully.',
      invoiceNumber: 'INV-MOT-401923'
    });

    // Booking 2: Active rental (Currently on the road)
    const pickup2 = new Date();
    pickup2.setDate(pickup2.getDate() - 1);
    const return2 = new Date();
    return2.setDate(return2.getDate() + 2);
    const price2 = PricingService.calculatePrice({
      dailyRate: rangeRover.dailyRate,
      pickupDateTime: pickup2,
      returnDateTime: return2,
      includeInsurance: false
    });

    const booking2 = await Booking.create({
      bookingReference: 'MOT-20261021-VELR',
      customer: customer._id,
      vehicle: rangeRover._id,
      pickupDateTime: pickup2,
      returnDateTime: return2,
      status: 'Active',
      paymentStatus: 'Paid',
      priceBreakdown: price2,
      pickupRecordedAt: pickup2
    });

    await Payment.create({
      booking: booking2._id,
      customer: customer._id,
      amount: price2.totalAmount,
      currency: 'INR',
      paymentMethod: 'UPI (Simulated)',
      status: 'Successful',
      transactionReference: 'SIM-TX-9901412-ROVR',
      gatewayResponseSimulated: 'Simulated UPI transfer verified.',
      invoiceNumber: 'INV-MOT-401924'
    });

    // Booking 3: Completed past rental
    const pickup3 = new Date();
    pickup3.setDate(pickup3.getDate() - 10);
    const return3 = new Date();
    return3.setDate(return3.getDate() - 7);
    const price3 = PricingService.calculatePrice({
      dailyRate: bmw.dailyRate,
      pickupDateTime: pickup3,
      returnDateTime: return3
    });

    await Booking.create({
      bookingReference: 'MOT-20261012-BMWP',
      customer: customer._id,
      vehicle: bmw._id,
      pickupDateTime: pickup3,
      returnDateTime: return3,
      status: 'Completed',
      paymentStatus: 'Paid',
      priceBreakdown: price3,
      pickupRecordedAt: pickup3,
      returnRecordedAt: return3
    });

    // Booking 4: Pending reservation
    const pickup4 = new Date();
    pickup4.setDate(pickup4.getDate() + 10);
    const return4 = new Date();
    return4.setDate(return4.getDate() + 12);
    const price4 = PricingService.calculatePrice({
      dailyRate: porsche.dailyRate,
      pickupDateTime: pickup4,
      returnDateTime: return4
    });

    await Booking.create({
      bookingReference: 'MOT-20261031-TAYC',
      customer: customer._id,
      vehicle: porsche._id,
      pickupDateTime: pickup4,
      returnDateTime: return4,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      priceBreakdown: price4
    });

    // 4. Seed In-App Notifications
    await Notification.create([
      {
        recipient: customer._id,
        type: 'BOOKING_CONFIRMED',
        title: 'Booking Confirmed: Audi A6 Sedan',
        message: 'Your upcoming reservation for the Audi A6 Sedan (MOT-20261025-A6UP) has been verified and confirmed.',
        relatedEntityId: booking1._id,
        entityType: 'Booking',
        isRead: false
      },
      {
        recipient: customer._id,
        type: 'PAYMENT_SUCCESSFUL',
        title: 'Payment Receipt Available',
        message: `Simulated transaction receipt INV-MOT-401923 for ₹${price1.totalAmount} is ready to view.`,
        relatedEntityId: payment1._id,
        entityType: 'Payment',
        isRead: true
      },
      {
        recipient: customer._id,
        type: 'PICKUP_RECORDED',
        title: 'Vehicle Handover Complete',
        message: 'Your Range Rover Velar has been officially handed over. Enjoy your journey!',
        relatedEntityId: booking2._id,
        entityType: 'Booking',
        isRead: true
      }
    ]);

    console.log('🔔 Seeded notifications and lifecycle bookings.');
    console.log('✨ Database seeding finished successfully.');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

// Execute if run directly
if (require.main === module) {
  seedDatabase();
}
