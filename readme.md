# Node JWT Authentication API

A Node.js REST API authentication system with JWT (JSON Web Token) based user authentication, registration, and password reset functionality.

---

## 🛠️ Tech Stack

- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Joi** - Input validation
- **Nodemailer** - Email service

---

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Node-JWT-Authentication
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

---

## 🔌 API Endpoints

### Public Routes

| Method | Endpoint                         | Description                  |
| ------ | -------------------------------- | ---------------------------- |
| POST   | `/api/user/register`             | Register a new user          |
| POST   | `/api/user/login`                | Login user and get JWT token |
| POST   | `/api/user/reset-password-email` | Send password reset email    |

### Protected Routes

| Method | Endpoint                    | Description                |
| ------ | --------------------------- | -------------------------- |
| POST   | `/api/user/reset-password`  | Reset user password        |
| GET    | `/api/user/logged-user/:id` | Get logged-in user details |

---

## 📄 License

ISC
