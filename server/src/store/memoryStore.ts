import bcrypt from 'bcryptjs';

export interface MemoryUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'customer' | 'admin';
  phone?: string;
  drivingLicense?: string;
}

export interface MemoryVehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  category: string;
  description: string;
  images: string[];
  registrationNumber: string;
  transmission: string;
  fuelType: string;
  seatingCapacity: number;
  dailyRate: number;
  operationalStatus: string;
  features: string[];
  mileageLimitPerDay: number;
}

export interface MemoryBooking {
  _id: string;
  bookingReference: string;
  customer: string; // user id
  vehicle: any;
  pickupDateTime: string;
  returnDateTime: string;
  status: string;
  paymentStatus: string;
  priceBreakdown: any;
  specialRequests?: string;
  createdAt: string;
}

export interface MemoryNotification {
  _id: string;
  recipient: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface MemoryPayment {
  _id: string;
  booking: string;
  customer: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  transactionReference: string;
  invoiceNumber: string;
  createdAt: string;
}

class InMemoryStore {
  public users: MemoryUser[] = [];
  public vehicles: MemoryVehicle[] = [];
  public bookings: MemoryBooking[] = [];
  public notifications: MemoryNotification[] = [];
  public payments: MemoryPayment[] = [];

  constructor() {
    this.initDefaultData();
  }

  private initDefaultData() {
    // Synchronous hash or precomputed hash for instant availability
    // Hash for 'Admin@Motivo2026' and 'Customer@Motivo2026'
    const adminHash = bcrypt.hashSync('Admin@Motivo2026', 10);
    const customerHash = bcrypt.hashSync('Customer@Motivo2026', 10);

    this.users = [
      {
        id: 'usr_admin_01',
        name: 'Aditya Sharma (Fleet Director)',
        email: 'admin@motivo.com',
        passwordHash: adminHash,
        role: 'admin',
        phone: '+91 98200 11223'
      },
      {
        id: 'usr_customer_01',
        name: 'Rajdeep Yadav',
        email: 'rajdeep@motivo.com',
        passwordHash: customerHash,
        role: 'customer',
        phone: '+91 98765 43210',
        drivingLicense: 'DL-0420190012345'
      }
    ];

    this.vehicles = [
      {
        _id: 'veh_01',
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
        _id: 'veh_02',
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
        _id: 'veh_03',
        make: 'Porsche',
        model: 'Taycan 4S',
        year: 2024,
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
        _id: 'veh_04',
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
        _id: 'veh_05',
        make: 'Mercedes-Benz',
        model: 'E-Class Exclusive',
        year: 2023,
        category: 'Luxury',
        description: 'Long-wheelbase luxury sedan with executive rear reclining seating, ambient illumination, and airmatic suspension.',
        images: [
          'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80'
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
        _id: 'veh_06',
        make: 'Toyota',
        model: 'Innova HyCross ZX',
        year: 2024,
        category: 'SUV',
        description: 'Premium family tourer with self-charging strong hybrid electric powertrain and Ottoman lounge chairs.',
        images: [
          'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'
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
        _id: 'veh_07',
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
        _id: 'veh_08',
        make: 'Tata',
        model: 'Safari Dark Edition',
        year: 2024,
        category: 'SUV',
        description: 'Flagship Indian luxury 7-seater SUV with ADAS Level 2, ventilated seats, gesture tailgate, and Harman JBL sound.',
        images: [
          'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
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
        _id: 'veh_09',
        make: 'Royal Enfield',
        model: 'Himalayan 450',
        year: 2024,
        category: 'Bike',
        description: 'High-performance adventure motorcycle with all-new liquid-cooled Sherpa 450 engine and Google Maps Tripper navigation.',
        images: [
          'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
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
        _id: 'veh_10',
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

    this.bookings = [
      {
        _id: 'bk_01',
        bookingReference: 'MOT-20261025-A6UP',
        customer: 'usr_customer_01',
        vehicle: this.vehicles[0],
        pickupDateTime: new Date(Date.now() + 2 * 86400000).toISOString(),
        returnDateTime: new Date(Date.now() + 5 * 86400000).toISOString(),
        status: 'Confirmed',
        paymentStatus: 'Paid',
        priceBreakdown: {
          billableDays: 3,
          dailyRate: 6500,
          baseCharge: 19500,
          additionalCharges: 1050,
          discounts: 0,
          tax: 3699,
          totalAmount: 24249
        },
        specialRequests: 'Child seat in rear row.',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'bk_02',
        bookingReference: 'MOT-20261021-VELR',
        customer: 'usr_customer_01',
        vehicle: this.vehicles[1],
        pickupDateTime: new Date(Date.now() - 1 * 86400000).toISOString(),
        returnDateTime: new Date(Date.now() + 2 * 86400000).toISOString(),
        status: 'Active',
        paymentStatus: 'Paid',
        priceBreakdown: {
          billableDays: 3,
          dailyRate: 9500,
          baseCharge: 28500,
          additionalCharges: 0,
          discounts: 0,
          tax: 5130,
          totalAmount: 33630
        },
        createdAt: new Date().toISOString()
      }
    ];

    this.notifications = [
      {
        _id: 'notif_01',
        recipient: 'usr_customer_01',
        type: 'BOOKING_CONFIRMED',
        title: 'Booking Confirmed: Audi A6 Sedan',
        message: 'Your upcoming reservation for the Audi A6 Sedan (MOT-20261025-A6UP) has been verified and confirmed.',
        isRead: false,
        createdAt: new Date().toISOString()
      },
      {
        _id: 'notif_02',
        recipient: 'usr_customer_01',
        type: 'PICKUP_RECORDED',
        title: 'Vehicle Handover Complete',
        message: 'Your Range Rover Velar has been officially handed over. Enjoy your journey!',
        isRead: true,
        createdAt: new Date().toISOString()
      }
    ];

    this.payments = [
      {
        _id: 'pay_01',
        booking: 'bk_01',
        customer: 'usr_customer_01',
        amount: 24249,
        currency: 'INR',
        paymentMethod: 'Card (Simulated)',
        status: 'Successful',
        transactionReference: 'SIM-TX-8839210-AUDI',
        invoiceNumber: 'INV-MOT-401923',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'pay_02',
        booking: 'bk_02',
        customer: 'usr_customer_01',
        amount: 33630,
        currency: 'INR',
        paymentMethod: 'UPI (Simulated)',
        status: 'Successful',
        transactionReference: 'SIM-TX-9901412-ROVR',
        invoiceNumber: 'INV-MOT-401924',
        createdAt: new Date().toISOString()
      }
    ];
  }
}

export const memoryStore = new InMemoryStore();
