import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";
import useSettingsStore from "../store/SettingsContext";
import { formThemeVars, styles } from "../../styles/Form.Styles";

export default function Ajustes() {
  const { settings, updateSettings, loading } = useSettingsStore((state => ({
    settings: state.settings,
    updateSettings: state.updateSettings,
    loading: state.loading,
  })));

  const handleChange = (key, value) => {
    updateSettings(key, value);
  };

  const saveSettings = () => {
    alert("Settings saved successfully!");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ color: formThemeVars.textColor, padding: "2rem 2rem" }}>
      {/* Theme Selector */}
      <FormControl fullWidth margin="normal" variant="standard" sx={styles.selectFormControlStyles}>
        <InputLabel id="theme-label" sx={styles.inputLabelStyles}>
          Theme
        </InputLabel>
        <Select
          labelId="theme-label"
          value={settings.theme}
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
            checked={settings.notifications.email}
            onChange={(e) =>
              handleChange("notifications", {
                ...settings.notifications,
                email: e.target.checked,
              })
            }
          />
        }
        label="Email Notifications"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={settings.notifications.push}
            onChange={(e) =>
              handleChange("notifications", {
                ...settings.notifications,
                push: e.target.checked,
              })
            }
          />
        }
        label="Push Notifications"
      />

      {/* Language Selector */}
      <FormControl fullWidth margin="normal" variant="standard" sx={styles.selectFormControlStyles}>
        <InputLabel id="language-label" sx={styles.inputLabelStyles}>
          Language
        </InputLabel>
        <Select
          labelId="language-label"
          value={settings.language}
          onChange={(e) => handleChange("language", e.target.value)}
          sx={styles.selectStyles}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="es">Spanish</MenuItem>
        </Select>
      </FormControl>

      {/* Icon Selector */}
      <FormControl fullWidth margin="normal" variant="standard" sx={styles.selectFormControlStyles}>
        <InputLabel id="icon-label" sx={styles.inputLabelStyles}>
          Icon
        </InputLabel>
        <Select
          labelId="icon-label"
          value={settings.icon}
          onChange={(e) => handleChange("icon", e.target.value)}
          sx={styles.selectStyles}
        >
          <MenuItem value="summer">Summer</MenuItem>
          <MenuItem value="winter">Winter</MenuItem>
          <MenuItem value="spring">Spring</MenuItem>
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