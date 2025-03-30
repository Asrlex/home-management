import { useState } from "react";
import useUserStore from '../../store/UserContext';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { TextField, Button, Box } from "@mui/material";
import { formThemeVars, styles } from "../styles/Form.Styles";

export default function Signup() {
  const { signup } = useUserStore();
  const [details, setDetails] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(details);
      navigate("/login");
      toast.success("Signup successful! Please login.");
    } catch (error) {
      toast.error("Signup failed. Please try again.");
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
        value={details.email}
        onChange={(e) => setDetails({ ...details, email: e.target.value })}
        variant="outlined"
        fullWidth
        sx={styles.textFieldStyles}
      />
      <TextField
        label="Contraseña"
        type="password"
        value={details.password}
        onChange={(e) => setDetails({ ...details, password: e.target.value })}
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
        Registrarse
      </Button>
      <Button
        variant="text"
        onClick={() => navigate("/login")}
        sx={{
          textTransform: "none",
        }}
      >
        ¿Ya tienes cuenta? Inicia sesión
      </Button>
    </Box>
  );
}