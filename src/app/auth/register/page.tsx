"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name })
    });

    const data = await response.json();

    if (data.error) {
      setError(data.error);
    } else {
      router.push("/login");
    }
  };

  return (
    <Box
      className="flex items-center justify-center min-h-screen bg-gray-100"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f5f7"
      }}>
      <Paper
        elevation={4}
        sx={{
          padding: "32px",
          borderRadius: "12px",
          maxWidth: "400px",
          width: "100%"
        }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: "#1976d2"
          }}>
          Register
        </Typography>
        <Typography variant="body2" align="center" gutterBottom color="textSecondary">
          Buat akun baru untuk mulai menggunakan layanan kami.
        </Typography>
        <form onSubmit={handleRegister}>
          <TextField
            label="Full Name"
            type="text"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ marginY: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              marginY: 2,
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#1565c0"
              }
            }}>
            Register
          </Button>
        </form>
        <Typography variant="body2" align="center" color="textSecondary" sx={{ marginTop: 2 }}>
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
