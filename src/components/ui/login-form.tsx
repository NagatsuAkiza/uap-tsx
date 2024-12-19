"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  TextField,
  IconButton,
  InputAdornment,
  Button,
  Typography,
  Box,
  Paper
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await signIn("credentials", {
      redirect: false,
      email,
      password
    });

    if (response?.error) {
      setError(response.error);
    } else {
      router.push("/");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
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
          Login
        </Typography>
        <Typography variant="body2" align="center" gutterBottom color="textSecondary">
          Masuk ke akun Anda untuk mengakses dashboard
        </Typography>
        <form onSubmit={handleLogin}>
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
            type={showPassword ? "text" : "password"}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
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
            Login
          </Button>
        </form>
        <Typography variant="body2" align="center" color="textSecondary" sx={{ marginTop: 2 }}>
          Belum punya akun?{" "}
          <a href="/auth/register" style={{ color: "#1976d2", textDecoration: "none" }}>
            Daftar Sekarang
          </a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
