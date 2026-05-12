import { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Card,
  Avatar,
  Typography,
  Chip,
  Divider,
  Button,
  LinearProgress,
  Stack,
} from "@mui/material";

import axiosClient from "../lib/axiosClient";

import BadgeIcon from "@mui/icons-material/Badge";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const REVEAL_DURATION = 10;

const PURPLE = "#3C3489";
const PURPLE_LIGHT = "#EEEDFE";
const PURPLE_BORDER = "#AFA9EC";
const GREEN_BG = "#E1F5EE";
const GREEN_TEXT = "#085041";
const PURPLE_BAR = "#7F77DD";

function FieldRow({ fieldKey, config, revealed, onToggle }) {
  const { label, masked, real, Icon } = config;

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{
        px: 3,
        py: 1.2,
        borderBottom: "0.5px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: "9px",
          bgcolor: "grey.50",
          border: "0.5px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 18, color: "text.secondary" }} />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontWeight: 500,
            color: "text.disabled",
            mb: 0.25,
          }}
        >
          {label}
        </Typography>

        <Typography
          variant="body2"
          noWrap
          sx={{
            fontFamily: "'DM Mono', monospace",
            fontWeight: 500,
            fontSize: 13.5,
            letterSpacing: revealed ? "normal" : "0.08em",
            color: revealed ? PURPLE : "text.secondary",
            transition: "color 0.2s",
          }}
        >
          {revealed ? real : masked}
        </Typography>
      </Box>

      <Button
        size="small"
        variant="outlined"
        startIcon={
          revealed ? (
            <VisibilityOffIcon sx={{ fontSize: "13px !important" }} />
          ) : (
            <VisibilityIcon sx={{ fontSize: "13px !important" }} />
          )
        }
        onClick={() => onToggle(fieldKey)}
        sx={{
          flexShrink: 0,
          fontSize: 11,
          fontWeight: 500,
          px: 1.5,
          py: 0.6,
          borderRadius: "8px",
          textTransform: "none",
          minWidth: 0,
          borderColor: revealed ? PURPLE_BORDER : "divider",
          bgcolor: revealed ? PURPLE_LIGHT : "transparent",
          color: revealed ? PURPLE : "text.secondary",
          "&:hover": {
            bgcolor: revealed ? "#E3E1FA" : "grey.100",
            borderColor: revealed ? PURPLE_BORDER : "grey.400",
          },
        }}
      >
        {revealed ? "Hide" : "Reveal"}
      </Button>
    </Stack>
  );
}

export default function UserDetailCard() {
  const [revealedField, setRevealedField] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [timerProgress, setTimerProgress] = useState(100);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const timerRef = useRef(null);
  const autoHideRef = useRef(null);

  // ✅ Get localStorage data safely
  const UserData = JSON.parse(localStorage.getItem("user") || "{}");

  const id = UserData?.id;

  // ✅ Fetch User Detail API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        const res = await axiosClient.get(`/users/${id}`);

        setUser(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  // ✅ Dynamic Fields
  const FIELDS = user
    ? {
        aadhaar: {
          real: user.aadhaarNumber,
          masked: `XXXX · XXXX · ${user.aadhaarNumber?.slice(-4)}`,
          label: "Aadhaar Number",
          Icon: BadgeIcon,
        },
        phone: {
          real: user.phoneNumber,
          masked: `XXXX · XXX · ${user.phoneNumber?.slice(-4)}`,
          label: "Phone Number",
          Icon: PhoneIcon,
        },
      }
    : {};

  const hideField = useCallback(() => {
    setRevealedField(null);
    setCountdown(0);
    setTimerProgress(100);

    clearInterval(timerRef.current);
    clearTimeout(autoHideRef.current);
  }, []);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    clearTimeout(autoHideRef.current);

    setCountdown(REVEAL_DURATION);
    setTimerProgress(100);

    let elapsed = 0;

    timerRef.current = setInterval(() => {
      elapsed += 1;

      const remaining = REVEAL_DURATION - elapsed;

      setCountdown(remaining);
      setTimerProgress((remaining / REVEAL_DURATION) * 100);

      if (remaining <= 0) {
        clearInterval(timerRef.current);
      }
    }, 1000);

    autoHideRef.current = setTimeout(
      hideField,
      REVEAL_DURATION * 1000
    );
  }, [hideField]);

  const toggleField = useCallback(
    (key) => {
      if (revealedField === key) {
        hideField();
        return;
      }

      setRevealedField(key);
      startTimer();
    },
    [revealedField, hideField, startTimer]
  );

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(autoHideRef.current);
    };
  }, []);

  const showTimer =
    revealedField !== null && countdown > 0;

  // ✅ Loading UI
  if (loading) {
    return (
      <Typography align="center" sx={{ mt: 4 }}>
        Loading...
      </Typography>
    );
  }

  // ✅ Error UI
  if (error) {
    return (
      <Typography
        align="center"
        color="error"
        sx={{ mt: 4 }}
      >
        {error}
      </Typography>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
      `}</style>

      <Card
        variant="outlined"
        sx={{
          maxWidth: 420,
          mx: "auto",
          mt: 4,
          borderRadius: "20px",
          overflow: "hidden",
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.75}
          sx={{
            px: 3,
            pt: 2.5,
            pb: 2,
            borderBottom: "0.5px solid",
            borderColor: "divider",
          }}
        >
          <Avatar
            sx={{
              width: 52,
              height: 52,
              bgcolor: PURPLE_LIGHT,
              color: PURPLE,
              fontWeight: 600,
              fontSize: 17,
            }}
          >
            {user?.name?.slice(0, 2).toUpperCase()}
          </Avatar>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, mb: 0.25 }}
            >
              {user?.name}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                fontFamily: "'DM Mono', monospace",
                color: "text.disabled",
              }}
            >
              ID: {user?.id}
            </Typography>
          </Box>

          <Chip
            icon={
              <VerifiedUserIcon
                sx={{
                  fontSize: "13px !important",
                  color: `${GREEN_TEXT} !important`,
                }}
              />
            }
            label="Verified"
            size="small"
            sx={{
              ml: "auto !important",
              bgcolor: GREEN_BG,
              color: GREEN_TEXT,
              fontWeight: 600,
              fontSize: 11,
              height: 26,
              borderRadius: "99px",
            }}
          />
        </Stack>

        {/* Timer */}
        {showTimer && (
          <LinearProgress
            variant="determinate"
            value={timerProgress}
            sx={{
              height: 2,
              bgcolor: PURPLE_LIGHT,
              "& .MuiLinearProgress-bar": {
                bgcolor: PURPLE_BAR,
                transition: "transform 1s linear",
              },
            }}
          />
        )}

        {/* Fields */}
        <Box sx={{ py: 1 }}>
          {Object.entries(FIELDS).map(([key, config]) => (
            <FieldRow
              key={key}
              fieldKey={key}
              config={config}
              revealed={revealedField === key}
              onToggle={toggleField}
            />
          ))}

          {/* Full Name */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ px: 3, py: 1.2 }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "9px",
                bgcolor: "grey.50",
                border: "0.5px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PersonIcon
                sx={{
                  fontSize: 18,
                  color: "text.secondary",
                }}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 500,
                  color: "text.disabled",
                  mb: 0.25,
                }}
              >
                Full Name
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  fontSize: 13.5,
                }}
              >
                {user?.name}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Footer */}
        <Divider />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            px: 3,
            py: 1.25,
            bgcolor: "grey.50",
          }}
        >
          <Typography
            variant="caption"
            color="text.disabled"
          >
            {showTimer
              ? "Visible — auto-hides in 10 seconds"
              : "Tap reveal to view sensitive data"}
          </Typography>

          {showTimer && (
            <Typography
              variant="caption"
              sx={{
                fontFamily: "'DM Mono', monospace",
                color: "text.disabled",
              }}
            >
              Hides in {countdown}s
            </Typography>
          )}
        </Stack>
      </Card>
    </>
  );
}