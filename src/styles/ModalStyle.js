export const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "var(--modal-input-bg-color)",
    borderColor: "var(--border-color)",
    color: "var(--modal-title-text-color)",
    boxShadow: "none",
    "&:hover": { borderColor: "var(--border-color)" },
    "@media (max-width: 768px)": {
      fontSize: "12px",
      padding: "0",
      margin: "0",
      width: "100%",
    },
  }),
  input: (provided) => ({
    ...provided,
    color: "var(--modal-title-text-color)",
    "@media (max-width: 768px)": {
      fontSize: "12px",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "var(--context-no-content-bg-color)",
    "@media (max-width: 768px)": {
      fontSize: "12px",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "var(--text-color)",
    "@media (max-width: 768px)": {
      fontSize: "12px",
    },
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 10500,
    maxHeight: "350px",
    overflowY: "auto",
    backgroundColor: "var(--modal-button-bg-color)",
    color: "var(--modal-button-text-color)",
    "@media (max-width: 768px)": {
      maxHeight: "250px",
      padding: "4px",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "var(--modal-button-bg-color)"
      : state.isFocused
      ? "var(--modal-button-hover-bg-color)"
      : "var(--modal-button-bg-color)",
    color: "var(--modal-button-text-color)",
    "&:hover": {
      backgroundColor: "var(--modal-button-hover-bg-color)",
    },
    "@media (max-width: 768px)": {
      fontSize: "12px",
      padding: "4px",
    },
  }),
};