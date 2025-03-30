export const formThemeVars = {
  textColor: "var(--text-color)",
  bgColor: "var(--bg-color)",
  borderColor: "var(--border-color)",
  labelColor: "var(--form-label-color)",
  selectBgColor: "var(--form-select-bg-color)",
  selectTextColor: "var(--form-select-text-color)",
  selectOptionsBgColor: "var(--form-select-options-bg-color)",
  selectOptionsTextColor: "var(--form-select-options-text-color)",
  selectOptionsHoverBgColor: "var(--form-select-options-hover-bg-color)",
  selectOptionsSelectedBgColor:
    "var(--form-select-options-selected-bg-color)",
  buttonBgColor: "var(--form-button-bg-color)",
  buttonTextColor: "var(--form-button-text-color)",
  buttonHoverBgColor: "var(--form-button-hover-bg-color)",
  checkboxCheckedColor: "var(--barra-item-hover-color)",
};

export const styles = {
  inputLabelStyles: {
    color: formThemeVars.labelColor,
    fontWeight: "bold",
    fontSize: "1.2rem",
    "&.Mui-focused": {
      color: formThemeVars.labelColor,
    },
    "&.MuiFormLabel-filled": {
      color: formThemeVars.labelColor,
    },
  },
  selectStyles: {
    color: formThemeVars.selectTextColor,
    backgroundColor: formThemeVars.selectBgColor,
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: formThemeVars.borderColor,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: formThemeVars.checkboxCheckedColor,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: formThemeVars.checkboxCheckedColor,
    },
    "& .MuiSelect-icon": {
      color: formThemeVars.selectTextColor,
    },
    "& .MuiSelect-select": {
      padding: "1rem",
    },
    "& .MuiSelect-select:focus": {
      backgroundColor: formThemeVars.selectBgColor,
    },
  },
  selectMenuStyles: {
    backgroundColor: formThemeVars.selectOptionsBgColor,
    "& .MuiPaper-root": {
      backgroundColor: formThemeVars.selectOptionsBgColor,
    },
    "& .MuiMenu-list": {
      backgroundColor: formThemeVars.selectOptionsBgColor,
    },
  },
  menuItemStyles: {
    backgroundColor: formThemeVars.selectOptionsBgColor,
    color: formThemeVars.selectOptionsTextColor,
    "&:hover": {
      backgroundColor: formThemeVars.selectOptionsHoverBgColor,
    },
    "&.Mui-selected": {
      backgroundColor: formThemeVars.selectOptionsSelectedBgColor,
    },
    "&.Mui-selected:hover": {
      backgroundColor: formThemeVars.selectOptionsHoverBgColor,
    },
  },
  selectFormControlStyles: {
    "& .MuiInput-underline:before": {
      borderBottomColor: formThemeVars.borderColor,
    },
    "& .MuiInput-underline:hover:before": {
      borderBottomColor: formThemeVars.checkboxCheckedColor,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: formThemeVars.checkboxCheckedColor,
    },
  },
  textFieldStyles: {
    "& .MuiOutlinedInput-root": {
      backgroundColor: formThemeVars.selectBgColor,
      color: formThemeVars.selectTextColor,
      "& fieldset": {
        borderColor: formThemeVars.borderColor,
      },
      "&:hover fieldset": {
        borderColor: formThemeVars.checkboxCheckedColor,
      },
      "&.Mui-focused fieldset": {
        borderColor: formThemeVars.checkboxCheckedColor,
      },
    },
  },
  buttonStyles: {
    backgroundColor: formThemeVars.buttonBgColor,
    color: formThemeVars.buttonTextColor,
    marginTop: "1rem",
  },
};
