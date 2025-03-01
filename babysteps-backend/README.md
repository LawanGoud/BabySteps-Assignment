### Check Doctors

```
curl -X GET http://localhost:3000/doctors
```

### Add a Doctor

```
curl -X POST http://localhost:3000/doctors -H "Content-Type: application/json" -d '{
"name": "Dr. Smith",
"workingHours": { "start": "09:00", "end": "17:00" }
}`
```

### check Appointment

```
curl -X GET http://localhost:3000/appointments
```

### Book an Appointment

```
curl -X POST http://localhost:3000/appointments -H "Content-Type: application/json" -d '{
  "doctorId": "PUT_DOCTOR_ID_HERE",
  "date": "2025-02-26T10:00:00.000Z",
  "duration": 30,
  "appointmentType": "Routine Check-Up",
  "patientName": "John Doe"
}'
```
