import { useState, useEffect } from "react";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";
import toast from "react-hot-toast";
import React from "react";
import useSettingsStore from "@/store/SettingsStore";
import useThemeStore from "@/store/ThemeStore";
import { styles } from "@/styles/Form.Styles";

export default function Ajustes() {
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const loading = useSettingsStore((state) => state.loading);
  const { theme, toggleTheme } = useThemeStore();
  const [localSettings, setLocalSettings] = useState(null);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (key: string, value: any) => {
    setLocalSettings((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveSettings = async () => {
    if (localSettings) {
      await updateSettings(localSettings)
        .then(() => {
          toast.success("Ajustes guardados correctamente.");
        })
        .catch((error) => {
          console.error("Error actualizando ajustes:", error);
          toast.error("Error guardando ajustes.");
        });
      if (localSettings.theme !== theme) {
        toggleTheme();
      }
    }
  };

  if (loading || !localSettings) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="ajustes">
      {/* Theme Selector */}
      <FormControl
        fullWidth
        margin="normal"
        variant="standard"
        sx={styles.selectFormControlStyles}
      >
        <InputLabel id="theme-label" sx={styles.inputLabelStyles}>
          Tema
        </InputLabel>
        <Select
          labelId="theme-label"
          value={localSettings.theme}
          onChange={(e) => handleChange("theme", e.target.value)}
          sx={styles.selectStyles}
        >
          <MenuItem value="light">Claro</MenuItem>
          <MenuItem value="dark">Oscuro</MenuItem>
        </Select>
      </FormControl>

      {/* Notifications */}
      <FormControlLabel
        control={
          <Checkbox
            checked={localSettings.notifications.email}
            onChange={(e) =>
              handleChange("notifications", {
                ...localSettings.notifications,
                email: e.target.checked,
              })
            }
          />
        }
        sx={styles.checkboxStyles}
        label="Email Notifications"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={localSettings.notifications.push}
            onChange={(e) =>
              handleChange("notifications", {
                ...localSettings.notifications,
                push: e.target.checked,
              })
            }
          />
        }
        sx={styles.checkboxStyles}
        label="Push Notifications"
      />

      {/* Language Selector */}
      <FormControl
        fullWidth
        margin="normal"
        variant="standard"
        sx={styles.selectFormControlStyles}
      >
        <InputLabel id="language-label" sx={styles.inputLabelStyles}>
          Idioma
        </InputLabel>
        <Select
          labelId="language-label"
          value={localSettings.language}
          onChange={(e) => handleChange("language", e.target.value)}
          sx={styles.selectStyles}
        >
          <MenuItem value="en">Inglés</MenuItem>
          <MenuItem value="es">Español</MenuItem>
        </Select>
      </FormControl>

      {/* Icon Selector */}
      <FormControl
        fullWidth
        margin="normal"
        variant="standard"
        sx={styles.selectFormControlStyles}
      >
        <InputLabel id="icon-label" sx={styles.inputLabelStyles}>
          Icono
        </InputLabel>
        <Select
          labelId="icon-label"
          value={localSettings.icon}
          onChange={(e) => handleChange("icon", e.target.value)}
          sx={styles.selectStyles}
        >
          <MenuItem value="winter">Invierno</MenuItem>
          <MenuItem value="spring">Primavera</MenuItem>
          <MenuItem value="summer">Verano</MenuItem>
          <MenuItem value="autumn">Otoño</MenuItem>
        </Select>
      </FormControl>

      {/* Default Page Selector */}
      <FormControl
        fullWidth
        margin="normal"
        variant="standard"
        sx={styles.selectFormControlStyles}
      >
        <InputLabel id="default-page-label" sx={styles.inputLabelStyles}>
          Página por defecto
        </InputLabel>
        <Select
          labelId="default-page-label"
          value={localSettings.defaultPage}
          onChange={(e) => handleChange("defaultPage", e.target.value)}
          sx={styles.selectStyles}
        >
          <MenuItem value="/productos">Productos</MenuItem>
          <MenuItem value="/lista-compra">Lista Compra</MenuItem>
          <MenuItem value="/despensa">Despensa</MenuItem>
          <MenuItem value="/recetas">Recetas</MenuItem>
          <MenuItem value="/tareas-pendientes">Tareas Pendientes</MenuItem>
          <MenuItem value="/tareas-casa">Tareas Casa</MenuItem>
          <MenuItem value="/fichajes">Fichajes</MenuItem>
          <MenuItem value="/gastos">Gastos</MenuItem>
          <MenuItem value="/ajustes">Ajustes</MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="contained"
        onClick={saveSettings}
        sx={styles.buttonStyles}
      >
        Save Settings
      </Button>
    </div>
  );
}
