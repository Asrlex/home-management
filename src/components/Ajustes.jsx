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
import { axiosRequest } from "../services/AxiosRequest";
import api_config from "../config/apiconfig";

export default function Ajustes() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    theme: "light",
    notifications: {
      email: true,
      push: false,
    },
    language: "en",
  });

  const themeVars = {
    textColor: "var(--text-color)",
    bgColor: "var(--bg-color)",
    borderColor: "var(--border-color)",
    labelColor: "var(--settings-label-color)",
    selectBgColor: "var(--settings-select-bg-color)",
    selectTextColor: "var(--settings-select-text-color)",
    selectOptionsBgColor: "var(--settings-select-options-bg-color)",
    selectOptionsTextColor: "var(--settings-select-options-text-color)",
    selectOptionsHoverBgColor: "var(--settings-select-options-hover-bg-color)",
    selectOptionsSelectedBgColor:
      "var(--settings-select-options-selected-bg-color)",
    buttonBgColor: "var(--settings-button-bg-color)",
    buttonTextColor: "var(--settings-button-text-color)",
    buttonHoverBgColor: "var(--settings-button-hover-bg-color)",
    checkboxCheckedColor: "var(--barra-item-hover-color)",
  };

  const styles = {
    inputLabelStyles: {
      color: themeVars.labelColor,
      fontWeight: "bold",
      fontSize: "1.2rem",
      "&.Mui-focused": {
        color: themeVars.labelColor,
      },
      "&.MuiFormLabel-filled": {
        color: themeVars.labelColor,
      },
    },
    selectStyles: {
      color: themeVars.selectTextColor,
      backgroundColor: themeVars.selectBgColor,
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: themeVars.borderColor,
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: themeVars.checkboxCheckedColor,
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: themeVars.checkboxCheckedColor,
      },
      "& .MuiSelect-icon": {
        color: themeVars.selectTextColor,
      },
      "& .MuiSelect-select": {
        padding: "1rem",
      },
      "& .MuiSelect-select:focus": {
        backgroundColor: themeVars.selectBgColor,
      },
    },
    selectMenuStyles: {
      backgroundColor: themeVars.selectOptionsBgColor,
      "& .MuiPaper-root": {
        backgroundColor: themeVars.selectOptionsBgColor,
      },
      "& .MuiMenu-list": {
        backgroundColor: themeVars.selectOptionsBgColor,
      },
    },
    menuItemStyles: {
      backgroundColor: themeVars.selectOptionsBgColor,
      color: themeVars.selectOptionsTextColor,
      "&:hover": {
        backgroundColor: themeVars.selectOptionsHoverBgColor,
      },
      "&.Mui-selected": {
        backgroundColor: themeVars.selectOptionsSelectedBgColor,
      },
      "&.Mui-selected:hover": {
        backgroundColor: themeVars.selectOptionsHoverBgColor,
      },
    },
    selectFormControlStyles: {
      "& .MuiInput-underline:before": {
        borderBottomColor: themeVars.borderColor,
      },
      "& .MuiInput-underline:hover:before": {
        borderBottomColor: themeVars.checkboxCheckedColor,
      },
      "& .MuiInput-underline:after": {
        borderBottomColor: themeVars.checkboxCheckedColor,
      },
    },
  };

  useEffect(() => {
    async function fetchSettings() {
      try {
        axiosRequest("GET", api_config.settings.base)
          .then((response) => {
            setSettings(response);
          })
          .catch((error) => {
            console.error("Error fetching settings:", error);
          });
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveSettings = async () => {
    try {
      axiosRequest("PUT", api_config.settings.base, settings)
        .then((response) => {
          if (response) {
            alert("Settings saved successfully!");
          } else {
            alert("Failed to save settings.");
          }
        })
        .catch((error) => {
          console.error("Error saving settings:", error);
        });
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ color: themeVars.textColor, padding: "2rem 2rem" }}>
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
          value={settings.theme}
          onChange={(e) => handleChange("theme", e.target.value)}
          sx={styles.selectStyles}
          MenuProps={{
            PaperProps: {
              sx: styles.selectMenuStyles,
            },
          }}
        >
          <MenuItem value="light" sx={styles.menuItemStyles}>
            Light
          </MenuItem>
          <MenuItem value="dark" sx={styles.menuItemStyles}>
            Dark
          </MenuItem>
        </Select>
      </FormControl>

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
            sx={{
              color: themeVars.labelColor,
              "&.Mui-checked": {
                color: themeVars.checkboxCheckedColor,
              },
            }}
          />
        }
        label="Email Notifications"
        sx={{ color: themeVars.labelColor }}
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
            sx={{
              color: themeVars.labelColor,
              "&.Mui-checked": {
                color: themeVars.checkboxCheckedColor,
              },
            }}
          />
        }
        label="Push Notifications"
        sx={{ color: themeVars.labelColor }}
      />

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
          value={settings.language}
          onChange={(e) => handleChange("language", e.target.value)}
          sx={styles.selectStyles}
          MenuProps={{
            PaperProps: {
              sx: styles.selectMenuStyles,
            },
          }}
        >
          <MenuItem value="en" sx={styles.menuItemStyles}>
            English
          </MenuItem>
          <MenuItem value="es" sx={styles.menuItemStyles}>
            Spanish
          </MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="contained"
        onClick={saveSettings}
        sx={{
          backgroundColor: themeVars.buttonBgColor,
          color: themeVars.buttonTextColor,
          marginTop: "1rem",
          "&:hover": {
            backgroundColor: themeVars.buttonHoverBgColor,
          },
        }}
      >
        Save Settings
      </Button>
    </div>
  );
}
