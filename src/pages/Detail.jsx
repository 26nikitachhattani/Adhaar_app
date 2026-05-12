//import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../lib/axiosClient";

import { useState, useEffect, useRef } from "react";

function SecureDataMask({ value, label = "Sensitive data" }) {
  const [revealed, setRevealed] = useState(false);
  const [displayValue, setDisplayValue] = useState("");
  const timerRef = useRef(null);

  const masked = value
    ? "XXXX-XXXX-" + value.replace(/\D/g, "").slice(-4)
    : "XXXX-XXXX-XXXX";

  const reveal = () => {
    setDisplayValue(value);
    setRevealed(true);

    timerRef.current = setTimeout(() => {
      setRevealed(false);
      setDisplayValue(""); // clears unmasked value from state
    }, 10000);
  };

  const hide = () => {
    clearTimeout(timerRef.current);
    setRevealed(false);
    setDisplayValue("");
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current); // cleanup on unmount
  }, []);

  return (
    <div role="group" aria-labelledby={`${label}-label`}>
      <span id={`${label}-label`} style={{ fontSize: 12, color: "#888" }}>
        {label}
      </span>

      {/* aria-live announces the value change to screen readers */}
      <p
        aria-live="polite"
        aria-atomic="true"
        style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 500 }}
      >
        {revealed ? displayValue : masked}
      </p>

      <button
        onClick={revealed ? hide : reveal}
        aria-pressed={revealed}
        aria-label={revealed ? `Hide ${label}` : `Reveal ${label}`}
      >
        {revealed ? "Hide" : "Tap to Reveal"}
      </button>

      {/* Screen-reader-only countdown hint */}
      {revealed && (
        <span role="status" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
          {label} is visible. It will be hidden automatically in 10 seconds.
        </span>
      )}
    </div>
  );
}



function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [revealed, setRevealed] = useState({ aadhaar: false, phone: false });

  const usr = JSON.parse(localStorage.getItem("user"));
  const userId = usr ? usr.id : null;

  useEffect(() => {
    axiosClient
      .get(`/users/${userId}`)
      .then((res) => setUser(res.data))
      .catch(() => setError("User not found or API error"));
  }, [id]);

  const toggleField = (field) =>
    setRevealed((prev) => ({ ...prev, [field]: !prev[field] }));

  const maskAadhaar = (num) =>
    num ? `•••• •••• ${String(num).slice(-4)}` : "—";
  const maskPhone = (num) =>
    num ? `•••• ••• ${String(num).slice(-4)}` : "—";

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  if (error)
    return (
      <div style={styles.errorCard}>
        <span style={{ fontSize: 20, color: "#A32D2D" }}>⚠</span>
        <div>
          <p style={styles.errorTitle}>User not found</p>
          <p style={styles.errorSub}>{error}</p>
        </div>
      </div>
    );

  if (!user) return <p style={styles.loading}>Loading user…</p>;

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.avatarBand}>
        <div style={styles.avatar}>{initials}</div>
        <div>
          <p style={styles.name}>{user.name}</p>
          <p style={styles.uid}>ID: {userId}</p>
        </div>
        <span style={styles.badge}>✓ Verified</span>
      </div>

      {/* Fields */}
      <div>
      <SecureDataMask value={user.aadhaarNumber} label="Aadhaar number" />
      <SecureDataMask value={user.phoneNumber} label="Phone number" />
        {/* <FieldRow
          icon="🪪"
          label="Aadhaar number"
          value={revealed.aadhaar ? user.aadhaarNumber : maskAadhaar(user.aadhaarNumber)}
          masked={!revealed.aadhaar}
          onToggle={() => toggleField("aadhaar")}
          shown={revealed.aadhaar}
        /> */}
        {/* <FieldRow
          icon="📞"
          label="Phone number"
          value={revealed.phone ? user.phoneNumber : maskPhone(user.phoneNumber)}
          masked={!revealed.phone}
          onToggle={() => toggleField("phone")}
          shown={revealed.phone}
        /> */}
        <div style={styles.fieldRow}>
          <span style={styles.fieldIcon}>👤</span>
          <div>
            <p style={styles.fieldLabel}>Name</p>
            <p style={styles.fieldValue}>{user.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldRow({ icon, label, value, masked, onToggle, shown }) {
  return (
    <div style={styles.fieldRow}>
      <span style={styles.fieldIcon}>{icon}</span>
      <div style={{ flex: 1 }}>
        <p style={styles.fieldLabel}>{label}</p>
        <p style={{ ...styles.fieldValue, ...(masked ? styles.masked : {}) }}>
          {value}
        </p>
      </div>
      <button style={styles.revealBtn} onClick={onToggle}>
        {shown ? "Hide" : "Show"}
      </button>
    </div>
  );
}

const styles = {
  card: { maxWidth: 480, margin: "2rem auto", border: "0.5px solid #e0e0e0", borderRadius: 12, overflow: "hidden", fontFamily: "sans-serif" },
  avatarBand: { display: "flex", alignItems: "center", gap: 14, padding: "1.25rem", borderBottom: "0.5px solid #e0e0e0" },
  avatar: { width: 52, height: 52, borderRadius: "50%", background: "#EEEDFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 500, color: "#3C3489" },
  name: { fontWeight: 500, fontSize: 16, margin: 0 },
  uid: { fontSize: 12, color: "#888", margin: "2px 0 0", fontFamily: "monospace" },
  badge: { marginLeft: "auto", background: "#E1F5EE", color: "#085041", fontSize: 11, padding: "3px 10px", borderRadius: 99, fontWeight: 500 },
  fieldRow: { display: "flex", alignItems: "center", gap: 12, padding: ".75rem 1.25rem", borderBottom: "0.5px solid #f0f0f0" },
  fieldIcon: { fontSize: 18, width: 22, flexShrink: 0 },
  fieldLabel: { fontSize: 11, color: "#888", margin: "0 0 2px" },
  fieldValue: { fontSize: 14, fontWeight: 500, fontFamily: "monospace", margin: 0 },
  masked: { color: "#aaa", letterSpacing: "0.15em" },
  revealBtn: { padding: "5px 12px", borderRadius: 8, border: "0.5px solid #ccc", background: "transparent", fontSize: 12, cursor: "pointer" },
  loading: { padding: "2rem", color: "#888", textAlign: "center" },
  errorCard: { display: "flex", alignItems: "center", gap: 12, padding: "1rem 1.25rem", background: "#FCEBEB", border: "0.5px solid #F7C1C1", borderRadius: 12, maxWidth: 400, margin: "2rem auto" },
  errorTitle: { fontWeight: 500, color: "#A32D2D", margin: 0 },
  errorSub: { fontSize: 12, color: "#791F1F", margin: "2px 0 0" },
};

export default UserDetail;