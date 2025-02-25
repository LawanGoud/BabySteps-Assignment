import express from "express";
import connectDB from "./config/db.mjs";

import Doctor from "./models/Doctor.mjs";
import Appointment from "./models/Appointment.mjs";

const app = express();

//Connect to MongoDB
connectDB();

app.get("/", (request, response) => {
  response.send("Hello World!");
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
