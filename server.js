const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let appointments = [];
let nextId = 1;

app.get("/api/appointments", (req, res) => {
  res.json({ message: "Liste", count: appointments.length, appointments });
});

app.post("/api/appointments", (req, res) => {
  const { patientName, doctorName, date, time } = req.body;
  if (!patientName || !doctorName || !date || !time) {
    return res.status(400).json({ error: "Données manquantes !" });
  }
  const newAppointment = { id: nextId++, patientName, doctorName, date, time, status: "confirmé" };
  appointments.push(newAppointment);
  res.status(201).json({ message: "Créé !", appointment: newAppointment });
});

app.get("/api/appointments/:id", (req, res) => {
  const appt = appointments.find(a => a.id === parseInt(req.params.id));
  if (!appt) return res.status(404).json({ error: "Non trouvé" });
  res.json(appt);
});

app.delete("/api/appointments/:id", (req, res) => {
  const index = appointments.findIndex(a => a.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Non trouvé" });
  const deleted = appointments.splice(index, 1);
  res.json({ message: "Supprimé !", appointment: deleted[0] });
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});