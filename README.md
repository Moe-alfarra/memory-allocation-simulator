# Memory Allocation Simulator

A full-stack Memory Allocation Simulator that visualizes how different memory allocation strategies assign processes to memory blocks. The simulator provides an interactive interface for configuring memory blocks, adding processes, running allocation algorithms, and visualizing the resulting memory layout.


<img width="1901" height="908" alt="image" src="https://github.com/user-attachments/assets/257d3451-cade-447d-b06f-0b1f16716380" />

---

# Tech Stack

## Frontend

* React
* Vite
* Framer Motion

## Backend

* Spring Boot
* Java

## Visualization

* Animated Memory Allocation Chart
* Memory Utilization Metrics Dashboard

---

# Implemented Algorithms

The simulator currently supports:

* First Fit
* Best Fit
* Worst Fit
* Next Fit

Each algorithm produces:

* Memory Allocation Visualization
* Per-Process Allocation Results
* Total Memory Usage
* Used Memory
* Free Memory
* Number of Allocated Processes

---

# Project Structure

```
memory-allocation-simulator
│
├── memory-allocation-simulator-frontend
│
└── memory-allocation-simulator-backend
```

---

# Running the Project Locally

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/memory-allocation-simulator.git
cd memory-allocation-simulator
```

---

# Run Backend (Spring Boot)

Navigate to the backend folder:

```bash
cd memory-allocation-simulator-backend
```

Run the Spring Boot server:

```bash
mvn spring-boot:run
```

The backend will start on:

```
http://localhost:8080
```

---

# Run Frontend (React + Vite)

Open a new terminal and navigate to the frontend folder:

```bash
cd memory-allocation-simulator-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will run on:

```
http://localhost:5173
```

---

# Important Configuration

Before running the project locally, you must ensure the frontend and backend API URLs match your environment.

---

# Backend CORS Configuration

Inside the backend controller, update the allowed frontend origin.

Example in `MemoryAllocationController`:

```java
@CrossOrigin(origins = {
    "http://localhost:5173"
})
```

If you deploy the frontend later (for example on Vercel), add the deployed URL as well:

```java
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://your-frontend-domain.vercel.app"
})
```

---

# Frontend API URL

Inside the frontend code, ensure the API points to the correct backend address.

Example in the React application:

```javascript
const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/memory-allocate";
```

If your backend is deployed, update the environment variable accordingly:

```
VITE_API_BASE_URL=https://your-backend-domain/api/memory-allocate
```

---

# Local Development Summary

Frontend →

```
http://localhost:5173
```

Backend →

```
http://localhost:8080
```

The frontend communicates with the backend using:

```
http://localhost:8080/api/memory-allocate
```

---

# Features

* Interactive memory block configuration
* Dynamic process input
* Random data generator
* Animated memory allocation visualization
* Real-time memory utilization metrics
* Allocation result table for each process
* Support for multiple memory allocation strategies

---

# Example Simulation Input

Memory Blocks (KB)

```
B1   100
B2   500
B3   200
B4   300
B5   600
```

Processes (KB)

```
P1   212
P2   417
P3   112
P4   426
```

The simulator allocates processes to memory blocks based on the selected algorithm and visualizes the result.

---

# Future Improvements

* Step-by-step allocation animation
* Algorithm comparison mode
* Memory fragmentation analysis
* Export results as CSV
* Additional allocation algorithms

---

# Author

Mohammed Alfarra

---
