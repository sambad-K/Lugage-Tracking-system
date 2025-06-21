const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const { faker } = require('@faker-js/faker');
const moment = require('moment'); // To handle date calculations more easily

const app = express();
const PORT = 4000;

// Connect to MongoDB without deprecated options
mongoose.connect('mongodb://localhost:27017/MINOR')
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.log("Error connecting to MongoDB", err);
  });

// Define the passenger schema (for hashed data)
const passengerSchema = new mongoose.Schema({
  fullName: String,   // Single field for both first and last name
  ticketNumber: String, // Hashed ticket number
  ltpNumber: String, // Hashed LTP number
  email: String,
  phoneNumber: String,
  airline: String,
  date: Date  // Random date within current month
});

// Define the distributed schema (for unhashed data)
const distributedSchema = new mongoose.Schema({
  fullName: String,   // Single field for both first and last name
  ticketNumber: String, // Unhashed ticket number
  ltpNumber: String, // Unhashed LTP number
  email: String,
  phoneNumber: String,
  airline: String,
  date: Date  // Random date within current month
});

const Passenger = mongoose.model('Passenger', passengerSchema);
const Distributed = mongoose.model('Distributed', distributedSchema);

// Function to generate secure LTP number (5-digit number hashed with SHA256)
function generateLtpNumber() {
  const randomLtp = faker.number.int({ min: 10000, max: 99999 }).toString();  // Generate 5-digit random number
  return crypto.createHash('sha256').update(randomLtp).digest('hex').slice(0, 32);  // Hash and slice to fit the 32 chars
}

// Function to generate the ticket number (3-letter airline code + 5-digit number)
function generateTicketNumber(airline) {
  const airlineCode = airline.substring(0, 3).toUpperCase();  // First 3 letters of airline in uppercase
  const randomNum = faker.number.int({ min: 10000, max: 99999 });  // 5-digit random number
  return `${airlineCode}${randomNum}`;  // Concatenate airline code and random number
}

// Function to generate Nepali full name (first name + last name with space)
function generateNepaliFullName() {
  const firstNames = [
    'Ram', 'Hari', 'Bishal', 'Tej', 'Ganesh', 'Laxmi', 'Rama', 'Sita', 'Gita', 'Maya', 
    'Nisha', 'Suman', 'Ravi', 'Sanjay', 'Kiran', 'Nabin', 'Pooja', 'Asha', 'Deepa', 
    'Madhav', 'Niranjan', 'Bishnu', 'Manoj', 'Santosh', 'Dipendra', 'Roshan', 'Suraj', 
    'Prakash', 'Ashish', 'Kushal', 'Bimal', 'Subash', 'Sudip', 'Jiban', 'Rajendra', 
    'Sandeep', 'Arjun', 'Sujan', 'Sunil', 'Bibek', 'Devendra', 'Yubaraj', 'Mahesh', 
    'Bikash', 'Pradeep', 'Amit', 'Ramesh', 'Ranjit', 'Mohan', 'Rudra', 'Dinesh', 
    'Anju', 'Sarita', 'Sujata', 'Anita', 'Bina', 'Menuka', 'Sabita', 'Sharmila', 
    'Rekha', 'Chhaya', 'Rojina', 'Krishna', 'Mukti', 'Uma', 'Indira', 'Sandhya', 
    'Sabin', 'Aayush', 'Anish', 'Shristi', 'Sneha', 'Shraddha', 'Dipika', 'Kabita', 
    'Samir', 'Tika', 'Shova', 'Hira', 'Nirjala', 'Narayan', 'Shiva', 'Rupak', 'Sudeep'
  ];
  const lastNames = [
    'Sharma', 'Bhandari', 'Adhikari', 'Dahal', 'Poudel', 'Bhattarai', 'Tiwari', 'Sigdel', 'Regmi', 'Acharya',
    'Neupane', 'Upadhyay', 'Ghimire', 'Aryal', 'Dulal', 'Subedi', 'Panthi', 'Bastola', 'Koirala', 'Lamsal',
    'Basnet', 'Rana', 'Thapa', 'Kunwar', 'Bogati', 'Mahat', 'Khadka', 'Rijal', 'Gurung', 'Magar',
    'Tamang', 'Lama', 'Newar', 'Shrestha', 'Pradhan', 'Maskey', 'Tuladhar', 'Bajracharya', 'Rai', 'Limbu',
    'Sherpa', 'Sunuwar', 'Yadav', 'Jha', 'Mandal', 'Gupta', 'Karna', 'Das', 'Thakur', 'Singh',
    'Mahato', 'Pariyar', 'BK', 'Nepali', 'Damai', 'Sarki', 'Ghale', 'Balami', 'Katuwal', 'Gole',
    'Thami', 'Chaudhary', 'Karki', 'Maharjan', 'Kayastha', 'Mool', 'Byanjankar', 'Tamrakar', 'Sitoula', 'Pangeni'
  ];
  

  const firstPart = faker.helpers.arrayElement(firstNames);
  const secondPart = faker.helpers.arrayElement(lastNames);
  return firstPart + ' ' + secondPart;  // Full name (first + last name with space)
}

// Function to generate Nepali phone numbers (format: 984XXXXXXX)
function generateNepaliPhoneNumber() {
  const number = '984' + faker.number.int({ min: 1000000, max: 9999999 }).toString(); // Generate 7 random digits
  return number;
}

// Function to generate a random date within the current month
function generateRandomDateThisMonth() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // First day of the current month
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the current month

  const randomDate = new Date(startOfMonth.getTime() + Math.random() * (endOfMonth.getTime() - startOfMonth.getTime()));
  return randomDate;
}

// Function to create a passenger with Nepali details
async function createPassenger(airline) {
  const fullName = generateNepaliFullName(); // Generate Nepali full name
  const date = generateRandomDateThisMonth(); // Generate random date within the current month

  const ticketNumber = generateTicketNumber(airline);  // Generate ticket number with airline prefix and 5-digit number
  const ltpNumber = generateLtpNumber();  // Generate hashed 5-digit LTP number

  const email = faker.internet.userName() + '@nepalairline.com';  // Casual email format

  const passengerData = {
    fullName,
    ticketNumber: crypto.createHash('sha256').update(ticketNumber).digest('hex'),  // Store hashed ticket number in 'Passenger' collection
    ltpNumber,  // Already hashed LTP number
    email,
    phoneNumber: generateNepaliPhoneNumber(),  // No hashing for phone number
    airline,
    date
  };

  const distributedData = {
    fullName,
    ticketNumber,  // Unhashed ticket number
    ltpNumber: faker.number.int({ min: 10000, max: 99999 }).toString(),  // Unhashed LTP number
    email,
    phoneNumber: generateNepaliPhoneNumber(),  // No hashing for phone number
    airline,
    date
  };

  // Save both collections at the same time using Promise.all for synchronization
  await Promise.all([
    new Passenger(passengerData).save(),
    new Distributed(distributedData).save()
  ]);
}

// Endpoint to generate flight data
// Endpoint to generate exactly 5000 flight data
app.get('/generateData', async (req, res) => {
  try {
    console.log('Generating 5000 unique data...');

    const airlines = ['Buddha', 'Yeti', 'Shree', 'Quatar'];
    const totalPassengers = 5000;
    const passengersPerAirline = Math.floor(totalPassengers / airlines.length); // Approx. 1250 per airline

    const uniqueNames = new Set();
    const uniqueLtpNumbers = new Set();
    const uniqueTicketNumbers = new Set();

    for (let airline of airlines) {
      let count = 0;

      while (count < passengersPerAirline) {
        let fullName;
        let ltpNumber;
        let ticketNumber;

        // Ensure full name uniqueness
        do {
          fullName = generateNepaliFullName();
        } while (uniqueNames.has(fullName));
        uniqueNames.add(fullName);

        // Ensure LTP number uniqueness
        do {
          ltpNumber = generateLtpNumber();
        } while (uniqueLtpNumbers.has(ltpNumber));
        uniqueLtpNumbers.add(ltpNumber);

        // Ensure Ticket number uniqueness
        do {
          ticketNumber = generateTicketNumber(airline);
        } while (uniqueTicketNumbers.has(ticketNumber));
        uniqueTicketNumbers.add(ticketNumber);

        const email = faker.internet.userName() + '@nepalairline.com';
        const date = generateRandomDateThisMonth();
        const phoneNumber = generateNepaliPhoneNumber();

        const passengerData = {
          fullName,
          ticketNumber: crypto.createHash('sha256').update(ticketNumber).digest('hex'),
          ltpNumber,
          email,
          phoneNumber,
          airline,
          date
        };

        const distributedData = {
          fullName,
          ticketNumber,
          ltpNumber: faker.number.int({ min: 10000, max: 99999 }).toString(),
          email,
          phoneNumber,
          airline,
          date
        };

        await Promise.all([
          new Passenger(passengerData).save(),
          new Distributed(distributedData).save()
        ]);

        count++;
      }
    }

    console.log('5000 unique data inserted successfully');
    res.json({ message: '5000 unique passengers generated successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ message: 'Error generating data', error: error.message });
  }
});


// Function to delete passengers older than 1 month
async function deleteOldData() {
  const oneMonthAgo = moment().subtract(1, 'months').toDate(); // Date one month ago
  try {
    const result = await Passenger.deleteMany({ date: { $lt: oneMonthAgo } });
    const distributedResult = await Distributed.deleteMany({ date: { $lt: oneMonthAgo } });
    console.log(`Deleted ${result.deletedCount} old records from 'Passenger' and ${distributedResult.deletedCount} from 'Distributed'.`);
  } catch (error) {
    console.error('Error deleting old records:', error);
  }
}

// Run the deleteOldData function every 24 hours
setInterval(deleteOldData, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
