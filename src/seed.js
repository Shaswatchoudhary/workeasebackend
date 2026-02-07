const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Worker = require('./models/Worker');
const Booking = require('./models/Booking');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const workers = [
  // --- ELECTRICIANS ---
  {
    name: 'Rajesh Kumar',
    category: 'Electrician',
    serviceType: 'Residential Electrician',
    yearsOfExperience: 8,
    pricePerHour: 350,
    rating: 4.8,
    totalBookings: 142,
    isAvailable: true,
    location: { lat: 28.6129, lng: 77.2095 },
    image: 'https://st2.depositphotos.com/1005682/12186/i/450/depositphotos_121865862-stock-photo-indian-male-electrician.jpg'
  },
  {
    name: 'Vikram Malhotra',
    category: 'Electrician',
    serviceType: 'Industrial Wiring Specialist',
    yearsOfExperience: 15,
    pricePerHour: 600,
    rating: 5.0,
    totalBookings: 500,
    isAvailable: true,
    location: { lat: 28.6250, lng: 77.2150 },
    image: 'https://thumbs.dreamstime.com/b/electrician-holding-bundle-wires-staring-looking-camera-concept-wire-recommendation-promotion-247556274.jpg'
  },
  {
    name: 'Amit Singh',
    category: 'Electrician',
    serviceType: 'Home Automation Expert',
    yearsOfExperience: 5,
    pricePerHour: 450,
    rating: 4.6,
    totalBookings: 88,
    isAvailable: true,
    location: { lat: 28.6300, lng: 77.2200 },
    image: 'https://media.istockphoto.com/id/518022060/photo/electrician-at-work.jpg?s=612x612&w=0&k=20&c=N7P0Jd1YdXVr6zZ1g4yQ9e4Xz9r8xQ6w5y1Z5X4v8qU='
  },

  // --- PLUMBERS ---
  {
    name: 'Suresh Singh',
    category: 'Plumber',
    serviceType: 'Leakage Specialist',
    yearsOfExperience: 5,
    pricePerHour: 300,
    rating: 4.5,
    totalBookings: 89,
    isAvailable: true,
    location: { lat: 28.6149, lng: 77.2080 },
    image: 'https://tiimg.tistatic.com/fp/1/006/064/plumber-services-367.jpg'
  },
  {
    name: 'Ramesh Gupta',
    category: 'Plumber',
    serviceType: 'Bathroom Fittings Expert',
    yearsOfExperience: 10,
    pricePerHour: 400,
    rating: 4.7,
    totalBookings: 210,
    isAvailable: true,
    location: { lat: 28.6050, lng: 77.2050 },
    image: 'https://www.shutterstock.com/shutterstock/videos/3396943941/thumb/1.jpg?ip=x480'
  },
  {
    name: 'Dinesh Kumar',
    category: 'Plumber',
    serviceType: 'Water Tank Cleaner',
    yearsOfExperience: 3,
    pricePerHour: 250,
    rating: 4.2,
    totalBookings: 45,
    isAvailable: true,
    location: { lat: 28.6180, lng: 77.2180 },
    image: 'https://media.istockphoto.com/id/1142930607/photo/plumber-fixing-sink-pipe-with-adjustable-wrench.jpg?s=612x612&w=0&k=20&c=6q1Z5X4v8qU='
  },

  // --- CARPENTERS ---
  {
    name: 'Amit Sharma',
    category: 'Carpenter',
    serviceType: 'Furniture Specialist',
    yearsOfExperience: 12,
    pricePerHour: 450,
    rating: 4.9,
    totalBookings: 310,
    isAvailable: true,
    location: { lat: 28.6100, lng: 77.2100 },
    image: 'https://st3.depositphotos.com/5653638/18453/i/450/depositphotos_184533424-stock-photo-handsome-indian-carpenter-wood-worker.jpg'
  },
  {
    name: 'Sanjay Dutt',
    category: 'Carpenter',
    serviceType: 'Modular Kitchen Expert',
    yearsOfExperience: 8,
    pricePerHour: 550,
    rating: 4.8,
    totalBookings: 120,
    isAvailable: true,
    location: { lat: 28.6300, lng: 77.2300 },
    image: 'https://www.shutterstock.com/image-photo/carpenter-working-on-wood-structure-outdoor-construction-site-portrait-600w-2475654519.jpg'
  },

  // --- AC REPAIR (Highly Booked) ---
  {
    name: 'Vijay Verma',
    category: 'AC Repair',
    serviceType: 'AC Service & Repair',
    yearsOfExperience: 6,
    pricePerHour: 500,
    rating: 4.9,
    totalBookings: 3500, // Featured in "Most Booked"
    isAvailable: true,
    location: { lat: 28.6200, lng: 77.2000 },
    image: 'https://www.shutterstock.com/image-photo/technician-opening-air-conditioner-examine-600nw-2476765805.jpg'
  },
  {
    name: 'Arun Yadav',
    category: 'AC Repair',
    serviceType: 'AC Installation',
    yearsOfExperience: 7,
    pricePerHour: 600,
    rating: 4.8,
    totalBookings: 2100, // Featured
    isAvailable: true,
    location: { lat: 28.5900, lng: 77.1900 },
    image: 'https://tiimg.tistatic.com/fp/1/008/912/ac-maintenance-services-617.jpg'
  },

  // --- APPLIANCE REPAIR (Highly Booked) ---
  {
    name: 'Deepak Chopra',
    category: 'Appliance Repair',
    serviceType: 'Washing Machine Repair',
    yearsOfExperience: 9,
    pricePerHour: 450,
    rating: 4.7,
    totalBookings: 1800, // Featured
    isAvailable: true,
    location: { lat: 28.6180, lng: 77.2250 },
    image: 'https://content.jdmagicbox.com/comp/defaul/defaultbeautysalon/defaultbeautysalon-5.jpg'
  },
  {
    name: 'Manoj Tiwari',
    category: 'Appliance Repair',
    serviceType: 'Microwave & Oven Repair',
    yearsOfExperience: 5,
    pricePerHour: 350,
    rating: 4.5,
    totalBookings: 900, // Featured
    isAvailable: true,
    location: { lat: 28.6400, lng: 77.2100 },
    image: 'https://tiimg.tistatic.com/fp/1/007/052/microwave-oven-repair-service-858.jpg'
  },

  // --- SELF CARE (MALE) ---
  {
    name: 'Rahul Barber',
    category: 'Self-care (Male)',
    serviceType: 'Haircut & Beard Styling',
    yearsOfExperience: 4,
    pricePerHour: 200,
    rating: 4.6,
    totalBookings: 3200, // Most booked
    gender: 'Male',
    isAvailable: true,
    location: { lat: 28.6150, lng: 77.2200 },
    image: 'https://www.kapilssalon.com/wp-content/uploads/2025/08/How-to-Become-a-Professional-Hairdresser-in-India-Step-by-Step-Career-Guide-2025-Edition-1024x576.png'
  },
  {
    name: 'Mohit Stylist',
    category: 'Self-care (Male)',
    serviceType: 'Facial & Massage',
    yearsOfExperience: 6,
    pricePerHour: 500,
    rating: 4.8,
    totalBookings: 150,
    gender: 'Male',
    isAvailable: true,
    location: { lat: 28.6350, lng: 77.2150 },
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400'
  },

  // --- SELF CARE (FEMALE) ---
  {
    name: 'Priya Salon',
    category: 'Self-care (Female)',
    serviceType: 'Bridal Makeup',
    yearsOfExperience: 5,
    pricePerHour: 2500,
    rating: 4.9,
    totalBookings: 1200,
    gender: 'Female',
    isAvailable: true,
    location: { lat: 28.6200, lng: 77.2300 },
    image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400'
  },
  {
    name: 'Sneha Beauty',
    category: 'Self-care (Female)',
    serviceType: 'Skincare Treatment',
    yearsOfExperience: 3,
    pricePerHour: 800,
    rating: 4.7,
    totalBookings: 300,
    gender: 'Female',
    isAvailable: true,
    location: { lat: 28.6100, lng: 77.2400 },
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400'
  }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await Worker.deleteMany();
    await Booking.deleteMany();

    console.log('Seeding workers...');
    await Worker.insertMany(workers);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
