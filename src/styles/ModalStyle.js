export const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "var(--modal-input-bg-color)",
    borderColor: "var(--border-color)",
    color: "var(--modal-title-text-color)",
    boxShadow: "none",
    "&:hover": { borderColor: "var(--border-color)" },
    maxHeight: "40px",
  }),
  input: (provided) => ({ ...provided, color: "var(--modal-title-text-color)" }),
  placeholder: (provided) => ({
    ...provided,
    color: "var(--context-no-content-bg-color)",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "var(--text-color)",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 10500,
    maxHeight: "350px",
    overflowY: "auto",
    backgroundColor: "var(--modal-button-bg-color)",
    color: "var(--modal-button-text-color)",
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
  }),
};