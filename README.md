# 🏠 RentEase — Premium Property Rental Platform

A full-stack **MERN** (MongoDB, Express, React, Node.js) web application for listing, browsing, and booking rental properties. Supports three user roles: **Admin**, **Owner**, and **Renter**.

---

## ✨ Features

### 👤 Authentication
- User registration with role selection (Admin / Owner / Renter)
- Secure login with JWT (HTTP-only cookies)
- Forgot password / reset functionality

### 🏘️ Owner Portal
- Add new property listings with images, pricing & details
- View and manage all owned properties (edit / delete)
- Manage booking requests (approve / reject)
- Requires Admin approval before accessing the portal

### 🔍 Renter Portal
- Browse all available properties with filters (address, type, ad type)
- View property details and images
- Book properties directly from the listing
- Track booking history and status

### 🛡️ Admin Dashboard
- View and manage all registered users
- Grant or revoke Owner access
- View all properties and bookings across the platform

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 19, Vite 7, TailwindCSS v4   |
| Backend    | Express 5, Node.js                  |
| Database   | MongoDB with Mongoose 8             |
| Auth       | JWT + bcrypt                        |
| File Upload| Multer                              |
| UI Library | Ant Design (antd)                   |

---

## 📁 Project Structure

```
House_Rent/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── admin/       # Admin dashboard components
│   │   │   ├── common/      # Home, Login, Register, ForgotPassword
│   │   │   └── user/        # Owner & Renter portals
│   │   ├── images/          # Hero slideshow images
│   │   ├── App.jsx          # Router & context provider
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles & CSS variables
│   └── package.json
│
├── server/                  # Express backend
│   ├── config/
│   │   └── connect.js       # MongoDB connection
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── ownerController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   └── authMiddleware.js # JWT verification
│   ├── models/
│   │   ├── UserSchema.js
│   │   ├── PropertySchema.js
│   │   └── BookingSchema.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── ownerRoutes.js
│   │   └── userRoutes.js
│   ├── uploads/             # Uploaded property images
│   ├── .env                 # Environment variables
│   ├── index.js             # Server entry point
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the Repository

```bash
git clone https://github.com/Devanshu-Deshmukh/HOUSE_RENT.git
cd HOUSE_RENT
```

### 2. Configure Environment Variables

Edit `server/.env` and set your values:

```env
MONGO_URI=mongodb://localhost:27017/house_rent
JWT_SECRET=your_secret_key_here
```

> Replace `MONGO_URI` with your MongoDB Atlas connection string if using cloud.

### 3. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Run the Application

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

### 5. Open in Browser

Navigate to **http://localhost:5173**

---

## 🔐 User Flow

```
1. Register → Choose role (Admin / Owner / Renter)
2. If Owner → Wait for Admin to grant access
3. If Admin → Login → Grant Owner access from dashboard
4. Owner (granted) → Login → Add properties
5. Renter → Login → Browse properties → Book
6. Owner → Manage bookings (approve/reject)
```

---

## 📡 API Endpoints

### User Routes (`/api/user`)
| Method | Endpoint                      | Auth | Description              |
|--------|-------------------------------|------|--------------------------|
| POST   | `/register`                   | ❌   | Register new user        |
| POST   | `/login`                      | ❌   | Login user               |
| POST   | `/forgotpassword`             | ❌   | Reset password           |
| GET    | `/getAllProperties`            | ❌   | Get all properties       |
| POST   | `/getuserdata`                | ✅   | Get logged-in user data  |
| POST   | `/bookinghandle/:propertyid`  | ✅   | Book a property          |
| GET    | `/getallbookings`             | ✅   | Get user's bookings      |

### Owner Routes (`/api/owner`)
| Method | Endpoint                       | Auth | Description              |
|--------|--------------------------------|------|--------------------------|
| POST   | `/postproperty`                | ✅   | Add new property         |
| GET    | `/getallproperties`            | ✅   | Get owner's properties   |
| GET    | `/getallbookings`              | ✅   | Get owner's bookings     |
| POST   | `/handlebookingstatus`         | ✅   | Update booking status    |
| DELETE | `/deleteproperty/:propertyid`  | ✅   | Delete a property        |
| PATCH  | `/updateproperty/:propertyid`  | ✅   | Update a property        |

### Admin Routes (`/api/admin`)
| Method | Endpoint            | Auth | Description              |
|--------|---------------------|------|--------------------------|
| GET    | `/getallusers`      | ✅   | Get all users            |
| POST   | `/handlestatus`     | ✅   | Grant/revoke Owner access|
| GET    | `/getallproperties` | ✅   | Get all properties       |
| GET    | `/getallbookings`   | ✅   | Get all bookings         |

---

## 📄 License

ISC