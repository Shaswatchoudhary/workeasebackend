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
    fullName: 'Arjun Patil',
    phone: '9876543210',
    aadhaar: '123456789012',
    pan: 'ABCDE1234F',
    category: 'Electrician',
    experience: 8,
    summary: 'Expert electrician with over 8 years of experience in residential and commercial wiring. Specialized in installing and repairing circuit breakers, lighting fixtures, and high-voltage systems. Committed to safety and providing top-notch electrical solutions for all your home needs. Experienced in handling complex projects with precision and care.',
    bankDetails: {
      holderName: 'Arjun Patil',
      bankName: 'HDFC Bank',
      accountNumber: '123456789',
      ifsc: 'HDFC0001234'
    },
    rating: 4.8,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2465, 16.7085], address: 'Shahupuri, Kolhapur' }
  },
  {
    fullName: 'Kavish Deshmukh',
    phone: '9876543211',
    aadhaar: '123456789013',
    pan: 'BCDEF1234G',
    category: 'Electrician',
    experience: 5,
    summary: 'Wiring specialist focused on home automation and modern electrical systems. 5 years of experience in troubleshooting and resolving electrical faults efficiently. Dedicated to ensuring customer satisfaction through reliable and high-quality work. Skilled in reading blueprints and technical diagrams for accurate installations and repairs.',
    bankDetails: {
      holderName: 'Kavish Deshmukh',
      bankName: 'ICICI Bank',
      accountNumber: '234567890',
      ifsc: 'ICIC0002345'
    },
    rating: 4.5,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2398, 16.7012], address: 'Rajarampuri, Kolhapur' }
  },
  {
    fullName: 'Rohan Kulkarni',
    phone: '9876543212',
    aadhaar: '123456789014',
    pan: 'CDEFG2345H',
    category: 'Electrician',
    experience: 10,
    summary: 'Commercial electrician with a decade of experience in large-scale electrical installations. Expertise in industrial power systems, maintenance, and emergency repairs. Proven track record of delivering projects on time and within budget while maintaining the highest safety standards. Capable of leading teams for complex electrical infrastructure projects.',
    bankDetails: {
      holderName: 'Rohan Kulkarni',
      bankName: 'SBI',
      accountNumber: '345678901',
      ifsc: 'SBIN0003456'
    },
    rating: 5.0,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2480, 16.7120], address: 'Tarabai Park, Kolhapur' }
  },
  {
    fullName: 'Aditya Shinde',
    phone: '9876543213',
    aadhaar: '123456789015',
    pan: 'DEFGH3456I',
    category: 'Electrician',
    experience: 3,
    summary: 'Expert in inverter and battery maintenance, specializing in home UPS systems. 3 years of hands-on experience in the field, ensuring reliable backup power solutions for households. Fast, efficient, and always ready to help with your electrical backup needs. Focuses on preventive maintenance to extend the life of your equipment.',
    bankDetails: {
      holderName: 'Aditya Shinde',
      bankName: 'Axis Bank',
      accountNumber: '456789012',
      ifsc: 'UTIB0004567'
    },
    rating: 4.2,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2410, 16.6980], address: 'Uchgaon, Kolhapur' }
  },
  {
    fullName: 'Varun Jadhav',
    phone: '9876543214',
    aadhaar: '123456789016',
    pan: 'EFGHI4567J',
    category: 'Electrician',
    experience: 6,
    summary: 'Maintenance specialist for all household appliances and electrical systems. 6 years of experience in providing comprehensive maintenance services to ensure safety and efficiency. Known for attention to detail and a customer-centric approach in every electrical task. Skilled at diagnosing hidden electrical issues before they become major problems.',
    bankDetails: {
      holderName: 'Varun Jadhav',
      bankName: 'YES Bank',
      accountNumber: '567890123',
      ifsc: 'YESB0005678'
    },
    rating: 4.6,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2510, 16.7040], address: 'Kadamwadi, Kolhapur' }
  },

  // --- PLUMBERS ---
  {
    fullName: 'Sanjay Bhosale',
    phone: '8876543210',
    aadhaar: '223456789012',
    pan: 'GBHDE1234F',
    category: 'Plumber',
    experience: 5,
    summary: 'Leakage specialist dealing with pipe repairs and bathroom fittings. 5 years of experience in providing reliable plumbing solutions for residential properties. Dedicated to fixing leaks quickly and efficiently to prevent water damage in your home. Expertise includes resolving complex drainage issues and installing modern plumbing fixtures.',
    bankDetails: {
      holderName: 'Sanjay Bhosale',
      bankName: 'HDFC Bank',
      accountNumber: '663456789',
      ifsc: 'HDFC0001234'
    },
    rating: 4.4,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2450, 16.7065], address: 'Laxmipuri, Kolhapur' }
  },
  {
    fullName: 'Vikram More',
    phone: '8876543211',
    aadhaar: '223456789013',
    pan: 'HBDEF1234G',
    category: 'Plumber',
    experience: 9,
    summary: 'Bathroom fittings expert specializing in luxury installations and renovations. 9 years of experience in creating functional and beautiful bathrooms for discerning clients. Focuses on quality craftsmanship and attention to every detail in every plumbing project. Skilled in installing diverse bathroom fixtures ranging from classic to modern styles.',
    bankDetails: {
      holderName: 'Vikram More',
      bankName: 'ICICI Bank',
      accountNumber: '764567890',
      ifsc: 'ICIC0002345'
    },
    rating: 4.7,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2380, 16.7025], address: 'Phulewadi, Kolhapur' }
  },
  {
    fullName: 'Akash Ghorpade',
    phone: '8876543212',
    aadhaar: '223456789014',
    pan: 'ICDFG2345H',
    category: 'Plumber',
    experience: 4,
    summary: 'Pipeline specialist proficient in underground drainage and main line repairs. 4 years of experience in handling complex plumbing infrastructure for homes and small businesses. Always uses high-quality materials to ensure long-lasting results in all plumbing services. Dedicated to providing efficient and professional support for all plumbing needs.',
    bankDetails: {
      holderName: 'Akash Ghorpade',
      bankName: 'SBI',
      accountNumber: '865678901',
      ifsc: 'SBIN0003456'
    },
    rating: 4.1,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2425, 16.7110], address: 'Nagala Park, Kolhapur' }
  },
  {
    fullName: 'Nitin Mane',
    phone: '8876543213',
    aadhaar: '223456789015',
    pan: 'JEFGH3456I',
    category: 'Plumber',
    experience: 7,
    summary: 'Water tank expert with 7 years of experience in installation and cleaning services. Specializes in managing water systems efficiently for residential buildings, ensuring a safe water supply. Fast and professional service with a focus on hygiene and customer satisfaction. Expertise includes handling water pump repairs and pressure management.',
    bankDetails: {
      holderName: 'Nitin Mane',
      bankName: 'Axis Bank',
      accountNumber: '966789012',
      ifsc: 'UTIB0004567'
    },
    rating: 4.5,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2485, 16.6995], address: 'Kasaba Bawada, Kolhapur' }
  },
  {
    fullName: 'Deepak Thorat',
    phone: '8876543214',
    aadhaar: '223456789016',
    pan: 'KEGHI4567J',
    category: 'Plumber',
    experience: 2,
    summary: 'Maintenance plumber providing comprehensive support for various plumbing tasks. 2 years of experience in diagnosing and fixing everyday plumbing issues in local households. Committed to learning and improving plumbing techniques for better service quality. Reliable and punctual for all types of plumbing maintenance and minor repair work.',
    bankDetails: {
      holderName: 'Deepak Thorat',
      bankName: 'YES Bank',
      accountNumber: '067890123',
      ifsc: 'YESB0005678'
    },
    rating: 3.9,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2520, 16.7075], address: 'Salokhe Nagar, Kolhapur' }
  },

  // --- CARPENTERS ---
  {
    fullName: 'Pramod Chavan',
    phone: '7776543210',
    aadhaar: '323456789012',
    pan: 'PBHDE1234F',
    category: 'Carpenter',
    experience: 10,
    summary: 'Furniture specialist with a decade of experience in crafting bespoke wooden items. Expertise in modern and traditional furniture design, from initial concept to final finish. Dedicated to using high-quality materials and precise techniques for stunning, durable results. Committed to delivering custom furniture that meets each client unique style and needs.',
    bankDetails: {
      holderName: 'Pramod Chavan',
      bankName: 'HDFC Bank',
      accountNumber: '111222333',
      ifsc: 'HDFC0001234'
    },
    rating: 4.9,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2440, 16.7055], address: 'Shivaji Peth, Kolhapur' }
  },
  {
    fullName: 'Santosh Pawar',
    phone: '7776543211',
    aadhaar: '323456789013',
    pan: 'QBDEF1234G',
    category: 'Carpenter',
    experience: 6,
    summary: 'Modular kitchen expert with 6 years of experience in designing and installing functional spaces. Skilled in coordinating with other trades and ensuring seamless installations for high-end residential projects. Focuses on maximizing kitchen utility while maintaining stylish aesthetics for every modern home. Expertise includes using diverse materials for versatile kitchen designs.',
    bankDetails: {
      holderName: 'Santosh Pawar',
      bankName: 'ICICI Bank',
      accountNumber: '222333444',
      ifsc: 'ICIC0002345'
    },
    rating: 4.6,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2490, 16.7095], address: 'Ruikar Colony, Kolhapur' }
  },
  {
    fullName: 'Ramesh Gaikwad',
    phone: '7776543212',
    aadhaar: '323456789014',
    pan: 'RCDFG2345H',
    category: 'Carpenter',
    experience: 4,
    summary: 'Door and window fixer providing expert repair and installation services for local homes. 4 years of experience in ensuring security and functionality for various residential properties. Dedicated to using durable materials and precise methods in every project for long-term customer satisfaction. Reliable and efficient in resolving door and window issues promptly.',
    bankDetails: {
      holderName: 'Ramesh Gaikwad',
      bankName: 'SBI',
      accountNumber: '333444555',
      ifsc: 'SBIN0003456'
    },
    rating: 4.3,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2415, 16.7015], address: 'Samrat Nagar, Kolhapur' }
  },
  {
    fullName: 'Ganesh Sawant',
    phone: '7776543213',
    aadhaar: '323456789015',
    pan: 'SEFGH3456I',
    category: 'Carpenter',
    experience: 8,
    summary: 'Wood polishing expert with 8 years of experience in restoring the beauty of wooden surfaces. Expertise in applying diverse finishes and treatments to enhance wood grains and provide lasting protection. Dedicated to achieving a flawless, professional look for all types of furniture and wooden fixtures. Focused on client specific preferences for every wood restoration project.',
    bankDetails: {
      holderName: 'Ganesh Sawant',
      bankName: 'Axis Bank',
      accountNumber: '444555666',
      ifsc: 'UTIB0004567'
    },
    rating: 4.7,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2455, 16.7130], address: 'Kawala Naka, Kolhapur' }
  },
  {
    fullName: 'Vishal Salunkhe',
    phone: '7776543214',
    aadhaar: '323456789016',
    pan: 'TEGHI4567J',
    category: 'Carpenter',
    experience: 2,
    summary: 'General carpenter offering versatile repair and maintenance services for residential and commercial spaces. 2 years of experience in handling various small-scale carpentry tasks with care and precision. Committed to providing reliable and affordable services to the local community for all basic woodworking needs. Punctual and professional in every carpentry project undertaken.',
    bankDetails: {
      holderName: 'Vishal Salunkhe',
      bankName: 'YES Bank',
      accountNumber: '555666777',
      ifsc: 'YESB0005678'
    },
    rating: 3.8,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2375, 16.6975], address: 'Rankala, Kolhapur' }
  },

  // --- MEN'S SELF CARE ---
  {
    fullName: 'Sameer Kadam',
    phone: '6666543110',
    aadhaar: '423456789012',
    pan: 'UBHDE1234F',
    category: "Men's Self Care",
    experience: 7,
    summary: 'Professional barber with 7 years of experience in haircutting and trending hair designs. Specialized in providing a comfortable and modern grooming experience for men of all ages. Dedicated to ensuring customer satisfaction through personalized styles and attention to detail. Skilled in various styling techniques to suit different hair types and preferences.',
    bankDetails: {
      holderName: 'Sameer Kadam',
      bankName: 'HDFC Bank',
      accountNumber: '666777888',
      ifsc: 'HDFC0001234'
    },
    rating: 4.7,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2435, 16.7045], address: 'Mangalwar Peth, Kolhapur' }
  },
  {
    fullName: 'Amit Nikam',
    phone: '6666543111',
    aadhaar: '423456789013',
    pan: 'VBDEF1234G',
    category: "Men's Self Care",
    experience: 4,
    summary: 'Beard grooming specialist with 4 years of experience in precision trimming and beard styling. expertise in maintaining facial hair for a sharp and professional appearance in every man. Committed to using high-quality grooming products for the best results and skin health. Fast and efficient service with a focus on modern men style trends for all clients.',
    bankDetails: {
      holderName: 'Amit Nikam',
      bankName: 'ICICI Bank',
      accountNumber: '777888999',
      ifsc: 'ICIC0002345'
    },
    rating: 4.4,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2410, 16.7080], address: 'Yallamma Colony, Kolhapur' }
  },
  {
    fullName: 'Rahul Shinde',
    phone: '6666543112',
    aadhaar: '423456789014',
    pan: 'WCDFG2345H',
    category: "Men's Self Care",
    experience: 5,
    summary: 'Skin care expert for men with 5 years of experience in facial treatments and relaxation techniques. Specialized in deep cleansing and revitalizing skin for a healthier and more energetic look. Dedicated to providing a soothing and professional experience for every client who cares about their skin. expertise includes managing various skin types and advising on effective grooming routines.',
    bankDetails: {
      holderName: 'Rahul Shinde',
      bankName: 'SBI',
      accountNumber: '888999000',
      ifsc: 'SBIN0003456'
    },
    rating: 4.5,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2475, 16.7020], address: 'Race Course, Kolhapur' }
  },
  {
    fullName: 'Vijay Patil',
    phone: '6666543113',
    aadhaar: '423456789015',
    pan: 'XEFGH3456I',
    category: "Men's Self Care",
    experience: 8,
    summary: 'Massaging therapist for men with 8 years of experience in stress relief and rejuvenation. Specialized in traditional and modern massage techniques for complete relaxation after a busy day. Dedicated to creating a peaceful environment for every massage session with professional care. Expertise in relieving muscle tension and improving overall well-being for all male clients.',
    bankDetails: {
      holderName: 'Vijay Patil',
      bankName: 'Axis Bank',
      accountNumber: '999000111',
      ifsc: 'UTIB0004567'
    },
    rating: 4.8,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2445, 16.7115], address: 'Bindu Chowk, Kolhapur' }
  },
  {
    fullName: 'Sunil More',
    phone: '6666543114',
    aadhaar: '423456789016',
    pan: 'YEGHI4567J',
    category: "Men's Self Care",
    experience: 3,
    summary: 'Grooming package expert offering comprehensive solutions for the modern man since 3 years. Focused on providing a complete transformation for every client with tailored grooming packages and styles. Dedicated to professional service and customer satisfaction for all grooming needs. Reliable and enthusiastic about help every man to look and feel his best every day.',
    bankDetails: {
      holderName: 'Sunil More',
      bankName: 'YES Bank',
      accountNumber: '000111222',
      ifsc: 'YESB0005678'
    },
    rating: 4.1,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2405, 16.6990], address: 'Subhashnagar, Kolhapur' }
  },

  // --- WOMEN'S SELF CARE ---
  {
    fullName: 'Priya Deshpande',
    phone: '5556543110',
    aadhaar: '523456789012',
    pan: 'ZBHDE1234F',
    category: "Women's Self Care",
    experience: 8,
    summary: 'Bridal makeup artist with 8 years of experience in creating stunning looks for special days. Expertise in various makeup styles to suit different occasions and individual preferences for women. Dedicated to providing a personalized and high-quality beauty experience for every client. Skilled in professional techniques to ensure a flawless and long-lasting finish in every makeup task.',
    bankDetails: {
      holderName: 'Priya Deshpande',
      bankName: 'HDFC Bank',
      accountNumber: '111222999',
      ifsc: 'HDFC0001234'
    },
    rating: 4.9,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2438, 16.7052], address: 'Malwadi, Kolhapur' }
  },
  {
    fullName: 'Snehal Kulkarni',
    phone: '5556543111',
    aadhaar: '523456789013',
    pan: 'ABCEF1234G',
    category: "Women's Self Care",
    experience: 6,
    summary: 'Skin treatment specialist for women with 6 years of experience in revitalizing skin health. Specialized in professional facials and holistic skin care routines for a radiant appearance every day. Dedicated to ensuring a relaxing and effective beauty experience for every female client. Focused on using quality products tailored to each skin type for optimal results and care.',
    bankDetails: {
      holderName: 'Snehal Kulkarni',
      bankName: 'ICICI Bank',
      accountNumber: '222333000',
      ifsc: 'ICIC0002345'
    },
    rating: 4.7,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2395, 16.7090], address: 'Pratibha Nagar, Kolhapur' }
  },
  {
    fullName: 'Anjali Patil',
    phone: '5556543112',
    aadhaar: '523456789014',
    pan: 'BBCFG2345H',
    category: "Women's Self Care",
    experience: 4,
    summary: 'Hair coloring specialist for women with 4 years of experience in modern color trends and styles. Specialized in providing vibrant and healthy hair color options to suit individual client styles. Dedicated to using safe and quality products for the best hair health and color results. Expert in guiding clients toward styles that best enhance their features and hair types naturally.',
    bankDetails: {
      holderName: 'Anjali Patil',
      bankName: 'SBI',
      accountNumber: '333444111',
      ifsc: 'SBIN0003456'
    },
    rating: 4.4,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2460, 16.7018], address: 'Maruti Chowk, Kolhapur' }
  },
  {
    fullName: 'Kavita Shinde',
    phone: '5556543113',
    aadhaar: '523456789015',
    pan: 'CBCGH3456I',
    category: "Women's Self Care",
    experience: 5,
    summary: 'Nail care expert for women with 5 years of experience in manicure and pedicure perfection. Specialized in creating beautiful and healthy nail looks with a variety of styles and finishes. Dedicated to providing a pleasant and professional environment for every nail care session in local homes. Expert in advising clients on nail health and effective maintenance between professional services.',
    bankDetails: {
      holderName: 'Kavita Shinde',
      bankName: 'Axis Bank',
      accountNumber: '444555222',
      ifsc: 'UTIB0004567'
    },
    rating: 4.5,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2472, 16.7112], address: 'Rajendra Nagar, Kolhapur' }
  },
  {
    fullName: 'Pooja Gaikwad',
    phone: '5556543114',
    aadhaar: '523456789016',
    pan: 'DBCDI4567J',
    category: "Women's Self Care",
    experience: 3,
    summary: 'Waxing and threading specialist with 3 years of experience in professional hair removal services. Dedicated to provide a comfortable and hygienic experience for every female client for all beauty needs. Focused on efficiency and client specific comfort throughout every beauty session in local households. Professional and friendly in help women to achieve their grooming goals easily every day.',
    bankDetails: {
      holderName: 'Pooja Gaikwad',
      bankName: 'YES Bank',
      accountNumber: '555666333',
      ifsc: 'YESB0005678'
    },
    rating: 4.2,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2422, 16.6985], address: 'Sane Guruji, Kolhapur' }
  },

  // --- AC REPAIR ---
  {
    fullName: 'Vinay Bhoite',
    phone: '4446543110',
    aadhaar: '623456789012',
    pan: 'EBHDE1234F',
    category: 'AC Repair',
    experience: 7,
    summary: 'AC servicing expert with 7 years of experience in maintaining various air conditioning units. expertise in diagnosing and fixing cooling issues efficiently for residential buildings in the city. Dedicated to providing reliable and high-quality maintenance services for optimal AC performance. Skilled in handling diverse AC models ranging from window units to modern split systems.',
    bankDetails: {
      holderName: 'Vinay Bhoite',
      bankName: 'HDFC Bank',
      accountNumber: '888999444',
      ifsc: 'HDFC0001234'
    },
    rating: 4.8,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2442, 16.7058], address: 'Shahu Colony, Kolhapur' }
  },
  {
    fullName: 'Ajit Sawant',
    phone: '4446543111',
    aadhaar: '623456789013',
    pan: 'FBDEF1234G',
    category: 'AC Repair',
    experience: 5,
    summary: 'Gas refilling specialist for air conditioners with 5 years of hands-on technical experience. expertise in ensuring optimal cooling by managing refrigerant levels accurately for every AC unit. Dedicated to provide fast and efficient gas refilling services for home comfort during peak summers. Reliable in diagnosing leaks and providing long-term solutions for AC cooling issues.',
    bankDetails: {
      holderName: 'Ajit Sawant',
      bankName: 'ICICI Bank',
      accountNumber: '999000555',
      ifsc: 'ICIC0002345'
    },
    rating: 4.6,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2400, 16.7100], address: 'Udyam Nagar, Kolhapur' }
  },
  {
    fullName: 'Sandeep Mane',
    phone: '4446543112',
    aadhaar: '623456789014',
    pan: 'GCDFG2345H',
    category: 'AC Repair',
    experience: 9,
    summary: 'AC installation professional with 9 years of experience in setting up diverse AC systems. Specialized in proper placement and wiring for maximum cooling efficiency and occupant comfort in homes. Dedicated to providing a clean and professional installation experience for all residential clients. focuses on safety and efficiency in every new air conditioning setup project.',
    bankDetails: {
      holderName: 'Sandeep Mane',
      bankName: 'SBI',
      accountNumber: '000111666',
      ifsc: 'SBIN0003456'
    },
    rating: 4.9,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2478, 16.7022], address: 'Timber Market, Kolhapur' }
  },
  {
    fullName: 'Mahesh Thorat',
    phone: '4446543113',
    aadhaar: '623456789015',
    pan: 'HCDGH3456I',
    category: 'AC Repair',
    experience: 4,
    summary: 'Split AC specialist with 4 years of experience in repairing and maintaining modern split units. Expertise in managing remote sensors, air filters, and compressor issues for diverse AC models. Dedicated to providing reliable and timely repair services to local households for every AC need. Focused on customer satisfaction through clear communication and efficient technical support.',
    bankDetails: {
      holderName: 'Mahesh Thorat',
      bankName: 'Axis Bank',
      accountNumber: '111222777',
      ifsc: 'UTIB0004567'
    },
    rating: 4.3,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2450, 16.7125], address: 'Sykes Extension, Kolhapur' }
  },
  {
    fullName: 'Omkar Chavan',
    phone: '4446543114',
    aadhaar: '623456789016',
    pan: 'ICDHI4567J',
    category: 'AC Repair',
    experience: 2,
    summary: 'General AC maintenance technician with 2 years of experience in providing comprehensive support for AC systems. Committed to regular maintenance for all local households to ensure clean and efficient cooling. Dedicated to expert service and professional learning in the evolving AC technology field. Reliable for seasonal check-ups and minor repairs for various types of air conditioners.',
    bankDetails: {
      holderName: 'Omkar Chavan',
      bankName: 'YES Bank',
      accountNumber: '222333888',
      ifsc: 'YESB0005678'
    },
    rating: 3.8,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2388, 16.6998], address: 'Kavala Naka, Kolhapur' }
  },

  // --- APPLIANCE REPAIR ---
  {
    fullName: 'Dinesh Pawar',
    phone: '3336543110',
    aadhaar: '723456789012',
    pan: 'JBHDE1234F',
    category: 'Appliance Repair',
    experience: 8,
    summary: 'Washing machine repair expert with 8 years of experience in technical diagnostics and parts replacement. expertise in fixing major brands of front and top-loading machines for residential clients. Dedicated to providing efficient and professional repair services for everyday appliance reliability. Reliable and fast in resolving complex washing machine technical issues in homes.',
    bankDetails: {
      holderName: 'Dinesh Pawar',
      bankName: 'HDFC Bank',
      accountNumber: '333444999',
      ifsc: 'HDFC0001234'
    },
    rating: 4.7,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2428, 16.7042], address: 'Shivaji Peth, Kolhapur' }
  },
  {
    fullName: 'Hemant Salunkhe',
    phone: '3336543111',
    aadhaar: '723456789013',
    pan: 'KBDEF1234G',
    category: 'Appliance Repair',
    experience: 6,
    summary: 'Refrigerator repair specialist with 6 years of experience in cooling system repairs and maintenance. expertise in managing gas leaks, sensor issues, and compressor faults for diverse fridge brands. Dedicated to ensuring your food stays fresh with reliable and quick cooling restoration services. Focuses on quality parts and professional service for every residential refrigerator repair.',
    bankDetails: {
      holderName: 'Hemant Salunkhe',
      bankName: 'ICICI Bank',
      accountNumber: '444555000',
      ifsc: 'ICIC0002345'
    },
    rating: 4.5,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2488, 16.7088], address: 'Bagal Chowk, Kolhapur' }
  },
  {
    fullName: 'Sharad Jadhav',
    phone: '3336543112',
    aadhaar: '723456789014',
    pan: 'LCDFG2345H',
    category: 'Appliance Repair',
    experience: 4,
    summary: 'Microwave oven repair expert with 4 years of experience in fixing diverse technical and electrical issues. expertise in resolving heating faults, panel failures, and sensor problems for home appliances. Dedicated to ensuring safety and functionality in every microwave repair task in local households. Focused on customer satisfaction through clear communication and efficient technical repair.',
    bankDetails: {
      holderName: 'Sharad Jadhav',
      bankName: 'SBI',
      accountNumber: '555666111',
      ifsc: 'SBIN0003456'
    },
    rating: 4.2,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2405, 16.7010], address: 'Mirajkar Ticktik, Kolhapur' }
  },
  {
    fullName: 'Nilesh Bhosale',
    phone: '3336543113',
    aadhaar: '723456789015',
    pan: 'MCDGH3456I',
    category: 'Appliance Repair',
    experience: 7,
    summary: 'Geyser and water heater repair professional with 7 years of experience in technical maintenance. expertise in installing and repairing various types of heating units with a focus on safety standards. Dedicated to providing reliable and professional services for consistent hot water supply in homes. Skilled in diagnosing shared issues like thermostat failure and electrical heating elements.',
    bankDetails: {
      holderName: 'Nilesh Bhosale',
      bankName: 'Axis Bank',
      accountNumber: '666777222',
      ifsc: 'UTIB0004567'
    },
    rating: 4.6,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2430, 16.7118], address: 'Shivaji Peth, Kolhapur' }
  },
  {
    fullName: 'Pratik More',
    phone: '3336543114',
    aadhaar: '723456789016',
    pan: 'NCDHI4567J',
    category: 'Appliance Repair',
    experience: 3,
    summary: 'General appliance technician providing versatile repair and maintenance for residential properties since 3 years. Expertise in fixing small household electrical appliances with precision and care for the community. Dedicated to professional service and customer satisfaction for all home appliance repair needs. Reliable and enthusiastic helper for various appliance technical support tasks.',
    bankDetails: {
      holderName: 'Pratik More',
      bankName: 'YES Bank',
      accountNumber: '777888333',
      ifsc: 'YESB0005678'
    },
    rating: 3.9,
    status: 'ACTIVE',
    isOnline: true,
    basePrice: 399,
    location: { type: 'Point', coordinates: [74.2495, 16.6990], address: 'Salokhe Nagar, Kolhapur' }
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
