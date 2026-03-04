# 🏠 House Rent Platform - Backend API

A complete **MERN Stack** backend for a house rental management system with advanced features like JWT authentication, admin dashboard, and owner management.

## 📊 Project Status

**Backend Development: ✅ 100% Complete**

- ✅ Complete API structure
- ✅ User authentication with JWT
- ✅ Admin dashboard with statistics
- ✅ Owner property management system
- ✅ Booking management system
- ✅ Role-based access control
- ✅ MongoDB database integration

---

## ✨ Features

### 🔐 Authentication & Security
- JWT token-based authentication
- Role-based access control (User, Owner, Admin)
- Secure password storage
- Token expiration (7 days)

### 👤 User Management
- User registration & login
- Profile management
- User verification system
- Different roles: User, Owner, Admin

### 🏘️ Property Management (Owner Features)
- Add/edit/delete properties
- Property availability tracking
- Property statistics dashboard
- View bookings for properties
- Tenant inquiry management

### 📋 Booking System
- Create property bookings
- Booking status management (pending/confirmed/rejected)
- Payment tracking
- View booking history
- Owner approval system

### 📊 Admin Dashboard
- View all users
- View all properties
- View all bookings
- Platform statistics (total users, properties, revenue)
- User verification
- Booking approval/rejection

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-------------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB |
| **Authentication** | JWT (jsonwebtoken) |
| **Database ODM** | Mongoose |
| **CORS** | cors package |
| **Environment** | dotenv |

---

## 📁 Project Structure
```
server/
├── controllers/
│   ├── houseController.js      (Property CRUD operations)
│   ├── userController.js       (User management)
│   ├── bookingController.js    (Booking operations)
│   ├── adminController.js      (Admin operations)
│   └── ownerController.js      (Owner operations)
│
├── models/
│   ├── House.js               (Property schema)
│   ├── User.js                (User schema)
│   └── Booking.js             (Booking schema)
│
├── routes/
│   ├── houseRoutes.js         (Property endpoints)
│   ├── userRoutes.js          (User endpoints)
│   ├── bookingRoutes.js       (Booking endpoints)
│   ├── adminRoutes.js         (Admin endpoints)
│   └── ownerRoutes.js         (Owner endpoints)
│
├── middlewares/
│   └── authMiddleware.js      (JWT & role verification)
│
├── server.js                  (Main server file)
├── package.json              (Dependencies)
├── .env                       (Environment variables)
└── .gitignore
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v14 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/house-rent-backend.git
cd house-rent-backend/server
```

### Step 2: Install Dependencies
```bash
npm install
npm install jsonwebtoken
```

### Step 3: Configure Environment
Create `.env` file in `server/` folder:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/houseRentDB
PORT=8000
NODE_ENV=development
JWT_SECRET=your_secret_key_change_this
CORS_ORIGIN=http://localhost:3000
```

### Step 4: Start MongoDB
```bash
# Windows
mongod

# Mac
brew services start mongodb-community

# Or use MongoDB Atlas (cloud)
```

### Step 5: Start Server
```bash
npm start
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on http://localhost:8000
```

---

## 📡 API Endpoints

### **Houses/Properties**
```
GET    /api/houses              - Get all houses
GET    /api/houses/:id          - Get house by ID
GET    /api/houses/available    - Get available houses
POST   /api/houses              - Add new house
PUT    /api/houses/:id          - Update house
DELETE /api/houses/:id          - Delete house
```

### **Users**
```
GET    /api/users               - Get all users
POST   /api/users/register      - Register user
POST   /api/users/login         - Login user
PUT    /api/users/:id           - Update user
DELETE /api/users/:id           - Delete user
```

### **Bookings**
```
GET    /api/bookings            - Get all bookings
POST   /api/bookings            - Create booking
PUT    /api/bookings/:id/status - Update booking status
DELETE /api/bookings/:id        - Cancel booking
```

### **Admin** (Requires Admin Role + JWT Token)
```
GET    /api/admin/users         - Get all users
GET    /api/admin/properties    - Get all properties
GET    /api/admin/bookings      - Get all bookings
GET    /api/admin/dashboard     - Get statistics
DELETE /api/admin/users/:id     - Delete user
DELETE /api/admin/properties/:id - Delete property
```

### **Owner** (Requires Owner Role + JWT Token)
```
GET    /api/owner/properties/:ownerEmail     - My properties
POST   /api/owner/properties                 - Add property
PUT    /api/owner/properties/:id             - Update property
GET    /api/owner/bookings/:ownerEmail       - My bookings
GET    /api/owner/stats/:ownerEmail          - Statistics
```

---

## 🔐 Authentication

### Get JWT Token (Register/Login)
```
POST /api/users/register

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9999999999",
  "role": "owner"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": { ... }
}
```

### Use Token in Protected Requests
```
Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📊 Database Schema

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String,
  phone: String,
  role: String (user/owner/admin),
  propertiesOwned: [ObjectId],
  bookings: [ObjectId],
  isVerified: Boolean,
  createdAt: Date
}
```

### House Schema
```javascript
{
  owner: String,
  ownerEmail: String,
  address: String,
  city: String,
  rent: Number,
  bedrooms: Number,
  bathrooms: Number,
  amenities: [String],
  tenant: String,
  isAvailable: Boolean,
  createdAt: Date
}
```

### Booking Schema
```javascript
{
  tenant: String,
  property: ObjectId (ref: House),
  bookingStartDate: Date,
  bookingEndDate: Date,
  rentAmount: Number,
  totalAmount: Number,
  status: String (pending/confirmed/rejected),
  paymentStatus: String (pending/paid),
  createdAt: Date
}
```

---

## 🧪 Testing with Postman

1. **Download Postman** from https://www.postman.com/
2. **Test Endpoints** using the API documentation above
3. **Use JWT Token** from login/register response for protected routes

Example:
```
GET http://localhost:8000/api/houses
Headers: None (public)

POST http://localhost:8000/api/owner/properties
Headers: Authorization: Bearer YOUR_TOKEN_HERE
Body: JSON property data
```

---

## 📚 Project Phases

### ✅ Phase 1: Basic Backend (Complete)
- Server setup with Express
- MongoDB connection
- Basic CRUD operations
- User authentication

### ✅ Phase 2: Advanced Features (Complete)
- JWT token authentication
- Role-based access control
- Admin dashboard
- Owner management system

### 📋 Phase 3: Frontend (Next)
- React frontend with Vite
- Connect to backend APIs
- User interface

### 🚀 Phase 4: Deployment (Future)
- Deploy backend to cloud
- Deploy frontend to production
- Set up CI/CD pipeline

---

## 🎓 Learning Outcomes

This project covers:

✅ Node.js & Express fundamentals  
✅ MongoDB & Mongoose  
✅ RESTful API design  
✅ JWT authentication  
✅ Role-based access control  
✅ Error handling & validation  
✅ Git version control  
✅ Project management  

---



---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- MongoDB documentation
- Express.js guides
- JWT authentication resources
- SkillWallet project platform

---

## 📧 Contact & Support

For questions or issues:
1. Check the documentation files
2. Review API endpoints
3. Test with Postman
4. Check MongoDB connection

---

**Last Updated:** March 4, 2026  
**Status:** ✅ Backend Development Complete (100%)
```

---

#