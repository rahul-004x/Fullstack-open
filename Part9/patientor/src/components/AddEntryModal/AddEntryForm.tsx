import { SyntheticEvent, useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  TextField,
  Typography,
  Stack,
  Button,
  RadioGroup,
  Radio,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  SelectChangeEvent,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import { HealthCheckRating, Diagnosis, EntryWithoutId } from "../../types";

// Styles for multi-select
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      // width: 250,
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryWithoutId) => void;
  diagnosis: Diagnosis[];
}

const AddEntryForm: React.FC<Props> = ({ onCancel, onSubmit, diagnosis }) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState(HealthCheckRating.Healthy);
  const [diagnosisCodes, setDiagnosisCodes] = useState<Array<Diagnosis['code']>>([]);
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState('');
  const [entryType, setEntryType] = useState("HealthCheck");

  const theme = useTheme();

  const handleDelete = (codeToDelete: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    setDiagnosisCodes(diagnosisCodes.filter(code => code !== codeToDelete));
  };
  
  const onDiagnosisCodesChange = (event: SelectChangeEvent<string[]>) => {
    event.preventDefault();
    const value = event.target.value;
    typeof value === 'string' ? setDiagnosisCodes(value.split(',')) : setDiagnosisCodes(value);
  };

  const addNewEntryHandler = (event: SyntheticEvent) => {
    event.preventDefault();
       
    const baseEntry = {
      description,
      date,
      specialist,
      diagnosisCodes
    };
  
    switch (entryType) {
      case "HealthCheck":
        onSubmit({
          type: "HealthCheck",
          ...baseEntry,
          healthCheckRating
        });
        break;
  
      case "Hospital": 
        onSubmit({
          type: "Hospital",
          ...baseEntry,
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria
          }
        });
        break;
      
      case "OccupationalHealthcare":  
        onSubmit({
          type: "OccupationalHealthcare",  
          ...baseEntry,
          employerName,  
          sickLeave: sickLeaveStart && sickLeaveEnd ? {
            startDate: sickLeaveStart,
            endDate: sickLeaveEnd
          } : undefined
        });
        break;
    }
  };
  
  return (
    <>
      <form onSubmit={addNewEntryHandler}>
      <Box component="section" sx={{ p: 2, border: "1px dashed black" }}>
        <Typography
          variant="h5"
          style={{ marginTop: "0.5em", marginBottom: "0.5em" }}
        >
          New Healthcare entry
        </Typography>

        <FormControl>
          <FormLabel id="entry-type">Entry type</FormLabel>
          <RadioGroup
            row
            aria-labelledby="entry-type"
            defaultValue="HealthCheck"
            name="entry-type-group"
            onChange={(event) => {
              setEntryType(event.target.value as string);
            }}
          >
            <FormControlLabel
              value="HealthCheck"
              control={<Radio />}
              label="Health Check"
            />
            <FormControlLabel
              value="Hospital"
              control={<Radio />}
              label="Hospital"
            />
            <FormControlLabel
              value="OccupationalHealthcare"
              control={<Radio />}
              label="Occupational Healthcare"
            />
          </RadioGroup>
        </FormControl>

        <TextField
          required
          fullWidth
          margin="dense"
          id="description-input"
          label="Description"
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
          }}
        ></TextField>
        <TextField
          required
          fullWidth
          margin="dense"
          id="date-input"
          label="Date"
          type="date"
          value={date}
          onChange={(event) => {
            setDate(event.target.value);
          }}
          InputLabelProps={{
            shrink: true,
          }}
        ></TextField>
        <TextField
          required
          fullWidth
          margin="dense"
          id="specialist-input"
          label="Specialist"
          value={specialist}
          onChange={(event) => {
            setSpecialist(event.target.value);
          }}
        ></TextField>

        {/* DiagnosisCodes */}
        <FormControl fullWidth margin="dense">
          <InputLabel id="diagnosis-codes-label">Diagnosis codes</InputLabel>
          <Select
            labelId="diagnosis-codes-label"
            id="diagnosis-codes"
            multiple
            value={diagnosisCodes}
            onChange={onDiagnosisCodesChange}
            input={
              <OutlinedInput id="diagnosis-codes" label="Diagnosis codes" />
            }
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip 
                    key={value} 
                    label={value}
                    onDelete={handleDelete(value)}
                    onMouseDown={(event) => {
                      event.stopPropagation();
                    }}
                    />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {diagnosis.map((item) => (
              <MenuItem
                key={item.code}
                value={item.code}
                style={getStyles(item.code, diagnosisCodes, theme)}
              >
                {item.code} {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {entryType === "HealthCheck" ? (
          <>
            <FormControl fullWidth margin="dense">
              <InputLabel id="demo-simple-select-label">
                Healthcheck rating
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={healthCheckRating}
                label="Healthcheck rating"
                onChange={(event) => {
                  setHealthCheckRating(Number(event.target.value));
                }}
              >
                {Object.entries(HealthCheckRating)
                  .filter(([key]) => isNaN(Number(key)))
                  .map(([key, value]) => (
                    <MenuItem key={key} value={value}>
                      {key}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </>
        ) : null}
        {entryType === "Hospital" ? (
          <>
            <TextField
              required
              fullWidth
              margin="dense"
              id="discharge-criteria-input"
              label="Discharge criteria"
              value={dischargeCriteria}
              onChange={(event) => {
                setDischargeCriteria(event.target.value);
              }}
            ></TextField>
            <TextField
              required
              fullWidth
              type="date"
              margin="dense"
              id="discharge-date-input"
              label="Discharge date"
              value={dischargeDate}
              onChange={(event) => {
                setDischargeDate(event.target.value);
              }}
              InputLabelProps={{
                shrink: true,
              }}
            ></TextField>
          </>
        ) : null}
        {entryType === "OccupationalHealthcare" ? (
          <>
            <TextField
              required
              fullWidth
              margin="dense"
              id="employer-name-input"
              label="Employer name"
              value={employerName}
              onChange={(event) => {
                setEmployerName(event.target.value);
              }}
            ></TextField>
            <TextField
              fullWidth
              type="date"
              margin="dense"
              id="sickleave-start-date-input"
              label="Sickleave start date"
              value={sickLeaveStart}
              onChange={(event) => {
                setSickLeaveStart(event.target.value);
              }}
              InputLabelProps={{
                shrink: true,
              }}
            ></TextField>
            <TextField
              fullWidth
              type="date"
              margin="dense"
              id="sickleave-end-date-input"
              label="Sickleave end date"
              value={sickLeaveEnd}
              onChange={(event) => {
                setSickLeaveEnd(event.target.value);
              }}
              InputLabelProps={{
                shrink: true,
              }}
            ></TextField>
          </>
        ) : null}
        <Stack direction="row" justifyContent="space-between">
          <Button
            variant="contained"
            color="error"
            onClick={onCancel}
          >
            CANCEL
          </Button>
          <Button variant="contained" type="submit">
            ADD
          </Button>
        </Stack>
      </Box>
    </form>
    </>
  );
};

export default AddEntryForm;