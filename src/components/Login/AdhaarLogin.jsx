// src/components/AadhaarLogin.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  // Tabs,
  // Tab,
  //Button,
  //Divider,
} from '@mui/material';
// import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
// import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import OTPLoginTab from './OTPLoginTab';
//import BiometricTab from './BiometricTab';
import FaceAuthTab from './FaceAuthTab';
//import RightPanel from './RightPanel';

// Custom CSS (separate import as requested)
import './styles/AadhaarLogin.css';

function TabPanel({ children, value, index }) {
  return (
    <Box hidden={value !== index} role="tabpanel">
      {value === index && <Box>{children}</Box>}
    </Box>
  );
}

export default function AadhaarLogin() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box className="aadhaar-page">
      <Box className="login-container">

        {/* ── Left Login Card ── */}
        <Box className="login-left">

          {/* Brand row */}
          <Box className="brand-row">
            <Box className="brand-emblem">
              <svg viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="13" cy="13" r="11" stroke="white" strokeWidth="1.5" />
                <circle cx="13" cy="10" r="3.5" stroke="white" strokeWidth="1.3" />
                <path
                  d="M6.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5"
                  stroke="white"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
            </Box>
            <Box className="brand-text-block">
              <span className="brand-name">UIDAI · Aadhaar</span>
              <span className="brand-sub">Government of India</span>
            </Box>
          </Box>

          {/* Heading */}
          <Typography className="login-heading" variant="h4">
            Citizen Login
          </Typography>
          <Typography className="login-subheading" variant="body2">
            Securely verify your identity using your Aadhaar number
          </Typography>

          {/* Auth method tabs */}
          {/* <Box className="auth-tabs-wrapper" sx={{ mb: 1.75 }}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              variant="fullWidth"
              TabIndicatorProps={{ style: { transition: 'all 0.25s ease' } }}
            >
              <Tab label="OTP Login" />
              <Tab label="Biometric" />
              <Tab label="Face Auth" />
            </Tabs>
          </Box> */}

          {/* Tab Panels */}
          <TabPanel value={activeTab} index={0}>
            <OTPLoginTab />
          </TabPanel>
          {/* <TabPanel value={activeTab} index={1}>
            <BiometricTab />
          </TabPanel> */}
          <TabPanel value={activeTab} index={2}>
            <FaceAuthTab />
          </TabPanel>

          {/* Alt access */}
          {/* <Box className="or-divider">
            <Box className="or-divider-line" />
            <Typography className="or-divider-text">or access via</Typography>
            <Box className="or-divider-line" />
          </Box> */}

          {/* <Box sx={{ display: 'flex', gap: 1.25 }}>
            <Button className="alt-btn" startIcon={<PhoneAndroidIcon sx={{ fontSize: '18px !important' }} />}>
              mAadhaar App
            </Button>
            <Button className="alt-btn" startIcon={<AccountBalanceIcon sx={{ fontSize: '18px !important' }} />}>
              DigiLocker
            </Button>
          </Box> */}

          {/* Footer */}
          <Typography className="footer-note">
            Need help?{' '}
            <a href="https://uidai.gov.in" target="_blank" rel="noreferrer">
              Aadhaar Help Center
            </a>
            {' · '}
            <a href="https://uidai.gov.in" target="_blank" rel="noreferrer">
              Grievance Portal
            </a>
          </Typography>
        </Box>

        {/* ── Right Info Panel ── */}
        {/* <RightPanel /> */}
      </Box>
    </Box>
  );
}
