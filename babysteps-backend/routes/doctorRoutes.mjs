import express from "express";
import Doctor from "../models/Doctor.mjs";
import Appointment from "../models/Appointment.mjs";
import { parse, format, addMinutes, isBefore, isEqual } from "date-fns";

const router = express.Router();

// ✅ Get All Doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get available slots for a doctor on a specific date
router.get("/:id/slots", async (req, res) => {
  try {
    const doctorId = req.params.id;
    const date = req.query.date; // YYYY-MM-DD

    if (!date) {
      return res.status(400).json({ message: "Date parameter is required" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const { start, end } = doctor.workingHours;
    const startTime = parse(`${date} ${start}`, "yyyy-MM-dd HH:mm", new Date());
    const endTime = parse(`${date} ${end}`, "yyyy-MM-dd HH:mm", new Date());

    let availableSlots = [];
    let currentTime = startTime;

    while (isBefore(currentTime, endTime) || isEqual(currentTime, endTime)) {
      availableSlots.push(format(currentTime, "HH:mm"));
      currentTime = addMinutes(currentTime, 30);
    }

    // ✅ Get booked appointments
    const bookedAppointments = await Appointment.find({
      doctorId,
      date: {
        $gte: startTime,
        $lt: endTime,
      },
    });

    // ✅ Remove booked slots
    bookedAppointments.forEach((appointment) => {
      const bookedTime = format(new Date(appointment.date), "HH:mm");
      availableSlots = availableSlots.filter((slot) => slot !== bookedTime);
    });

    res.json({ date, availableSlots });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Create a new doctor
router.post("/", async (req, res) => {
  try {
    const { name, workingHours, specialization } = req.body;
    if (!specialization) {
      return res.status(400).json({ message: "Specialization is required" });
    }

    const newDoctor = new Doctor({ name, workingHours, specialization });
    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (error) {
    res.status(400).json({ message: "Error creating doctor", error });
  }
});

export default router;
