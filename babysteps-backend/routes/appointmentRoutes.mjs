import express from "express";
import Appointment from "../models/Appointment.mjs";

const router = express.Router();

// Get all Appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("doctorId");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Create a New Appointment
router.post("/", async (req, res) => {
  try {
    const { doctorId, date, duration, appointmentType, patientName, notes } =
      req.body;

    const newAppointment = new Appointment({
      doctorId,
      date,
      duration,
      appointmentType,
      patientName,
      notes,
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(400).json({ message: "Error creating appointment", error });
  }
});

export default router;
