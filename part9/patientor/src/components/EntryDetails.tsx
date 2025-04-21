import { Entry } from "../types";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { Typography, Paper } from "@mui/material";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case "Hospital":
      return (
        <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
          <Typography variant="h6">
            {entry.date} <LocalHospitalIcon />
          </Typography>
          <Typography><em>{entry.description}</em></Typography>
          <Typography>Discharge: {entry.discharge.date} - {entry.discharge.criteria}</Typography>
          {entry.diagnosisCodes && (
            <Typography>Diagnosis codes: {entry.diagnosisCodes.join(', ')}</Typography>
          )}
          <Typography>Diagnosed by: {entry.specialist}</Typography>
        </Paper>
      );
    case "OccupationalHealthcare":
      return (
        <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
          <Typography variant="h6">
            {entry.date} <WorkIcon /> {entry.employerName}
          </Typography>
          <Typography><em>{entry.description}</em></Typography>
          {entry.sickLeave && (
            <Typography>Sick leave: {entry.sickLeave.startDate} to {entry.sickLeave.endDate}</Typography>
          )}
          {entry.diagnosisCodes && (
            <Typography>Diagnosis codes: {entry.diagnosisCodes.join(', ')}</Typography>
          )}
          <Typography>Diagnosed by: {entry.specialist}</Typography>
        </Paper>
      );
    case "HealthCheck":
      return (
        <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
          <Typography variant="h6">
            {entry.date} <MonitorHeartIcon />
          </Typography>
          <Typography><em>{entry.description}</em></Typography>
          <Typography>Health rating: {entry.healthCheckRating}</Typography>
          {entry.diagnosisCodes && (
            <Typography>Diagnosis codes: {entry.diagnosisCodes.join(', ')}</Typography>
          )}
          <Typography>Diagnosed by: {entry.specialist}</Typography>
        </Paper>
      );
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;