// Step 1: Import express, mysql2, body-parser, cors, path using require

// initialize express using express() as app
// define PORT 3000

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from public directory (this is done to integrate html files)

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'your_password', // Replace with your MySQL password
    database: 'banking_app'
});

// Connect to MySQL and if err then display using console.error else console log "Connected to MySQL database"

// Function to generate unique account number (like ACC88196332944)

// Define Routes
// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the customers HTML file which will display all customers in a table

// API endpoint to get all customers and test on postman

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

    // Email validation - use regex
    // const emailRegex = ----------------

    // Mobile number validation (10 digits) - use regex
    // const mobileRegex = ---------------- 

    // Opening balance validation - check null condition and throw error along with correct status code


    // Generate account number
    const accountNumber = generateAccountNumber();

    // Insert into database
    const query = ``; // write appropriate insert query

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

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});