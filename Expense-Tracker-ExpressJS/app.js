import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
const app = express();
import bodyParser from "body-parser";
// import mongoose from "mongoose";
// const morgan = require("morgan");
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
// const Axios = require("axios");
import connectDB from "./config/database.js";

// Connect mongoose server
connectDB();

app.use(cors());
app.use(express.json());
// app.use(morgan("combined"));
// app.use(bodyParser.json()); <- Extra code since app.use(express.json()) already exists
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/test", (req, res) => {
  return res.json(`Hello! Testing the API`);
});

// Import the users route file
import usersRoutes from "./routes/users.js";

// Mount the users routes at the /users path
app.use("/api/users", usersRoutes);

// Import the users route file
import transactionRoutes from "./routes/transactions.js";

// Mount the users transactions routes at the /users path
app.use("/api/transactions", transactionRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server listening on port " + PORT + "...");
});
