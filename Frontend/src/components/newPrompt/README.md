# MERN Stack Application

Gemini AI Full Stack Project.

A full-stack AI-powered web application that integrates the Gemini AI API to deliver intelligent responses through a modern web interface.

The project demonstrates a complete full-stack architecture including a React frontend and a Node.js backend, focusing on API integration, asynchronous communication, and modern development practices.

A full-stack web application built with the **MERN stack (MongoDB, Express.js, React, Node.js)**.
The project demonstrates modern web development practices including REST API design, state management, authentication, and scalable frontend architecture.

---

## Features

* Full-stack MERN architecture
* RESTful API built with Express.js
* MongoDB database integration
* Responsive React frontend
* Image uploading support
* Markdown rendering
* Authentication and protected routes
* Chat / AI interaction support
* Modern UI with component-based architecture

---

## Tech Stack

**Frontend**

* React
* Vite
* React Query
* React Router
* Markdown rendering

**Backend**

* Node.js
* Express.js
* MongoDB
* Mongoose

**External Services**

* Gemini API
* ImageKit
* Clerk Authentication

---

## Project Structure

```
project-root
│
├── client/                # React frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── hooks
│   │   └── utils
│
├── server/                # Node.js backend
│   ├── controllers
│   ├── routes
│   ├── models
│   └── middleware
│
└── README.md
```

---

## Installation

### 1. Clone the repository

```
git clone https://github.com/your-username/your-repository.git
cd your-repository
```

### 2. Install dependencies

Frontend:

```
cd client
npm install
```

Backend:

```
cd server
npm install
```

---

## Environment Variables

Create a `.env` file in the backend directory:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_api_key
IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_key
CLERK_SECRET_KEY=your_key
```

---

## Running the Application

### Start backend

```
cd server
npm run dev
```

### Start frontend

```
cd client
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

## Build for Production

```
npm run build
```

This will generate the **dist** folder containing the optimized production build.

---

## Deployment

Recommended free deployment stack:

Frontend:

* Netlify
* Vercel

Backend:

* Render
* Railway

Database:

* MongoDB Atlas

---

## Screenshots

Add screenshots of the application here.

```
/screenshots/homepage.png
/screenshots/chat.png
```

---

## Future Improvements

* Add conversation persistence
* Improve error handling
* Add rate limiting
* Implement caching
* Add automated tests

---

## Author

Full Stack Developer specializing in **React, Node.js, and scalable web architectures**.

---

## License

This project is open source and available under the MIT License.
