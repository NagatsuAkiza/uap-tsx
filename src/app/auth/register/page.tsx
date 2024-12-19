"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [noKtp, setNoKtp] = useState("");
  const [noHp, setNoHp] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    const data = { email, password, name, noKtp, noHp };

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Registrasi berhasil");
        router.push("/auth/login");
      } else {
        alert(result.error || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Gagal menghubungi server");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f5f7",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: "32px",
          borderRadius: "12px",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleRegister}>
          <TextField
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="No HP"
            type="text"
            value={noHp}
            onChange={(e) => setNoHp(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="No KTP"
            type="text"
            value={noKtp}
            onChange={(e) => setNoKtp(e.target.value.replace(/[^0-9]/g, ""))}
            fullWidth
            required
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              marginY: 2,
            }}
          >
            Register
          </Button>
        </form>
        <Typography variant="body2" align="center" color="textSecondary">
          Sudah punya akun?{" "}
          <a href="/auth/login" style={{ color: "#1976d2", textDecoration: "none" }}>
            Login Sekarang
          </a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;
