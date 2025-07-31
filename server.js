const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from public directory

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'your_password', // Replace with your MySQL password
    database: 'banking_app'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Function to generate unique account number
function generateAccountNumber() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ACC${timestamp.slice(-8)}${random}`;
}

// Routes
// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the users HTML file
app.get('/customers', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'customers.html'));
});

// API endpoint to create new customer
app.post('/api/customers', (req, res) => {
    const {
        firstName,
        lastName,
        email,
        mobileNumber,
        address,
        openingBalance,
        accountType
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !mobileNumber || !address || !openingBalance || !accountType) {
        return res.status(400).json({ 
            success: false, 
            message: 'All fields are required' 
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please enter a valid email address' 
        });
    }

    // Mobile number validation (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobileNumber)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please enter a valid 10-digit mobile number' 
        });
    }

    // Opening balance validation
    if (isNaN(openingBalance) || parseFloat(openingBalance) < 0) {
        return res.status(400).json({ 
            success: false, 
            message: 'Opening balance must be a valid positive number' 
        });
    }

    // Generate account number
    const accountNumber = generateAccountNumber();

    // Insert into database
    const query = `
        INSERT INTO customers 
        (first_name, last_name, email, mobile_number, address, account_number, opening_balance, account_type) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
        firstName,
        lastName,
        email,
        mobileNumber,
        address,
        accountNumber,
        parseFloat(openingBalance),
        accountType
    ], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            
            // Handle duplicate email error
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Email address already exists' 
                });
            }
            
            return res.status(500).json({ 
                success: false, 
                message: 'Database error occurred' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Customer account created successfully!',
            accountNumber: accountNumber,
            customerId: result.insertId
        });
    });
});

// API endpoint to get all customers (for testing)
app.get('/api/customers', (req, res) => {
    const query = 'SELECT * FROM customers ORDER BY created_at DESC';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error occurred' 
            });
        }
        
        res.json({ 
            success: true, 
            customers: results 
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});