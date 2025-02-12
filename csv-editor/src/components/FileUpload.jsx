import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Select, MenuItem, InputLabel, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [parsedData, setParsedData] = useState([]);
    const [editedData, setEditedData] = useState([]);
    const [fileType, setFileType] = useState('csv');
    const [editingRow, setEditingRow] = useState(null);
    const [newRecord, setNewRecord] = useState({ City: '1', Sex: 'M' });
    const [csvFileName, setCsvFileName] = useState('data');

    // Handle file selection
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // Handle file upload and request to backend
    const handleFileUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file first!");
            return;
        }
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const endpoint = fileType === 'csv' ? '/upload-csv' : '/upload-xlsx';
            const response = await axios.post(`http://localhost:3000${endpoint}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setParsedData(response.data);
            setEditedData(response.data.map(row => ({ ...row }))); // Clone the response to allow editing
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };
    const getCityStats = () => {
        const cityCounts = { '1': 0, '2': 0, '3': 0, '4': 0 };
        editedData.forEach(row => {
            if (cityCounts[row.City] !== undefined) {
                cityCounts[row.City]++;
            }
        });
        const total = editedData.length;
        return { cityCounts, total };
    };

    const getAgeRanges = () => {
        const ageRanges = { '0-18': 0, '19-35': 0, '36-50': 0, '51+': 0 };
        editedData.forEach(row => {
            const age = parseInt(row.Age, 10);
            if (age <= 18) ageRanges['0-18']++;
            else if (age <= 35) ageRanges['19-35']++;
            else if (age <= 50) ageRanges['36-50']++;
            else ageRanges['51+']++;
        });
        return ageRanges;
    };
    const handleSaveCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        const headers = Object.keys(editedData[0]);
        csvContent += headers.join(",") + "\n";
        editedData.forEach(row => {
            csvContent += headers.map(header => row[header]).join(",") + "\n";
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${csvFileName}.csv`);
        document.body.appendChild(link);
        link.click();
    };


    // Handle editing of a row
    const handleEditRow = (index) => {
        setEditingRow(index);
    };

    // Handle saving of updated row
    const handleSaveEdit = (index) => {
        const updatedData = [...editedData];
        setParsedData(updatedData); // Save the changes to parsedData
        setEditingRow(null);
    };

    // Handle deleting a row
    const handleDeleteRow = (index) => {
        const updatedData = editedData.filter((_, i) => i !== index);
        setEditedData(updatedData);
        setParsedData(updatedData);
    };

    // Handle adding a new record
    const handleAddNewRecord = () => {
        if (Object.keys(newRecord).length === 0) return; // Prevent adding empty record
        setEditedData([...editedData, newRecord]);
        setParsedData([...editedData, newRecord]); // Update the parsed data
        setNewRecord({}); // Clear the input
    };

    return (
        <div style={{ padding: '20px', width: '100%', maxWidth: '800px', margin: 'auto' }}>
            <Typography variant="h4" gutterBottom>Upload and Edit File</Typography>

            <FormControl fullWidth margin="normal">
                <InputLabel>File Type</InputLabel>
                <Select value={fileType} onChange={(e) => setFileType(e.target.value)} label="File Type">
                    <MenuItem value="csv">CSV</MenuItem>
                    <MenuItem value="xlsx">XLSX</MenuItem>
                </Select>
            </FormControl>

            <input type="file" accept={fileType === 'csv' ? '.csv' : '.xlsx'} onChange={handleFileChange} style={{ marginBottom: '16px' }} />

            <Button variant="contained" color="primary" onClick={handleFileUpload} fullWidth style={{ marginBottom: '20px' }}>
                Upload
            </Button>

            {editedData.length > 0 && (
                <>

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="data table">
                            <TableHead>
                                <TableRow>
                                    {Object.keys(editedData[0]).map((key, index) => (
                                        <TableCell key={index} align="center">{key}</TableCell>
                                    ))}
                                    <TableCell key="actions" align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {editedData.map((row, index) => (
                                    <TableRow key={index}>
                                        {Object.keys(row).map((key, i) => (
                                            <TableCell key={i} align="center">
                                                {editingRow === index ? (
                                                    <TextField
                                                        value={row[key]}
                                                        onChange={(e) => {
                                                            const updatedData = [...editedData];
                                                            updatedData[index][key] = e.target.value;
                                                            setEditedData(updatedData);
                                                        }}
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                ) : (
                                                    row[key]
                                                )}
                                            </TableCell>
                                        ))}
                                        <TableCell align="center">
                                            {editingRow === index ? (
                                                <Button variant="contained" color="primary" onClick={() => handleSaveEdit(index)}>
                                                    Save
                                                </Button>
                                            ) : (
                                                <Button variant="contained" color="secondary" onClick={() => handleEditRow(index)}>
                                                    Edit
                                                </Button>
                                            )}
                                            <Button variant="outlined" color="error" onClick={() => handleDeleteRow(index)} style={{ marginLeft: '10px' }}>
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Add New Record */}
                    <div style={{ margin: '10px' , display: 'grid', alignItems: 'center',padding: '10px', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                        {Object.keys(editedData[0]).map((key, index) => (
                            key === "Ciudad" || key === "Sexo" ? (
                                <FormControl key={index} style={{ marginRight: '30px' , width: '100%'}}>
                                    <InputLabel>{key}</InputLabel>
                                    <Select
                                        value={newRecord[key] || ''}
                                        onChange={(e) => setNewRecord({ ...newRecord, [key]: e.target.value })}
                                    >
                                        {key === "Ciudad" ? ["1", "2", "3", "4"].map(option => (
                                            <MenuItem key={option} value={option}>{option}</MenuItem>
                                        )) : ["M", "F"].map(option => (
                                            <MenuItem key={option} value={option}>{option}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) : (
                                <TextField
                                    key={index}
                                    label={key}
                                    value={newRecord[key] || ''}
                                    onChange={(e) => setNewRecord({ ...newRecord, [key]: e.target.value })}
                                    variant="outlined"
                                    size="small"
                                    style={{ marginRight: '30px' }}
                                />
                            )
                        ))}
                        <Button variant="contained" color="success" onClick={handleAddNewRecord} style={{ marginLeft: '10px' }}>
                            Add Record
                        </Button>
                    </div>


                    <TextField
                        label="CSV File Name"
                        value={csvFileName}
                        onChange={(e) => setCsvFileName(e.target.value)}
                        variant="outlined"
                        fullWidth
                        style={{ marginBottom: '10px' }}
                    />
                    <Button variant="contained" color="info" onClick={handleSaveCSV} fullWidth>
                        Export as CSV
                    </Button>
                </>
            )}
        </div>
    );
};

export default FileUpload;
