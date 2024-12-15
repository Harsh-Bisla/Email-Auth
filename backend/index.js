const express = require('express');
require('dotenv').config();
const router = require('./routes/userRoute');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_BD_URL;
const cors = require('cors');
const connectMongoDb = require('./dbConnection');

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "https://email-auth-one.vercel.app/"
}));

//mongo connection
connectMongoDb(`${MONGO_URL}`)
    .then(() => console.log("Mongo DB Connected Successfully"))
    .catch((err) => console.log("Mongo DB Connection error", err))

app.use("/api", router);

app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`);
})


