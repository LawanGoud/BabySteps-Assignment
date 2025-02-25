import express from "express";
import connectDB from "./config/db.mjs";

import doctorRoutes from "./routes/doctorRoutes.mjs";
import appointmentRoutes from "./routes/appointmentRoutes.mjs";

const app = express();

app.use(express.json());

//Connect to MongoDB
connectDB();

app.get("/", (request, response) => {
  response.send("Welcome to BabySteps");
});

app.use("/doctors", doctorRoutes);
app.use("/appointments", appointmentRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
