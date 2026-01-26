# Data Visualization Dashboard

A comprehensive full-stack dashboard utilizing the MERN stack (MongoDB, Express, React, Node.js) and D3.js for visualizing visualization insights.

## Features

- **Interactive Charts**: Line, Bar, Bubble, and Pie charts using D3.js.
- **Dynamic Filtering**: Filter data by Year, Topic, Sector, Region, PESTLE, Source, Country, and City.
- **RESTful API**: Flexible API with combinational filtering capabilities.
- **Responsive Design**: Built with Tailwind CSS and React.

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Frontend**: React (Vite), D3.js, Tailwind CSS
- **Tools**: Axios, Headless UI

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- MongoDB (Local or Atlas URI)

### Installation

1.  **Clone the repository** (if applicable) or navigate to project root.

2.  **Install Backend Dependencies**:
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies**:
    ```bash
    cd ../frontend
    npm install
    ```

### Data Import

1.  Place your `jsondata.json` file in `backend/data/`.
2.  Run the import script:
    ```bash
    cd backend
    npm run import
    ```

### Running the Application

1.  **Start Backend**:
    ```bash
    cd backend
    npm start
    # or for dev
    npm run dev
    ```
    Server runs on `http://localhost:5000`.

2.  **Start Frontend**:
    ```bash
    cd frontend
    npm run dev
    ```
    Frontend runs on `http://localhost:5173`.

## API Documentation

- `GET /api/insights`: Fetch all insights. Supports query params for filtering (e.g., `?year=2018&topic=gas`).
- `GET /api/insights/filters`: Fetch unique values for filter dropdowns.

## Folder Structure

- `backend/models`: Database schemas.
- `backend/controllers`: Request handlers.
- `backend/routes`: API routes.
- `frontend/src/components/charts`: D3 visualization components.
- `frontend/src/components/filters`: Filter UI components.
- `frontend/src/pages`: Main dashboard view.
