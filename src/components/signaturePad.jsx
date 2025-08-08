import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography
} from '@mui/material';

const SignaturePad = ({ open, onClose, onSave }) => {
  const sigCanvas = useRef();

  const clear = () => sigCanvas.current.clear();

  const save = () => {
    if (sigCanvas.current.isEmpty()) {
      alert("Please sign before saving.");
      return;
    }
    const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    
    onSave(dataURL);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Sign the Invoice</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Use your mouse or finger to sign below:
        </Typography>
        <Box
          sx={{
            border: '1px solid #ccc',
            borderRadius: 2,
            boxShadow: 1,
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{
              width: 600,
              height: 250,
              className: 'sigCanvas'
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={clear} color="warning" variant="outlined">
          Clear
        </Button>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={save} color="primary" variant="contained">
          Save Signature
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignaturePad;
