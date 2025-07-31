
# 💳 Bank App

A simple banking application built using **Node.js**, **Express**, **MySQL**, and vanilla **HTML/CSS**.

---

## 📁 Step 1: Create Project Folder and Install Dependencies

In your terminal, run the following commands:

```bash
mkdir bank-app
cd bank-app
npm init -y
npm install express mysql2 body-parser cors
npm install -D nodemon
```

---

## 🛢️ Step 2: Database Setup

Open your MySQL client and run the following SQL script:

```sql
CREATE DATABASE banking_app;
USE banking_app;

CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    address TEXT NOT NULL,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    opening_balance DECIMAL(15,2) NOT NULL,
    account_type ENUM('savings', 'current') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📂 Project Structure

```
bank-app/
├── server.js
├── package.json
├── package-lock.json
├── node_modules/
└── public/
    ├── index.html
    └── styles.css
```

---

## ⚙️ Database Configuration

Make sure MySQL is running on your machine.

In your `server.js`, update the connection configuration:

```js
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',        // Replace with your MySQL username
    password: '',        // Replace with your MySQL password
    database: 'banking_app'
});
```

---

## 🚀 Run the Application

### For Development (auto-restart on changes using `nodemon`):

```bash
npm run dev
```

Make sure your `package.json` includes the following:

```json
"scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
}
```

### For Production:

```bash
npm start
```

---

## 🌐 Access the Application

Open your browser and go to:

```
http://localhost:3000
```

---

## 📝 Notes

- Ensure MySQL is properly installed and the service is running.
- Make sure the database name and credentials match those in your `server.js`.
- You can expand this project further by adding routes for creating accounts, transactions, and user dashboards.

---

Happy Coding! 🚀