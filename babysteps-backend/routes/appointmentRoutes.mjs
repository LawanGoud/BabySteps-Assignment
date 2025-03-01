import express from "express";
import Appointment from "../models/Appointment.mjs";
import Doctor from "../models/Doctor.mjs";
import { parseISO, format, isBefore, isAfter } from "date-fns";

const router = express.Router();

// ✅ Get all appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("doctorId");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Book an appointment
router.post("/", async (req, res) => {
  try {
    const { doctorId, date, duration, appointmentType, patientName, notes } =
      req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointmentTime = parseISO(date);
    const formattedDate = format(appointmentTime, "yyyy-MM-dd");

    const workingStart = parseISO(
      `${formattedDate}T${doctor.workingHours.start}:00`
    );
    const workingEnd = parseISO(
      `${formattedDate}T${doctor.workingHours.end}:00`
    );

    if (
      isBefore(appointmentTime, workingStart) ||
      isAfter(appointmentTime, workingEnd)
    ) {
      return res
        .status(400)
        .json({ message: "Appointment time is outside working hours" });
    }

    const overlappingAppointment = await Appointment.findOne({
      doctorId,
      date: appointmentTime,
    });

    if (overlappingAppointment) {
      return res
        .status(400)
        .json({ message: "This time slot is already booked" });
    }

    const newAppointment = new Appointment({
      doctorId,
      date: appointmentTime,
      duration,
      appointmentType,
      patientName,
      notes,
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(400).json({ message: "Error booking appointment", error });
  }
});

export default router;
