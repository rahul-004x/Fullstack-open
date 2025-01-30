import { useRef, useEffect } from 'react';
import { Alert } from '@mui/material';

import AddEntryForm from './AddEntryForm';
import { EntryWithoutId, Diagnosis } from "../../types";

interface Props {
  onSubmit: (values: EntryWithoutId) => void;
  onClose: () => void;
  error?: string;
  modalOpen: boolean;
  diagnosis: Diagnosis[];
}

const AddEntryModal = ({ onSubmit, error, onClose, modalOpen, diagnosis }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalOpen) {
      containerRef.current?.focus();
    }
  }, [modalOpen]);

  if (!modalOpen) {
    return null;
  }

  return (
    <div ref={containerRef} tabIndex={-1}>
      {error && <Alert severity="error">{error}</Alert>}
      <AddEntryForm onSubmit={onSubmit} onCancel={onClose} diagnosis={diagnosis} />
    </div>
  );
};

export default AddEntryModal;