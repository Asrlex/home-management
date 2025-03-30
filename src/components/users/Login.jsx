import { useState } from "react";
import useUserStore from '../../store/UserContext';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { TextField, Button, Box } from "@mui/material";
import { formThemeVars, styles } from "../styles/Form.Styles";

export default function Login() {
  const { login } = useUserStore();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      navigate("/");
      toast.success("Login successful!");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "2rem",
        maxWidth: "500px",
        margin: "auto",
        borderRadius: "8px",
      }}
    >
      <TextField
        label="Email"
        type="email"
        value={credentials.email}
        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
        variant="outlined"
        fullWidth
        sx={styles.textFieldStyles}
      />
      <TextField
        label="Contraseña"
        type="password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        variant="outlined"
        fullWidth
        sx={styles.textFieldStyles}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{
          backgroundColor: formThemeVars.buttonBgColor,
          color: formThemeVars.buttonTextColor,
        }}
      >
        Iniciar sesión
      </Button>
      <Button
        variant="text"
        onClick={() => navigate("/signup")}
        sx={{
          textTransform: "none",
        }}
      >
        ¿No tienes cuenta? Regístrate aquí
      </Button>
    </Box>
  );
}