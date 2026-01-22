const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
// connectDB is called here or in app.js? Typically here before listening or inside app if separate. 
// I put connectDB in importData.js, but for server it should be here.
// Let's call it here.
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
