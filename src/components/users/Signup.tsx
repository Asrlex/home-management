import { useState } from 'react';
import useUserStore from '../../store/UserStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { formThemeVars, styles } from '../../styles/Form.Styles';
import React from 'react';
import { ApiPaths } from '@/entities/enums/api.enums';

export default function Signup() {
  const { signup } = useUserStore();
  const [details, setDetails] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };

    if (!details.email) {
      newErrors.email = 'El correo electrónico es obligatorio.';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(details.email)) {
      newErrors.email = 'El correo electrónico no es válido.';
      valid = false;
    }

    if (!details.password) {
      newErrors.password = 'La contraseña es obligatoria.';
      valid = false;
    } else if (details.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
      valid = false;
    } else if (!/[A-Z]/.test(details.password)) {
      newErrors.password =
        'La contraseña debe contener al menos una letra mayúscula.';
      valid = false;
    } else if (!/[0-9]/.test(details.password)) {
      newErrors.password = 'La contraseña debe contener al menos un número.';
      valid = false;
    } else if (!/[!@#$%^&.,-_*]/.test(details.password)) {
      newErrors.password =
        'La contraseña debe contener al menos un carácter especial.';
      valid = false;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors,
    }));
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Por favor, corrige los errores antes de continuar.');
      return;
    }

    try {
      await signup(details);
      navigate(ApiPaths.Login);
      toast.success('¡Registro exitoso! Por favor, inicia sesión.');
    } catch (error) {
      toast.error('El registro falló. Por favor, inténtalo de nuevo.');
      console.error('Error during signup:', error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '2rem',
        maxWidth: '500px',
        margin: 'auto',
        borderRadius: '8px',
      }}
    >
      <TextField
        label="Email"
        type="email"
        value={details.email}
        onChange={(e) => setDetails({ ...details, email: e.target.value })}
        error={!!errors.email}
        helperText={errors.email}
        variant="outlined"
        fullWidth
        sx={styles.textFieldStyles}
      />
      <TextField
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        value={details.password}
        onChange={(e) => setDetails({ ...details, password: e.target.value })}
        error={!!errors.password}
        helperText={errors.password}
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
        Registrarse
      </Button>
      <Button
        variant="text"
        onClick={() => navigate(ApiPaths.Login)}
        sx={{
          textTransform: 'none',
        }}
      >
        ¿Ya tienes cuenta? Inicia sesión
      </Button>
    </Box>
  );
}
