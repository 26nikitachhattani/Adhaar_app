// src/components/OTPLoginTab.jsx
import React, { useState, useRef } from 'react';
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Grid,
  Alert,
  Collapse,
} from '@mui/material';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import BadgeIcon from '@mui/icons-material/Badge';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import ShieldIcon from '@mui/icons-material/Shield';
import RefreshIcon from '@mui/icons-material/Refresh';
import LockOpenIcon from '@mui/icons-material/LockOpen';

export default function OTPLoginTab() {
  const [aadhaar, setAadhaar] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [captchaInput, setCaptchaInput] = useState('');
  const [consent, setConsent] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [captchaCode] = useState('4X7R2');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const otpRefs = useRef([]);

  const formatAadhaar = (value) => {
    const digits = value.replace(/\D/g, '').substring(0, 12);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const handleAadhaarChange = (e) => {
    setAadhaar(formatAadhaar(e.target.value));
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSendOTP = () => {
    const raw = aadhaar.replace(/\s/g, '');
    if (raw.length < 12) {
      setError('Please enter a valid 12-digit Aadhaar number first.');
      return;
    }
    setError('');
    setOtpSent(true);
    let t = 30;
    setCountdown(t);
    const iv = setInterval(() => {
      t--;
      setCountdown(t);
      if (t <= 0) clearInterval(iv);
    }, 1000);
  };

  const handleSubmit = () => {
    if (!consent) { setError('Please accept the consent terms to proceed.'); return; }
    if (aadhaar.replace(/\s/g, '').length < 12) { setError('Enter a valid Aadhaar number.'); return; }
    if (otp.some(d => d === '')) { setError('Please enter the complete 6-digit OTP.'); return; }
    if (captchaInput.toUpperCase() !== captchaCode) { setError('Incorrect captcha. Please try again.'); return; }
    setError('');
    setSuccess(true);
  };

  return (
    <Box>
      <Collapse in={!!error}>
        <Alert severity="error" sx={{ mb: 1.5, fontSize: '0.8rem' }} onClose={() => setError('')}>
          {error}
        </Alert>
      </Collapse>

      <Collapse in={success}>
        <Alert severity="success" sx={{ mb: 1.5, fontSize: '0.8rem' }} icon={<LockOpenIcon fontSize="small" />}>
          Identity verified successfully. Redirecting…
        </Alert>
      </Collapse>

      {/* Aadhaar Number */}
      <TextField
        label="Aadhaar Number"
        placeholder="XXXX XXXX XXXX"
        value={aadhaar}
        onChange={handleAadhaarChange}
        inputProps={{ maxLength: 14, inputMode: 'numeric' }}
        InputProps={{ startAdornment: <BadgeIcon sx={{ color: '#B0BAC9', mr: 1, fontSize: 20 }} /> }}
        sx={{ mb: 1.5 }}
      />

      {/* Mobile Number */}
      <TextField
        label="Linked Mobile Number"
        placeholder="+91 XXXXX XXXXX"
        value={mobile}
        onChange={e => setMobile(e.target.value)}
        inputProps={{ maxLength: 14, inputMode: 'tel' }}
        InputProps={{ startAdornment: <PhoneAndroidIcon sx={{ color: '#B0BAC9', mr: 1, fontSize: 20 }} /> }}
        sx={{ mb: 1.5 }}
      />

      {/* OTP Row */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.75, fontSize: '0.8rem', fontWeight: 500, color: '#4A5568' }}>
          One-Time Password (OTP)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box className="otp-grid" sx={{ display: 'flex', gap: '8px', flex: 1 }}>
            {otp.map((digit, i) => (
              <TextField
                key={i}
                className="otp-single-box"
                value={digit}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => handleOtpKeyDown(i, e)}
                inputRef={el => otpRefs.current[i] = el}
                inputProps={{
                  maxLength: 1,
                  inputMode: 'numeric',
                  style: { textAlign: 'center', fontSize: '1.1rem', fontWeight: 600, padding: '12px 0', color: '#1A3A6E' }
                }}
                sx={{
                  width: '44px',
                  '& .MuiOutlinedInput-root': { borderRadius: '10px', backgroundColor: '#FAFBFD' }
                }}
              />
            ))}
          </Box>
          <Button
            className="send-otp-btn"
            variant="contained"
            onClick={handleSendOTP}
            disabled={countdown > 0}
            size="small"
            sx={{
              height: '56px',
              borderRadius: '10px',
              background: '#EBF1FB',
              color: '#1A3A6E',
              boxShadow: 'none',
              fontSize: '0.78rem',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              textTransform: 'none',
              px: 1.5,
              '&:hover': { background: '#D5E3F7', boxShadow: 'none' },
              '&.Mui-disabled': { background: '#F0F3FA', color: '#B0BAC9' },
            }}
          >
            {countdown > 0 ? `Resend (${countdown}s)` : otpSent ? 'Resend OTP' : 'Send OTP'}
          </Button>
        </Box>
        {otpSent && countdown > 0 && (
          <Typography variant="caption" sx={{ color: '#8492A6', mt: 0.5, display: 'block' }}>
            OTP sent to registered mobile number
          </Typography>
        )}
      </Box>

      {/* Captcha Row */}
      <Box sx={{ mb: 1.75 }}>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.75, fontSize: '0.8rem', fontWeight: 500, color: '#4A5568' }}>
          Captcha Verification
        </Typography>
        <Grid container spacing={1.25} alignItems="center">
          <Grid item xs>
            <TextField
              label="Enter captcha"
              value={captchaInput}
              onChange={e => setCaptchaInput(e.target.value.toUpperCase())}
              inputProps={{ maxLength: 5 }}
              InputProps={{ startAdornment: <KeyboardIcon sx={{ color: '#B0BAC9', mr: 1, fontSize: 20 }} /> }}
            />
          </Grid>
          <Grid item>
            <Box className="captcha-display">
              <span style={{ position: 'relative', zIndex: 1 }}>{captchaCode}</span>
              <div className="captcha-strikethrough" />
            </Box>
          </Grid>
          <Grid item>
            <Button
              variant="text"
              sx={{ minWidth: 0, p: 1, color: '#8492A6', borderRadius: '8px' }}
              title="Refresh captcha"
            >
              <RefreshIcon fontSize="small" />
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Consent Checkbox */}
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
            I consent to share my Aadhaar-based identity information for authentication as per{' '}
            <span className="consent-link">UIDAI terms</span> and{' '}
            <span className="consent-link">privacy policy</span>.
          </Typography>
        }
      />

      {/* Submit */}
      <Button
        variant="contained"
        fullWidth
        size="large"
        startIcon={<ShieldIcon />}
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
        Verify &amp; Login
      </Button>
    </Box>
  );
}
