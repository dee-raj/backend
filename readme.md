# Backend Authentication API with Node.js, MongoDB, and JWT

This is a simple backend authentication API built using **Node.js**, **Express**, **MongoDB**, and **JWT** (JSON Web Tokens). The API allows user registration, login, session management, and access to a home page based on authentication. The routes include user management (registration and login), session management (viewing and logging out), and a home route (protected by JWT authentication).

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Setup](#setup)
4. [Running the Application](#running-the-application)
5. [API Endpoints](#api-endpoints)
6. [Environment Variables](#environment-variables)
7. [Code Breakdown](#code-breakdown)
8. [Security Considerations](#security-considerations)
9. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

Before you begin, you need to have the following installed on your machine:
- **Node.js** (v14 or higher)
- **MongoDB** (running locally or remotely via MongoDB Atlas)

If you don't have these installed, follow the official documentation to install:
- [Install Node.js](https://nodejs.org/)
- [Install MongoDB](https://www.mongodb.com/docs/manual/installation/)

## 2. Installation

1. Clone the repository to your local machine:
    ```bash
    git clone https://github.com/dee-raj/auth-api.git
    cd auth-api
    ```

2. Install the required dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file at the root of your project with the following environment variables:
    ```plaintext
    MONGODB_URI=mongodb://localhost:27017/authdb  # MongoDB connection URL
    JWT_SECRET=your-secret-key  # Secret key for JWT
    PORT=3030  # Port for the server to run
    ```

4. Ensure that MongoDB is running locally or that you have a connection to a remote MongoDB database (like MongoDB Atlas).

## 3. Setup

1. **MongoDB Connection**:
   - This application uses **MongoDB** to store user data and session information.
   - The connection string for MongoDB is set in the `.env` file as `MONGODB_URI`. Make sure that MongoDB is up and running before starting the server.
   
2. **JWT Authentication**:
   - The application uses **JWT** to authenticate users. A user is issued a JWT token after successful login, which is then used to access protected routes.

## 4. Running the Application

To run the application, follow these steps:

1. **Start the MongoDB server**:
   - If you are running MongoDB locally, make sure MongoDB is started by running the following command:
     ```bash
     mongod
     ```

2. **Start the Node.js server**:
   - Start the application with:
     ```bash
     npm start
     ```

   The application will run on port `3030` by default (or another port specified in your `.env` file).

3. **Access the API**:
   - Open your browser or an API client (like Postman) and start making requests to the API at `http://localhost:3030`.

---

## 5. API Endpoints

### 1. **User Routes**
- **POST /user/register**: Register a new user
    - **Request Body**:
      ```json
      {
        "firstName": "John",
        "email": "john.doe@example.com",
        "password": "password123"
      }
      ```
    - **Response**:
      ```json
      {
        "message": "User registered successfully with email: john.doe@example.com"
      }
      ```

- **POST /user/login**: Log in and get a JWT token
    - **Request Body**:
      ```json
      {
        "email": "john.doe@example.com",
        "password": "password123"
      }
      ```
    - **Response**:
      ```json
      {
        "message": "Logged in successfully",
        "token": "<JWT_TOKEN>"
      }
      ```

- **POST /user/logout**: Log out a user (destroy the session)
    - **Request Body**:
      ```json
      {
        "token": "<JWT_TOKEN>",
        "userId": "<USER_ID>"
      }
      ```
    - **Response**:
      ```json
      {
        "message": "Logged out successfully"
      }
      ```

### 2. **Session Routes**
- **GET /session/myToken/:userId**: Get the session details of the user
    - **Response**:
      ```json
      {
        "token": "<JWT_TOKEN>",
        "timeLeft": 3600000
      }
      ```

- **GET /session/all**: Get all active sessions in the system
    - **Response**:
      ```json
      [
        {
          "userId": "<USER_ID>",
          "token": "<JWT_TOKEN>",
          "expiresAt": "2025-02-27T17:00:00.000Z"
        }
      ]
      ```

### 3. **Home Routes**
- **GET /home**: Access the home page (protected route)
    - **Request Header**:
      ```plaintext
      Authorization: Bearer <JWT_TOKEN>
      ```
    - **Response**:
      ```json
      {
        "message": "Welcome to the home page",
        "userId": "<USER_ID>"
      }
      ```

---

## 6. Environment Variables

You will need to create a `.env` file to store your sensitive data such as MongoDB URI and JWT secret. Here is an example `.env` file:

```plaintext
MONGODB_URI=mongodb://localhost:27017/authdb
JWT_SECRET=your-secret-key
PORT=3030
```

Make sure not to commit this file to your version control (e.g., Git) to keep your secrets safe. Add `.env` to your `.gitignore` file:

```plaintext
.env
```

---

## 7. Code Breakdown

### **Main Application (`index.js`)**:
- This file sets up the Express application, connects to MongoDB, and includes all routes. It also listens on a specific port defined in `.env`.

### **User Routes (`user.js`)**:
- This file handles user registration, login, and logout. The `/login` route issues a JWT upon successful authentication, and the `/logout` route invalidates the session.

### **Session Routes (`session.js`)**:
- This file manages the sessions. It allows you to get session details for a user and view all active sessions.

### **Home Routes (`home.js`)**:
- This file contains the `/home` route, which is protected by JWT. Only authenticated users with a valid token can access this route.

---

## 8. Security Considerations

### 1. **Storing JWTs**
   - Store JWT tokens securely on the client-side (preferably in HTTP-only cookies to prevent XSS attacks).

### 2. **Secure Password Storage**
   - In this example, passwords are stored in plain text for simplicity. **In production**, make sure to hash and salt passwords using libraries like **bcrypt** before storing them in the database.

   Example:
   ```js
   import bcrypt from 'bcryptjs';

   const hashedPassword = await bcrypt.hash(password, 10);  // Hash password
   ```

### 3. **Session Expiration**
   - The JWT token has an expiration time of 1 hour. After that, the user will need to log in again to obtain a new token.

### 4. **Environment Variable Protection**
   - Ensure that sensitive information like the `JWT_SECRET` and `MONGODB_URI` are kept safe and are not exposed publicly.

---

## 9. Troubleshooting

1. **MongoDB Connection Issues**:
   - Make sure MongoDB is running, either locally or through a cloud service like MongoDB Atlas.
   - If you're using MongoDB Atlas, ensure your IP address is whitelisted and you have the correct connection string.

2. **Invalid Token**:
   - If you get an "Unauthorized: Invalid or expired token" error, ensure the token is valid and not expired. If it is expired, log in again to get a new token.

3. **Missing Environment Variables**:
   - Ensure that the `.env` file exists and contains the correct environment variables (`MONGODB_URI`, `JWT_SECRET`, `PORT`).

## Conclusion

This backend API allows users to register, log in with email and password, and access protected routes using JWT authentication. MongoDB stores user data securely, and the JWT ensures the integrity of authentication.