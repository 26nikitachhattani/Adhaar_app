// src/components/FaceAuthTab.jsx
import React, { useState } from 'react';
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Alert,
  Collapse,
} from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import BadgeIcon from '@mui/icons-material/Badge';

export default function FaceAuthTab() {
  const [aadhaar, setAadhaar] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');

  const formatAadhaar = (value) => {
    const digits = value.replace(/\D/g, '').substring(0, 12);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const handleSubmit = () => {
    if (aadhaar.replace(/\s/g, '').length < 12) {
      setError('Enter a valid 12-digit Aadhaar number.');
      return;
    }
    if (!consent) {
      setError('Please accept the consent terms to proceed.');
      return;
    }
    setError('');
    alert('Launching Face Authentication. You will be redirected to mAadhaar or approved device.');
  };

  return (
    <Box>
      <Box className="auth-icon-center">
        <Box className="auth-icon-circle">
          <FaceIcon sx={{ fontSize: 38, color: '#1A3A6E' }} />
        </Box>
        <Typography className="auth-icon-label" variant="h6">
          Face Authentication
        </Typography>
        <Typography className="auth-icon-desc" variant="body2">
          Authenticate using facial recognition via the mAadhaar app or UIDAI-approved device
        </Typography>
      </Box>

      <Collapse in={!!error}>
        <Alert severity="error" sx={{ mb: 1.5, fontSize: '0.8rem' }} onClose={() => setError('')}>
          {error}
        </Alert>
      </Collapse>

      <TextField
        label="Aadhaar Number"
        placeholder="XXXX XXXX XXXX"
        value={aadhaar}
        onChange={e => setAadhaar(formatAadhaar(e.target.value))}
        inputProps={{ maxLength: 14, inputMode: 'numeric' }}
        InputProps={{ startAdornment: <BadgeIcon sx={{ color: '#B0BAC9', mr: 1, fontSize: 20 }} /> }}
        sx={{ mb: 1.5 }}
      />

      <FormControlLabel
        sx={{ mb: 1.5, alignItems: 'flex-start', ml: 0 }}
        control={
          <Checkbox
            checked={consent}
            onChange={e => setConsent(e.target.checked)}
            size="small"
            sx={{ pt: 0.25, pr: 1 }}
          />
        }
        label={
          <Typography className="consent-text" variant="body2">
            I consent to face-based authentication as per{' '}
            <span className="consent-link">UIDAI guidelines</span>.
          </Typography>
        }
      />

      <Button
        variant="contained"
        fullWidth
        size="large"
        startIcon={<CameraAltIcon />}
        onClick={handleSubmit}
        sx={{
          height: '50px',
          borderRadius: '11px',
          background: '#1A3A6E',
          fontSize: '0.9rem',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': { background: '#142E5C', boxShadow: 'none' },
        }}
      >
        Launch Face Auth
      </Button>
    </Box>
  );
}
