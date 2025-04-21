import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button, Collapse } from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";

import patientService from "../services/patients";
import { Patient, Entry } from "../types";
import EntryDetails from "./EntryDetails";
import AddEntryForm from "./AddEntryForm";

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const patient = await patientService.getById(id);
        setPatient(patient);
      }
    };
    fetchPatient();
  }, [id]);

  if (!patient) return <div>Loading...</div>;
  
  const handleEntryAdded = (newEntry: Entry) => {
    setPatient({
      ...patient,
      entries: [...patient.entries, newEntry]
    });
    setShowForm(false);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" style={{ marginBottom: "0.5em" }}>
        {patient.name}
        {patient.gender === "male" && <MaleIcon />}
        {patient.gender === "female" && <FemaleIcon />}
        {patient.gender === "other" && <TransgenderIcon />}
      </Typography>
      <Typography>ssn: {patient.ssn}</Typography>
      <Typography>occupation: {patient.occupation}</Typography>
      <Typography>date of birth: {patient.dateOfBirth}</Typography>
      
      <Box sx={{ mt: 3, mb: 2 }}>
        <Button 
          variant="contained" 
          color={showForm ? "error" : "primary"}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add New Entry"}
        </Button>
      </Box>
      
      <Collapse in={showForm}>
        {id && <AddEntryForm patientId={id} onEntryAdded={handleEntryAdded} />}
      </Collapse>

      <Typography variant="h6" style={{ marginTop: "1em", marginBottom: "0.5em" }}>
        entries
      </Typography>
      {patient.entries.length === 0 ? (
        <Typography>No entries found</Typography>
      ) : (
        patient.entries.map((entry) => (
          <EntryDetails key={entry.id} entry={entry} />
        ))
      )}
    </Box>
  );
};

export default PatientPage;