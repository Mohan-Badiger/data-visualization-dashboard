const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Insight = require('../models/Insight.model');
const connectDB = require('../config/db');

dotenv.config();

// Connect to DB
connectDB();

// Read JSON file
const importData = async () => {
    try {
        const filePath = `${__dirname}/../data/jsondata.json`;
        if (!fs.existsSync(filePath)) {
            console.error('Error: jsondata.json not found in backend/data/');
            process.exit(1);
        }

        const rawData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // Clean and Transform Data
        const cleanedData = rawData.map(item => {
            return {
                ...item,
                end_year: (item.end_year && item.end_year !== "") ? parseInt(item.end_year) : null,
                start_year: (item.start_year && item.start_year !== "") ? parseInt(item.start_year) : null,
                // Ensure strings are strings or empty string (not undefined)
                topic: item.topic || "",
                sector: item.sector || "",
                region: item.region || "",
                peestle: item.pestle || "",
                source: item.source || "",
                country: item.country || "",
                city: item.city || "",
                swot: item.swot || ""
            };
        });

        // Clear existing data
        await Insight.deleteMany();

        // Insert new data
        await Insight.insertMany(cleanedData);

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

importData();
