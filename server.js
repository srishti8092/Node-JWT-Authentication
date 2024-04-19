const express = require('express');
const dotenv = require("dotenv");
dotenv.config();
const cors = require('cors');
const connectDB = require('./config/dbConnection')
const userRoute = require('./routes/userRoute')
const app = express();
const port = process.env.PORT;

app.use(cors());

//db connection
connectDB(process.env.DB_URL);

app.use(express.json());
//load route 
app.use('/api/user', userRoute)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
});