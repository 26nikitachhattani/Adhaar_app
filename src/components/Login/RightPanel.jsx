// src/components/RightPanel.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import BoltIcon from '@mui/icons-material/Bolt';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SecurityIcon from '@mui/icons-material/Security';

const features = [
  {
    icon: <LockOpenIcon sx={{ fontSize: 17, color: 'rgba(255,255,255,0.85)' }} />,
    title: 'Single Sign-On',
    desc: 'Access all central & state services with one secure login',
  },
  {
    icon: <VisibilityOffIcon sx={{ fontSize: 17, color: 'rgba(255,255,255,0.85)' }} />,
    title: 'Privacy Protected',
    desc: 'Minimal data shared; full consent-based access always',
  },
  {
    icon: <BoltIcon sx={{ fontSize: 17, color: 'rgba(255,255,255,0.85)' }} />,
    title: 'Instant Verification',
    desc: 'OTP, biometric, or face auth completed in seconds',
  },
];

export default function RightPanel() {
  return (
    <Box className="login-right">
      <Box className="right-dot-pattern" />
      <Box className="right-content">

        {/* Badge pill */}
        <Box className="right-pill">
          <SecurityIcon sx={{ fontSize: 14 }} />
          Secured by UIDAI
        </Box>

        {/* Heading */}
        <Typography className="right-heading" variant="h5">
          One identity.<br />All of India's services.
        </Typography>

        {/* Body */}
        <Typography className="right-body" variant="body2">
          Your Aadhaar gives you seamless, verified access to government services across health, finance, welfare, and more.
        </Typography>

        {/* Feature list */}
        <Box>
          {features.map((f, i) => (
            <Box key={i} className="feature-item">
              <Box className="feature-icon-box">
                {f.icon}
              </Box>
              <Box>
                <Typography className="feature-title" variant="body2">
                  {f.title}
                </Typography>
                <Typography className="feature-desc" variant="body2">
                  {f.desc}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Secure badge */}
        <Box className="secure-badge">
          <VerifiedUserIcon sx={{ fontSize: 15, color: 'rgba(255,255,255,0.5)' }} />
          ISO 27001 certified · End-to-end encrypted · 256-bit SSL
        </Box>
      </Box>
    </Box>
  );
}
