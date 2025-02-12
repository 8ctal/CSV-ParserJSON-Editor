# CSV Editor with Statistics - React + Vite

## Overview
This is a **React + Vite** application that allows users to **upload, edit, and analyze CSV files**. Users can:
- Upload CSV/XLSX files
- View and edit tabular data
- Add and delete records
- Generate statistics, including **total by city with percentage** and **grouping by age range**
- Export modified data as a CSV file
- View graphical representations of data

## Features
- **File Upload**: Supports CSV and XLSX files
- **Data Editing**: Modify table records directly
- **Add & Remove Rows**: Dynamically update dataset
- **Statistics Generation**: Total by city with percentage & age range grouping
- **Graphical Data Representation**: Interactive charts for better insights
- **CSV Export**: Save modified data as a CSV file

## Project Structure
```
/csv-editor
│── /src
│   ├── /components
│   │   ├── FileUpload.jsx  # Main component for file handling
│   │   ├── ChartPage.jsx   # Separate component for data visualization
│   ├── App.jsx             # Main App entry point
│   ├── main.jsx            # Renders the React app
│── /public
│── package.json
│── vite.config.js          # Vite configuration
│── README.md               # Project documentation
```

## Installation
1. **Clone the repository**:
   ```sh
   git clone https://github.com/your-repo/csv-editor.git
   ```
2. **Navigate to the project folder**:
   ```sh
   cd csv-editor
   ```
3. **Install dependencies**:
   ```sh
   npm install
   ```
4. **Start the development server**:
   ```sh
   npm run dev
   ```
   The app should now be running on `http://localhost:5173/`.

## Backend Setup
1. **Navigate to the backend directory** (if separate):
   ```sh
   cd backend
   ```
2. **Install dependencies**:
   ```sh
   npm install
   ```
3. **Start the backend server**:
   ```sh
   node server.js
   ```
   The server should now be running on `http://localhost:3000/`.

## Usage
1. **Select a file** using the file input field.
2. **Choose the file type** (CSV/XLSX).
3. **Upload the file**.
4. **Edit data**, add or delete records.
5. **View statistics** on a separate chart page.
6. **Export modified data** as a CSV file.

## Dependencies
- **Frontend**:
    - React
    - Vite
    - Material UI (for UI components)
    - Axios (for API requests)
    - Recharts (for data visualization)

- **Backend**:
    - Express (for server handling)
    - Multer (for file uploads)
    - CSV-Parser (for CSV processing)

## License
This project is open-source and available under the [MIT License](LICENSE).

