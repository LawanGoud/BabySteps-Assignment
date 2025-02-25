import express from "express";
import Doctor from "../models/Doctor.mjs";

const router = express.Router();

//Get All Doctors

router.get("/", async (request, response) => {
  console.log("Fetching Doctors...");
  try {
    const doctors = await Doctor.find();
    console.log("Doctors found:", doctors);
    response.json(doctors);
  } catch (error) {
    response.status(500).json({ message: "Server error", error });
  }
});

// Create a new Doctor

router.post("/", async (request, response) => {
  try {
    const { name, workingHours } = request.body;
    const newDoctor = new Doctor({ name, workingHours });
    await newDoctor.save();
    response.status(201).json(newDoctor);
  } catch (error) {
    response.status(400).json({ message: "Error creating doctor", error });
  }
});

export default router;
