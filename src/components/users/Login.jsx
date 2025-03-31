import { useState } from "react";
import useUserStore from "../../store/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { TextField, Button, Box,InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { formThemeVars, styles } from "../../styles/Form.Styles";

export default function Login() {
  const { login } = useUserStore();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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
        onChange={(e) =>
          setCredentials({ ...credentials, email: e.target.value })
        }
        variant="outlined"
        fullWidth
        sx={styles.textFieldStyles}
      />
      <TextField
        label="Contraseña"
        type={showPassword ? "text" : "password"}
        value={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
        variant="outlined"
        fullWidth
        sx={styles.textFieldStyles}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
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
