import { useState } from "react";
import { TextField, Button, Grid, Alert, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Entry, HealthCheckRating } from "../types";
import patientService from "../services/patients";

interface Props {
  patientId: string;
  onEntryAdded: (entry: Entry) => void;
}

const AddEntryForm = ({ patientId, onEntryAdded }: Props) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState("");
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      const diagnosisCodesArray = diagnosisCodes ? diagnosisCodes.split(',').map(code => code.trim()) : undefined;
      
      const newEntry = {
        type: "HealthCheck" as const,
        description,
        date,
        specialist,
        diagnosisCodes: diagnosisCodesArray,
        healthCheckRating
      };
      
      const addedEntry = await patientService.addEntry(patientId, newEntry);
      onEntryAdded(addedEntry);
      
      // Reset form
      setDescription("");
      setDate("");
      setSpecialist("");
      setDiagnosisCodes("");
      setHealthCheckRating(HealthCheckRating.Healthy);
      setError(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else if (typeof error === 'object' && error !== null && 'response' in (error as never)) {
        const axiosError = error as { response?: { data?: { error?: string } } };
        setError(axiosError.response?.data?.error || 'Unknown error occurred');
      } else {
        setError('Unknown error occurred');
      }
    }
  };

  return (
    <div style={{ marginTop: 20, marginBottom: 20, padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h3>Add New Health Check Entry</h3>
      
      {error && <Alert severity="error" style={{ marginBottom: 10 }}>{error}</Alert>}
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Grid>
          
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
          </Grid>
          
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Specialist"
              value={specialist}
              onChange={(e) => setSpecialist(e.target.value)}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Diagnosis Codes (comma separated)"
              value={diagnosisCodes}
              onChange={(e) => setDiagnosisCodes(e.target.value)}
              placeholder="Z00.00, Z00.8"
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Health Check Rating</InputLabel>
              <Select
                value={healthCheckRating}
                label="Health Check Rating"
                onChange={(e) => setHealthCheckRating(Number(e.target.value) as HealthCheckRating)}
              >
                <MenuItem value={HealthCheckRating.Healthy}>Healthy (0)</MenuItem>
                <MenuItem value={HealthCheckRating.LowRisk}>Low Risk (1)</MenuItem>
                <MenuItem value={HealthCheckRating.HighRisk}>High Risk (2)</MenuItem>
                <MenuItem value={HealthCheckRating.CriticalRisk}>Critical Risk (3)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              fullWidth
            >
              Add Entry
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddEntryForm;