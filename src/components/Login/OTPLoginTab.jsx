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

import { useNavigate } from 'react-router-dom';

import axiosClient from '../../lib/axiosClient';
//import ROService from "@/services/ROServices";

import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import BadgeIcon from '@mui/icons-material/Badge';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import ShieldIcon from '@mui/icons-material/Shield';
import RefreshIcon from '@mui/icons-material/Refresh';
import LockOpenIcon from '@mui/icons-material/LockOpen';

export default function OTPLoginTab() {

  const navigate = useNavigate();

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

  /*
  |--------------------------------------------------------------------------
  | FORMAT AADHAAR
  |--------------------------------------------------------------------------
  */

  const formatAadhaar = (value) => {

    const digits = value
      .replace(/\D/g, '')
      .substring(0, 12);

    return digits
      .replace(/(\d{4})(?=\d)/g, '$1 ')
      .trim();
  };

  const handleAadhaarChange = (e) => {
    setAadhaar(formatAadhaar(e.target.value));
  };

  /*
  |--------------------------------------------------------------------------
  | OTP INPUT
  |--------------------------------------------------------------------------
  */

  const handleOtpChange = (index, value) => {

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    newOtp[index] = value.slice(-1);

    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {

    if (
      e.key === 'Backspace' &&
      !otp[index] &&
      index > 0
    ) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  /*
  |--------------------------------------------------------------------------
  | SEND OTP
  |--------------------------------------------------------------------------
  */

  const handleSendOTP = () => {

    const raw = aadhaar.replace(/\s/g, '');

    if (raw.length < 12) {

      setError(
        'Please enter a valid 12-digit Aadhaar number first.'
      );

      return;
    }

    if (mobile.length < 10) {

      setError(
        'Please enter valid mobile number.'
      );

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

  /*
  |--------------------------------------------------------------------------
  | LOGIN SUBMIT
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async () => {

    try {

      /*
      |--------------------------------------------------------------------------
      | VALIDATIONS
      |--------------------------------------------------------------------------
      */

      if (!consent) {

        setError(
          'Please accept the consent terms.'
        );

        return;
      }

      const rawAadhaar =
        aadhaar.replace(/\s/g, '');

      if (rawAadhaar.length < 12) {

        setError(
          'Please enter valid Aadhaar number.'
        );

        return;
      }

      if (mobile.length < 10) {

        setError(
          'Please enter valid mobile number.'
        );

        return;
      }

      if (otp.some((d) => d === '')) {

        setError(
          'Please enter complete OTP.'
        );

        return;
      }

      if (
        captchaInput.toUpperCase() !==
        captchaCode
      ) {

        setError(
          'Invalid captcha.'
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | API CALL
      |--------------------------------------------------------------------------
      */

      const response = await axiosClient.get(
        `/users?aadhaarNumber=${rawAadhaar.replace(
          /(\d{4})(\d{4})(\d{4})/,
          '$1-$2-$3'
        )}&phoneNumber=${mobile}`
      );

      const user = response.data[0];

      /*
      |--------------------------------------------------------------------------
      | USER FOUND
      |--------------------------------------------------------------------------
      */

      if (user) {

        setError('');

        setSuccess(true);

        localStorage.setItem(
          'user',
          JSON.stringify(user)
        );

        setTimeout(() => {

          navigate('/details', {
            state: user
          });

        }, 1500);

      } else {

        setError(
          'Invalid Aadhaar or Mobile Number.'
        );
      }

    } catch (err) {

      console.log(err);

      setError(
        err?.message ||
        'Something went wrong.'
      );
    }
  };

  return (
    <Box>

      {/* ERROR ALERT */}

      <Collapse in={!!error}>
        <Alert
          severity="error"
          sx={{
            mb: 1.5,
            fontSize: '0.8rem'
          }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      </Collapse>

      {/* SUCCESS ALERT */}

      <Collapse in={success}>
        <Alert
          severity="success"
          sx={{
            mb: 1.5,
            fontSize: '0.8rem'
          }}
          icon={
            <LockOpenIcon fontSize="small" />
          }
        >
          Identity verified successfully.
          Redirecting...
        </Alert>
      </Collapse>

      {/* AADHAAR + MOBILE */}

      <Grid
        container
        spacing={1.25}
        alignItems="center"
      >

        <Grid item size={{ md: 6, xs: 12 }}>

          <TextField
            label="Aadhaar Number"
            placeholder="XXXX XXXX XXXX"
            value={aadhaar}
            onChange={handleAadhaarChange}
            inputProps={{
              maxLength: 14,
              inputMode: 'numeric'
            }}
            InputProps={{
              startAdornment: (
                <BadgeIcon
                  sx={{
                    color: '#B0BAC9',
                    mr: 1,
                    fontSize: 20
                  }}
                />
              )
            }}
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                backgroundColor: '#FAFBFD'
              }
            }}
          />

        </Grid>

        <Grid item size={{ md: 6, xs: 12 }}>

          <TextField
            label="Linked Mobile Number"
            placeholder="9876543210"
            value={mobile}
            onChange={(e) =>
              setMobile(
                e.target.value.replace(/\D/g, '')
              )
            }
            inputProps={{
              maxLength: 10,
              inputMode: 'tel'
            }}
            InputProps={{
              startAdornment: (
                <PhoneAndroidIcon
                  sx={{
                    color: '#B0BAC9',
                    mr: 1,
                    fontSize: 20
                  }}
                />
              )
            }}
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                backgroundColor: '#FAFBFD'
              }
            }}
          />

        </Grid>

      </Grid>

      {/* OTP */}

      <Box sx={{ mb: 1.5, mt: 2 }}>

        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mb: 0.75
          }}
        >
          One-Time Password (OTP)
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >

          <Box
            sx={{
              display: 'flex',
              gap: '8px',
              flex: 1
            }}
          >

            {otp.map((digit, i) => (

              <TextField
                key={i}
                value={digit}
                onChange={(e) =>
                  handleOtpChange(
                    i,
                    e.target.value
                  )
                }
                onKeyDown={(e) =>
                  handleOtpKeyDown(i, e)
                }
                inputRef={(el) =>
                  otpRefs.current[i] = el
                }
                inputProps={{
                  maxLength: 1,
                  inputMode: 'numeric',
                  style: {
                    textAlign: 'center'
                  }
                }}
                sx={{
                  width: '44px'
                }}
              />

            ))}

          </Box>

          <Button
            variant="contained"
            onClick={handleSendOTP}
            disabled={countdown > 0}
          >
            {
              countdown > 0
                ? `Resend (${countdown}s)`
                : otpSent
                  ? 'Resend OTP'
                  : 'Send OTP'
            }
          </Button>

        </Box>

      </Box>

      {/* CAPTCHA */}

      <Box sx={{ mb: 2 }}>

        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mb: 1
          }}
        >
          Captcha Verification
        </Typography>

        <Grid
          container
          spacing={1.25}
          alignItems="center"
        >

          <Grid item xs>

            <TextField
              label="Enter captcha"
              value={captchaInput}
              onChange={(e) =>
                setCaptchaInput(
                  e.target.value.toUpperCase()
                )
              }
              inputProps={{
                maxLength: 5
              }}
              InputProps={{
                startAdornment: (
                  <KeyboardIcon
                    sx={{
                      color: '#B0BAC9',
                      mr: 1
                    }}
                  />
                )
              }}
            />

          </Grid>

          <Grid item>

            <Box
              sx={{
                background: '#EEE',
                px: 2,
                py: 1,
                borderRadius: '8px',
                fontWeight: 700
              }}
            >
              {captchaCode}
            </Box>

          </Grid>

          <Grid item>

            <Button
              variant="text"
              sx={{
                minWidth: 0
              }}
            >
              <RefreshIcon fontSize="small" />
            </Button>

          </Grid>

        </Grid>

      </Box>

      {/* CONSENT */}

      <FormControlLabel
        control={
          <Checkbox
            checked={consent}
            onChange={(e) =>
              setConsent(e.target.checked)
            }
          />
        }
        label={
          <Typography variant="body2">
            I consent to share Aadhaar
            details for verification.
          </Typography>
        }
      />

      {/* SUBMIT */}

      <Button
        variant="contained"
        fullWidth
        size="large"
        startIcon={<ShieldIcon />}
        onClick={handleSubmit}
        sx={{
          mt: 2,
          height: '50px'
        }}
      >
        Verify & Login
      </Button>

    </Box>
  );
}