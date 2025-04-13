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
import useSettingsStore from "../store/SettingsStore";
import useThemeStore from "../store/ThemeStore";
import { formThemeVars, styles } from "../styles/Form.Styles";
import toast from "react-hot-toast";

export default function Ajustes() {
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const loading = useSettingsStore((state) => state.loading);
  const fetchSettings = useSettingsStore((state) => state.fetchSettings);
  const { theme, toggleTheme } = useThemeStore();
  const [localSettings, setLocalSettings] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      if (settings) {
        setLocalSettings(settings);
      } else {
        const fetchedSettings = await fetchSettings();
        if (fetchedSettings) {
          setLocalSettings(fetchedSettings);
        } else {
          setLocalSettings({
            theme: "light",
            notifications: {
              email: false,
              push: false,
            },
            language: "es",
            icon: "summer",
          });
        }
      }
    };

    loadSettings();
  }, [settings, fetchSettings]);

  const handleChange = (key, value) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveSettings = async () => {
    if (localSettings) {
      await updateSettings(localSettings)
        .then(() => {
          toast.success("Settings updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating settings:", error);
          toast.error("Error updating settings. Please try again.");
        });
      if (localSettings.theme !== theme) {
        toggleTheme();
      }
    }
  };

  if (loading || !localSettings) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ color: formThemeVars.textColor, padding: "2rem 2rem" }}>
      {/* Theme Selector */}
      <FormControl
        fullWidth
        margin="normal"
        variant="standard"
        sx={styles.selectFormControlStyles}
      >
        <InputLabel id="theme-label" sx={styles.inputLabelStyles}>
          Theme
        </InputLabel>
        <Select
          labelId="theme-label"
          value={localSettings.theme}
          onChange={(e) => handleChange("theme", e.target.value)}
          sx={styles.selectStyles}
        >
          <MenuItem value="light">Light</MenuItem>
          <MenuItem value="dark">Dark</MenuItem>
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
        label="Email Notifications"
        sx={{
          marginBottom: "1rem",
        }}
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
        label="Push Notifications"
        sx={{
          marginBottom: "1rem",
          marginInlineStart: "2rem",
        }}
      />

      {/* Language Selector */}
      <FormControl
        fullWidth
        margin="normal"
        variant="standard"
        sx={styles.selectFormControlStyles}
      >
        <InputLabel id="language-label" sx={styles.inputLabelStyles}>
          Language
        </InputLabel>
        <Select
          labelId="language-label"
          value={localSettings.language}
          onChange={(e) => handleChange("language", e.target.value)}
          sx={styles.selectStyles}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="es">Spanish</MenuItem>
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
          Icon
        </InputLabel>
        <Select
          labelId="icon-label"
          value={localSettings.icon}
          onChange={(e) => handleChange("icon", e.target.value)}
          sx={styles.selectStyles}
        >
          <MenuItem value="winter">Winter</MenuItem>
          <MenuItem value="spring">Spring</MenuItem>
          <MenuItem value="summer">Summer</MenuItem>
          <MenuItem value="autumn">Autumn</MenuItem>
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
