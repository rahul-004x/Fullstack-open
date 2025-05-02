import { Dialog, DialogTitle, DialogContent, IconButton, Alert, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import AddEntryForm from './AddEntryForm';
import { EntryWithoutId, Diagnosis } from "../../types";

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: EntryWithoutId) => void;
  error?: string;
  diagnosis: Diagnosis[];
}

const AddEntryModal = ({ modalOpen, onClose, onSubmit, error, diagnosis }: Props) => (
  <Dialog 
    fullWidth={true} 
    maxWidth="md" 
    open={modalOpen} 
    onClose={onClose}
    PaperProps={{
      sx: {
        borderRadius: 2
      }
    }}
  >
    <DialogTitle sx={{ m: 0, p: 2 }}>
      Add New Medical Entry
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <DialogContent dividers>
      <Box sx={{ p: 1 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <AddEntryForm onSubmit={onSubmit} onCancel={onClose} diagnosis={diagnosis}/>
      </Box>
    </DialogContent>
  </Dialog>
);

export default AddEntryModal;