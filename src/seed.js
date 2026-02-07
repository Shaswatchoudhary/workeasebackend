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
    name: 'Arjun Patil',
    category: 'Electrician',
    serviceType: 'Residential Electrician',
    yearsOfExperience: 8,
    pricePerHour: 250,
    rating: 4.8,
    totalBookings: 142,
    isAvailable: true,
    location: { lat: 16.7085, lng: 74.2465 },
    image: 'https://st2.depositphotos.com/1005682/12186/i/450/depositphotos_121865862-stock-photo-indian-male-electrician.jpg'
  },
  {
    name: 'Kavish Deshmukh',
    category: 'Electrician',
    serviceType: 'Wiring Specialist',
    yearsOfExperience: 5,
    pricePerHour: 180,
    rating: 4.5,
    totalBookings: 88,
    isAvailable: true,
    location: { lat: 16.7012, lng: 74.2398 },
    image: 'https://thumbs.dreamstime.com/b/electrician-holding-bundle-wires-staring-looking-camera-concept-wire-recommendation-promotion-247556274.jpg'
  },
  {
    name: 'Rohan Kulkarni',
    category: 'Electrician',
    serviceType: 'Commercial Electrician',
    yearsOfExperience: 10,
    pricePerHour: 300,
    rating: 5.0,
    totalBookings: 250,
    isAvailable: true,
    location: { lat: 16.7120, lng: 74.2480 },
    image: 'https://media.istockphoto.com/id/518022060/photo/electrician-at-work.jpg?s=612x612&w=0&k=20&c=N7P0Jd1YdXVr6zZ1g4yQ9e4Xz9r8xQ6w5y1Z5X4v8qU='
  },
  {
    name: 'Aditya Shinde',
    category: 'Electrician',
    serviceType: 'Inverter Expert',
    yearsOfExperience: 3,
    pricePerHour: 150,
    rating: 4.2,
    totalBookings: 45,
    isAvailable: true,
    location: { lat: 16.6980, lng: 74.2410 },
    image: 'https://st2.depositphotos.com/1005682/12186/i/450/depositphotos_121865862-stock-photo-indian-male-electrician.jpg'
  },
  {
    name: 'Varun Jadhav',
    category: 'Electrician',
    serviceType: 'Maintenance Specialist',
    yearsOfExperience: 6,
    pricePerHour: 200,
    rating: 4.6,
    totalBookings: 110,
    isAvailable: true,
    location: { lat: 16.7040, lng: 74.2510 },
    image: 'https://media.istockphoto.com/id/518022060/photo/electrician-at-work.jpg?s=612x612&w=0&k=20&c=N7P0Jd1YdXVr6zZ1g4yQ9e4Xz9r8xQ6w5y1Z5X4v8qU='
  },

  // --- PLUMBERS ---
  {
    name: 'Sanjay Bhosale',
    category: 'Plumber',
    serviceType: 'Leakage Specialist',
    yearsOfExperience: 5,
    pricePerHour: 150,
    rating: 4.4,
    totalBookings: 89,
    isAvailable: true,
    location: { lat: 16.7065, lng: 74.2450 },
    image: 'https://tiimg.tistatic.com/fp/1/006/064/plumber-services-367.jpg'
  },
  {
    name: 'Vikram More',
    category: 'Plumber',
    serviceType: 'Bathroom Fittings Expert',
    yearsOfExperience: 9,
    pricePerHour: 220,
    rating: 4.7,
    totalBookings: 210,
    isAvailable: true,
    location: { lat: 16.7025, lng: 74.2380 },
    image: 'https://www.shutterstock.com/shutterstock/videos/3396943941/thumb/1.jpg?ip=x480'
  },
  {
    name: 'Akash Ghorpade',
    category: 'Plumber',
    serviceType: 'Pipeline Specialist',
    yearsOfExperience: 4,
    pricePerHour: 130,
    rating: 4.1,
    totalBookings: 56,
    isAvailable: true,
    location: { lat: 16.7110, lng: 74.2425 },
    image: 'https://media.istockphoto.com/id/1142930607/photo/plumber-fixing-sink-pipe-with-adjustable-wrench.jpg?s=612x612&w=0&k=20&c=6q1Z5X4v8qU='
  },
  {
    name: 'Nitin Mane',
    category: 'Plumber',
    serviceType: 'Water Tank Expert',
    yearsOfExperience: 7,
    pricePerHour: 180,
    rating: 4.5,
    totalBookings: 124,
    isAvailable: true,
    location: { lat: 16.6995, lng: 74.2485 },
    image: 'https://tiimg.tistatic.com/fp/1/006/064/plumber-services-367.jpg'
  },
  {
    name: 'Deepak Thorat',
    category: 'Plumber',
    serviceType: 'Maintenance Plumber',
    yearsOfExperience: 2,
    pricePerHour: 100,
    rating: 3.9,
    totalBookings: 32,
    isAvailable: true,
    location: { lat: 16.7075, lng: 74.2520 },
    image: 'https://www.shutterstock.com/shutterstock/videos/3396943941/thumb/1.jpg?ip=x480'
  },

  // --- CARPENTERS ---
  {
    name: 'Pramod Chavan',
    category: 'Carpenter',
    serviceType: 'Furniture Specialist',
    yearsOfExperience: 10,
    pricePerHour: 280,
    rating: 4.9,
    totalBookings: 310,
    isAvailable: true,
    location: { lat: 16.7055, lng: 74.2440 },
    image: 'https://st3.depositphotos.com/5653638/18453/i/450/depositphotos_184533424-stock-photo-handsome-indian-carpenter-wood-worker.jpg'
  },
  {
    name: 'Santosh Pawar',
    category: 'Carpenter',
    serviceType: 'Modular Kitchen Expert',
    yearsOfExperience: 6,
    pricePerHour: 240,
    rating: 4.6,
    totalBookings: 120,
    isAvailable: true,
    location: { lat: 16.7095, lng: 74.2490 },
    image: 'https://www.shutterstock.com/image-photo/carpenter-working-on-wood-structure-outdoor-construction-site-portrait-600w-2475654519.jpg'
  },
  {
    name: 'Ramesh Gaikwad',
    category: 'Carpenter',
    serviceType: 'Door & Window Fixer',
    yearsOfExperience: 4,
    pricePerHour: 180,
    rating: 4.3,
    totalBookings: 78,
    isAvailable: true,
    location: { lat: 16.7015, lng: 74.2415 },
    image: 'https://st3.depositphotos.com/5653638/18453/i/450/depositphotos_184533424-stock-photo-handsome-indian-carpenter-wood-worker.jpg'
  },
  {
    name: 'Ganesh Sawant',
    category: 'Carpenter',
    serviceType: 'Wood Polishing Expert',
    yearsOfExperience: 8,
    pricePerHour: 260,
    rating: 4.7,
    totalBookings: 195,
    isAvailable: true,
    location: { lat: 16.7130, lng: 74.2455 },
    image: 'https://www.shutterstock.com/image-photo/carpenter-working-on-wood-structure-outdoor-construction-site-portrait-600w-2475654519.jpg'
  },
  {
    name: 'Vishal Salunkhe',
    category: 'Carpenter',
    serviceType: 'General Carpenter',
    yearsOfExperience: 2,
    pricePerHour: 120,
    rating: 3.8,
    totalBookings: 42,
    isAvailable: true,
    location: { lat: 16.6975, lng: 74.2375 },
    image: 'https://st3.depositphotos.com/5653638/18453/i/450/depositphotos_184533424-stock-photo-handsome-indian-carpenter-wood-worker.jpg'
  },

  // --- SELF CARE (MALE) ---
  {
    name: 'Sameer Kadam',
    category: 'Self-care (Male)',
    serviceType: 'Haircut & Styling',
    yearsOfExperience: 7,
    pricePerHour: 200,
    rating: 4.7,
    totalBookings: 420,
    gender: 'Male',
    isAvailable: true,
    location: { lat: 16.7045, lng: 74.2435 },
    image: 'https://www.kapilssalon.com/wp-content/uploads/2025/08/How-to-Become-a-Professional-Hairdresser-in-India-Step-by-Step-Career-Guide-2025-Edition-1024x576.png'
  },
  {
    name: 'Amit Nikam',
    category: 'Self-care (Male)',
    serviceType: 'Beard Trimming',
    yearsOfExperience: 4,
    pricePerHour: 120,
    rating: 4.4,
    totalBookings: 250,
    gender: 'Male',
    isAvailable: true,
    location: { lat: 16.7080, lng: 74.2410 },
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400'
  },
  {
    name: 'Rahul Shinde',
    category: 'Self-care (Male)',
    serviceType: 'Facial & Scrub',
    yearsOfExperience: 5,
    pricePerHour: 250,
    rating: 4.5,
    totalBookings: 180,
    gender: 'Male',
    isAvailable: true,
    location: { lat: 16.7020, lng: 74.2475 },
    image: 'https://www.kapilssalon.com/wp-content/uploads/2025/08/How-to-Become-a-Professional-Hairdresser-in-India-Step-by-Step-Career-Guide-2025-Edition-1024x576.png'
  },
  {
    name: 'Vijay Patil',
    category: 'Self-care (Male)',
    serviceType: 'Head Massage',
    yearsOfExperience: 8,
    pricePerHour: 180,
    rating: 4.8,
    totalBookings: 320,
    gender: 'Male',
    isAvailable: true,
    location: { lat: 16.7115, lng: 74.2445 },
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400'
  },
  {
    name: 'Sunil More',
    category: 'Self-care (Male)',
    serviceType: 'Grooming Package',
    yearsOfExperience: 3,
    pricePerHour: 300,
    rating: 4.1,
    totalBookings: 95,
    gender: 'Male',
    isAvailable: true,
    location: { lat: 16.6990, lng: 74.2405 },
    image: 'https://www.kapilssalon.com/wp-content/uploads/2025/08/How-to-Become-a-Professional-Hairdresser-in-India-Step-by-Step-Career-Guide-2025-Edition-1024x576.png'
  },

  // --- SELF CARE (FEMALE) ---
  {
    name: 'Priya Deshpande',
    category: 'Self-care (Female)',
    serviceType: 'Bridal Makeup',
    yearsOfExperience: 8,
    pricePerHour: 500,
    rating: 4.9,
    totalBookings: 150,
    gender: 'Female',
    isAvailable: true,
    location: { lat: 16.7052, lng: 74.2438 },
    image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400'
  },
  {
    name: 'Snehal Kulkarni',
    category: 'Self-care (Female)',
    serviceType: 'Skin Treatment',
    yearsOfExperience: 6,
    pricePerHour: 350,
    rating: 4.7,
    totalBookings: 210,
    gender: 'Female',
    isAvailable: true,
    location: { lat: 16.7090, lng: 74.2395 },
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400'
  },
  {
    name: 'Anjali Patil',
    category: 'Self-care (Female)',
    serviceType: 'Hair Coloring',
    yearsOfExperience: 4,
    pricePerHour: 280,
    rating: 4.4,
    totalBookings: 124,
    gender: 'Female',
    isAvailable: true,
    location: { lat: 16.7018, lng: 74.2460 },
    image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400'
  },
  {
    name: 'Kavita Shinde',
    category: 'Self-care (Female)',
    serviceType: 'Manicure & Pedicure',
    yearsOfExperience: 5,
    pricePerHour: 200,
    rating: 4.5,
    totalBookings: 185,
    gender: 'Female',
    isAvailable: true,
    location: { lat: 16.7112, lng: 74.2472 },
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400'
  },
  {
    name: 'Pooja Gaikwad',
    category: 'Self-care (Female)',
    serviceType: 'Full Body Waxing',
    yearsOfExperience: 3,
    pricePerHour: 300,
    rating: 4.2,
    totalBookings: 76,
    gender: 'Female',
    isAvailable: true,
    location: { lat: 16.6985, lng: 74.2422 },
    image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400'
  },

  // --- AC REPAIR ---
  {
    name: 'Vinay Bhoite',
    category: 'AC Repair',
    serviceType: 'AC Servicing',
    yearsOfExperience: 7,
    pricePerHour: 300,
    rating: 4.8,
    totalBookings: 540,
    isAvailable: true,
    location: { lat: 16.7058, lng: 74.2442 },
    image: 'https://www.shutterstock.com/image-photo/technician-opening-air-conditioner-examine-600nw-2476765805.jpg'
  },
  {
    name: 'Ajit Sawant',
    category: 'AC Repair',
    serviceType: 'Gas Refilling',
    yearsOfExperience: 5,
    pricePerHour: 450,
    rating: 4.6,
    totalBookings: 320,
    isAvailable: true,
    location: { lat: 16.7100, lng: 74.2400 },
    image: 'https://tiimg.tistatic.com/fp/1/008/912/ac-maintenance-services-617.jpg'
  },
  {
    name: 'Sandeep Mane',
    category: 'AC Repair',
    serviceType: 'AC Installation',
    yearsOfExperience: 9,
    pricePerHour: 600,
    rating: 4.9,
    totalBookings: 850,
    isAvailable: true,
    location: { lat: 16.7022, lng: 74.2478 },
    image: 'https://www.shutterstock.com/image-photo/technician-opening-air-conditioner-examine-600nw-2476765805.jpg'
  },
  {
    name: 'Mahesh Thorat',
    category: 'AC Repair',
    serviceType: 'Split AC Expert',
    yearsOfExperience: 4,
    pricePerHour: 350,
    rating: 4.3,
    totalBookings: 145,
    isAvailable: true,
    location: { lat: 16.7125, lng: 74.2450 },
    image: 'https://tiimg.tistatic.com/fp/1/008/912/ac-maintenance-services-617.jpg'
  },
  {
    name: 'Omkar Chavan',
    category: 'AC Repair',
    serviceType: 'General Maintenance',
    yearsOfExperience: 2,
    pricePerHour: 200,
    rating: 3.8,
    totalBookings: 64,
    isAvailable: true,
    location: { lat: 16.6998, lng: 74.2388 },
    image: 'https://www.shutterstock.com/image-photo/technician-opening-air-conditioner-examine-600nw-2476765805.jpg'
  },

  // --- APPLIANCE REPAIR ---
  {
    name: 'Dinesh Pawar',
    category: 'Appliance Repair',
    serviceType: 'Washing Machine Repair',
    yearsOfExperience: 8,
    pricePerHour: 250,
    rating: 4.7,
    totalBookings: 290,
    isAvailable: true,
    location: { lat: 16.7042, lng: 74.2428 },
    image: 'https://media.istockphoto.com/id/1142930607/photo/plumber-fixing-sink-pipe-with-adjustable-wrench.jpg?s=612x612&w=0&k=20&c=6q1Z5X4v8qU='
  },
  {
    name: 'Hemant Salunkhe',
    category: 'Appliance Repair',
    serviceType: 'Refrigerator Expert',
    yearsOfExperience: 6,
    pricePerHour: 220,
    rating: 4.5,
    totalBookings: 180,
    isAvailable: true,
    location: { lat: 16.7088, lng: 74.2488 },
    image: 'https://tiimg.tistatic.com/fp/1/007/052/microwave-oven-repair-service-858.jpg'
  },
  {
    name: 'Sharad Jadhav',
    category: 'Appliance Repair',
    serviceType: 'Microwave Repair',
    yearsOfExperience: 4,
    pricePerHour: 150,
    rating: 4.2,
    totalBookings: 98,
    isAvailable: true,
    location: { lat: 16.7010, lng: 74.2405 },
    image: 'https://media.istockphoto.com/id/1142930607/photo/plumber-fixing-sink-pipe-with-adjustable-wrench.jpg?s=612x612&w=0&k=20&c=6q1Z5X4v8qU='
  },
  {
    name: 'Nilesh Bhosale',
    category: 'Appliance Repair',
    serviceType: 'Geyser Repair',
    yearsOfExperience: 7,
    pricePerHour: 200,
    rating: 4.6,
    totalBookings: 145,
    isAvailable: true,
    location: { lat: 16.7118, lng: 74.2430 },
    image: 'https://tiimg.tistatic.com/fp/1/007/052/microwave-oven-repair-service-858.jpg'
  },
  {
    name: 'Pratik More',
    category: 'Appliance Repair',
    serviceType: 'General Technician',
    yearsOfExperience: 3,
    pricePerHour: 120,
    rating: 3.9,
    totalBookings: 54,
    isAvailable: true,
    location: { lat: 16.6990, lng: 74.2495 },
    image: 'https://media.istockphoto.com/id/1142930607/photo/plumber-fixing-sink-pipe-with-adjustable-wrench.jpg?s=612x612&w=0&k=20&c=6q1Z5X4v8qU='
  }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await Worker.deleteMany();
    await Booking.deleteMany();

    console.log('Seeding 35 Kolhapur workers...');
    await Worker.insertMany(workers);

    console.log('Successfully seeded 35 realistic workers in Kolhapur!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
