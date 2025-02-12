const express = require('express');
const multer = require('multer');
const path = require('path');
const csvParser = require('csv-parser');
const fs = require('fs');
const cors = require('cors'); // Import cors


const app = express();
const port = 3000;

app.use(cors());

// Set up multer to store uploaded files in 'uploads' directory
const upload = multer({ dest: 'uploads/' });
// Endpoint to upload CSV file
app.post('/upload-csv', upload.single('file'), (req, res) => {
    const filePath = path.join(__dirname, req.file.path);
    const results = [];
    // Reading the CSV file
    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => results.push(data)) // Push each row into results array
        .on('end', () => {
            console.log('CSV Data:', results);
            res.json(results); // Send parsed data as JSON response
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});